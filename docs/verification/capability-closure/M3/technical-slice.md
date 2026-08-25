# M3 — technical session slice

**Status:** `PASS` for the server boundary, `ACTIVE` for the full gate

**Lab commit:** `e3dcf505c275ae2a1cc6548bf4a9324b69f712e8`

## What is proven

The API can start a server-owned rate-limiter capability session only when the
Runtime release, TaskFamily release and Question Brain release agree. The
primary QuestionCard is `question.q315`; the canonical capability is
`capability.distributed-systems.rate-limiter`; the family is
`task-family.rate-limiter`.

The API can append typed evidence commands with deterministic idempotency. A
retry returns the same immutable event. Reusing an event/session identity with
different release or content data is rejected. The DTO deliberately has no
field for raw answers, hidden tests, solutions, verdicts or `mastered`.

## What is not proven yet

This slice does not pretend that Sergey has mastered the capability. The web
learner surface still needs to call these endpoints in the actual q315 flow,
render the evidence state, and keep language-specific drafts. Then a real human
session must be completed, followed by a genuine 48–72-hour changed-context
repeat. E2E fixtures may test the state machine, but cannot close the human
gate.

## Verification record

- targeted service tests: `3 passed`;
- focused ledger tests: `3 passed / 1 skipped` (Postgres integration is opt-in);
- full Lab `pnpm check`: contracts `247/1254`, API `164/708 + 1 skipped`, web
  `77/376`, production builds and browser boundary guard all green;
- current release remains `NOT_RELEASED` until the human acceptance section is
  complete.
