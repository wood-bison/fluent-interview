# Progress checkpoint — G12 Control Center evidence wave (2026-09-02)

## Master plan

This was an evidence-only bounded wave; it does not add curriculum questions,
task families, answers, or learner progress records.

| checked | remaining | total | completion |
| ---: | ---: | ---: | ---: |
| 658 | 476 | 1,134 | 58.02% |

## Closed in this wave

- Target repository: `/Users/sergeyzhechko/developer/fluent-interview-platform`,
  branch `main`.
- Local commit (no push): `6e5314914baad976f0fb03b610a4a00269f8111b` —
  `feat(g12): capture control center state evidence`.
- Isolated disposable compose stack: `fluent-g12-studio-20260902`, port
  `47380`; six services healthy, migrations 18/18, pending 0.
- Five state fixtures: `ready`, `starting`, `degraded`, `stopped`, and
  `incident-capture`.
- Unknown `state` query fails closed to `ready` and exposes a visible alert;
  `starting` exposes `aria-busy=true`; every state preserves locale and has one
  `.app-scroll-region` scroll owner.
- Each fixture has metadata-only interaction trace, semantic snapshot, and
  visual JPEG with SHA-256 entries in the G12 index/checksum manifest.

## Quality gates

- `NX_CI=1 pnpm check` — PASS;
- `pnpm boundary:check` — PASS;
- `pnpm toolchain:check` — PASS;
- C098 desktop matrix policy and accessibility policy — PASS;
- G10S historical evidence index — **655/655 verified**, rewrites `0`;
- G12 registry — `71/71` evidence-ready, `0` open machine states,
  `12` open human dispositions, `12` unresolved items,
  `0` structural failures;
- target ladder was chained as `git status → git diff --check → NX_CI=1
  pnpm check → pnpm boundary:check → pnpm toolchain:check → git commit`.

## Remaining order

1. Complete G10S-246 human acceptance for the 12 open screen dispositions;
   machine evidence must not promote human review to `DONE`.
2. Run G11 breadth and path-specific closure packs for the curriculum and
   content bank.
3. Run G12.5 requalification and an independent final review.
4. Execute G13 decommission only after retention and rollback proof are
   signed off; do not delete legacy repositories, containers, or evidence
   earlier.

Push remains intentionally deferred while GitHub Actions quota is constrained.
