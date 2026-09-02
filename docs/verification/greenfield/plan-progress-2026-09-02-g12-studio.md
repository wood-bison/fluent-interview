# Plan progress — G12 Studio evidence wave — 2026-09-02

## Срез

- Master plan: **658 checked / 476 remaining / 1 134 total (58,02%)**.
- This wave is evidence-only; it does not claim new curriculum questions,
  tasks, or learner progress.
- G12 registry: **58/71 evidence-ready**, **13 open states**, **12 open human
  dispositions**, **25 unresolved items**, **0 structural failures**.
- G10S historical evidence index: **614/614**, `rewritesDetected=0`.

## Closed in this wave

Target repository `/Users/sergeyzhechko/developer/fluent-interview-platform`:

- commit `b05505a` — `feat(g12): capture studio state evidence` (no push);
- live isolated compose stack `fluent-g12-studio-20260902` on port `47380`;
- six state fixtures: `candidate-list`, `draft`, `review`, `published`,
  `quarantine`, `restart`;
- every fixture has interaction, semantic, and visual evidence with SHA-256
  entries in the G12 index/checksum manifest;
- server-backed authoring transitions and post-restart persistence were
  checked; no learner projection was granted to draft or quarantined content.

## Quality gates

- `sha256sum -c docs/verification/greenfield/G12/checksums.sha256` — PASS;
- `NX_CI=1 pnpm check` — PASS;
- `pnpm boundary:check` — PASS;
- `pnpm toolchain:check` — PASS;
- full test set — **493/493 PASS**.

## Remaining order

1. Capture the remaining G12 state groups (Control Center, Settings and any
   newly uncovered critical states), keeping one state fixture per durable
   registry entry.
2. Complete G10S-246 human acceptance and the 12 open human dispositions;
   machine evidence must not promote these to DONE.
3. Run G11 breadth and path-specific closure packs, then G12.5
   requalification and independent final review.
4. Execute G13 decommission only after the retention window and rollback
   proof are signed off; do not delete legacy artifacts earlier.

The disposable Studio stack can be stopped with the scoped `pnpm run down`
flow after evidence review; no volumes were pruned during this wave.
