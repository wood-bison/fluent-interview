# Greenfield plan progress — 2026-09-03 — G11-R07 join guard

Снимок выполнен после target-коммитов `2246c48` (implementation) и `ba73857`
(evidence) в `/Users/sergeyzhechko/developer/fluent-interview-platform`.
Оба коммита локальные; push не выполнялся из-за ограничения GitHub Actions и
удаление старых репозиториев, сущностей, контейнеров, volumes и данных не
выполнялось.

## Что сделано

- Добавлен fail-closed guard `G11-R07`, который требует точный join
  `questionRef + activityId → TaskFamily + TaskRevision + runtimeProfile` и
  released scenario.
- `broken`, `partial` и `preview` links исключаются из coverage, но остаются
  видимыми как blocked; conceptual activity не превращается в выдуманную
  runnable task.
- Focused suite: `4/4 PASS`. Полный target `pnpm check`,
  `pnpm boundary:check`, `pnpm toolchain:check` и post-commit
  `pnpm architecture:evidence-schema`: `PASS`; target `main` clean.

## Честный текущий результат

`7` assessed activities → `4` runnable candidates → `2` exact runnable
activities (`event-loop` predict/run), `2` blocked candidates (`nexttick`
starvation и Nest interceptor), `3` conceptual activities. Выпущены `1`
runtime profile и `1` scenario. Пять structural checks проходят:
`projectionValid`, `everyExposedRunnableHasExactJoin`,
`brokenCandidatesExcludedFromCoverage`, `previewLinksExcludedFromCoverage`,
`deterministicOrdering`.

Общий статус — `PASS_WITH_GAPS`. Поэтому checkbox `G11-R07` остаётся открытым:
этот guard доказывает корректное исключение пробелов, но не создаёт недостающие
TaskFamily/Revision/runtime releases и не подменяет authoring.

Receipt:
`fluent-interview-platform/docs/verification/greenfield/G11/activity-runtime-revalidation-2026-09-03.{json,md}`.

## Reproducible progress

`pnpm plan:progress:json`:

| Срез | Checked | Remaining | Total | Completion |
| --- | ---: | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 | 58,55% |
| Исполнимые gates/checks | 664 | 278 | 942 | 70,49% |
| Неразрушающее закрытие продукта | 664 | 128 | 792 | 83,84% |
| Product closure | 664 | 73 | 737 | 90,09% |
| Requalification + independent review | 0 | 55 | 55 | 0% |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 | 0% |

Следующая очередь: authoring/runtime packs для двух blocked candidates, затем
повторить этот gate до `PASS`; после этого G11-R08 language relevance, R09
overlays, R12–R14 и G12.5. `PASS_WITH_GAPS` не является production promotion.

Дата: 3 сентября 2026
