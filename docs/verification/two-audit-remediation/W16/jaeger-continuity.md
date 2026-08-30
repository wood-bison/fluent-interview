# W16 — route → run → trace continuity

Снимок: 2026-08-28T18:55:16.909Z
Статус: **pass**

| Proof | Result |
| --- | --- |
| Learner route context | HTTP 200; node-rate-limiter-001; ready; run allowed |
| Released runtime run | HTTP 201; pass; 4/4 tests pass |
| First-run timing | histogram delta 1 |
| Sergey isolation | unchanged stable projection hash |
| Jaeger continuity | fluent-task-runtime + learning-api; shared trace count 1 |

The run used a disposable synthetic learner profile. Evidence contains bounded statuses, counts, hashes and trace identities only; it does not contain source, hidden tests, answers, or learner profile identifiers.
