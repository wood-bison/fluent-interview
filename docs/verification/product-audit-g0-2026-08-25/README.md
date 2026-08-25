# G0 — reproducible product-integrity baseline

Captured: 2026-08-25 (Europe/Warsaw)

This directory is a read-only evidence snapshot for the integration/UX
remediation plan. It records released API payloads and the local production
package boundary; it is not a runtime catalogue and must never be imported by
the learner application.

## Source revisions

`revisions.tsv` records the four repository HEADs at capture time. The three
child repositories are independent Git roots; the umbrella repository only
coordinates them.

## Captured contracts

| File | Owner | Purpose |
| --- | --- | --- |
| `brain-quality.json` | Question Brain | published cards, locale parity, graph and quality checks |
| `brain-release.json` | Question Brain | immutable question release metadata |
| `runtime-health.json` | Task Runtime | runtime readiness contract |
| `lab-runtime-relations.json` | Fluent Lab adapter | Question Brain ↔ Task Runtime join and release IDs |
| `lab-program-map.json` | Fluent Lab | program, areas, stations and released paths |
| `lab-program-coverage.json` | Fluent Lab | path/capability coverage projection |
| `lab-question-summary.json` | Fluent Lab adapter | Question Brain catalogue summary |
| `lab-project-books.json` | Fluent Lab | preview/published project-book state |
| `package-status.txt` | Fluent Lab package manager | component readiness and data-preservation boundary |
| `browser-smoke-2026-08-25.json` | in-app Browser | route, landmark, overflow, console, and Studio target-size smoke evidence |
| `task-run-evidence-2026-08-25.json` | in-app Browser | server-owned Go Task Runtime → Evidence acceptance |

All JSON payloads have SHA-256 entries in `SHA256SUMS`.

## Reproduction commands

```bash
cd /Users/sergeyzhechko/developer/fluent-interview

curl -fsS 'http://127.0.0.1:48127/v1/quality?workspace=fluent-interview&include_fixtures=false' | jq .
curl -fsS 'http://127.0.0.1:48127/v1/release?workspace=fluent-interview&include_fixtures=false' | jq .
curl -fsS 'http://127.0.0.1:48227/v1/health/ready' | jq .
curl -fsS 'http://127.0.0.1:49301/api/runtime/relations' | jq .
curl -fsS 'http://localhost:49300/api/program/map' | jq .
curl -fsS 'http://localhost:49300/api/program/coverage' | jq .
curl -fsS 'http://localhost:49300/api/questions/summary' | jq .
curl -fsS 'http://localhost:49300/api/project-books/catalogue' | jq .
pnpm -C fluent-engineering-lab package:local:status
```

## Live values at capture

- Question Brain: 1,591 published cards, 1,591 English, 1,591 Russian,
  134 canonical topic rows in the current quality projection, zero unmapped
  cards, zero semantic-shape warnings.
- Fluent Lab runtime join: 18 released revisions, 17 valid exact question
  pins, one capability-only revision, state `ready`.
- Project books: five preview books, zero published books.
- Local production package: all five components ready; learner data preserved.

The numbers above are explanatory. The JSON payloads are authoritative for
verification and include release IDs and timestamps.

## Browser evidence

The live desktop walkthrough for this baseline covered `/`, `/learning-map`,
all nine `/paths/*` projections, q315, the rate-limiter TaskFamily and its Go
workspace, `/projects/content-delivery-platform/defense`, and RU/EN route
switching. The checked invariants were one `main`, one `h1`, no horizontal
 overflow, no unexpected console warnings/errors, and a successful 4/4 Go run
 with a server-owned Evidence record. The exact DOM/interaction assertions and
 accepted run identifier are recorded in the two JSON files above.

This text does not claim G0 complete: target-size screenshot baselines and a
deterministic design-audit harness remain explicit acceptance work in the
authoritative plan.
