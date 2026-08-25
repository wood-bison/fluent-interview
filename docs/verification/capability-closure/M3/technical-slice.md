# M3 — technical session slice

**Status:** `PASS` for the server boundary, `ACTIVE` for the full gate

**Lab commits:** `e3dcf50` (server slice), `4e895cf` (learner UI transport),
`4443bc8` (lint-clean Angular client), `2f19db4` (explanation/reflection and
server-owned cold-repeat scheduling), `98177b4` (reconciled inventory compiler)

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
submits the deterministic explanation, records a reflection, and appends the
runtime result with the Task Runtime revision contract. After reflection the
learner can schedule the repeat; the API owns the stable assignment id,
`dueAt = recordedAt + 48h`, and changed-context id. When the due gate is open,
the changed-context run is recorded as repeat evidence. The Run action is
fail-closed until the server projection says `run` or `cold-repeat`; a browser
refresh cannot mint a new key for the same profile/task while storage is
available.

## What is not proven yet

This slice does not pretend that Sergey has mastered the capability. A real
human session must be completed, including the spoken 60–90 second explanation
and reflection, followed by a genuine 48–72-hour changed-context repeat. E2E
fixtures may test the state machine, but cannot close the human gate.

## Verification record

- targeted service tests: `4 passed`;
- focused ledger tests: `3 passed / 1 skipped` (Postgres integration is opt-in);
- full Lab `pnpm check`: curriculum drift `0`; lab-contracts `247/1254`,
  learning-api `165/711 + 1 skipped`, web `78/378`, observability `7/39`;
  production builds and browser boundary guard green. Existing warnings remain
  explicitly listed below.
- current release remains `NOT_RELEASED` until the human acceptance section is
  complete.
