# M4 — technical slice: canonical inventory read model

**Status:** `PREP` only; M4 remains `TODO` in the closure ledger

This slice removes one concrete source of the confusing counters: the learner
rail and Practice task headline now consume the server-owned
`product-inventory.v1` projection. The task catalogue remains a drill-down
collection; it is not allowed to redefine the released revision count.

## Live local evidence

At `2026-08-25T21:30:26.000Z`, the running Lab on `127.0.0.1:49300` returned:

| Surface | Result |
| --- | --- |
| `/api/program/inventory` | `200`, `product-inventory.v1`, reconciliation `valid=true` |
| Program | `1` |
| Paths | `9` |
| Areas | `15` |
| Stations | `81` |
| Question Brain cards | `1,591` |
| Question Brain topic groups | `135` |
| Runtime task revisions | `20` |
| Runnable stations | `1` |
| `/api/labs/catalogue` | `20` items, six languages, zero missing capability keys |

The exact machine-readable capture is in
[`baseline.json`](baseline.json).

## What changed

- `ProgramController` compiles the inventory from released Program/Map,
  Question Brain, Runtime relation audit and profile progress.
- The shell rail no longer fetches a second Question Brain summary to build a
  competing number. Invalid or unavailable inventory leaves a counter absent.
- Practice shows the released Runtime revision count and warns if the fetched
  catalogue does not match that release.
- Contract tests cover valid and invalid inventory envelopes; the full Lab
  check remains green.

## What this does not prove

This is not an M4 release. A route manifest and an independent crawl still have
to prove that every advertised executable URL returns a runnable workspace,
that no unreleased task is exposed, and that every counter has an owner,
formula, release id and drill-down collection. Progress and Studio surfaces
also need explicit consumer reconciliation before the gate can move to
`ACTIVE`.
