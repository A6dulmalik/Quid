# Frontend performance baseline and budgets (issue #438)

## Before / after framework

Every performance change should be recorded with the same before/after shape so a budget waiver is a decision, not an accident.

| Field | Before | After |
| --- | --- | --- |
| Route / URL | e.g. `/hunter/mission-board` | same URL, same query and fixtures |
| First-load JS | `resource-summary:script:size` from Lighthouse, in bytes transferred | re-measured after the change |
| LCP | Lighthouse `largest-contentful-paint` (lab) and field p75 if available | re-measured after the change |
| INP | lab `total-blocking-time` as proxy; field p75 (or timespan INP) when available | re-measured after the change |
| Largest chunks | top contributors from `client.html` produced by `npm run analyze` | same report after the change |
| Change | PR / commit that introduced it | linked PR and reviewer |
| Verdict | within budget, over budget with waiver, or reverted | follow-up issue if waived |

**Environment note:** No build analyzer run was performed in this environment. Dependencies were not installed and builds, tests, lint and CI were deliberately not executed while preparing this change. The numbers below are budgets and targets, not measured results; the "before" column is a template to fill in from the first real analyzer/Lighthouse run on a developer machine or in CI.

## Budgets

Budgets are for first-load (initial navigation) JavaScript, measured as transferred bytes of `script` resources. Lighthouse CI asserts the byte values in the right column via `resource-summary:script:size`; 150 kB and 250 kB are treated as 150 KiB / 250 KiB.

| Surface | First-load JS target | Asserted ceiling | LCP target | INP target |
| --- | --- | --- | --- | --- |
| Landing `/` | < 150 kB gzip | 153,600 bytes | <= 2,500 ms | <= 200 ms |
| Mission board `/hunter/mission-board` | < 250 kB gzip | 256,000 bytes | <= 2,500 ms | <= 200 ms |
| Hunter hub `/hunter` | < 250 kB gzip | 256,000 bytes | <= 2,500 ms | <= 200 ms |

LCP and INP are Core Web Vitals "good" thresholds. CI uses the median of three Lighthouse navigation runs per URL. INP requires a real interaction, so it is not present in navigation-mode Lighthouse results: the workflow keeps an `interaction-to-next-paint` assertion at `warn` (it is populated by timespan/user-flow runs) and gates on `total-blocking-time` <= 200 ms as the enforced lab proxy. Confirm the actual INP p75 with CrUX/RUM or a scripted Lighthouse timespan before declaring a route healthy.

## Code-splitting strategy

- Keep the App Router route boundary as the primary split: landing, `/hunter`, and `/hunter/mission-board` must not import each other's feature code.
- Load below-the-fold landing sections with `next/dynamic` (motion-heavy sections such as roadmap, FAQ, opportunities) so the hero's first paint does not wait for the full animation bundle.
- Keep Stellar/Soroban wallet clients behind interaction-triggered dynamic imports. The landing route should never pull `@stellar/stellar-sdk` into its initial chunks just because `WalletProvider` is mounted.
- Defer modal and upload code (`SubmitFeedbackModal`, `ProofFileUpload`, wizard steps, milestone flows) until the trigger is used.
- Prefer named/direct icon imports. `experimental.optimizePackageImports` in `frontend/next.config.ts` rewrites barrel imports for `@iconify/react`, `lucide-react`, `react-icons`, `framer-motion` and `@stellar/stellar-sdk`; if a package regression appears, remove that package from the list rather than disabling the whole option.
- Re-run the analyzer after adding any package in the icon, animation or Stellar family and record the delta in the table above.

## Run the bundle analyzer

The analyzer is a devDependency and is only wired into `next.config.ts` when `ANALYZE=true`; normal builds and `next start` are unaffected.

```bash
cd frontend
npm ci
npm run analyze
```

`npm run analyze` is `ANALYZE=true next build`. Reports are emitted under `.next/analyze/` (client, server, edge). Use `client.html` for first-load JS budgets. On Windows the inline `ANALYZE=true` prefix requires a POSIX shell (Git Bash/WSL); from `cmd` or PowerShell, set `ANALYZE=true` in the environment then run `npm run build`.

The lockfile is intentionally not modified by this change. `npm ci` will fail until `frontend/package-lock.json` is regenerated to include `@next/bundle-analyzer`; do that in a follow-up before relying on CI.

## Run Lighthouse CI

`.github/workflows/lighthouse.yml` runs on PRs touching `frontend/**` (or the workflow itself). It installs with `npm ci`, builds with the same public env values as `ci.yml`, starts `next start` on `127.0.0.1:3000`, polls until the server responds, writes an LHCI config in the runner temp directory, and runs:

```bash
npx --yes @lhci/cli@0.15 autorun --config="$RUNNER_TEMP/lighthouserc.json"
```

The config collects three runs each for `/`, `/hunter/mission-board`, and `/hunter`, then uses `assertMatrix` to apply per-route JS ceilings plus the LCP threshold, the INP warning, and the TBT gate. `@lhci/cli` is fetched by `npx` and is not a repository dependency. Reports are written to the filesystem target, not uploaded. No secrets are used; all env values are public testnet identifiers and URLs.

To reproduce locally, start the built server, copy the JSON block from the workflow into a temporary file outside the repo (adjusting paths as needed), and pass it to the same `npx` command. Compare the resulting table to the before/after framework above.
