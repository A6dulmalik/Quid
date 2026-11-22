# lib/soroban/

Typed clients for Quid's Soroban contracts. One file per contract.

| File | Contract | Status |
|------|----------|--------|
| `quid-store.ts` | `quid-store` | Here |
| `../soroban-client.ts` | shared RPC, simulate, sign and submit helpers, plus some `quid-store` calls | Legacy location, don't add to it |
| `../milestone-escrow-client.ts` | `quid-milestone-escrow` | Legacy location |
| `../tip-jar-client.ts` | `quid-tip-jar` | Legacy location |

## Rules for new code

- A new contract client goes in `lib/soroban/<contract-name>.ts`, for example
  `quid-leaderboard.ts` or `quid-reputation.ts`.
- Read-only calls use simulation and never ask Freighter to sign.
- Read contract IDs from `NEXT_PUBLIC_*` env vars and add each new one to
  `frontend/.env.example` and the frontend job in `.github/workflows/ci.yml`.
- Handle an unset or placeholder contract ID (`CAAAA…D2KM`) with a clear
  "not configured" state instead of throwing at import time.
- Moving the legacy files into this folder is a separate refactor. Don't
  combine it with feature work, or every open PR that imports them will
  conflict.
