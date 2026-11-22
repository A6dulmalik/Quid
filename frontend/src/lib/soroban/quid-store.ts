import {
  Address,
  Horizon,
  nativeToScVal,
  rpc,
  scValToNative,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import {
  cancelMissionToContract,
  ContractInvokeError,
  describeSorobanFailure,
  getStoreContract,
  payoutParticipantToContract,
  pauseMissionToContract,
  submitFeedbackToContract,
  type MissionActionParams,
  type MissionActionReceipt,
  type PayoutParticipantParams,
  type PayoutReceipt,
  type SubmitFeedbackParams,
  type SubmissionReceipt,
} from "@/lib/soroban-client";
import {
  NETWORK_PASSPHRASE,
  signFreighterTransaction,
} from "@/lib/freighter-wallet";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ??
  "https://soroban-testnet.stellar.org";
const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ??
  "https://horizon-testnet.stellar.org";

export interface CreateMissionParams {
  ownerAddress: string;
  title: string;
  descriptionCid: string;
  rewardTokenAddress: string;
  /** Integer amount in the token's smallest unit. */
  rewardAmount: bigint;
  maxParticipants: number;
  minAssetTokenAddress?: string;
  minAssetAmount?: bigint;
  expiresAt?: bigint;
}

export interface CreateMissionReceipt {
  missionId: string;
  txHash: string;
}

export interface QuidStoreMission {
  id: string;
  owner: string;
  title: string;
  descriptionCid: string;
  rewardToken: string;
  rewardAmount: string;
  maxParticipants: number;
  participantsCount: number;
  status: string;
  createdAt: string;
  minAssetToken: string | null;
  minAssetAmount: string;
  expiresAt: string | null;
}

function struct(fields: Array<[string, xdr.ScVal]>): xdr.ScVal {
  return xdr.ScVal.scvMap(
    fields.map(
      ([key, val]) =>
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol(key),
          val,
        }),
    ),
  );
}

function asMissionId(value: unknown): string {
  if (typeof value === "bigint" || typeof value === "number") {
    if (typeof value === "number" && !Number.isSafeInteger(value)) {
      throw new Error("The contract returned an unsafe mission id.");
    }
    return String(value);
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return value;
  }
  throw new Error("The contract did not return a valid mission id.");
}

async function submitAndConfirm(
  call: xdr.Operation,
  signerAddress: string,
): Promise<{ txHash: string; returnValue: xdr.ScVal }> {
  const horizon = new Horizon.Server(HORIZON_URL);
  const server = new rpc.Server(RPC_URL);
  const account = await horizon.loadAccount(signerAddress);
  const transaction = new TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(call)
    .setTimeout(180)
    .build();

  const simulation = await server.simulateTransaction(transaction);
  if (!rpc.Api.isSimulationSuccess(simulation)) {
    throw new ContractInvokeError(simulation);
  }

  const prepared = rpc.assembleTransaction(transaction, simulation).build();
  const signedXdr = await signFreighterTransaction(
    prepared.toXDR(),
    signerAddress,
    NETWORK_PASSPHRASE,
  );
  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE,
  );
  const sent = await server.sendTransaction(
    signedTransaction as Parameters<typeof server.sendTransaction>[0],
  );
  if (sent.status === "ERROR") {
    throw new ContractInvokeError(sent.errorResult);
  }

  let result = await server.getTransaction(sent.hash);
  let attempts = 0;
  while (result.status === "NOT_FOUND" && attempts < 30) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = await server.getTransaction(sent.hash);
    attempts += 1;
  }

  if (result.status === "FAILED") {
    throw new ContractInvokeError(describeSorobanFailure(result));
  }
  if (result.status !== "SUCCESS") {
    throw new Error(
      `Transaction ${sent.hash} was submitted but is not yet confirmed. Check its status before retrying.`,
    );
  }
  if (!result.returnValue) {
    throw new Error(
      `Transaction ${sent.hash} succeeded but did not return a contract value.`,
    );
  }

  return { txHash: sent.hash, returnValue: result.returnValue };
}

function toUserCreateError(error: unknown): Error {
  const detail =
    error instanceof ContractInvokeError
      ? describeSorobanFailure(error.errorResult)
      : error instanceof Error
        ? error.message
        : String(error);

  if (/insufficient|not enough|balance|trustline|#5\b/i.test(detail)) {
    return new Error(
      "Your wallet does not have enough of this reward token, or its trustline is missing. Fund the wallet or choose a smaller reward and try again.",
    );
  }
  return error instanceof Error ? error : new Error(detail);
}

/** Creates and escrows a mission on the deployed `quid-store` contract. */
export async function createMission(
  params: CreateMissionParams,
): Promise<CreateMissionReceipt> {
  const {
    ownerAddress,
    title,
    descriptionCid,
    rewardTokenAddress,
    rewardAmount,
    maxParticipants,
    minAssetTokenAddress,
    minAssetAmount = BigInt(0),
    expiresAt,
  } = params;

  if (!ownerAddress) throw new Error("Connect the creator wallet to publish.");
  if (!title.trim()) throw new Error("A mission title is required.");
  if (!descriptionCid) throw new Error("A pinned mission description is required.");
  if (rewardAmount <= BigInt(0)) {
    throw new Error("The reward amount must be positive.");
  }
  if (
    !Number.isInteger(maxParticipants) ||
    maxParticipants < 1 ||
    maxParticipants > 0xffffffff
  ) {
    throw new Error("Hunter limit must be between 1 and 4,294,967,295.");
  }

  try {
    const reward = struct([
      [
        "reward_token",
        new Address(rewardTokenAddress).toScVal(),
      ],
      ["reward_amount", nativeToScVal(rewardAmount, { type: "i128" })],
    ]);
    const minAsset = struct([
      [
        "min_asset_token",
        minAssetTokenAddress
          ? new Address(minAssetTokenAddress).toScVal()
          : xdr.ScVal.scvVoid(),
      ],
      ["min_asset_amount", nativeToScVal(minAssetAmount, { type: "i128" })],
    ]);
    const call = getStoreContract().call(
      "create_mission",
      new Address(ownerAddress).toScVal(),
      nativeToScVal(title.trim(), { type: "string" }),
      nativeToScVal(descriptionCid, { type: "string" }),
      reward,
      nativeToScVal(maxParticipants, { type: "u32" }),
      minAsset,
      expiresAt === undefined
        ? xdr.ScVal.scvVoid()
        : nativeToScVal(expiresAt, { type: "u64" }),
    );
    const result = await submitAndConfirm(call, ownerAddress);
    const missionId = asMissionId(scValToNative(result.returnValue));
    return { missionId, txHash: result.txHash };
  } catch (error) {
    throw toUserCreateError(error);
  }
}

function recordValue(value: unknown): Record<string, unknown> | null {
  if (value instanceof Map) {
    return Object.fromEntries(
      Array.from(value.entries(), ([key, entry]) => [String(key), entry]),
    );
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function nativeString(value: unknown, field: string): string {
  if (
    typeof value === "string" ||
    typeof value === "bigint" ||
    typeof value === "number"
  ) {
    return String(value);
  }
  if (value instanceof Address) return value.toString();
  throw new Error(`The quid-store returned an invalid ${field}.`);
}

/** Reads a mission through Soroban simulation without requesting a signature. */
export async function getMission(
  missionId: bigint | string,
  sourceAddress: string,
): Promise<QuidStoreMission> {
  if (!/^\d+$/.test(String(missionId))) {
    throw new Error("Mission id must be a non-negative integer.");
  }

  const horizon = new Horizon.Server(HORIZON_URL);
  const server = new rpc.Server(RPC_URL);
  const account = await horizon.loadAccount(sourceAddress);
  const transaction = new TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      getStoreContract().call(
        "get_mission",
        nativeToScVal(BigInt(missionId), { type: "u64" }),
      ),
    )
    .setTimeout(180)
    .build();
  const simulation = await server.simulateTransaction(transaction);
  if (!rpc.Api.isSimulationSuccess(simulation)) {
    throw new ContractInvokeError(simulation);
  }

  const returnValue = simulation.result?.retval;
  if (!returnValue) {
    throw new Error("The quid-store did not return a mission record.");
  }
  const native = scValToNative(returnValue);
  const record = recordValue(native);
  if (!record) {
    throw new Error("The quid-store returned an invalid mission record.");
  }
  const minAsset = record.min_asset ?? record.minAssetToken;
  const expiresAt = record.expires_at ?? record.expiresAt;
  return {
    id: nativeString(record.id, "mission id"),
    owner: nativeString(record.owner, "owner"),
    title: nativeString(record.title, "title"),
    descriptionCid: nativeString(
      record.description_cid ?? record.descriptionCid,
      "description CID",
    ),
    rewardToken: nativeString(
      record.reward_token ?? record.rewardToken,
      "reward token",
    ),
    rewardAmount: nativeString(
      record.reward_amount ?? record.rewardAmount,
      "reward amount",
    ),
    maxParticipants: Number(record.max_participants ?? record.maxParticipants),
    participantsCount: Number(
      record.participants_count ?? record.participantsCount,
    ),
    status: nativeString(record.status, "status"),
    createdAt: nativeString(record.created_at ?? record.createdAt, "created at"),
    minAssetToken:
      minAsset === undefined || minAsset === null
        ? null
        : nativeString(minAsset, "minimum asset token"),
    minAssetAmount: nativeString(
      record.min_asset_amount ?? record.minAssetAmount,
      "minimum asset amount",
    ),
    expiresAt:
      expiresAt === undefined || expiresAt === null
        ? null
        : nativeString(expiresAt, "expiration"),
  };
}

export const submitFeedback = submitFeedbackToContract;
export const payoutParticipant = payoutParticipantToContract;
export const cancelMission = cancelMissionToContract;
export const pauseMission = pauseMissionToContract;

export type {
  MissionActionParams,
  MissionActionReceipt,
  PayoutParticipantParams,
  PayoutReceipt,
  SubmitFeedbackParams,
  SubmissionReceipt,
};
