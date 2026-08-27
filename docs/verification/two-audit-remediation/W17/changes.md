# W17 changes — validation matrix

## Implemented

- Added `scripts/validation-matrix-gate.mjs`, a bounded read-only gate that
  inventories the Vue router and probes 43 canonical, legacy-alias, dynamic,
  unavailable and recovery routes.
- The same gate probes 16 public Lab/Runtime/Brain endpoints and reconciles
  Program, inventory, Practice, Progress, Question Brain and Runtime release
  identity. It also verifies bounded question pagination and separation of code
  and PostgreSQL rate-limit families.
- Added root commands `validation:matrix:check` and `verify:routes`; the
  static check and development-live matrix now run from `release-verify`.
- Persisted the machine-readable result at `validation-matrix.json` so a
  route can only be considered covered when its HTTP status, HTML shell and
  source release evidence are present.
- Added executable current/current and previous/current boundary fixtures for
  the Question Brain envelope and a schema-compatibility gate.
- Added a browser route matrix for every concrete route sample, including the
  deployment workspace route, with meaningful headings, console/request and
  horizontal-overflow assertions on both supported desktop projects.
- Added `scripts/runtime-release-join-gate.mjs` and wired it into the aggregate
  development release verifier. The gate checks Brain release/catalog identity,
  Runtime's question-release dependency, every binding's revision and content
  hash, and the released/immutable state of all runnable revisions; capability-
  only deferred revisions remain explicit and non-runnable.
- Added learner-safe placement metadata (`native`, `shared`, `proposed`,
  `unmapped`) to the Lab question projection and forward-compatible Vue
  contract. Questions now explain why a non-native card is visible without
  exposing Brain's internal `pathKey` or `mappingState`.
- Added a seven-test named golden journey suite covering theory-only,
  incomplete and rich cards, all five rate-limiter language revisions,
  CodeMirror language-mode binding, PostgreSQL row-lock SQL boundary,
  project-book checkpoint and local-AI cancellation. The suite runs on both
  desktop projects (14 executions).
- Executed the released `pg-locks-016` task through the live Task Runtime with
  real concurrent PostgreSQL 17 sessions. All five harness checks passed,
  including zero overlapping claims, `SKIP LOCKED` behaviour and final row
  state. Evidence is persisted in `postgresql-concurrency-run.json` without
  publishing the learner solution.
- Exercised a real server-owned ordering design activity: Docker layer/cache
  source issuance followed by a correct 8/8 commit in an isolated profile.
  The server required the explanation boundary and did not return its answer
  key to the learner. Evidence: `design-case-run.json`.
- Exercised the released `node-cpu-bound-002` incident task through Task
  Runtime. Real Node.js 24 worker-thread, event-loop, AbortSignal and cleanup
  checks passed 4/4. Evidence: `incident-debug-run.json`.
- Added a real AppModule HTTP integration for cold repeat. It creates an
  explained initial attempt, creates the linked repeat, records a pass stamp,
  and returns a retained comeback projection with no next action. The local AI
  dependency is advisory-only and replaced by a bounded test provider.
  Evidence: `cold-repeat-http-run.json`.
- Added an eight-execution visual/state matrix for RU/EN × light/dark,
  keyboard entry, reduced motion/transparency and 200% zoom. The zoom check
  waits for the lazy route's semantic heading instead of relying on a flaky
  fixed delay.
- Added the canonical-route gate and promoted `/program` and `/map` legacy
  aliases into the live validation matrix. The static and live gates now
  cover all 35 router records, preserve query/hash context, and guard learner
  CTAs against inventing a task destination.
- Added lazy CodeMirror grammars for JavaScript, TypeScript, Go, Java, C# and
  SQL. The workspace editor now derives its grammar from the server-owned
  runtime language instead of silently rendering every task as JavaScript.
- Hardened the Question Brain quality projection against the observed cold-load
  thundering herd. The HTTP server now coalesces identical in-flight quality
  reads and caches only the answer-free aggregate for two seconds; the cache is
  scoped by workspace/fixture mode, bounded to 32 entries, and never fronts
  writes. Lab development and packaged clients now use a bounded 4s operator
  timeout instead of the learner route-ready 1.2s budget. Added an HTTP
  concurrency unit test and verified 20 simultaneous live Brain requests, Lab
  catalogue integrity, `studio-system` route rendering, and the complete
  102-scenario browser suite.

## Existing checks included in the wave

- Vue Playwright E2E: 102 scenarios on the two desktop projects.
- Lab route manifest, action projection, track isolation, activity corpus and
  Runtime binding gates.
- Design token, performance, observability, accessibility and desktop visual
  guards from earlier waves.

No synthetic endpoint in this wave writes progress, starts a task run, changes
graph/content releases or mutates Docker state.
