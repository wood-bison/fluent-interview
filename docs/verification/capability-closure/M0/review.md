# M0 review — recovery baseline, vocabulary, and authority

Date: 2026-08-25
Status: **self-check PASS / independent reviewer PENDING**
Active plan: [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](../../../CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md)

## What was verified

1. Root proof source commit and all three repositories are recorded with exact
   SHA values; the root proof was captured at `53f623c` and the two service
   checkouts are `3b10ddf` (Question Brain) and `050340b` (Task Runtime).
2. The packaged Lab, Question Brain, Runtime, Jaeger, and Grafana endpoints
   responded successfully.
3. Brain quality and Runtime relation releases agree on
   `question-release-d00a14931e607336`; the live Runtime reports
   `task-family-release-2026-08-25-g9`. There are no missing locales, graph
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
   checkouts. Each owned image now carries
   `org.opencontainers.image.revision`; the label was inspected against the
   checkout SHA. Compose volumes were preserved.
9. A real in-app Browser crawl visited 14 representative learner routes after
   API hydration. All resolved without runtime-error copy; the four primary
   language paths rendered their headings, the question library rendered 1,591
   cards and 135 topic groups, and the Go rate-limiter lab rendered 4/4
   evidence checks. The crawl is recorded in `baseline.json` and is not
   deferred to M12.

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
QUESTION_BRAIN_SOURCE_REVISION="$(git -C fluent-question-brain rev-parse HEAD)" \
  docker compose --project-name fluent-question-brain --file fluent-question-brain/deploy/compose/compose.yaml build
TASK_RUNTIME_SOURCE_REVISION="$(git -C fluent-task-runtime rev-parse HEAD)" \
  docker compose --project-name fluent-task-runtime --file fluent-task-runtime/deploy/compose/compose.yaml build
docker compose --project-name fluent-question-brain --file fluent-question-brain/deploy/compose/compose.yaml up -d --force-recreate --remove-orphans
docker compose --project-name fluent-task-runtime --file fluent-task-runtime/deploy/compose/compose.yaml up -d --force-recreate --remove-orphans
docker inspect --format '{{.Name}}|{{.Image}}|{{index .Config.Labels "org.opencontainers.image.revision"}}' \
  fluent-question-brain-api-1 fluent-question-brain-indexer-1 \
  fluent-question-brain-cms-1 fluent-task-runtime-runtime-1
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
| Representative Browser crawl after hydration | PASS | 14 routes; 0 runtime errors; 1,591 cards / 135 topics; Go lab 4/4 |
| Image source revision is independently inspectable | PASS | OCI revision labels match service SHAs |
| Shared Trace Explorer is not a Runtime UI | PASS | workspace contract + status output |
| Profile-aware baseline | PASS | packaged API bases in baseline |
| Historical `RELEASED` no longer active automation | PASS | historical headers + root AGENTS |
| Learner/foreign Docker data preserved | PASS | exact stop only; no volume deletion |
| Independent reviewer | **PENDING** | required before M0 → M1 |

M0 therefore remains `ACTIVE` until an independent reviewer checks this proof
and records `PASS`. No M1 implementation may be claimed from this self-check.
