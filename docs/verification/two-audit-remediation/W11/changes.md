# W11 changes

- Added a read-only Runtime binding gate that reconciles `/v1/tasks`,
  `/v1/task-families`, and the published Brain catalogue.
- Every task identity is checked as `taskId@revision`; duplicate identities,
  stale Brain release pins, missing question bindings, revision/hash mismatch,
  unpinned runnable images and network-enabled runners fail closed.
- Family rows are checked against raw revisions and runnable flags. The gate
  preserves the one intentionally unreleased project-book revision as a
  non-runnable row instead of counting it as learner-ready.
- Workspace clients and the Runtime HTTP boundary now require an exact positive
  `revision`; ambiguous or missing revisions are typed refusals, never latest
  fallbacks.
- Added a root release-verifier step and machine-readable evidence without
  copying hidden tests, answers or source code.
- Hardened the Runtime result boundary: private mount paths are replaced with
  neutral diagnostic placeholders, learner-facing messages are bounded, and
  `test_code` is always removed from the public envelope.
- Added `runtime-failure-matrix-gate.mjs` and a Docker-backed engine regression
  test. The matrix writes `runtime-failure-matrix.json`/`.md`, probes the
  missing-revision refusal, exercises five rate-limiter language profiles and
  records only source digests, typed verdicts and timing. It also verifies the
  exported Jaeger `task.run` span carries the same correlation/task/revision
  identity as the pass response.
