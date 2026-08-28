# Gate W17 — PASS WITH EXPLICIT MATRIX GAPS

The executable validation matrix is green: 35 router records, 43 sampled web
routes and 16 public API probes passed. The matrix now contains 107 checks,
including nine accepted-placement boundary checks, and the current Vue E2E
suite reports 102/102 scenarios on both supported desktop projects. The
Question Brain boundary accepts both current/current and previous/current
envelopes (14 contract tests). Release identity, bounded pagination,
fixture-free Brain content and code/PostgreSQL TaskFamily separation reconcile
across the live development stack.

The semantic path matrix adds 27 checks (nine published counts, nine placement
boundaries and nine language/domain isolation checks) and is green. It
intentionally leaves W17-026 open: the released Frontend projection has no
Vue-native syllabus yet; React/Angular/shared cards are not relabelled as Vue
content.

The negative boundary gate is green: invalid graph release IDs, stale and
malformed runtime revisions, and incompatible TaskFamily bindings fail closed
with typed responses. The owner retry/idempotency/timeout fixtures add 54
targeted tests without creating learner state.

The Brain ↔ Runtime release-join gate is also green (27/27): the Runtime
question-release dependency matches the published Brain release, all 22
question bindings match their revision and content hash, and 19 runnable
revisions are released with immutable hashes. One capability-only revision is
explicitly deferred and cannot be run.

The browser route matrix adds a concrete h1/console/request/overflow pass for
all 41 browser samples on both desktop projects and probes every internal learner href
projected by those routes. The named golden suite contains seven test bodies and
passes 14/14 executions (once per supported desktop project): theory-only,
incomplete, rich learning layers, the five rate-limiter language bindings,
CodeMirror language-mode binding, PostgreSQL SQL boundary, project-book checkpoint and AI cancellation. The
visual/state matrix adds eight executions
covering RU/EN × light/dark, keyboard entry, reduced motion/transparency and
200% zoom. This is not a production promotion.

The aggregate development verifier now passes 55/55 steps with no warning:
`package-provenance-plan` is executable and all five child roots are clean and
pinned. This is still development verification, not production promotion. The remaining rows are
  explicit: Vue-native syllabus, independent screenshot sign-off and package-mode
  multi-language runtime drills. W17-040 is closed by the isolated real PostgreSQL 17 run
recorded in `postgresql-concurrency-run.json`; W17-041 and W17-042 are closed
by the server-owned ordering and Node.js incident runs recorded in
`design-case-run.json` and `incident-debug-run.json`; W17-045 is closed by
the AppModule HTTP cold-repeat integration in `cold-repeat-http-run.json`.
None is counted from a browser fixture alone.

During the first aggregate rerun, `studio-system` and the catalogue integrity
check exposed a reproducible cold-load defect rather than a flaky test:
Question Brain quality reads could fan out across the four-connection local
Postgres pool and Lab's 1.2s client timeout converted a healthy slow projection
into an error taxonomy 500. The fix is now part of the released development
path: Brain coalesces identical quality requests and serves a two-second
answer-free snapshot bounded to 32 workspace/scope entries; Lab's operator
boundary has a bounded 4s timeout. The post-fix 20-request concurrent probe
returned 20/20 HTTP 200 responses, the catalogue check passed, and the
complete 102/102 browser suite plus aggregate gate passed. Question Brain's
HTTP package tests are race-clean, and the full Brain/Runtime Go test and vet
suites pass. The failure was fixed, not hidden by retrying the same run.

The canonical-route guard passes 8/8. Legacy `/program` and `/map` aliases are
included in the live route matrix and preserve query/hash context; learner
lesson/question views no longer invent an Event Loop destination.

Evidence: `validation-matrix.json`, `tests.json`, `commands.jsonl`,
`findings.md` and the earlier W13–W16 owner-gate artifacts.
