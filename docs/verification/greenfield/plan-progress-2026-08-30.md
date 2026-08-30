# Progress snapshot — 2026-08-30

Команда: `pnpm plan:progress`
План: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`

## Формальный счётчик

**Осталось: 215 пунктов из 606.**

| Состояние | Количество |
| --- | ---: |
| Закрыто (`[x]`) | 391 |
| Осталось (`[ ]`) | 215 |
| Всего | 606 |
| Формальное выполнение | 64.52% |

Это счётчик строк-чекбоксов, а не обещание production readiness. В него входят
policy/evidence/independent-review пункты, поэтому он намеренно больше числа
текущих технических дефектов. Для понимания узкого технического фронта смотри
разбивку `pnpm plan:progress`: на implementation gates `G0–G12` остаётся 31
пункта, а независимая финальная проверка `R-*` ещё не начата.

## Открытые кластеры

- governance и evidence protocol (`0.*`, `A-*`, `D-*`);
- импорт/качество контента и coverage (`G5`, `G10`, `G11`);
- runtime conformance и practice workbench (`G6`);
- human-facing evidence, security, visual/a11y и rollback (`G7–G9`, `G12`);
- независимая проверка после release candidate (`R-*`).

После каждого следующего коммита этот снимок нужно обновлять только вместе с
проверкой команды `pnpm plan:progress`; галочки не закрываются по количеству
строк или по одному зелёному smoke-тесту.
