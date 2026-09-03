# Master-plan progress — G11-021 activity runtime projection

Дата: **3 сентября 2026** · target `fluent-interview-platform/main` · local
commits only, push не выполнялся.

## Снимок

| Счётчик | Выполнено | Осталось | Всего | Completion |
| --- | ---: | ---: | ---: | ---: |
| Формальные пункты master-plan | 659 | 475 | 1 134 | 58,11% |
| Исполнимые gates/checks | 659 | 283 | 942 | 69,96% |
| Non-destructive closure | 659 | 133 | 792 | 83,21% |
| Product closure | 659 | 78 | 737 | 89,42% |

Источник счётчиков: `pnpm plan:progress:json` в umbrella-репозитории
`fluent-interview`. `pnpm plan:progress:test` — **3/3 PASS**.

## Закрытый срез

Target commit: `69d2cac` — `feat(g11): project released activity runtime joins`.

Новая проекция не меняет `question-catalog.v1` и не создаёт learner content.
Она дала два проверенных exact runtime joins:

- `question.node-event-loop-001.activity-predict` →
  `node-event-loop-001@1` / `node-26-commonjs`;
- `question.node-event-loop-001.activity-run` →
  `node-event-loop-001@1` / `node-26-commonjs`.

Текущий portfolio audit: **7 assessed activities**, **2 exact joins**, **5 open**,
`1` runnable revision; independent scenario queue: **12** requested slots,
`0` ready-for-review. G11-027 и G11-028 остаются PASS; G11-021…026 остаются
OPEN, потому что breadth, facets, shared families, rubrics и независимые
scenario bodies ещё не авторизованы.

## Проверки

- projection/portfolio/queue tests: **14/14 PASS**;
- полный `pnpm check`: **PASS**;
- evidence schema index: **690/690 verified**, `rewritesDetected=0`;
- database/import/release/Docker mutations: `0`;
- push: `false`.

Следующая bounded очередь — оформить human acceptance G10S-246 на актуальном
immutable snapshot, затем пройти reviewed authoring G11. Удаление legacy
репозиториев, сущностей, volumes, images и контейнеров не выполняется без
отдельного пользовательского разрешения и restore proof.
