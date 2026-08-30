# Progress snapshot — 2026-08-30

Команда: `pnpm plan:progress`
План: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`

## Формальный счётчик

**Осталось: 631 пункт из 1 134.**

| Состояние | Количество |
| --- | ---: |
| Закрыто (`[x]`) | 503 |
| Осталось (`[ ]`) | 631 |
| Всего | 1 134 |
| Формальное выполнение | 44.36% |

Это счётчик строк-чекбоксов, а не обещание production readiness. В него входят
policy/evidence/independent-review пункты, поэтому он намеренно больше числа
 текущих технических дефектов. Для понимания узкого технического фронта смотри
разбивку `pnpm plan:progress`: в неё входят implementation gates, quality/content
closure и независимая финальная проверка. Формальный счётчик не является
оценкой оставшихся часов и не подменяет evidence каждого гейта.

Предыдущий implementation slice: target `c018ed2` (evidence `51d24d4`) добавил
backup-completeness rehearsal для G10S-086. Disposable database после всех
восьми миграций содержит Strata authoring и public serving records; custom-format
dump включает обязательные таблицы, а `roles-grants.json` фиксирует 4
least-privilege роли, 6 schema grants, 271 object grants и 0 memberships без
credentials (`credentialsDetected=false`). Временная база и dump удалены;
`G10S-086` закрыт только после зелёного `pnpm check`, post-commit ladder,
checksum validation и evidence validation.

Последний implementation slice: target `74c3242` (evidence `f1cb582`) закрыл
G10S-087. Custom dump из migrated source восстановлен во вторую disposable
database; после replay allowlisted grants source/restored/target logical hash
совпал (`4f528310…70f5cc`), role metadata совпала (4 роли, 6 schema grants,
271 object grants, 0 memberships), а `g10s_role_checks.sql` подтвердил 12/12.
Обе временные базы и dump удалены. Gate закрыт после полного `pnpm check`,
архитектурного тестового набора и evidence/checksum validation.

Следующий implementation slice: `G10S-092` — создать deterministic migration
rejection report для source collisions; auto-merge вопросов запрещён.

Исторический implementation slice: target `4811050` (evidence `a5cdf89`) добавил
G12-025 state evidence registry. Он формализовал `71` critical-state fixture
IDs и трёхчастный evidence contract, но не закрыл checkbox: фактических
captures `0/71`, promotable dispositions `0/12`, unresolved `83`.

Исторический slice: target `cd1497e` (evidence `a183d99`) добавил
`practice-portfolio-policy.v1` и audit G11-021…028. Он честно зафиксировал
`6` cards, `7` assessed activities, `1` family, `0` runnable revisions из
`456`, `0` package-mode evidence и `0/8` закрытых проверок. Контентные
checkboxes остаются открытыми: аудит формирует точный authoring/runtime backlog
и не подменяет его синтетическими карточками.

Исторический implementation slice: target `72e4978` (evidence `f4ef25b`) добавил
`vault-classification-ledger.v1` для G11-013. Все `1 597` Brain/Vault records
теперь представлены metadata-only строками; закрытыми по факту являются
`1 591` canonical IDs, `1 591` capabilities и `1 594` RU/EN locale facets.
Roles, provenance/license и reviewer dispositions пока `0`; поэтому
`G11-013` остаётся открытым, а `0/1 597` записей считаются fully classified.

Исторический implementation slice: target `c326e79` (evidence `5d37354`) добавил
`shared-content-audit.v1` для G11-015. Он проверил `3` shared modules и `6`
generic placements: explicit shared keys отсутствуют (`0/3`), а `3` generic
placements не имеют path-specific prerequisite. Итог `G11-015=OPEN`,
`6` unresolved items; это теперь измеримый curriculum metadata backlog.

Исторический implementation slice: target `0b2669e` (evidence `93ee3fa`) добавил
bounded `research-authoring-pack.v1` для G11-018. Все `1 597` records получили
path-specific research boundaries и authoring checklist; в первом batch `100`
записей, `0` review-ready, official source missing у `1 597`, mechanism у
`494`, answer у `463`, typed placement у `1 370`, assessed activity у `1 346`.
Гейт остаётся открытым до оригинального текста, источников и reviewer sign-off.

Исторический implementation slice: target `de1836d` (evidence `10021d2`) добавил
`expert-sample-audit.v1` для G11-019. Выбрано `27` стабильных samples — по
одному на каждый path/domain cluster; `0` independent expert reviews записано,
поэтому гейт остаётся OPEN до полного decision set.

Исторический implementation slice: target `96a0506` добавил seeded
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
