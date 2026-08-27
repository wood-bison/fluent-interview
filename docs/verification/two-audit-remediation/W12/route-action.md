# W12 route/action gate

Status: **PASS**
Cases: **12/12**; exact Runtime selections: **3**; recovery cases: **2**.

The gate calls the server-owned `learner-route-context.v1` projection. It checks canonical routes, phase/family consistency, allowed actions, exact TaskFamily + revision identity, query tamper rejection and answer-free recovery.

| Case | Family | Canonical route | Phase | Actions | Status |
| --- | --- | --- | --- | --- | --- |
| `program` | `program` | `/` | `overview` | open-map, open-practice, open-progress | PASS |
| `knowledge-map` | `knowledge-map` | `/learning-map` | `overview` | back, open-program, open-practice | PASS |
| `practice-entry` | `practice-lab` | `/practice` | `overview` | back, open-program, open-progress | PASS |
| `task-family` | `practice-task-family` | `/practice/task-family/task-family.deferred` | `overview` | back, open-practice, open-progress | PASS |
| `question-practice` | `practice-questions` | `/practice/questions` | `practice` | back, open-practice, open-progress | PASS |
| `theory-lesson` | `practice-lesson` | `/practice/lesson/js-prediction` | `lesson` | back, open-progress | PASS |
| `controlled-lab` | `practice-lab` | `/practice/lab/node-event-loop-001` | `trace` | back, open-practice, run, open-traces, open-progress | PASS |
| `runtime-exact` | `practice-lab` | `/practice/lab/deferred?revision=1&taskFamily=task-family.deferred` | `predict` | back, open-practice, run, open-progress | PASS |
| `journal-alias` | `progress` | `/journal?view=recall` | `progress` | back, open-program, open-practice | PASS |
| `unknown-recovery` | `recovery` | `recovery` | `recovery` | recover, open-program, open-map | PASS |
| `external-return-rejected` | `practice-lab` | `/practice/lab/node-event-loop-001` | `predict` | back, open-practice, run, open-progress | PASS |
| `invalid-runtime-selection` | `recovery` | `recovery` | `recovery` | recover, open-program, open-map | PASS |

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
LEARNING_API_URL=http://127.0.0.1:47000 pnpm route:actions:gate
LEARNING_API_URL=http://127.0.0.1:47000 pnpm route:actions:gate:check
```

Stable content digest: `c1511649c8e9578de4b2d9829fefc8db386ff0a91aeb2c7a84b0173346799937`
