# M4 — technical slice: canonical inventory read model

**Status:** `PREP` only; M4 remains `TODO` in the closure ledger

This slice removes one concrete source of the confusing counters: the learner
rail and Practice task headline now consume the server-owned
`product-inventory.v1` projection. The task catalogue remains a drill-down
collection; it is not allowed to redefine the released revision count.

## Live local evidence

At `2026-08-25T22:03:16.251Z`, the restarted production package on
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
| Runtime release descriptors (operator view) | `20` |
| Learner-visible Runtime revisions | `19` |
| Learner-visible TaskFamily keys | `14` |
| Runnable stations | `1` |
| `/api/labs/catalogue` | `19` items, six languages, zero missing capability keys; all 19 workspaces respond |
| `pnpm m4:route-audit` | `pass`, 81/81 map joins, 81/81 HTML routes, 1/1 runnable station workspaces, 19/19 catalogue workspaces, Program/Coverage/Practice/Published/Progress/Next and Studio Question Brain identities/counts reconciled |
| Explore projection (`x-fel-mode: explore`) | `81` open topics, `0` locked topics, `66` runnable stations; inventory valid |

The exact machine-readable capture is in
[`baseline.json`](baseline.json).

## Follow-up validation

At `2026-08-26T00:05:49Z`, after the package restart on Lab `9af8713`, the
full `NX_SKIP_NX_CACHE=true pnpm check` completed with exit code `0`:

- curriculum drift: `valid=true`, `issueCount=0`;
- Lab contracts: `247` suites / `1,254` tests passed;
- learning API: `165` suites passed, `1` intentionally skipped (`712/713`
  tests passed);
- learner web: `79` suites / `380` tests passed;
- observability: `7` suites / `39` tests passed;
- production bundle guard: `59` browser chunks scanned, pass.

The command still reports the existing non-fatal lint warnings (41 contracts,
6 API, 13 web) and two Angular performance-budget warnings (initial bundle
and lab route stylesheet). They are recorded as M11 work; they did not change
the exit status or hide a test/build failure.

The local production package was then rebuilt and restarted from Lab
`e088ad6` at `2026-08-25T22:10:55.909Z`. The package state is `ready`, the
learner route is `http://localhost:49300/onboarding`, and a fresh
`pnpm m4:route-audit` returned `status=pass` with the Studio checks below.

The compiler/contract change is in Lab `7635423`; the learner catalogue
release-boundary fix is in Lab `7018909`; the independent audit crawl is in
Lab `d4ef81b`; the Explore-mode acceptance assertion is in Lab `7289e7d`; the
first consumer-surface release reconciliation is in Lab `f427ec7`, the
Practice/Published/learner-map extension is in Lab `9af8713`, and the Studio
Question Brain counter reconciliation is in Lab `e088ad6`, all on `main`.

At `2026-08-25T22:09:44.300Z`, the independent audit also verified the
operator-facing Studio projections:

- Question Brain summary release `question-release-d00a14931e607336` matches
  `product-inventory.release.questionReleaseId`;
- Studio summary and quality both report `1,591` cards and `135` topic groups;
- published, graph-released, English and Russian checks reconcile to the same
  release (`1,591 / 1,591 / 0 / 0`);
- the inventory still reports only `6` station-bound cards, making the corpus
  versus learning-station distinction explicit rather than silently claiming
  that every card is already a learner station.

## What changed

- `ProgramController` compiles the inventory from released Program/Map,
  Question Brain, Runtime relation audit and profile progress.
- Runtime's operator descriptor count is deliberately not copied into the
  learner counter: capability-only/unreleased descriptors remain available to
  authoring and Studio, while only fully joined `valid` revisions become
  learner TaskFamilies and revisions.
- The same compiler emits a route manifest for every released station, with
  learner-safe route, kind, state, readiness and executable flag.
- The shell rail no longer fetches a second Question Brain summary to build a
  competing number. Invalid or unavailable inventory leaves a counter absent.
- Practice shows the released Runtime revision count and warns if the fetched
  catalogue does not match that release.
- Contract tests cover valid and invalid inventory envelopes; the full Lab
  check remains green.

## What this does not prove

This is not an M4 release. The route-manifest join, zero-unreleased-task
catalogue check, 19-workspace HTTP crawl, Explore-mode open-topic check and
Studio release/counter reconciliation are green, but complete counter
drill-down reconciliation across Program, Map, Practice, Progress and Studio
has not been accepted yet. Every counter still needs an owner, formula,
release id and drill-down collection before the gate can move to `ACTIVE`.
