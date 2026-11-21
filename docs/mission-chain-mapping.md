# `quid-store` and Prisma field mapping

The database stores Stellar contract integers as decimal strings or
`DECIMAL(39, 0)` values so JavaScript number precision cannot silently change
token amounts or contract identifiers.

| `quid-store` value | Prisma field | Mapping |
| --- | --- | --- |
| `Mission.id` (`u64`) | `Mission.onChainId` (`String?`, unique) | Base-10 string. The application must not convert this id to a JavaScript number. |
| `Mission.status` | `Mission.status` (`MissionStatus`) | Values align, including `CREATED`; `OPEN`, `STARTED`, `PAUSED`, `COMPLETED`, and `CANCELLED`. |
| `Mission.reward_token` | `Mission.rewardToken` | Stellar contract address. |
| `Mission.reward_amount` (`i128`) | `Mission.rewardAmount` (`String`) | Base-10 integer string in the token's smallest unit. |
| `Mission.max_participants` / `participants_count` (`u32`) | `Mission.maxParticipants` / `participantsCount` | Prisma `Int`. |
| `Mission.min_asset` | `Mission.minAssetToken` | Nullable contract address (`None` is `NULL`). |
| `Mission.min_asset_amount` (`i128`) | `Mission.minAssetAmount` (`DECIMAL(39, 0)`) | Zero when no asset gate is configured. |
| `Mission.expires_at` (`Option<u64>`) | `Mission.expiresAt` (`String?`) | Base-10 Unix timestamp; `NULL` means no expiration. A string preserves the full unsigned range. |
| `Submission.status` | `Submission.status` (`SubmissionStatus`) | `PENDING`, `APPROVED`, `REJECTED`, and `PAID`; the database also tracks the off-chain review states. |
| `DataKey::HunterStake` amount (`i128`) | `Submission.stakeAmount` (`DECIMAL(39, 0)`) | Optional because historical submissions and the indexer's `sub:new` event do not contain the stake amount. |
| `submit_feedback` stake token argument | `Submission.stakeToken` | Optional contract address. The contract stores the stake amount but not its token, so the submitting client must supply this mapping. |

`MissionCreateEvent` currently omits `min_asset`, `min_asset_amount`, and
`expires_at`. The event indexer cannot reconstruct those fields from the event;
the authenticated publish flow records them from the transaction request.
Likewise, `SubNewEvent` does not expose the stake token or amount. These fields
remain nullable for rows created solely by event indexing.

## Creator publish flow

The create-quest wizard pins its metadata JSON to IPFS, calls
`create_mission`, waits for transaction confirmation, and then links the
returned decimal mission id to the saved backend draft. The contract performs
the reward-token transfer inside `create_mission`; the creator signs that
transfer as part of the same Freighter transaction, so there is no separate
token-approval entrypoint. A failed simulation (including insufficient balance
or a missing trustline) is surfaced before asking the wallet to sign.

The wizard currently offers XLM rewards through the testnet XLM SAC configured
as `NEXT_PUBLIC_REWARD_TOKEN_XLM`. Supported testnet token addresses and
funding/trustline instructions are maintained in the root README and
`quid-contract/README.md`. Private and future-scheduled quests are rejected
until the contract has corresponding visibility and scheduling behavior.

## Migration

Apply the additive migration with the regular backend migration command:

```sh
cd backend
npm run prisma:migrate:deploy
```

The migration adds the contract's `CREATED` status and nullable / defaulted
columns without changing existing mission or submission rows.
