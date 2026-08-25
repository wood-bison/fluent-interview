# M3 — technical session slice

**Status:** `PASS` for the server boundary, `ACTIVE` for the full gate

**Lab commits:** `e3dcf50` (server slice), `4e895cf` (learner UI transport)

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

The golden rate-limiter learner route now starts that server session, displays
the current gate, links to `q315`, records recall/reveal/prediction/observation,
and appends the runtime result with the Task Runtime revision contract. The
Run action is fail-closed until the server projection says `run`; a browser
refresh cannot mint a new key for the same profile/task while storage is
available.

## What is not proven yet

This slice does not pretend that Sergey has mastered the capability. A real
human session must be completed, including the spoken 60–90 second explanation
and reflection, followed by a genuine 48–72-hour changed-context repeat. E2E
fixtures may test the state machine, but cannot close the human gate.

## Verification record

- targeted service tests: `3 passed`;
- focused ledger tests: `3 passed / 1 skipped` (Postgres integration is opt-in);
- web tests: `78/378` (uncached run) and web production build green; the full
  Lab `pnpm check` is still required before closing M3;
- current release remains `NOT_RELEASED` until the human acceptance section is
  complete.
