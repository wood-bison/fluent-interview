# M4 — technical slice: canonical inventory read model

**Status:** `PREP` only; M4 remains `TODO` in the closure ledger

This slice removes one concrete source of the confusing counters: the learner
rail and Practice task headline now consume the server-owned
`product-inventory.v1` projection. The task catalogue remains a drill-down
collection; it is not allowed to redefine the released revision count.

## Live local evidence

At `2026-08-25T21:40:26.000Z`, the restarted production package on
`127.0.0.1:49300` returned:

| Surface | Result |
| --- | --- |
| `/api/program/inventory` | `200`, `product-inventory.v1`, reconciliation `valid=true`, `routeManifest=81` |
| Program | `1` |
| Paths | `9` |
| Areas | `15` |
| Stations | `81` |
| Question Brain cards | `1,591` |
| Question Brain topic groups | `135` |
| Runtime task revisions | `20` |
| Runnable stations | `1` |
| `/api/labs/catalogue` | `20` items, six languages, zero missing capability keys |
| `pnpm m4:route-audit` | `pass`, 81/81 map joins, 81/81 HTML routes, 1/1 runnable workspaces |

The exact machine-readable capture is in
[`baseline.json`](baseline.json).

The compiler/contract change is in Lab `7635423`; the independent audit
command is in Lab `cf31611` on `main`.

## What changed

- `ProgramController` compiles the inventory from released Program/Map,
  Question Brain, Runtime relation audit and profile progress.
- The same compiler emits a route manifest for every released station, with
  learner-safe route, kind, state, readiness and executable flag.
- The shell rail no longer fetches a second Question Brain summary to build a
  competing number. Invalid or unavailable inventory leaves a counter absent.
- Practice shows the released Runtime revision count and warns if the fetched
  catalogue does not match that release.
- Contract tests cover valid and invalid inventory envelopes; the full Lab
  check remains green.

## What this does not prove

This is not an M4 release. The route-manifest join and bounded HTTP crawl are
now green, but no unreleased task exposure audit and no complete counter
drill-down reconciliation across Progress and Studio have been accepted yet.
Every counter still needs an owner, formula, release id and drill-down
collection before the gate can move to `ACTIVE`.
