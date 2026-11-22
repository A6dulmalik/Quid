# verification/

On-chain **Proof-of-Test** verification. Not built yet. This folder is the agreed
home for that work so parallel PRs don't collide.

## Scope

- Read Soroban state over RPC (`RPC_URL`, `CONTRACT_ID`) to confirm that a
  submission's IPFS CID, hunter address and mission ID match what `quid-store`
  holds on-chain.
- Expose read-only verify routes under `/api/verification/*`.
- Persist verification results if a Prisma model is added (add a migration).

## Out of scope

- Event ingestion. That belongs in `../indexer/`.
- Sending alerts. Inject `NotificationsService` from `../notifications/`.

## Conventions

- Add providers and controllers to `verification.module.ts`. Don't edit
  `app.module.ts`, since the module is already registered there.
- Mock RPC calls in unit specs. CI has no network access to testnet.
