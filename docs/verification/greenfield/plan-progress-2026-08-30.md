# Progress snapshot — 2026-08-30

Команда: `pnpm plan:progress`
План: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`

## Формальный счётчик

**Осталось: 194 пунктов из 606.**

| Состояние | Количество |
| --- | ---: |
| Закрыто (`[x]`) | 412 |
| Осталось (`[ ]`) | 194 |
| Всего | 606 |
| Формальное выполнение | 67.99% |

Это счётчик строк-чекбоксов, а не обещание production readiness. В него входят
policy/evidence/independent-review пункты, поэтому он намеренно больше числа
 текущих технических дефектов. Для понимания узкого технического фронта смотри
разбивку `pnpm plan:progress`: на implementation gates `G0–G12` остаётся 16
пунктов, а независимая финальная проверка `R-*` ещё не начата.

Последний implementation slice: target `4811050` (evidence `a5cdf89`) добавил
G12-025 state evidence registry. Он формализовал `71` critical-state fixture
IDs и трёхчастный evidence contract, но не закрыл checkbox: фактических
captures `0/71`, promotable dispositions `0/12`, unresolved `83`.

## Открытые кластеры

- governance и evidence protocol (`0.*`, `A-*`, `D-*`);
- импорт/качество контента и coverage (`G5`, `G10`, `G11`);
- runtime conformance и practice workbench (`G6`);
- human-facing evidence, security, visual/a11y и rollback (`G7–G9`, `G12`);
- независимая проверка после release candidate (`R-*`).

После каждого следующего коммита этот снимок нужно обновлять только вместе с
проверкой команды `pnpm plan:progress`; галочки не закрываются по количеству
строк или по одному зелёному smoke-тесту.
