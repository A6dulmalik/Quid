# Submission AI summaries and sentiment: no-go for MVP

**Decision:** defer automated summaries and sentiment scoring. Do not generate
or persist inferred summaries or scores from submission text in the current
release.

The repository has no configured AI provider, privacy/retention policy for
sending user submissions to one, or evaluation set for measuring summary and
sentiment quality. A heuristic or hard-coded value would look authoritative
without meeting the founder's need for reliable review context. The existing
`aiSummary` and `sentiment` columns remain available, but this release leaves
submission sentiment unset and does not claim that a mission title is an AI
summary. Existing chain-indexed mission rows may still use the title as a
legacy display fallback in `aiSummary`; that value is not generated from
submission text and must not be presented as AI analysis.

Reconsider this as a separately scoped post-MVP change after choosing a
provider, documenting consent and retention, setting cost and retry limits,
and agreeing on a quality check. The future job should run only after the
submission content is successfully available from IPFS and must not block
on-chain submission or review.
