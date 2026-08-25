# M0 review — recovery baseline, vocabulary, and authority

Date: 2026-08-25
Status: **self-check PASS / independent reviewer PENDING**
Active plan: [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](../../../CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md)

## What was verified

1. Root and all three repositories are clean and aligned with `origin/main`.
2. The packaged Lab, Question Brain, Runtime, Jaeger, and Grafana endpoints
   responded successfully.
3. Brain quality and Runtime relation releases agree on
   `question-release-d00a14931e607336`; there are no missing locales, graph
   proposals, invalid bindings, or task-boundary violations in the live
   release.
4. The Lab map projection is reproducible: 81 nodes, 81 non-empty routes, and
   81 unique routes. Its 76 locked nodes are readiness data, not missing routes.
5. Only one shared Trace Explorer is declared. `workspace.yaml` no longer calls
   Jaeger a Task Runtime UI; status/port output uses the neutral shared name.
6. The old Lab `MASTER-PLAN.md` and the Aspire operational handoff are clearly
   historical evidence. The root closure plan is the only active queue.
7. A runtime-generated sandbox orphan was confirmed from
   `internal/engine/docker_executor.go`, stopped by exact name, and auto-removed
   without touching a volume. No global prune or foreign-resource action was
   performed.
8. Brain and Runtime images were rebuilt and recreated from the pinned clean
   checkouts. Compose volumes were preserved.

## Commands and evidence

```text
pnpm status
docker compose ls
docker system df -v
curl -fsS http://127.0.0.1:49301/api/program/inventory
curl -fsS http://127.0.0.1:49301/api/program/learner-map
curl -fsS http://127.0.0.1:49301/api/runtime/relations
curl -fsS 'http://127.0.0.1:48127/v1/quality?workspace=fluent-interview'
curl -fsS http://127.0.0.1:48227/v1/tasks/summary
docker compose --project-name fluent-question-brain --file fluent-question-brain/deploy/compose/compose.yaml build
docker compose --project-name fluent-task-runtime --file fluent-task-runtime/deploy/compose/compose.yaml build
docker compose --project-name fluent-question-brain --file fluent-question-brain/deploy/compose/compose.yaml up -d --force-recreate --remove-orphans
docker compose --project-name fluent-task-runtime --file fluent-task-runtime/deploy/compose/compose.yaml up -d --force-recreate --remove-orphans
```

Machine-readable results are in
[`baseline.json`](baseline.json). The baseline intentionally records the
historical 66/25/2/39 route comparison without treating it as current truth.

## M0 acceptance status

| Criterion | Result | Evidence |
| --- | --- | --- |
| One active plan and one glossary | PASS | root closure plan + glossary v1 |
| SHA/release/schema baseline | PASS | `baseline.json` |
| Dirty trees and Docker owners known | PASS | `baseline.json`, exact orphan action |
| Source-of-truth matrix and taxonomy mapping published | PASS | contracts v1 |
| Counters separate total/released/runnable | PASS | baseline + glossary counter policy |
| Route manifest reproducible from API | PASS | 81/81/81 projection counts |
| Shared Trace Explorer is not a Runtime UI | PASS | workspace contract + status output |
| Profile-aware baseline | PASS | packaged API bases in baseline |
| Historical `RELEASED` no longer active automation | PASS | historical headers + root AGENTS |
| Learner/foreign Docker data preserved | PASS | exact stop only; no volume deletion |
| Independent reviewer | **PENDING** | required before M0 → M1 |

M0 therefore remains `ACTIVE` until an independent reviewer checks this proof
and records `PASS`. No M1 implementation may be claimed from this self-check.
