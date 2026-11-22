---
name: Wave task
about: A scoped, contributor-ready task for a Drips Wave (contracts, backend, or frontend)
type: Task
title: "AREA-000 Short imperative title"
labels: []
assignees: ''
---

<!--
Title format: <AREA>-<NNN> <imperative summary>
  AREA is one of: SC (contracts), BE (backend), FE (frontend), CI, REPO, DOCS
  Example: "BE-052 Notifications inbox API"

Labels: add one area label (contracts / backend / frontend / ci), one phase label
(phase:foundation, phase:backend, phase:integration-fe-chain, phase:testing, phase:infra),
and "good first issue" or "help wanted" when it applies.
-->

## Description
<!-- One or two sentences: what changes and why. -->

## User Story
**As a** <!-- creator / hunter / contributor / maintainer -->,  
**I want to** <!-- capability -->,  
**so that** <!-- outcome -->.

## Requirements and Context
- Files: <!-- exact paths, mark new files with (new) -->
- <!-- What exists today, with file references -->
- <!-- Constraints: storage tier, auth, route prefix (/api), env vars, etc. -->

## Suggested Implementation
```ts
// IN FILES: <paths>
// 1.
// 2.
// 3.
```

## Acceptance Criteria
- [ ] <!-- Observable, testable outcome -->
- [ ] Tests added or updated (`cargo test` / `npm test` / `npm run test:e2e`).
- [ ] UI changes include before/after screenshots in the PR.

## Submission Guidelines
- **Branch:** `<area>/<id>-<short-slug>` (e.g. `backend/be-052-notifications-inbox-api`)
- **Depends on:** `none`
- **PR:** `<type>(<scope>): <summary>` (e.g. `feat(backend): add notifications inbox api`)
