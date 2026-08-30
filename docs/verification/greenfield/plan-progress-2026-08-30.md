# Progress snapshot — 2026-08-30

Команда: `pnpm plan:progress`
План: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`

## Формальный счётчик

**Осталось: 611 пунктов из 1 134.**

| Состояние | Количество |
| --- | ---: |
| Закрыто (`[x]`) | 523 |
| Осталось (`[ ]`) | 611 |
| Всего | 1 134 |
| Формальное выполнение | 46.12% |

Это счётчик строк-чекбоксов, а не обещание production readiness. В него входят
policy/evidence/independent-review пункты, поэтому он намеренно больше числа
 текущих технических дефектов. Для понимания узкого технического фронта смотри
разбивку `pnpm plan:progress`: в неё входят implementation gates, quality/content
closure и независимая финальная проверка. Формальный счётчик не является
оценкой оставшихся часов и не подменяет evidence каждого гейта.

Предыдущий implementation slice: target `2b8a20d` (evidence `4abd375`) закрыл
G10S-091. Disposable database после всех восьми миграций подтвердил точную
identity constraint `UNIQUE (kc_code, aspect, stack)`: `generic` и `node`
варианты приняты, duplicate triple отклонён, `band/scope` в identity нет.
Гейт закрыт только после зелёного `pnpm check`, post-commit ladder, checksum
validation и evidence validation.

Предыдущий implementation slice: target `a6e9fed` (evidence `108e8ef`) закрыл
G10S-092. Metadata-only collision report нормализует strict identity, группирует
двух кандидатов в `REVIEW_REQUIRED`, отклоняет malformed metadata и оставляет
даже одиночный кандидат без implicit promotion. `autoMergedRecords=0`; source
wording и answers не копируются. Гейт закрыт после полного `pnpm check`,
архитектурного test ladder и evidence/checksum validation.

Последний implementation slice: target `7c590bc` (evidence `de6b8f7`) закрыл
G10S-093. Dynamic `strata.language` table принимает новые BCP-47 tags без
закрытого RU/EN enum; `Intl.Locale` канонизирует `pt-br` → `pt-BR` и
`zh-hant` → `zh-Hant`, а disposable database rehearsal подтвердил три
динамические строки и отсутствие closed enum constraint. Гейт закрыт после
полного `pnpm check`, language/architecture test ladder и evidence/checksum
validation.

Предыдущий implementation slice: target `e9c1f8f` (evidence `401c0b4`) закрыл
G10S-094. Rehearsal сохранил все 14 canonical layer kinds, отклонил in-place
body update, оставил две версии с разными hashes и атомарно перевёл v1 в
`deprecated`, а v2 в единственный `preferred` на координате. Гейт закрыт после
полного `pnpm check`, architecture test ladder и evidence/checksum validation.

Последний implementation slice: target `0cd4acc` (evidence `acc6e45`) закрыл
G10S-095. Canonical preferred coordinate `(question, layer_key=prompt, lang,
depth)` теперь защищён независимо от `ord/version`: оба bypass-прохода
отклонены, три English-варианта сохранились с одним preferred, а Russian
координата разрешена отдельно. Гейт закрыт после полного `pnpm check`,
architecture test ladder и evidence/checksum validation.

Последний implementation slice: target `49b872d` (evidence `4de55e9`) закрыл
G10S-097. Alternative normal prompts теперь требуют `reviewer` и декларацию
`sameExpectedAnswer=true`; machine gate проверяет только metadata, а semantic
sameness остаётся human-review responsibility. Гейт закрыт после полного
`pnpm check`, architecture test ladder и evidence/checksum validation.

Последний implementation slice: target `78dcb10` (evidence `737df92`) закрыл
G10S-098. Полная metadata-only queue теперь выводит каждую normal prompt
alternative, оставляет каждую запись в `REVIEW_REQUIRED`, блокирует malformed
кандидатов и содержит 0 silent acceptances; перестановка источника сохраняет
queue hash. Гейт закрыт после полного `pnpm check`, architecture test ladder,
evidence/checksum validation и ручной проверки отсутствия body в queue.

Последний implementation slice: target `1ac1a1714c0c316e01aeb061335a8c204ace0a4c`
(evidence `33b24741310eac2c1c0245cc379edd0306a9ca0d`) закрыл `G10S-100`.
Metadata-only review сформировал три strict identity groups из пяти записей:
одна clear, одна с явным human decision на новый aspect и одна
`REVIEW_REQUIRED`. Автоматическое merge/aspect/semantic-question creation и
Probe artifacts равны нулю; output без bodies, batch hash детерминирован.
Reviewed proposal лишь готов к отдельной authoring command. Гейт закрыт после
полного `pnpm check`, boundary/toolchain checks, architecture test ladder,
evidence validation и checksum validation.

Последний implementation slice: target `85570a17e2c0863566678af9d76afaaed3a4598b`
(evidence `db97d2c485745a9ffbb66d6d22e6b9d04ddb90f6`) закрыл `G10S-101`.
Единая Zod-схема принимает целые плановые минуты `1..120`; RU/EN planned-budget
copy проходит, unsafe `Actual response duration`, ноль, дробь и значение выше
границы отклоняются. Negative fixtures дают ожидаемый `REVIEW_REQUIRED`, при
этом все три отказы корректны; observed learner duration и Activity execution
budget не смешиваются, bodies не эмитируются. Гейт закрыт после полного
`pnpm check`, boundary/toolchain checks, architecture test ladder, evidence
validation и checksum validation.

Последний implementation slice: target `e5db22b` (evidence `57f197c`) закрыл
`G10S-102`. Curriculum placement теперь владеет `priority`, `order`, `pattern`
и `prerequisites`; malformed priority/pattern записи отклоняются, а
metadata-only Question joins содержат только `questionId`, `trackId`,
`moduleId`, `lessonId`, `scope`. Projection hash детерминирован, bodies не
эмитируются. Гейт закрыт после полного `pnpm check`, boundary/toolchain checks,
architecture test ladder, evidence validation и checksum validation.

Последний implementation slice: target `7410f33` (evidence `5a41338`) закрыл
`G10S-103`. Контракты теперь разделяют `TaskRevision.executionBudgetSec`
(`1..3600` секунд), `LearnerActivityObservation.observedDurationMs`
(`0..86400000` миллисекунд) и Question `responseBudgetMin` (`1..120` минут).
Crossed fields, mismatched family/revision coordinates и нулевой execution
budget блокируются; projection детерминирован и metadata-only. Гейт закрыт
после полного `pnpm check`, boundary/toolchain checks, architecture test
ladder, evidence validation и checksum validation.

Последний implementation slice: target `1380278a14e5cd321faed511d800640dd47fafb7`
(evidence `49c6430377bcbf8c4699a8430ff764c6e57c4c14`) закрыл `G10S-104`.
Source grants и cited provenance теперь связаны строгим контрактом: из пяти
metadata records два приняты, три intentional negative fixtures отклонены;
проверены 7 citations, 6 покрытых grant’ами, 1 grantless citation,
`duplicateGrantSourceCount=1`, `autoGrantCount=0`. Projection содержит только
license/disposition metadata и note hash, без текста и bodies, детерминирован
при перестановке входа. Гейт закрыт после полного `pnpm check`,
boundary/toolchain checks, architecture test ladder, evidence validation и
checksum validation.

Последний implementation slice: target `16c62996747a49a79e65518c5d6603f7f560d9e7`
(evidence `bf7187a2e89ded9a92374ee6043feaf02526e4fc`) закрыл `G10S-105`.
Provenance record теперь требует `source`, bounded `method`,
`acquiredAt`/`importedAt`, `reviewer`, `disposition`, `rights` и
`redistributable`; chronology и public-rights guards отклоняют недостоверные
records. Rehearsal принял 2 из 5 metadata records, отклонил три intentional
negative fixtures, подтвердил заполненность обязательных полей, deterministic
metadata-only projection (`f1749b8c…80418`) и отсутствие bodies. Vocabulary
методов пока намеренно остаётся bounded key и закрывается следующим пунктом.

Следующий implementation slice: `G10S-106` — versioned provenance method
vocabulary и fail-closed quarantine неизвестных методов.

Последний implementation slice: target `7815ed07d09150ef220a4f6e97d9479501153d10`
(evidence `c98873d64fd02f767cd9a9326e95bd9c6cc6e491`) закрыл `G10S-106`.
Release boundary закрепляет `provenance-method.v1` с пятью методами:
`human`, `translation`, `mt_reviewed`, `generated`, `imported`. Rehearsal
принял 3 из 5 records и поместил два неизвестных ключа в `QUARANTINED`; missing
method также quarantine-only, автоматическое сопоставление запрещено,
projection metadata-only и детерминирован (`c3e3b583…c85fd`). Реализованный
implementation slice `G10S-107` — explicit distributable grant для
company-linked и paid sources перед public disposition.

Последний implementation slice: target `c619ae412bad0f26d81cee57f08ec5255e63dda1`
(evidence `6c09aa2fa06c2fde656d86f2d5526aac79801a4b`) закрыл `G10S-107`.
Restricted provenance contract теперь требует явный reviewed и
redistributable grant artifact для `company_linked` и `paid` источников перед
`public` disposition. Rehearsal принял `3/5` records, проверил `2` grant
artifacts, поместил записи без grant или с non-redistributable grant в
quarantine и подтвердил `autoGrantCount=0`; projection metadata-only и
детерминирован (`aed8569be3b1858ca682e0aebda521947a808e3431fa08c52960289d9f5550dd`).
Следующий implementation slice после него `G10S-108` разделил
hidden/reference assets evaluator-а от public statement/contracts.

Последний implementation slice: target `ce7e73d05e3f3bb94733f7cc7a1a125efdf785be`
(evidence `c316b3bc2a962d6bd74ab9b9c550f2ea5ee16c1f`) закрыл `G10S-108`.
`TaskPublicContract` и `TaskHiddenAssetManifest` теперь разделены строгими
coordinate-bound схемами: публичная поверхность содержит только `public/`
refs/hashes, evaluator surface — только `hidden/` refs/hashes для tests,
reference solutions, harnesses, seeds и grading variants. Body-key canaries,
public-to-hidden refs, coordinate mismatch, namespace leaks и duplicate hidden
refs fail closed; rehearsal дал `2/5` accepted и `3` ожидаемых quarantine,
`0` bodies в projection, hash
`aef1cffc71a7bc04f01510458d8fb89e50a85fb07997886fcdaa15a9b3f90e8f`.
Последний implementation slice: target `d37fcb7b07cf7f270e6cedd088a9cc479f3fd6fe`
(evidence `10159b035c65c429da34b234a4c388f419cdce76`) закрыл `G10S-109`.
`TaskBuildContext` теперь содержит только task coordinates, public/hidden
paths, asset kinds, content hashes и required flags; public entries ограничены
`public/`, evaluator entries — `hidden/`. Обязательные entries должны быть
наблюдаемы в сборке с теми же surface/kind/hash; duplicate, unsafe, forbidden
и unallowlisted files, public evaluator assets и body keys fail closed.
Rehearsal `pnpm architecture:task-build-context` принял 2/5 records и отправил
3 intentional canaries в `REVIEW_REQUIRED`: 38/41 files совпали с allowlist,
обнаружены 3 unallowlisted files, 1 public evaluator leak, 1 forbidden path и
1 body-key record; missing required entries и projected bodies равны нулю,
projection hash детерминирован. Гейт закрыт после полного `pnpm check`,
boundary/toolchain checks, 96 architecture tests, evidence validation и
checksum validation; push не выполнялся по ограничению Actions quota.
Следующий implementation slice: `G10S-111` — stable IDs, независимые от array
order, локального path и timestamp.

Последний implementation slice: target `17e254aa5d4e15274d0043e67b6a42b33cc56efd`
(evidence `42300980d05ee64ac5eabb396c027f419edc7be`, checksum fix
`5afa397e43220d290a8e8797d57e208e2082bb16`) закрыл `G10S-110`.
Learner release publication теперь принимает только allowlisted `public/`
manifest/catalog/question-shard/public-index entries; hidden tests, reference
solutions, harnesses, seeds, grading variants и rubric fixtures остаются
candidate-only. Rehearsal `pnpm architecture:release-publication` inspected
5 records (`2` accepted, `3` expected `REVIEW_REQUIRED`), 24 candidate files,
6 candidate evaluator files и 18 published files; обнаружены 1 published
evaluator leak, 1 unallowlisted public file и 1 body-key canary, все остальные
drift/namespace/path counters равны нулю, projected bodies — `0`.
Projection metadata-only и детерминирован, архитектурный suite расширен до
100 тестов. Гейт закрыт после полного `pnpm check`, boundary/toolchain checks,
evidence validation и checksum validation; push не выполнялся по ограничению
Actions quota. Следующий implementation slice: `G10S-111` — доказать, что
stable IDs не зависят от array order, локального path или timestamp.

Последний implementation slice: target `d37cd484e39639c954bc01b0b70eabb3bf5165b2`
(evidence `0e70aa4`) закрыл `G10S-111`. Canonical stable IDs теперь вычисляются
только из явных `namespace/entity/identity`: ключи identity сортируются,
скалярные строки нормализуются, а array order, локальные пути, timestamps,
body и transient metadata никогда не участвуют. Rehearsal
`pnpm architecture:stable-ids` проверил 6 synthetic records: 4 валидных,
2 intentional invalid/quarantine, 3 unique IDs и 1 duplicate semantic group;
отдельно подтверждены `metadataOnly=true`, `noBodies=true`,
`arrayOrderIndependent=true`, `pathIndependent=true` и
`timestampIndependent=true`. Classification ledger и expert-sample audit
перестали использовать path hash и принимают canonical source ID либо
content-hash fallback. Полный `pnpm check`, boundary/toolchain checks и 103
architecture tests зелёные; evidence/checksum validation зелёные; push не
выполнялся по ограничению Actions quota. Следующий implementation slice:
`G10S-112` — versioned domain contract и property tests для identity,
preferred transition, provenance disposition и deterministic serialization.

Предыдущий implementation slice: target `3fb97e6` (evidence `018ca80`) закрыл
G10S-099. Metadata-only adapter не создаёт вторую semantic question: из трёх
code-prediction записей одна получила Activity/Task/Drill links при точном
совпадении темы, две остались `REVIEW_REQUIRED`/`BLOCKED`, а обычная prompt-only
запись помечена `NOT_APPLICABLE`. В output нет body, semanticQuestionsCreated=0,
а перестановка источника сохранила batch hash. Гейт закрыт после полного
`pnpm check`, boundary/toolchain checks, evidence validation и checksum validation.

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
