# Progress snapshot — 2026-08-30

Команда: `pnpm plan:progress`
План: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`

## Формальный счётчик

**Осталось: 634 пункта из 1 134.**

| Состояние | Количество |
| --- | ---: |
| Закрыто (`[x]`) | 500 |
| Осталось (`[ ]`) | 634 |
| Всего | 1 134 |
| Формальное выполнение | 44.09% |

Это счётчик строк-чекбоксов, а не обещание production readiness. В него входят
policy/evidence/independent-review пункты, поэтому он намеренно больше числа
 текущих технических дефектов. Для понимания узкого технического фронта смотри
разбивку `pnpm plan:progress`: в неё входят implementation gates, quality/content
closure и независимая финальная проверка. Формальный счётчик не является
оценкой оставшихся часов и не подменяет evidence каждого гейта.

Последний implementation slice: target `c68293b` (evidence `62936ec`) добавил
upgrade-database rehearsal для G10S-085. Custom-format dump текущей базы был
восстановлен в disposable database; восемь миграций применились без drift,
пять pre-existing public-table counts и Studio history hash
(`b58fd792…61947`) сохранились, serving schema выросла с 5 до 13 таблиц,
временная база и dump удалены. `G10S-085` закрыт только после зелёного
`pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check` и checksum validation.

Следующий implementation slice: `G10S-086` — backup/restore completeness:
schema, роли и grants metadata, serving projection и authoring records без
credentials. Затем `G10S-087` отдельно докажет restore в disposable database,
повтор grants/invariants и exact logical hashes.

Последний implementation slice: target `4811050` (evidence `a5cdf89`) добавил
G12-025 state evidence registry. Он формализовал `71` critical-state fixture
IDs и трёхчастный evidence contract, но не закрыл checkbox: фактических
captures `0/71`, promotable dispositions `0/12`, unresolved `83`.

Следующий slice: target `cd1497e` (evidence `a183d99`) добавил
`practice-portfolio-policy.v1` и audit G11-021…028. Он честно зафиксировал
`6` cards, `7` assessed activities, `1` family, `0` runnable revisions из
`456`, `0` package-mode evidence и `0/8` закрытых проверок. Контентные
checkboxes остаются открытыми: аудит формирует точный authoring/runtime backlog
и не подменяет его синтетическими карточками.

Следующий implementation slice: target `72e4978` (evidence `f4ef25b`) добавил
`vault-classification-ledger.v1` для G11-013. Все `1 597` Brain/Vault records
теперь представлены metadata-only строками; закрытыми по факту являются
`1 591` canonical IDs, `1 591` capabilities и `1 594` RU/EN locale facets.
Roles, provenance/license и reviewer dispositions пока `0`; поэтому
`G11-013` остаётся открытым, а `0/1 597` записей считаются fully classified.

Следующий implementation slice: target `c326e79` (evidence `5d37354`) добавил
`shared-content-audit.v1` для G11-015. Он проверил `3` shared modules и `6`
generic placements: explicit shared keys отсутствуют (`0/3`), а `3` generic
placements не имеют path-specific prerequisite. Итог `G11-015=OPEN`,
`6` unresolved items; это теперь измеримый curriculum metadata backlog.

Следующий implementation slice: target `0b2669e` (evidence `93ee3fa`) добавил
bounded `research-authoring-pack.v1` для G11-018. Все `1 597` records получили
path-specific research boundaries и authoring checklist; в первом batch `100`
записей, `0` review-ready, official source missing у `1 597`, mechanism у
`494`, answer у `463`, typed placement у `1 370`, assessed activity у `1 346`.
Гейт остаётся открытым до оригинального текста, источников и reviewer sign-off.

Следующий implementation slice: target `de1836d` (evidence `10021d2`) добавил
`expert-sample-audit.v1` для G11-019. Выбрано `27` стабильных samples — по
одному на каждый path/domain cluster; `0` independent expert reviews записано,
поэтому гейт остаётся OPEN до полного decision set.

Последний implementation slice: target `96a0506` добавил seeded
`wrong-solution` vector в `pnpm runtime:vectors`. Живой released Node profile
прошёл `13` vectors и recovery; неверный source получил
`failed/public_event_loop_order_mismatch`, `baselineMatch=false`, worker cleanup
и нулевые mastery/unlock/accepted mutations. Это перевело `G11-027` в `[x]` для
текущего released runtime; package-mode и будущие языки остаются отдельными
гейтами. Practice projection теперь `1/8` pass, state hash
`da2a4de17fe4c9a34b9ebbd3273da9eee612fc78a83e8d80e38a012d3e14b7e7`.

## Открытые кластеры

- governance и evidence protocol (`0.*`, `A-*`, `D-*`);
- импорт/качество контента и coverage (`G5`, `G10`, `G11`);
- runtime conformance и practice workbench (`G6`);
- human-facing evidence, security, visual/a11y и rollback (`G7–G9`, `G12`);
- независимая проверка после release candidate (`R-*`).

После каждого следующего коммита этот снимок нужно обновлять только вместе с
проверкой команды `pnpm plan:progress`; галочки не закрываются по количеству
строк или по одному зелёному smoke-тесту.
