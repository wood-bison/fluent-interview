# Greenfield plan progress — 2026-09-03 — G11-R08 language-path guard

Снимок выполнен после target commit `8e2a149b33924df1ff900fabd44eb1d3cb4ffc33`
(`gate(g11): add language path revalidation`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Удаление старых
репозиториев, сущностей, контейнеров, volumes и данных не выполнялось.

## Что сделано

- Добавлен `G11-R08` — детерминированная проверка ожидаемых language tracks,
  policy/curriculum/catalog coverage и path relevance.
- Native и generic placements проверяются раздельно; неизвестный track,
  foreign placement, malformed metadata и duplicate relevance IDs fail closed.
- Оценка не создаёт content bodies, TaskFamily/Revision, runtime releases,
  import, release pointer, database/Docker mutation или learner progress.
- Evidence JSON/Markdown сохранены в target G11; historical evidence index
  пересобран штатным генератором.

## Честный текущий результат

| Метрика | Значение |
| --- | ---: |
| Ожидаемые tracks | 8 |
| Оценённые tracks | 3 (`node`, `java`, `go`) |
| Blocked tracks | 5 (`dotnet`, `kotlin`, `python`, `react`, `next`) |
| Failed tracks | 0 |
| Placements | 10 |
| Native placements | 4 |
| Generic placements | 6 |

Все семь checks имеют `PASS` либо честный `PASS_WITH_GAPS`:
`expectedTrackSet`, `policyCoverage`, `curriculumCoverage`, `forbiddenSet`,
`relevanceMatrix`, `deterministicOrdering`, `metadataBoundary`.

Общий статус — `PASS_WITH_GAPS`. Поэтому checkbox `G11-R08` остаётся
открытым: guard доказывает корректную фиксацию пробелов, но не создаёт
отсутствующий curriculum/content/runtime. Ни один будущий путь не считается
готовым только потому, что его имя присутствует в expected set.

Evidence state hash: `c004ca60be7dc0314faa18b340075c0ea98bc037040a801fd268271539b8f22e`.
Historical index: `701/701` entries verified, `rewritesDetected=0`.

## Проверки и воспроизводимость

- `node --test tools/content-compiler/test/g11-language-path-revalidation.test.mjs` — **4/4 PASS**;
- `pnpm content:gates` — **PASS**;
- `pnpm check` — **PASS**;
- `pnpm boundary:check` — **PASS**;
- `pnpm toolchain:check` — **PASS**;
- `pnpm architecture:evidence-schema` после commit — **PASS**, target clean;
- `origin/main...main = 0 528` (push не выполнялся).

## Следующая очередь

1. Авторские/runtime packs для `dotnet`, `kotlin`, `python`, `react`, `next` с
   exact family/revision/profile и reviewed placement.
2. Повторить R08 после каждого цельного pack batch; только `PASS` может закрыть
   G11-R08, `PASS_WITH_GAPS` остаётся открытым.
3. Затем выполнить R09 overlays, R12–R14, G12.5 requalification и независимый
   human review.

Формальные счётчики не менялись, потому что ни один новый checkbox не получил
доказательство полного closure:

| Срез | Checked | Remaining | Total | Completion |
| --- | ---: | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 | 58,55% |
| Исполнимые gates/checks | 664 | 278 | 942 | 70,49% |
| Неразрушающее закрытие продукта | 664 | 128 | 792 | 83,84% |
| Product closure | 664 | 73 | 737 | 90,09% |
| Requalification + independent review | 0 | 55 | 55 | 0% |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 | 0% |

Дата: 3 сентября 2026
