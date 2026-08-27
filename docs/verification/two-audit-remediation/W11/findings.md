# W11 findings

## Fixed

- Runtime exposes 20 raw task revisions; 19 are released and runnable across
  15 runnable families. The project-book boundary remains explicitly
  unreleased/non-runnable.
- All raw revisions pin the current Brain release
  `question-release-d00a14931e607336`; public question binding IDs, revisions
  and content hashes reconcile with Brain.
- Runnable images are digest-pinned and all runners declare `network: none`.
- Family projection and raw catalogue agree on task identities and runnable
  status; no silent latest fallback is introduced by this gate.
- Runtime result diagnostics now redact `/hidden-tests`, `/solution` and
  `/output` mount paths and drop the optional `test_code` field before the
  result crosses the HTTP boundary. A real malformed Node submission confirms
  that private test filenames and harness paths are absent.
- Workspace requests without an exact revision now fail closed with a typed
  `revision_required` response; a live probe and Lab unit tests cover the
  boundary.
- A live disposable failure matrix covers rate-limiter pass verdicts in Node,
  Go, Java, .NET and PostgreSQL, plus Node assertion/compile/timeout cases;
  Docker argument tests cover memory, CPU, PID, network, read-only and
  capability isolation.
- The same matrix found the exported Jaeger `task.run` span for a live pass,
  matching correlation ID, task ID and exact revision; trace ID is recorded as
  evidence without storing learner source.

## Remaining W11 work

- Add explicit retry/idempotency and trace/evidence assertions to the runtime
  journey; retry/idempotency remains open, while the live pass trace identity
  assertion now passes.
- Extend compile/test/timeout adversarial cases beyond Node and capture a
  stable immutable Runtime release tuple before promotion.
- Browser frontend and Python profiles remain separate/deferred boundaries.
