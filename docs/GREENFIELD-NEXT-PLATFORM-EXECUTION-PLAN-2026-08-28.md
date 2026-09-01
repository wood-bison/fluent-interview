# Fluent Interview Platform — greenfield Next.js execution plan

## Progress reporting

После каждого локального коммита запускай `pnpm plan:progress`. Команда только
читает этот план и печатает `checked / remaining / total`, процент выполнения и
разбивку по разделам; она не ставит галочки автоматически и не превращает
чекбоксы в заявление о production readiness. Последний зафиксированный снимок:
[`plan-progress-2026-09-01-g10s-008.md`](verification/greenfield/plan-progress-2026-09-01-g10s-008.md).

Дата: **28 августа 2026**
Статус на 29 августа 2026: **G0–G4 PASS; G5–G8 PASS_WITH_LIMITATIONS; G9 Navigator PASS_WITH_LIMITATIONS; G10 Studio PASS_WITH_LIMITATIONS; G11 coverage policy PASS_WITH_LIMITATIONS; G12 RC `AWAITING_INDEPENDENT_REVIEW`**
Владелец продукта: **Sergey**
Reference workspace: `/Users/sergeyzhechko/developer/fluent-interview`
Предлагаемый target workspace: `/Users/sergeyzhechko/developer/fluent-interview-platform`
Default branch: **`main`**
Рабочее имя remote: **`fluent-interview-platform`**; owner и URL фиксируются в G0 до создания remote.

Этот документ предназначен агенту-координатору. Он превращает архитектурный
аудит в последовательную, commit-gated программу. Агент не имеет права
пропускать пункты, ставить галочку без evidence или объявлять финальный release
готовым без независимой проверки владельца и следующего Codex-аудита.

Связанные документы:

- [`GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md`](GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md);
- [`reports/greenfield-architecture-challenge-2026-08-28.html`](reports/greenfield-architecture-challenge-2026-08-28.html);
- [`NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md`](NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md) — Option A, не исполнять W03–W08;
- [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md);
- [`reports/production-curriculum-closure-audit-2026-08-27/agent-production-closure-plan.md`](reports/production-curriculum-closure-audit-2026-08-27/agent-production-closure-plan.md);
- [`CONTEXT.md`](../CONTEXT.md);
- [`WISHLIST.md`](WISHLIST.md).

### Execution update — 29 августа 2026

Реализация target уже прошла следующие commit-gated срезы и опубликована в
`origin/main`:

- `77c0a56` — G9 Navigator live evidence;
- `71c9013` — G10 Studio lifecycle evidence;
- `1d24738` — G11 explicit curriculum coverage evidence.
- `85ea1c0` — project-scoped PostgreSQL Studio outbox projection with live
  idempotent author→review→publish replay and restart recovery.
- `87cdff5` — G10 PostgreSQL outbox live evidence and disposable-stack
  cleanup; `23a1470` — gate index synchronized with the pushed target head.
- `5090343` — G10 command/checksum alignment; `3389157` — target gate index
  synchronized with that evidence commit.
- `a06c7e8` — durable PostgreSQL Studio command receipts; `0bf50a1` — G10
  receipt live evidence/checksums; `115c9d9` — target index synchronized.
- `eaae89b` — deterministic `vault-quality-inventory.v1` preflight for all
  1,597 Brain/Vault records; `7e1be05` — G11 gate/outputs/checksums; `12c049c`
  — target index synchronized with the quality-inventory head.
- `f45fe20` — selectable PostgreSQL authority for the validated Studio ledger;
  JSONL remains an explicit fallback.
- `d2242cd` — bounded public-boundary Studio authority journey with
  create/review/publish/readback replay and API restart recovery;
  `44b92db` — G10 evidence/checksums; `f3d3b4e` — target gate index synced.
- `1338644` — deterministic `vault-authoring-queue.v1` over the full
  Brain/Vault quality inventory; `6e46da3` — G11 queue evidence/checksums;
  `b37bd65` — target gate index synced.
- `f9cb6e9` — Studio command transitions now append as complete batches through
  one PostgreSQL `BEGIN`/`COMMIT` (with rollback on failure), while JSONL and
  minimal test doubles retain a compatible sequential fallback;
  `ae225bb` — G10 atomicity evidence/checksums; `17aadca` — target gate index
  synchronized with that evidence commit. This closes only the local authority
  atomic-append slice; managed distributed transactions and external consumers
  remain open.
- `b487793` — G9 Navigator получает server-clocked 90-day profile-scoped prune
  для PostgreSQL и JSONL history adapters, строгий `navigator-history-prune.v1`,
  Next proxy validation и explicit Settings confirmation; `e4abb67` — G9
  evidence/checksums, `e184912` — target index synchronized. Live disposable
  Compose подтвердил public proxy `200`, invalid profile `400` и отсутствие
  затронутого пользовательского volume; automatic scheduler, sync и privacy
  review остаются открытыми.
- `d36ae64` — добавлена bounded `studio:outbox-benchmark` команда, которая
  сравнивает одинаковый public command path на JSONL и PostgreSQL без вывода
  контента; `caa61b3` — G10 benchmark evidence/checksums и ADR. В 50-command
  sample PostgreSQL показал `p50=39.096 ms / p95=48.671 ms`, JSONL —
  `p50=52.580 ms / p95=80.009 ms`; Redis/Kafka не подключаются до явного
  измеримого trigger. Это закрывает только deterministic decision slice
  `G10-020`, а не broker/load/partition production gate.

Полные machine-readable материалы находятся в
`fluent-interview-platform/docs/verification/greenfield/G9/`, `G10/` и `G11/`.
Дополнительно исправлены реальные live-дефекты: Docker игнорировал исходный
`/api/curriculum/coverage` route (`5f33982`), Studio review proxy отправлял
literal `${candidateId}` (`37b84ad`), command idempotency протекала в immutable
review (`c4de6e3`), а CoveragePanel теперь декодирует серверный manifest
(`544e40b`).

Это не объявляет продукт готовым: seed catalog содержит 5 cards/6 activities,
а production target matrix требует 224/96/70 на Node и Java, 196/84/70 на Go;
остальные lanes остаются preview. G12 может подготовить RC только с
`AWAITING_INDEPENDENT_REVIEW`, пока corpus, runtime conformance, outbox и
human learning sign-off не закрыты.

### Execution update — G10S-192 scenario progression — 31 августа 2026

Target `main` закрыл G10S-192 двумя локальными коммитами без push из-за
ограничения Actions quota: implementation `134b2f0`
(`feat(g10s): publish C098 scenario progression`) и evidence
`8300cb7` (`docs(g10s): record C098 scenario progression evidence`).
Versioned policy и gate связывают released `node-event-loop-trace` с exact
Node question revision/TaskFamily/TaskRevision и фиксируют шесть стадий
`predict → run → observe → explain → defend → repeat`. Каждая стадия имеет
activity ID, runtime order indexes, evidence facets и rubric binding там, где
нужна оценка; шесть `ExpectedOrders()` и пять hidden evaluator checks hash-bound
и fail closed при drift. Focused tests `6/6`, content compiler `451/451`,
content-gates/full check/boundary/toolchain и deep body-boundary (`1377`
tracked / `1369` text / `8` binary / `8122` fragments / `0` matches,
`2526/2526` source baseline) — green. Evidence metadata-only и не создаёт
Task/Activity, не пишет БД, не импортирует и не активирует release.
Следующий executable пункт — G10S-193: explicit objective, prerequisites,
public statement, expected evidence и failure feedback для каждого scenario без
раскрытия hidden solution в browser.

### Execution update — G10S-193 observability scenario contracts — 31 августа 2026

Target `main` закрыл G10S-193 тремя локальными коммитами без push из-за
ограничения Actions quota: implementation `47d45c1`
(`feat(g10s): publish scenario contract metadata`) и evidence
`c7773d1` / `e9e84a3` (`docs(g10s): record scenario contract evidence`,
`docs(g10s): add scenario contract evidence guide`). Versioned policy
`g10s-observability-scenario-contracts-policy.v1`
(`2026.08.31-observability-scenario-contracts.1`) фиксирует ровно шесть
сценариев и для каждого шесть стадий `predict → run → observe → explain →
defend → repeat`: objective, prerequisites, learner-safe public statement,
expected evidence и failure feedback. Координаты проверяются against the
curriculum graph; preview-сценарии не становятся released автоматически.

Browser boundary allowlist/denylist проверяет, что route отдаёт только
metadata-only scenario contract и не раскрывает `solution`, `referenceSolution`,
`hiddenTests`, `expectedOrder`, `answerKey`, `privateSource` или
`expectedVerdict`. Gate не создаёт Task/Activity, не импортирует release и не
пишет БД. Focused tests `6/6`, content suite `457/457`, `content:gates`, полный
`pnpm check`, boundary и toolchain прошли; deep static body-boundary после
implementation показал `1382` tracked / `1374` text / `8` binary,
`8122` source fragments, `0` body matches и `2526/2526` baseline records.
Metadata-only evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/`.
Следующий executable пункт — `G10S-194` (curriculum placement и language-path
relevance).

### Execution update — G10S-194 observability path joins — 31 августа 2026

Target `main` закрыл G10S-194 двумя локальными commit-gated коммитами без
push из-за ограничения Actions quota: implementation `8106b4d`
(`feat(g10s): project observability path joins`) и evidence `279e927`
(`docs(g10s): record observability path join evidence`). Versioned policy
`g10s-observability-path-join-policy.v1`
(`2026.08.31-observability-path-join.1`) проверяет точную связь
`scenario → track/module/lesson → question → revision → TaskFamily/TaskRevision
→ runtimeProfile`.

В release остаётся ровно один полный join:
`node-event-loop-trace → node/node-runtime/node-event-loop →
question.node-event-loop-001@r1 → node-event-loop-001@1 → node-26-commonjs`.
Только `predict` и `run` получают task join; `observe`, `explain`, `defend` и
`repeat` сохраняют question-only связь. Пять preview-сценариев в Node/Go/Java
разрешают curriculum-координаты, но получают явный `deferred-preview` и
нулевые question/revision/family/runtime joins. Поэтому Node-specific runtime
не просачивается в Go/Java path, а preview не становится learner task
автоматически.

Gate проверяет exact activity IDs и порядок, curriculum coordinate drift,
released question/revision/release, runnable-stage compatibility и
cross-language leakage. Результат metadata-only: тела, решения, hidden tests,
Task/Activity creation, DB mutation, import и release authority отсутствуют.
Focused tests `6/6`, content suite `463/463`, evaluated gate,
`content:gates`, полный check, boundary и toolchain — `PASS`. Deep body-boundary
после implementation: `1387` tracked / `1379` text / `8` binary / `8122`
fragments / `0` matches; source baseline `2526/2526`. Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/`.
Следующий executable пункт — `G10S-195`.

### Execution update — G10S-195 C098 authoring pipeline — 31 августа 2026

Target `main` закрыл G10S-195 двумя локальными commit-gated коммитами без
push из-за ограничения Actions quota: implementation `315baaa`
(`feat(g10s): guard C098 authoring pipeline`) и evidence `77b10c5`
(`docs(g10s): record C098 authoring pipeline evidence`). Versioned policy
`g10s-c098-studio-authoring-pipeline-policy.v1`
(`2026.08.31-c098-studio-authoring-pipeline.1`) фиксирует exact
`author → review → publish-request` цепочку для C098:
`strata.author.create-revision` создаёт revision/layers/receipt,
`strata.review.record-decision` записывает immutable decision и policy
evaluation, а `strata.release.request-bundle` только запрашивает release
candidate.

Каждый шаг выполняется в `content-authoring` через local CLI/build step и пишет
только разрешённые `strata.*` таблицы. `public.question_*`, active pointer,
`studio_ledger_records`, JSONL, import и release не затрагиваются; serving
write до отдельного file-only import равен нулю. Fixture привязан к точной
координате `C098 / ordering / generic`, имеет canonical `en`, reviewed `en` и
`ru` prompt layers и координаты `prompt/depth=1/version=1/preferred/human`.
Gate проверяет порядок, transaction markers, owner/write-set, C098 identity,
locale coverage, отсутствие browser/serving shortcuts и неизвестных таблиц.

Focused tests `6/6`, content suite `469/469`, evaluated gate,
`content:gates`, полный `pnpm check`, boundary и toolchain — `PASS`. Deep
body-boundary после implementation: `1392` tracked / `1384` text / `8` binary,
`8122` source fragments, `0` body matches и exact source baseline `2526/2526`.
Evidence находится в `fluent-interview-platform/docs/verification/greenfield/G10S/`
и остаётся metadata-only. Следующий executable пункт — `G10S-196` (export
C098 bundle через rights/locale/layer/task/graph gates с loss ledger).

### Execution update — G10S-196 C098 release export — 31 августа 2026

Target `main` закрыл G10S-196 двумя локальными commit-gated коммитами без
push из-за ограничения Actions quota: implementation
`7c8b8f1c081cc9b6f5f65bd63b11e4dfb8bf898e`
(`feat(g10s): guard C098 release export`) и evidence
`4299b9b81ef9240af1067ebd1edb5650c137e3e4`
(`docs(g10s): record C098 release export evidence`). Versioned policy
`g10s-c098-release-export-policy.v1` (`2026.08.31-c098-release-export.1`)
связывает C098 `ordering/generic` с exact released Node question revision,
curriculum placement, task/runtime join и graph dependency. Перед сборкой
обязательны upstream gates `G10S-172`, `G10S-188`, `G10S-191`, `G10S-194` и
`G10S-195`; rights, EN/RU locale, preferred layers, task, graph и loss ledger
проверяются fail-closed.

Кандидат bundle строится дважды в памяти: `6` records, `12` translations,
`26` selected layer rows, `2` assessed activities, `1` graph dependency и
`59` loss-ledger entries. Artifact `36 604` bytes имеет logical/release hash
`bd482d33131190268da6e5b9d0fc81f204687b843a7651203ecd26a56aa33c06`, manifest
hash `fe27e0e2010bb08beb50c502442509c631e59c00423d36fdb7d8c95d817b14c6`;
повторная сборка byte-identical. Gate не пишет БД/файлы, не импортирует и не
активирует release, не эмитит bodies. Focused tests `6/6`, content suite
`475/475`, `content:gates`, полный `pnpm check`, boundary и toolchain — PASS;
post-evidence deep body-boundary: `1399` tracked / `1391` text / `8` binary,
`8122` fragments, `0` matches, source baseline `2526/2526`. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-release-export-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-197` (atomic serving import C098 bundle).

### Execution update — G10S-197 C098 serving import — 31 августа 2026

Target `main` закрыл G10S-197 двумя локальными implementation-коммитами и
отдельным evidence-коммитом без push из-за ограничения Actions quota:
`e1d2eb8` (`feat(g10s): import exact C098 serving bundle`), `6bb023c`
(`fix(g10s): make serving readback hash-stable`) и `fef29c1`
(`docs(g10s): record C098 serving import evidence`).

Versioned policy и importer связывают file-only
`question-release-bundle.v1` с exact serving projection для релиза
`2026.08.28-questions.1`: 6 карточек/ревизий, 12 EN/RU переводов, 10
placement’ов, 40 ролей, 6 supporting prompts, 7 activities и 3 graph edges.
Write-set содержит 15 serving tables; Strata/authoring database credential не
используется. До `BEGIN` проходят schema/hash/identity проверки, затем одна
write-транзакция создаёт immutable manifest, projection, pointer event, active
pointer, outbox event и receipt. Отдельный read-only readback восстанавливает
тот же logical hash. Exact retry с idempotency key возвращает `replayed=true`;
изменённый запрос не принимается.

В первой live-самопроверке readback правильно остановил процесс на
logical-hash drift. Причины были локализованы и исправлены до evidence:
явный SQL alias для source revision graph edge и сохранение bundle-aware
лексической формы zero-millisecond timestamps. Повторный live rehearsal
применил 17 миграций в disposable PostgreSQL, прошёл import/replay/readback,
проверил все projection counts и exact IDs/placement/activity/graph target;
временная БД, one-shot containers и bundle удалены, persistent DB не изменена.

Проверки: focused gate `6/6`, release-import `18/18`, content compiler
`481/481`, architecture `213/213`, `content:gates`, полный `pnpm check`,
`pnpm boundary:check`, `pnpm toolchain:check` и deep body-boundary
`1405/1397/8`, `8122` fragments, `0` matches, source baseline `2526/2526` —
`PASS`. Static gate state hash
`6739fda6496ed6cef4cfd88c21e8c70d4c78ad45c65851d6018d76d19656a29b`, live
evidence hash `7e38a2f742ffc5556405bc910e4d8e522470774e61c4d0ccd2ab26e4f036b1ba`.
Evidence metadata-only: тела контента, hidden evaluator assets, автоматическое
создание задач, import/release authority и persistent database mutation не
выдаются.

Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-serving-import-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-198` (learner route C098 с полными
answer layers и без broken/dead links).

### Execution update — G10S-198 C098 learner route — 31 августа 2026

Target `main` закрыл G10S-198 локальными implementation- и evidence-коммитами
без push из-за ограничения Actions quota: `a8d6eb7bb0b1f5d8f81925dca3e782667649d707`
(`feat(g10s): expose C098 learner route layers`) и `3148c98`
(`docs(g10s): record C098 learner route evidence`).

Learner route `/practice/lesson/:id` теперь является явным manifest target для
C098: release-only decoder открывает ровно `question.node-event-loop-001@r1`,
проверяет identity/EN-RU locale и возвращает все семь ожидаемых слоёв ответа,
включая `evidence`. В route contract зафиксированы deep links к Questions,
track и locale, exact practice runtime `node-event-loop-001@1` /
`node-26-commonjs`, program/Atlas/related-question links и graph target
`question.node-nexttick-promise-001.r1`. Unknown/stale question, лишний слой,
неподдержанный runtime или missing link закрываются fail-closed; preview content
и hidden evaluator bodies в browser не выдаются.

Проверки: focused G10S `6/6`, combined smoke/boundary route tests `54/54`,
content compiler `487/487`, architecture suite `213/213`,
`content:gates`, полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` — `PASS`. Static metadata-only gate зафиксировал state
hash `61180869fd35b8cbb6fe9e190d636d232104cb7c661c6f99344bb11aa60d4548`,
policy hash `a4ea07cb5caecc47d4acfa00a115cded7a194589daf4a10aa696f60452dd26d1`,
catalog hash `9a617497fb291dd9bb33bce4430fc55e51ec7220ad7a05dfdddf2137d4b2b942`,
curriculum hash `34adc43449ed44c1e7dfaa4654dfc03055d6626c6d1dfae4497d35076c85ebec`,
route manifest hash `7be333d945b55544f6b46eeb990e5e934098d7e6695a8c8496bd43e1d58b76ac`,
source-set hash `d9b497556c1771a8a6cb2564cab6ae3c0b85d2437d895754b7697596201e9a10`.
Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-learner-route-2026-08-31.{json,md}`;
все артефакты metadata-only, без answer bodies и database mutation.
Следующий executable пункт — `G10S-199` (language/runtime selector только с
реально compatible released Node profile; preview languages не активны).

### Corrective update — G10S-198 question placement context — 1 сентября 2026

После live-аудита каталога обнаружен и исправлен отдельный context defect:
`/questions?lesson=java-http` находил карточку по lesson, но затем брал первое
placement и мог показать Node.js-контекст вместо Java. Это нарушало инвариант
`question → lesson → track` и делало ссылку `Open lesson` misleading.

Target `main` получил два локальных commit-gated коммита без push из-за
ограничения Actions quota: `7620388`
(`fix(questions): preserve lesson placement context`) и `67991d0`
(`docs(g10s): record question placement context evidence`). Реализация
сводит фильтр к одной проверке `cardHasPlacement(card, track, lesson)` и
строит ссылку только через `selectPlacement` с той же парой координат. Source
guard и негативный тест не позволяют вернуться к раздельной фильтрации.

Evidence подтверждает `54/54` web smoke, `7/7` focused placement tests,
`43` валидных routes, `10` path placements, `11/11` vertical-slice checks и
зелёную строгую лестницу `NX_CI=1 pnpm check`, `pnpm boundary:check`,
`pnpm toolchain:check`. Browser на scoped stack
`http://127.0.0.1:47360/` подтвердил Java и Go placement/link, а несовместимое
`track=node&lesson=java-http` возвращает `0` карточек и no-match state.
Evidence metadata-only находится в
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-198-question-placement-context-2026-09-01.{json,md}`.
Это corrective evidence, а не новый curriculum checkbox и не закрытие
G10S-246/G11.

### Corrective update — Atlas route context — 1 сентября 2026

Следующая live-проверка обнаружила тот же класс misleading fallback в Atlas:
неизвестные `track` и `node` silently выбирали Node/первый модуль вместо того,
чтобы сообщить о неверном deep link. Это делало URL, который можно сохранить
или открыть из Questions, семантически опасным: интерфейс выглядел рабочим, но
показывал не тот учебный путь.

Target `main` получил implementation-коммит `eafcbf6`
(`fix(atlas): reject stale route context`). Теперь Atlas fail-closed для
неизвестного `track` и `node`, а выбор стартовой станции нормализует canonical
`?track=...&node=...` URL. Regression source guard не позволяет вернуть
тихое fallback-поведение.

После штатной пересборки scoped stack `http://127.0.0.1:47360/` проверены
четыре live-case: Java service selection, неизвестный track (`TRACK NOT
FOUND` без графа), неизвестный node (`MODULE NOT FOUND` без графа) и обычный
Node runtime. Evidence-коммит `5777f42` содержит metadata-only JSON/Markdown;
`NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` зелёные.
Это corrective evidence без новой curriculum capacity: общий checkbox-счётчик
не изменён, G10S-246 owner sign-off и G11 breadth по-прежнему открыты.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/atlas-route-context-correction-2026-09-01.{json,md}`.

### Corrective update — learner track context — 1 сентября 2026

Повторная cross-route проверка выявила более широкий вариант того же дефекта:
неизвестный `track` в `/program`, `/practice` и workbench мог молча получить
Node-каталог, а lesson lookup мог заменить запрошенный язык первым совпадением
из другой дорожки. Такой URL выглядел валидным, но learner видел не тот
контекст. Это особенно опасно для сохранённых ссылок и переходов из Questions.

Target `main` получил implementation-коммит `d56479d`
(`fix(routes): preserve learner track context`). Он добавляет общий
fail-closed recovery state `TRACK NOT FOUND`, убирает cross-track fallback в
program/practice/lesson, ограничивает lesson и placement одним явно
запрошенным `track`, и оставляет default только для URL без track-параметра.
Source guards и regression tests закрепляют этот контракт.

После пересборки scoped Compose `http://127.0.0.1:47360/` проверены шесть
live-case: обычный Node program, unknown track в program/practice/workbench,
Node URL с Java lesson и валидные Java program/lesson. Неверные ссылки
показывают recovery/no-match без Node или Java подмены; валидные ссылки
сохраняют свой track. Focused suite `8/8`, web smoke `56/56`, полный
`NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` зелёные.
Evidence-коммит `f437f46` (`docs(g10s): record learner track context
evidence`) добавляет metadata-only JSON/Markdown; push не выполнялся.

Это corrective evidence, а не новая curriculum capacity: checkbox-счётчик не
изменён, G10S-246 owner sign-off и G11 breadth остаются открытыми.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/learner-track-context-correction-2026-09-01.{json,md}`.

### Execution update — G10S-199 C098 runtime selector — 31 августа 2026

Target `main` закрыл G10S-199 двумя локальными коммитами без push из-за
ограничения Actions quota: `19d60a7` (`feat(g10s): guard C098 runtime
selector`) и `bd1203d` (`docs(g10s): record C098 runtime selector evidence`).

Контрактный `releasedProfilesForLearnerSelector` теперь является единственным
источником выбора runtime в learner workbench. Для released C098 он выдаёт
ровно JavaScript revision 1 на `node-26-commonjs` (Node.js 26.7.0); TypeScript,
Go, Java, Python и .NET остаются явными preview languages и не selectable.
Прямые preview run vectors получают HTTP 400, а отсутствие совместимого
профиля отключает Select вместо ложного варианта. `/practice/lesson/:id` для
EN и RU отвечает 200.

Проверки: selector policy `21/21`, focused tests `12/12`, live
`pnpm runtime:c098-selector-journey` PASS (runtime info 200, canonical Run
`passed`, 5 output lines, 8 trace events, cleanup true, mastery/unlock/accepted
false); `FLUENT_GOLDEN_REQUIRE_CLEAN=1 pnpm runtime:journey` также PASS (5/5
routes 200). Полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` зелёные. Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-runtime-selector-2026-08-31.{json,md}`;
все отчёты metadata-only, без database/import/release mutation.

Следующий executable пункт — `G10S-200`: доказать, что public Run выполняет
эксперимент и не создаёт mastery/verdict.

### Execution update — G10S-200/201 C098 public Run и hidden Submit — 31 августа 2026

Target `main` закрыл G10S-200 и G10S-201 локальными commit-gated коммитами без
push из-за ограничения Actions quota. Для G10S-200 implementation/evidence:
`a6d6fc5` / `7d95250`; для G10S-201 implementation/evidence:
`c7e7dbd` / `c067a05`.

G10S-200 доказывает public Run для released C098 без verdict/mastery:
`node-event-loop-001@revision 1`, `node-26-commonjs`, 5 ожидаемых строк вывода,
8 trace events, стабильный progress digest и отсутствие learner state mutation.
G10S-201 добавляет strict hidden Submit: Browser, Go runtime-control, evaluator
и API принимают только exact TaskRevision/release/profile; пять hidden checks
проходят, verdict/evidence IDs выводятся из request digest, а evidence хранит
только metadata. Exact replay возвращает тот же envelope, изменённый запрос с
тем же idempotency key получает `409`, stale revision и incompatible profile —
`400`; worker очищается, mastery/unlock не меняются.

Проверки G10S-200: static `13/13`, focused `10/10`, live PASS. Проверки
G10S-201: static `26/26`, focused `4/4`, live PASS, один authority evidence
record создан без raw source/prediction/hidden bodies. Для обоих срезов прошли
полные `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check`; evidence
находится в `fluent-interview-platform/docs/verification/greenfield/G10S/`.
Следующий executable пункт — `G10S-202`: wrong-order, malformed-input,
stale-revision, forged-verdict и duplicate-idempotency vectors должны fail
correctly.

### Execution update — G10S-202 C098 negative vectors — 31 августа 2026

Target `main` закрыл G10S-202 локальными commit-gated коммитами без push из-за
ограничения Actions quota: implementation `3668785` и evidence `0a2ca28`.
Versioned policy `g10s-c098-negative-vectors-policy.v1`
(`2026.08.31-c098-negative-vectors.1`) объединяет существующие public Run
vector journey и hidden Submit matrix на одной Next boundary. Она фиксирует
пять обязательных негативных классов: wrong-order prediction остаётся
видимым mismatch без authority, malformed Run/Submit получают `400` до worker,
stale revision и forged verdict fail closed, exact replay стабилен, changed
replay получает `409 idempotency_conflict`, а concurrent replay создаёт одну
verdict/evidence пару.

Static policy дала `24/24`, focused tests `4/4`; live journey PASS с `13`
runtime vectors и `8` Submit cases. Cancellation recovery и learner-state
stability также PASS. Отчёт metadata-only: source/diagnostics/hidden bodies не
эмитируются, Task/Activity не создаются, import/release authority и database
mutation отсутствуют. Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-negative-vectors-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-203`: Observe/Explain показывают
trace/evidence без hidden-answer leakage, Navigator получает exact context IDs
и сохраняет advisory-only boundary.

### Execution update — G10S-203 Observe/Explain + Navigator context — 31 августа 2026

Target `main` закрыл G10S-203 локальным commit-gated implementation-коммитом
`87849f5`; push отложен из-за ограничения Actions quota, а metadata-only
evidence фиксируется следующим docs-коммитом. Versioned policy
`g10s-c098-observe-explain-navigator-policy.v1`
(`2026.08.31-c098-observe-explain-navigator.1`) фиксирует released C098
`question.node-event-loop-001@r1`, `TaskFamily=node-event-loop-001@1`,
`node-26-commonjs`, scenario `node-event-loop-trace` и шесть ordered stages.

Contract добавляет строгие runtime/context coordinates; C098 learner shell
передаёт их Navigator только на canonical lesson routes, а API отклоняет
runtime/scenario drift до provider call. Observe/Explain и evidence bundle
показывают trace/evidence metadata без hidden answers, source, prompts или
diagnostics. Static policy — `40/40`, focused tests — `5/5`; live
`runtime:c098-observe-explain-journey` PASS: trace correlation, четыре evidence
kinds, 14 Navigator coordinates, revision/context forwarding, advisory-only
completion, stable replay, history cleanup и binding-drift rejection.
Полные `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` green.
Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-observe-explain-navigator-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-204`: restart/persistence для active
release, attempts, evidence и Studio history с backup/restore.

### Execution update — G10S-204 C098 persistence и exact restore — 31 августа 2026

Target `main` закрыл G10S-204 локальными commit-gated коммитами без push из-за
ограничения Actions quota: implementation `b113da1`, evidence/documentation
`0b2c4a5`. Versioned policy
`g10s-c098-persistence-policy.v1` (`2026.08.31-c098-persistence.1`)
фиксирует released C098 `question.node-event-loop-001@r1`,
`TaskFamily=node-event-loop-001@1`, `node-26-commonjs` и
`node-event-loop-trace`.

Live persistence journey сохраняет submission, progress, четыре evidence вида
и Studio active release после service `stop → start`, scoped Compose `down →
dev --detached` и полного restart. `data-backup.v1` проходит backup matrix с
14 canonical ledger entries и нулём issues; restore проверяет SHA-256
PostgreSQL/ledger/roles-grants, удаляет только allowlisted post-backup
sentinels, восстанавливает baseline и завершает cleanup с `0 containers / 0
networks`. Static policy — `33/33`, focused tests — `5/5`, live journey —
`PASS`. Report metadata-only: source/prompt/answer/dump/credential/hidden
evaluator bodies не эмитируются, database mutation/import/release authority не
выдаются. В journey исправлены nested Studio release identity и повторное
использование stale volume: каждый запуск получает свежий disposable stack ID.
Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-persistence-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-205`: RU/EN × light/dark × MacBook 13/16 ×
Studio Display browser matrix без overflow, clipping и unreachable controls.

### Execution update — G10S-205 C098 desktop route matrix — 31 августа 2026

Target `main` закрыл G10S-205 локальными commit-gated коммитами без push из-за
ограничения Actions quota: implementation/evidence `a35c919`, target index
`8dc3b8b`. Versioned policy
`g10s-c098-desktop-matrix-policy.v1` (`2026.08.31-c098-desktop-matrix.1`)
фиксирует 23 exact route templates — query strings сравниваются без
нормализации — и перебирает `en`/`ru`, `light`/`dark`, MacBook Pro 13
(1280×800), MacBook Pro 16 (1728×1117) и Apple Studio Display (2560×1440).

Live matrix PASS: `276/276` cases, `9,612` controls inspected, zero clipped
controls, zero horizontal overflow, `.app-scroll-region` — scroll owner в
каждом случае, zero missing `main`/`h1` landmarks, zero viewport mismatches и
zero console/page/request errors. Static source/evidence policy — `30/30`,
focused mutation suite — `7/7`; mutations route, viewport, overflow, clipping,
executor и scroll guard fail closed. Evidence metadata-only: source/prompt/
answer/solution/content/dump/credential/hidden evaluator bodies не эмитируются,
learner/authoring/import/release mutations не выполнялись. Полные `pnpm check`,
`pnpm boundary:check` и `pnpm toolchain:check` green. Evidence находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-desktop-matrix-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-206`: keyboard/screen-reader baseline для
landmarks, labels, focus order, dialog/panel behavior и code/runtime controls.

### Execution update — G10S-206 C098 accessibility baseline — 31 августа 2026

Target `main` закрыл G10S-206 локальным commit-gated коммитом без push из-за
ограничения Actions quota: implementation/evidence `955db57` (source fix
`cbcec0f`). Versioned policy
`g10s-c098-accessibility-policy.v1` (`2026.08.31-c098-accessibility.1`)
фиксирует те же 23 exact route templates и проверяет `en`/`ru`, `light`/`dark`
на MacBook Pro 16 (`1728×1117`).

Live accessibility matrix PASS: `92/92` route cases, `3,204` named controls,
zero unresolved ARIA references, duplicate IDs, positive `tabindex`, heading
skips, button-type omissions, missing image alternatives и invalid expanded
states. Command palette, profile menu и Navigator panel interaction matrix —
`12/12`; structural focusable-control count — `396`, focus return — `0`
failures. Static source/evidence policy — `30/30`, focused mutation suite —
`6/6`; conditional ARIA reference drift and missing focus-visible/reduced
motion/transparency guards fail closed. Evidence metadata-only, без learner
content, answer bodies, import/release authority или mutations. Полные
`pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-accessibility-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-207`: performance budget для initial route,
editor/task chunks и отсутствия duplicate content payload.

### Execution update — G10S-207 C098 production performance budget — 31 августа 2026

Target `main` закрыл G10S-207 локальными commit-gated коммитами без push из-за
ограничения Actions quota: implementation `b351fa0`, evidence/documentation
`5829de7`. Versioned policy
`g10s-c098-performance-policy.v1` (`2026.08.31-c098-performance.1`) расширяет
существующий production budget и не меняет runtime authority.

Production diagnostics PASS: проверены 13 routes; initial route — `930,785`
bytes, editor route `/practice/[slug]` — `948,852`, task route
`/practice/lesson/[id]` — `924,391`; largest emitted chunk — `415,610`, total
chunks — `1,130,694`. Route-specific payloads равны `8,103` (initial),
`26,170` (editor) и `1,709` (task), при бюджете `180,000` для каждого. Все
required routes присутствуют, heavy editor packages отсутствуют, duplicate
route chunk references и byte-identical chunk SHA-256 равны нулю. Static policy
tests — `9/9`, production checks — `8/8`; `pnpm check` теперь запускает
`performance:c098-policy` сразу после build. Evidence metadata-only находится
в `fluent-interview-platform/docs/verification/greenfield/G10S/c098-performance-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-208`: полная C098
route→question→activity→Run→Submit→Evidence machine journey и отдельная
human spoken-explanation evidence.

### Execution update — G10S-208 C098 authoring-to-learning vertical slice — 31 августа 2026

Target `main` закрыл machine-часть G10S-208 локальными commit-gated коммитами
без push из-за ограничения Actions quota: implementation `8e41ba1`,
metadata-only evidence/documentation `493fa96`. Скрипт
`tools/runtime/c098-vertical-slice-journey.mjs` выполняет единую проверяемую
цепочку `route → question → activity → Run → Submit → Evidence` на exact
координате `node-event-loop-001@revision 1` / `node-26-commonjs` и fail-closed
сводит результаты дочерних golden, submit и observe/explain journeys.

Live machine journey PASS_WITH_LIMITATIONS: 5 route responses `200`; Run — `5`
outputs и `8` trace events с совпавшим prediction order и clean worker; Submit —
`5/5` hidden checks, один evidence, stable replay и `409` duplicate conflict;
Evidence — `4` metadata-only facets (`trace`, `log`, `metric`, `assessment`) и
стабильный progress. Source, prompt, answer, solution и evaluator bodies не
попадают в отчёт. Human spoken explanation намеренно не автоматизируется:
статус `AWAITING_HUMAN`, evidence id отсутствует, агент не имеет права его
фабриковать. Полные `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` green; focused vertical tests — `6/6`.

Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-vertical-slice-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-209`: отдельный commit-marker для полного
C098 authoring-to-learning vertical slice, после чего начинается G10S.9
breadth-readiness/standalone-retirement.

### Execution update — G10S-209 C098 authoring-to-learning commit marker — 31 августа 2026

Target `main` закрыл G10S-209 локальным commit-gated коммитом без push из-за
ограничения Actions quota: `a4c2533` (`feat(g10s): prove C098 authoring-to-learning vertical slice`).
Marker `tools/runtime/c098-authoring-to-learning-marker.mjs` читает
versioned G10S-208 evidence и fail-closed проверяет exact target/evidence
commits (`8e41ba1`/`493fa96`), C098 coordinate, SHA-256, порядок и PASS-статус
всех шести machine stages, metadata-only controls и immutable
`AWAITING_HUMAN` boundary. Marker и mutation tests — `5/5`; `pnpm check`,
`pnpm boundary:check` и `pnpm toolchain:check` green. Никакие learner,
prompt, answer, solution или evaluator bodies не читаются в output; БД,
import и release authority не затрагиваются.

Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/c098-authoring-to-learning-marker-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-210`: сравнить Strata и target counts,
hashes и invariants перед standalone retirement.

### Execution update — G10S-210 Strata ↔ target reconciliation — 31 августа 2026

Target `main` закрыл G10S-210 локальными commit-gated коммитами без push из-за
ограничения Actions quota: implementation `6bc19f6`, evidence/documentation
`4e66c63`. Live reconciliation подтвердил чистый frozen Strata `main` на
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`: все `41` manifest files и
`159,515` bytes совпали, source drift/missing равны `0`. Every source
difference имеет решение: `13` mappings и `28` explicit dispositions,
uncovered `0`; adapted source/target hashes намеренно не объявлены
byte-identical.

Target transfer validation PASS (`13` mapped records, `3` unique targets),
current migration chain — `17/17` contiguous migrations. Disposable
PostgreSQL rehearsal PASS: inherited invariants `12/12`, platform ownership
invariants `16/16`, functional role checks `12`; disposable DB удалена,
target DB не изменена. Focused reconciliation tests `5/5`, полные
`pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` green; evidence
metadata-only, source bodies не эмитируются.

Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/strata-target-reconciliation-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-211`: повторить Strata golden fixtures
против target CLI и сравнить normalized outputs.

### Execution update — G10S-211 Strata golden fixtures ↔ target CLI — 31 августа 2026

Target `main` закрыл G10S-211 двумя локальными commit-gated коммитами без push
из-за ограничения Actions quota: implementation `ba34664`,
evidence/documentation `00b37f6`. Инструмент
`tools/dev/g10s-golden-cli-reconciliation.mjs` перечитывает все 11 frozen
golden-файлов Strata, сверяет bytes/SHA с baseline и source manifest и дважды
запускает target authoring CLI. В отчёт попадает только metadata projection:
source bodies, prompts, answers, evaluator material, database mutations и
release/import authority не эмитируются.

Результат `PASS_WITH_LIMITATIONS`: Strata `main` остаётся на
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`; manifest SHA
`e4cabff081bdf4660709330af28bcb832c43c0cda4789233e17b0e369e5804ae` совпал,
drift/missing `0`. Проверены `6` карточек, `75` layers, `3` task families и
`1` logical dataset. Target CLI integration прошёл `2/2` с exit codes `0,0`;
normalized digest обоих запусков совпал
(`f1660d56cef96a8efc114744281e4c11e9a41f954225a99b8955df8a7b614eca`).

Различия не скрываются: семь dispositions фиксируют намеренно суженный
authoring seed (один rights-cleared generic C098 вместо полного frozen
набора), `node → generic` projection, target-owned ref, `11 → 2` bilingual
layers, различие `durationMin=6` и `responseBudgetMin=4`, отсутствие expert
слоя и явное очищение provenance. Это адаптация с quarantine/routing
границами, а не заявление о полном переносе Strata. Focused mutation tests
`6/6`, полный `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check`
green.

Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/golden-cli-reconciliation-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-212`: повторить source `npm run check` и
target `pnpm check` как одну воспроизводимую toolchain-сверку.

### Execution update — G10S-212 source npm check ↔ target pnpm check — 31 августа 2026

Target `main` закрыл G10S-212 двумя локальными commit-gated коммитами без push
из-за Actions quota: implementation `bb1acc4`, evidence/documentation
`fcfc2f8`. Reconciler запускает ровно две команды в фиксированном порядке:
сначала `npm run check` в frozen Strata, затем `pnpm check` в target; fallback,
dependency installation, database/Docker mutation и release authority
запрещены.

Обе команды стартовали и завершились с exit `0`. Source `main` clean на
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`; manifest SHA
`e4cabff081bdf4660709330af28bcb832c43c0cda4789233e17b0e369e5804ae` совпал.
Target check выполнен на clean `main` commit
`bb1acc4731abe32bd4d7dc86ca555fe74317dac2`. Для воспроизводимости записаны
только нормализованные output SHA/размеры/строки (source `41` строк,
target `2,494`); тела stdout/stderr не публикуются. Focused mutation tests
`5/5`, полный `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check`
green.

Статус `PASS` означает готовность перейти к archive/retirement проверкам, но
не разрешает удалить Strata: production deploy, clean clone, rollback и
restore остаются отдельными гейтами. Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/toolchain-reconciliation-2026-08-31.{json,md}`.
Следующий executable пункт — `G10S-213`: проверить, что target docs/CLI
полностью описывают authoring, review, export, import, rollback и recovery без
source repo.

### Execution update — G10S-213/214 standalone lifecycle and target independence — 31 августа 2026

Target `main` закрыл G10S-213 и G10S-214 двумя implementation/evidence-парами
локальных commit-gated коммитов без push из-за Actions quota: G10S-213 —
`6f0f801` и `1c6a072`, G10S-214 — `d126d17` и `ebbb082`.

G10S-213 доказал self-contained target lifecycle: runbook содержит authoring,
review, deterministic export, file-only import/readback/reconciliation,
rollback и recovery; authoring/export/serving/stack CLIs отвечают на `--help`
без базы и Docker. G10S-214 собрал clean `git archive` и отдельный
`git clone --no-local --branch main` с тем же SHA, без `.git` в archive, symlink,
nested Git root, лишнего lockfile или source fallback. В fresh clone прошли
`pnpm install --offline --frozen-lockfile --ignore-scripts`, `pnpm build`,
`pnpm content:c098-release-export`, disposable
`pnpm architecture:c098-serving-import` и
`pnpm runtime:c098-vertical-slice-journey`; все exit `0`, C098 machine status
`PASS`. Первый clean-clone запуск выявил и устранил скрытую зависимость C098
export/import scripts от заранее собранного contracts `dist`.

Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/target-independence-2026-08-31.{json,md}`.

### Execution update — G10S-215 serving pointer rollback/restore — 1 сентября 2026

Target `main` закрыл G10S-215 двумя локальными commit-gated коммитами без push
из-за Actions quota: `58b017f` (implementation) и `175395e` (evidence/docs).
Добавлены migration `0018_release_pointer_operator_transitions.sql`, отдельная
operator-only команда `pnpm release:transition`, optimistic pointer check,
idempotency replay и immutable `import/activate/rollback` event metadata.
Контракт Zod теперь совпадает с DB constraints для bounded actor/reason.

Disposable rehearsal `pnpm architecture:release-pointer-transition` применила
все `18` миграций, импортировала synthetic pre-G10S baseline и C098, выполнила
rollback, отклонила stale expected pointer, восстановила C098 и повторила
forward-команду без второй записи. Результат `PASS`: event sequence
`import → import → rollback → activate`, readback verified, projection digest
стабилен, `contentBodiesEmitted=0`, база/one-shot containers/temporary bundles
очищены. Evidence target:
`fluent-interview-platform/docs/verification/greenfield/G10S/release-pointer-transition-2026-09-01.{json,md}`.
Следующий executable пункт — `G10S-216`: DB restore pre-G10S backup в
disposable stack с запускаемым reference product.

### Execution update — G10S-216 pre-G10S backup restore и product continuity — 1 сентября 2026

Target `main` закрыл G10S-216 двумя локальными commit-gated коммитами без push
из-за Actions quota: `c428809` (scoped restore rehearsal и focused tests) и
`bce1e17` (metadata-only evidence и handoff documentation).

`pnpm architecture:pre-g10s-restore-product` доказала полный disposable
сценарий: target database прошла миграции `1..18`, source database —
pre-G10S `1..17`; synthetic baseline и C098 были выгружены через
`pg_dump --no-owner --no-acl`, восстановлены в target и затем применена
migration `0018`. Так как `--no-acl` намеренно исключает grant statements,
rehearsal явно зафиксировала и повторила role ACL metadata; role journey
проверена в отдельной disposable role-check database, чтобы не менять active
release singleton. Source/restored logical hash совпал
(`c8682e78c7a550dc05fc2005b96a283a84ad748515926e9d2d3f53dca43d8cef`), все
19 release-history counts совпали, schema/role checks `12/12` PASS.

Reference product был поднят до restore и после restore: `/`, `/questions`,
`/api/studio/releases/active` вернули HTTP `200`, internal API readiness
вернула exit `0`. После проверки source DB, role-check DB, временный dump и
scoped Compose stack удалены (`0` containers/volumes/networks); persistent
stack не затронут. Evidence metadata-only, bodies `0`, dump bytes/hash и
rehearsal checksums записаны в
`fluent-interview-platform/docs/verification/greenfield/G10S/pre-g10s-restore-product-2026-09-01.{json,md}`.
Это synthetic restore rehearsal, а не production backup claim; настоящий
backup owner/retention остаётся отдельным G13/G12 acceptance gate.

Следующий executable пункт — `G10S-217`: immutable Strata archive tag/bundle,
hash manifest и clean clone/source checks.

### Execution update — G10S-217 immutable Strata archive и clone — 1 сентября 2026

Target `main` закрыл G10S-217 commit-gated implementation/evidence/docs
цепочкой без push из-за Actions quota: `44015ff` (archive rehearsal и
metadata guard), `3d9aa39` (machine-readable evidence) и `d3d10f9` (G10S
README handoff).

Frozen Strata `main` остался clean на
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`; все `41/41` файла manifest
совпали по байтам и SHA, drift/missing `0`. В source checkout создан локальный
annotated immutable tag `strata-archive-2026-09-01-g10s-217`; существующий tag
при другом commit был бы отвергнут. Rehearsal собрала временный tar.gz archive
(`99,047` bytes, SHA
`2425e2133c848572d54e1f8d64ec4315bc24638ce291ddc3b564ebfbade8d966`) без
symlink/Git metadata и complete-history Git bundle (`230,261` bytes, SHA
`306df648e2bb6f6f318aba0f81d9d69a56059eec0da6d2890d73a78ac97db63c`).

Bundle clone подтвердил `main`, frozen HEAD, tag и clean tree до/после install;
source `npm run check`, clone `npm ci --ignore-scripts --no-audit --no-fund` и
clone `npm run check` завершились exit `0`. Archive/bundle удалены из temporary
directory, Strata не удалена и target не получает source bodies. Машиночитаемое
evidence metadata-only: `G10S-217-strata-archive-2026-09-01.{json,md}`.

Следующий executable пункт — `G10S-218`: пометить standalone Strata
README/docs/plan как migrated/reference-only с target path/SHA.

### Execution update — G10S-218 Strata retirement handoff — 1 сентября 2026

Target `main` закрыл G10S-218 локальной commit-gated цепочкой без push из-за
Actions quota: implementation `bf9dd70` и marker-alignment fix `161a79b`,
затем evidence/docs commit `04026a3`. Rehearsal проверила, что retained Strata
successor clean на `0921dd0271983244a5cc96301ba0b242369cafd2`, его post-archive
изменения ограничены ровно `README.md`, `docs/migration.md` и `docs/plan.md`,
а каждый документ явно называет `fluent-interview-platform` active authority и
замораживает собственные historical checkboxes. Immutable annotated tag
`strata-archive-2026-09-01-g10s-217` по-прежнему указывает на baseline
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`; source `npm run check` завершился
exit `0`. Target `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` также green; evidence metadata-only, без source bodies,
runtime/schema/content mutations, удаления checkout или перемещения tag.
Машиночитаемая и human-readable фиксация находится в
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-218-strata-retirement-2026-09-01.{json,md}`.
Standalone checkout сознательно сохраняется до owner-approved G13 archive /
restore proof; следующий executable пункт — `G10S-219`.

### Execution update — G10S-219 Strata retention boundary — 1 сентября 2026

Target `main` закрыл G10S-219 commit-gated цепочкой без push из-за Actions
quota: implementation `8ccb0f5` и evidence/docs `356f3ad`. Новый
metadata-only retention guard fail-closed подтверждает, что retained Strata
checkout существует как clean non-symlink `main` на
`0921dd0271983244a5cc96301ba0b242369cafd2`, immutable archive tag
`strata-archive-2026-09-01-g10s-217` остаётся pinned к
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`, а executable policy roots не
содержат destructive call, направленный на source selector. Guard также
проверяет обязательные ownership markers: физическое удаление требует
owner-approved G13 authorization, exact manifest и archive/restore proof.
Target `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, focused
G10S-218/219 tests и live retention rehearsal — green. Evidence
`G10S-219-strata-retention-2026-09-01.{json,md}` metadata-only; source/runtime/
schema/content не изменялись, checkout не удалялся, tag не перемещался.
Следующий executable пункт — `G10S-220`: проверить отсутствие forbidden
legacy structure/fallbacks в target.

### Execution update — G10S-220 target structure guard — 1 сентября 2026

Target `main` закрыл G10S-220 локальной commit-gated цепочкой без push из-за
Actions quota: implementation `09fb087` и evidence/docs `b5de1f6`. Новый
metadata-only guard проверяет активное дерево target: ровно один root `.git`,
ноль nested Git roots/active или external symlinks, единственный root
`pnpm-lock.yaml`, единственный root `compose.yaml` с project name
`${FLUENT_STACK_ID:-fluent-interview-platform-dev}`, а также отсутствие
legacy source-path/fallback references в `76` runtime/config files. Реальный
результат — `PASS`: `901` files, `166` directories, `21` excluded generated /
dependency directories, scan errors `0`, runtime references/fallbacks `0`.

Focused target-independence tests — `5/5`; полный `pnpm check`,
`pnpm boundary:check` и `pnpm toolchain:check` — green. Guard fail-closed
тестируется на nested Git, external link, lockfile/Compose drift, env
override, legacy reference и fallback fixtures. Evidence
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-220-target-structure-2026-09-01.{json,md}`
содержит только metadata/counts/hashes; Docker и DB не запускались и не
изменялись. Следующий executable пункт — `G10S-221`: доказать one-root
startup через `pnpm dev` без самостоятельного Strata service.

### Execution update — G10S-221 one-root startup — 1 сентября 2026

Target `main` закрыл G10S-221 локальной commit-gated цепочкой без push из-за
Actions quota: implementation `c81e358` и evidence/docs `9b4040b`. `pnpm dev`
теперь применяет checked-in PostgreSQL migrations до запуска остальных
сервисов, fail-closed при ошибке и не поднимает самостоятельный Strata
service. Изолированный rehearsal `fluent-g10s-221-mthx3yvd` достиг `ready`:
точно шесть platform services (пять running/healthy и `api-data-init` exited
`0`), migrations `18/18`, ledger `count=18`, все шесть learner/API routes
`200`. Scoped cleanup завершился `0` containers / `0` networks и сохранил
ровно `postgres-data` и `platform-events`; report metadata-only, без bodies,
credentials или raw logs. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-221-one-root-startup-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-222: доказать scoped `pnpm down`, zero
orphans и сохранность declared durable volumes.

### Execution update — G10S-222 scoped cleanup and volume retention — 1 сентября 2026

Target `main` закрыл G10S-222 локальной commit-gated цепочкой без push из-за
Actions quota: implementation `2942587` и evidence/docs `943fd45`. Новый
metadata-only rehearsal вызывает именно публичный `pnpm down` дважды на
изолированном Compose project `fluent-g10s-222-mthxl0rl`, предварительно
включая optional observability profile в том же one-root stack. Оба shutdown
завершились `exit 0`, оставили `0` containers и `0` networks, не использовали
`--volumes`/`-v` и сохранили неизменными IDs всех трёх declared durable volumes:
`postgres-data`, `platform-events`, `otel-data`. Повторный `pnpm dev` после
первого shutdown прочитал PostgreSQL migration ledger как `18/18`, подтверждая
реальную сохранность данных. Focused cleanup tests — `3/3`; полный
`pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` — green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-222-scoped-cleanup-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-223: выровнять G11 input inventory и
authoring queue с Strata authority и C098 release schema.

### Execution update — G10S-223 G11 input reconciliation — 1 сентября 2026

G10S-223 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `bdf18e9` и evidence/docs `dc6e79c`. Гейт
детерминированно связывает G11 inventory (`1,597` записей, hash
`85e28bf…ba168`) с bounded authoring queue (`1,597` total, batch `100`,
`1,591` `authoring`, `6` `mapping-review`), проверяет оба intake manifest
SHA и оставляет automatic promotion отключённым. Authority — чистый Strata
`main` на `ec3b6804`; migration chain `1..18` и `0007_strata_authoring.sql`
подтверждены, API содержит `0` ссылок `strata.`. C098 закреплён на
`question-catalog.v1` / `question-release-bundle.v1`, identity
`C098/ordering/generic`, release/curriculum revisions, `en`/`ru`,
`predict`/`run`, `node-26-commonjs` и разрешённый `nexttick` graph target.
Прямые catalog edits, automatic import/release, body emission и DB/file writes
запрещены; negative fixtures и полный check/boundary/toolchain ladder green.
Исторические G11 artifacts не переписывались. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-223-g11-input-reconciliation-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-224: доказать source-grant/quarantine/adapter
gates для всех G11 mass-import packs и запретить прямую запись canonical catalog.

### Execution update — G10S-224 G11 mass-import boundary — 1 сентября 2026

G10S-224 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `e58583e`, evidence/docs `cf31479`. Гейт связывает
четыре исторических G11 mass-import pack с четырьмя policy references: source
grant, rights/quarantine и G10S.7 catalog adapter. Static scan десяти
import/review tools нашёл `0` ссылок и `0` записей в canonical
`content/questions/`, `0` инвертированных promotion expressions и `0` нарушений.
Pack scan нашёл `0` body-like fields; controls сохраняют
`metadataOnly=true`, `autoPromotion=false`, automatic import/release disabled,
`catalogWrites=0` и `databaseMutations=0`. Три старых root
`$.policy.autoPromotion=true` зафиксированы как immutable historical drift,
исторические файлы не переписывались; текущие генераторы fail-closed, а legacy
importer по умолчанию пишет в non-canonical `content/authoring/imports`.
Focused tests `5/5`, полный check/boundary/toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-224-g11-mass-import-boundary-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-225: retirement standalone Strata как active
authority.

### Execution update — G10S-225 standalone Strata authority retirement — 1 сентября 2026

G10S-225 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `39b23ff`, handoff docs `4b59fb0`, machine
evidence `1cbb69a`. Standalone Strata переведён из active authority в
`migrated/reference-only`; target monorepo является единственным владельцем
authoring, release-import и serving через `question-catalog.v1`. Все `15/15`
prerequisite evidence G10S-210…224 приняты (включая явный
`PASS_WITH_LIMITATIONS` для golden reconciliation), Strata `main` чистый, а
annotated archive tag `strata-archive-2026-09-01-g10s-217` всё ещё указывает на
`ec3b6804`. Active runtime/deployment scan проверил `231` файлов и нашёл `0`
legacy checkout paths, source selectors, standalone services, fallbacks,
authoring DSNs, package imports и прямых `strata.` references. Source checkout,
database и Docker не удалялись и остаются под G13 owner approval. Focused tests
`6/6`, полный check/boundary/toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-225-strata-active-authority-retirement-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-226: общий machine-evidence schema и
historical artifact handoff.

### Execution update — G10S-226 common machine-evidence schema — 1 сентября 2026

G10S-226 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `eea6840`, evidence `3d9b092`. Target получил
один закрытый `g10s-machine-evidence.v1` envelope и dependency-free validator;
исторические G10/G11/G12/G10S artifacts не переписывались. Deterministic
metadata-only index содержит `428` исторических файлов с относительным путём,
размером, SHA-256 и безопасными координатами schema/gate/status; body-like
поля, source/answer/log contents, DB/Docker writes и import/release authority
запрещены. Rehearsal и evidence report: `5/5` checks passed, `0` failed/open,
focused tests `3/3`, полный check/boundary/toolchain ladder green; текущий
report валидируется отдельно от historical index. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-226-machine-evidence-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-227: зафиксировать metadata-only inputs,
которые связывают frozen Strata, target parent, questions manifest и reports
13/14 без копирования содержимого.

### Execution update — G10S-227 evidence input coordinates — 1 сентября 2026

G10S-227 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `4c1a0bd`, evidence handoff `1d60683`. Вынесен
отдельный `G10S-inputs/` ledger, чтобы не переписывать исторический G10S
index: он фиксирует reviewed Strata successor `0921dd0`, archive tag
`strata-archive-2026-09-01-g10s-217` → `ec3b6804`, target parent
`3d9b092`, release/intake question manifests и SHA-256 обоих Brain reports
13/14. Source/question/report bodies не копируются; symlink, path, size/hash,
schema и ancestry drift fail closed; target/source/database/Docker/import/
release mutations запрещены. Rehearsal `8/8`, focused tests `4/4`, полный
check/boundary/toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-227-{inputs-2026-09-01.json,evidence-inputs-2026-09-01.md}`.
Следующий executable пункт — G10S-228: повторить обязательные repository и
content gates уже с обоими metadata ledgers в check chain.

### Execution update — G10S-228 repository/content gate closure — 1 сентября 2026

G10S-228 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `67d6bdd`, evidence `f2da01d`. Четыре команды
выполнены последовательно и повторно проверены: `pnpm check`,
`pnpm boundary:check`, `pnpm toolchain:check`, `pnpm content:gates` — **4/4
PASS**, `0` failed/open/skipped. Evidence сохраняет только command IDs,
arguments, exit codes, durations, output byte counts и SHA-256 digests; raw
stdout/stderr, question/answer bodies, database/Docker writes и
import/release authority не эмитируются. Anchor `1d60683` остаётся проверенной
ancestor‑точкой target `main`; focused tests `3/3`, полный check/boundary/
toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-228-gate-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-229: добавить и задокументировать отдельные
authoring/database/bundle verification gates.

### Execution update — G10S-229 dedicated content verification — 1 сентября 2026

G10S-229 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `5b6b1c3`, evidence `3d332dd`. Добавлены стабильные
root wrappers `content:authoring:check`, `content:db:verify` и
`content:bundle:verify`; их policy/schema и metadata-only runner фиксируют
только command coordinates, exit codes, durations, output byte counts и
SHA-256. Все **3/3** gates PASS: authoring lint/typecheck/tests, database-free
`db-verify` с удалёнными DB env и catalog/release/public/import boundary
verification. `catalogWrites`, DB/Docker mutations, external writes,
import/release authority и raw question/answer/log output равны нулю; focused
tests `3/3`, полный check/boundary/toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-229-content-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-230: fresh/upgrade DB, role/grant negative
matrix, canonical prompt race и backup/restore.

### Execution update — G10S-230 persistence, authority and recovery — 1 сентября 2026

G10S-230 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `361e018`, evidence `c42e3ad`. Добавлен
metadata-only gate `architecture:gate-230`, который последовательно запускает
`architecture:fresh-db`, `architecture:upgrade-db`,
`architecture:authority-negative-matrix`, `architecture:concurrency`,
`architecture:backup` и `architecture:restore-db`. Все **6/6 PASS** с нулевыми
failed/open/skipped: fresh/upgrade проверили 18 миграций и роли, negative matrix
отвергла unauthorized/stale/duplicate атаки, race оставила одну preferred prompt,
backup/restore сохранили логические snapshot hashes и role metadata. Временные
базы ограничены префиксом `fluent_g10s_`: до и после `0`, persistent DB/Docker
mutations `0`, durable volumes не удалялись. Evidence содержит только command
coordinates, exit codes, длительности, byte counts и SHA-256 stdout/stderr; raw
logs, credentials и question/answer bodies не эмитируются. Focused tests `3/3`,
полный check/boundary/toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-230-persistence-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-231: Studio author/review/publish,
deterministic export, file-only import, readback и rollback.

### Execution update — G10S-231 Studio release pipeline — 1 сентября 2026

G10S-231 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `e15dcc9`, evidence `002a7e1`. Добавлен
metadata-only `architecture:gate-231`, который в одном изолированном прогоне
последовательно проверяет девять границ Studio и release pipeline:
`architecture:studio-authoring-command`, `architecture:studio-review-command`,
`architecture:studio-release-request`, `architecture:golden-cli-reconciliation`,
`architecture:authoring-export-crash`, `architecture:serving-release-import`,
`architecture:c098-serving-import`, `architecture:serving-import-crash` и
`architecture:serving-release-reconciliation`. Все **9/9 PASS**; каждая команда
завершилась с exit `0`, а результаты фиксируют только координаты команды,
длительность, размеры и SHA-256 stdout/stderr — тела вопросов, ответов,
аргументы, credentials и сырые логи не попадают в evidence. Прогон подтвердил
детерминированную author/review/publish цепочку, crash-safe export/import,
идемпотентный file-only readback и rollback без обхода release boundary.
Временные базы ограничены префиксом `fluent_g10s_`: до и после `0`,
`noLeftovers=true`; persistent DB/Docker mutations `0`, durable volumes
сохранены. Focused tests `3/3`, полный check/boundary/toolchain ladder green.
Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-231-studio-release-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-232: corpus rights/quarantine/leak scans,
запретить любые forbidden distributable findings.

### Execution update — G10S-232 corpus rights and leak boundary — 1 сентября 2026

G10S-232 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `5cfb47a`, evidence `99664e2`. Добавлен
metadata-only `architecture:gate-232`, который последовательно запускает девять
сканеров: source manifests/storage, body boundary, rights defaults, Solvit paid
boundary, company attribution, release leak scan, observability leak scan и
quarantine round-trip. Все **9/9 PASS**; allowlisted safe metrics подтвердили
`releaseEligibleCount=0`, `trackedBodyCount=0`, `importAllowedRecords=0`,
`automaticPublicRecords=0`, `findingCount=0`, `bodyMatchCount=0` и
`servingProjectionRecords=0`; две непроверенные записи остаются явно
quarantined (`quarantinedRecords=2`), а disposition hash round-trip сохранён.
Company/paid/source payload не видны learner и не authorise import/release.
Команды выполнялись с удалёнными DB env, evidence содержит только координаты,
длительности, byte counts, SHA-256 и безопасные метрики — raw bodies, paths,
credentials и логи не эмитируются. Scoped `fluent_g10s_*` cleanup `0→0`,
persistent DB/Docker mutations `0`, durable volumes сохранены; focused `3/3`,
полный check/boundary/toolchain ladder green. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-232-corpus-rights-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-233: полный C098 learner/runtime/evidence
journey на exact release/revision IDs.

### Execution update — G10S-233 C098 full learner journey — 1 сентября 2026

G10S-233 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `9a83d03`, evidence `d3a15e7`. Добавлен
metadata-only `architecture:gate-233`, который последовательно проверяет девять
границ: released learner route, selector, public Run, Submit/replay/conflict,
negative vectors, Observe/Explain + Navigator, vertical slice, persistence и
authoring-to-learning marker. Все **9/9 PASS** на exact C098 coordinates:
release `2026.08.28-questions.1`, question
`question.node-event-loop-001`, revision `.r1`, runtime
`node-26-commonjs`/`g6-node-golden.1`; 7 answer layers, 43 routes, 8 trace
events, 5 hidden checks, 4 evidence facets, 13 runtime vectors и 8 submit
cases подтверждены. Persistence proof сохранил ledgers/Studio history через
restart, scoped down/up и integrity-checked restore, затем удалил post-backup
sentinels и оставил `0` containers/networks. Вложенный Studio rehearsal больше
не повторяет raw migrations после `pnpm dev`: lifecycle marker переиспользует
уже применённый migration ledger, устраняя найденный `psql exit 3`.
Scoped `fluent_g10s_*` cleanup `0→0`, persistent DB/Docker mutations `0`,
durable volumes сохранены; stdout/stderr и learner/evaluator bodies не
эмитируются. Focused `3/3`, полный check/boundary/toolchain ladder green.
Единственная честная граница — spoken explanation `AWAITING_HUMAN`.
Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-233-c098-journey-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-234: C098 RU/EN, light/dark, desktop,
keyboard/a11y и performance matrix.

### Execution update — G10S-234 C098 desktop quality matrix — 1 сентября 2026

G10S-234 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `60064fb`, evidence `99a80ea`. Добавлен
metadata-only `architecture:gate-234`, который последовательно запускает
`design:c098-desktop-matrix-policy`, `design:c098-accessibility-policy`,
`design:parity`, `design:raw-colors` и `performance:c098-policy`. Все **5/5
PASS**: desktop matrix дала `30/30` source checks и `276/276` cases,
accessibility — `30/30`, `92/92` route cases и `12/12` keyboard interactions,
design parity — `12` screens без issues, raw-color violations — `0`,
performance — `8/8` с 13 measured routes, без missing routes, duplicate payload
и forbidden heavy editor packages. Gate parser отдельно покрывает pretty-printed
JSON performance report и не принимает вложенный объект за report-level документ.
Статический quality slice не выдаёт import/release authority, не меняет БД,
Docker или каталог; disposable prefix `fluent_g10s_*` остаётся `0→0`, durable
volumes сохранены. Evidence содержит только command coordinates, durations,
byte counts и SHA-256 stdout/stderr. Focused `3/3`, полный check/boundary/toolchain
ladder green. Live screenshot diff, human visual sign-off, mobile matrix и
network Web Vitals остаются честными отдельными promotion gates.
Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-234-c098-quality-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-235: static dependency/SQL/credential scan,
no API→Strata access и no dual authority.

### Execution update — G10S-235 authority and security boundary — 1 сентября 2026

G10S-235 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `07fb3c5`, evidence `f879aad`. Добавлен
metadata-only `architecture:gate-235`, который последовательно запускает
serving-boundary, contract compatibility, source provenance, authority-negative,
security boundary, supply-chain, provenance signature и web-header checks. Все
**8/8 PASS**: serving boundary проверил 643 файла, `rawStrataSql=0` и
`authoringEnvironmentViolations=0`; contract/source ledgers не имеют gaps;
authority-negative отклонил 7 forbidden fields; security boundary подтвердил
защищённый CORS/HTML/process/runtime/Docker контур и cleanup `0` containers/
networks; SBOM содержит 175 components и `0` high/critical vulnerabilities;
CodeQL actions pinned, SARIF wait включён, локальная подпись проверена, web
headers PASS для `/` и `/questions`. Ни одна команда не выдала import/release
authority и не меняла durable data; disposable prefix `fluent_g10s_*` остаётся
`0→0`. Evidence содержит только coordinates, durations, byte counts и SHA-256
stdout/stderr. Focused `3/3`, полный check/boundary/toolchain ladder green.
Честные ограничения (third-party pentest, registry/image attestation, remote
CodeQL run и public deploy) оставлены явно в handoff.
Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-235-authority-boundary-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-236: reconciliation authoring→bundle→serving,
unexplained delta `0` и полный loss ledger.

### Execution update — G10S-236 cross-authority release reconciliation — 1 сентября 2026

G10S-236 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota: implementation `da9fed2`, evidence `e7040fa`. Добавлен
metadata-only `architecture:gate-236`, который последовательно запускает
source-field coverage, canonical bundle, release manifest/identity, public and
serving import boundaries, loss ledger и `reconciliation:release`. Все **9/9
PASS**: 73/73 source fields покрыты без contradictory mappings, canonical bundle
byte/hash-identical, manifest negative cases `5/5`, serving readback vectors
`18/18`, loss ledger `47 mapped / 5 intentional / 7 loss`, а release graph
получил `unexplainedDeltaCount=0` и deterministic projection rebuild.

В reconciliation исправлен реальный дефект: две assessed stages одной карточки
(`node-event-loop-001`) ошибочно считались конфликтом task family; теперь
повторная family допустима внутри одной card, но пересечение family между
разными cards по-прежнему fail-closed. `contentGapCount=358` (20 открытых
lessons, 70 role requirements, declared delta 212 questions и 56 activities)
остаётся честной контентной очередью и не маскируется под внутреннюю ошибку.
Gate metadata-only: persistent DB/Docker mutations `0`, import/release authority
не выдаётся, durable volumes сохранены; stdout/stderr и тела контента не
попадают в evidence. Focused `3/3`, полный check/boundary/toolchain ladder
green.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-236-release-reconciliation-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-237: clean archive target install/build/check/
dev/C098 без source repositories и agent-local caches.

### Execution update — G10S-237 clean archive independence — 1 сентября 2026

G10S-237 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota. Implementation gate — `21ab02c`; clean-room corrections —
`836d438`, `996f180`, `9c11d85`, `3c729a1`; evidence marker — `1604224`.
Финальная команда `pnpm architecture:gate-237 -- --write-report` завершилась
`PASS` за 130.4 s: target main clean и ancestry к `e7040fa` подтверждена,
archive не содержит `.git`, symlink или nested Git, fresh clone clean и содержит
ровно `pnpm-lock.yaml`, source references/env — `0/false`.

В clean archive последовательно прошли install, build, check, detached dev,
C098 export/import/journey и scoped cleanup (`0→0`). C098 дал export `PASS`,
import `PASS`, journey `PASS_WITH_LIMITATIONS` с machine status `PASS`; stdout,
stderr, тела ответов и секреты не попали в metadata-only evidence. Во время
rehearsal найдены и исправлены реальные дефекты: fresh-clone check теперь
строит content projections перед content tests, release manifest G10S-227
обновлён до шести записей/policy `.2`, а семь исторических screenshot-файлов,
на которые ссылался immutable G10S-226 index, force-added в archive без
переписывания индекса.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-237-clean-archive-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-238: ограничить каждый implementation commit
одним объявленным slice и вести последовательность docs → workspace → DB →
domain → Studio → corpus → adapter → C098 → retirement.

### Execution update — G10S-238 commit-slice discipline — 1 сентября 2026

G10S-238 закрыт в target `main` двумя локальными commit-gated шагами без push
из-за Actions quota: implementation `ffa194f`, evidence `6ecc55c`. Версионированные
policy/schema и `architecture:gate-238` проверяют точный диапазон
`e7040fa..1604224`: шесть SHA в линейном порядке, одного родителя, exact subject,
полное множество changed paths по allowlist и `git diff-tree --check`.
Итог — **28/28 PASS**: 24 commit-level assertions плюс history-range, main branch,
clean tree и ancestry.

Ledger различает `implementation`, `correction` и завершающий `evidence`; один
implementation объявляет только `workspace`, corrections не двигают sequence,
evidence обязан быть последним. Опубликована будущая последовательность
`docs → workspace → DB → domain → Studio → corpus → adapter → C098 → retirement`,
следующий slice — `db`. Gate fail-closed при незаявленном SHA, merge-коммите,
неверном родителе, subject или пути. Реальные исправления G10S-237 (content
projection order, manifest `.2`, семь indexed screenshots) входят в ledger как
отдельные bounded corrections.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-238-commit-slice-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-239: после каждого commit повторять slice
checks, фиксировать clean status и связывать SHA с gate.md.

### Execution update — G10S-239 post-commit cadence — 1 сентября 2026

G10S-239 закрыт в target `main` implementation commit `e2fbaaf` и evidence
commit `521bf2e`, без push из-за действующего Actions quota ограничения. Гейт
проверяет, что implementation является прямым линейным потомком G10S-238
evidence `6ecc55c`, имеет exact subject/path allowlist и чистый diff.
Пять обязательных post-commit команд (`git status --short`, `git diff --check`,
`pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`) выполнены
последовательно; результат **13/13 PASS**, включая четыре coordinate и четыре
commit assertions. Evidence metadata-only: тела stdout/stderr, source/question
бodies и секреты не записываются, только размеры и SHA-256.

Cadence теперь явный: fast checks запускаются после каждого commit, а полный
`pnpm check` — на границе implementation/evidence фазы. Это сокращает время
между срезами без ослабления clean/branch/boundary требований. Remote
attestation остаётся `OPEN`, push не выполнялся.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-239-post-commit-2026-09-01.{json,md}`.
Следующий executable пункт — G10S-240: fast-forward push policy с локальным
PASS и явной open-аттестацией при запрете push.

### Execution update — G12 RC rehearsal — 29 августа 2026

G12 выполнен как clean-room release-candidate rehearsal на новом clone
`/private/tmp/fluent-platform-rc-bLxvWh` из `origin/main`. Release commit:
`476aa01` (`release(g12): prepare Fluent Interview Platform release candidate`),
handoff metadata: `6cec7bb` (`docs(g12): finalize RC manifest and independent handoff`),
`e58d9f5` (индекс выровнен с pushed head) и `57a54a5` (счётчик evidence
commands выровнен с NDJSON). Все коммиты опубликованы в `main`; immutable tag
`rc-2026.08.29.1` указывает на `476aa01`, а `origin/main == 57a54a5`.

Локальные quality/build/repository guards, 12 learner routes, Playwright
theme/locale/keyboard/overflow smoke, Node Run/Submit/Replay, Navigator
offline boundary, progress/evidence, Studio lifecycle, backup/restore,
incident capture и scoped Docker shutdown прошли. Evidence и checksums находятся
в [target G12 handoff](../fluent-interview-platform/docs/verification/greenfield/G12/gate.md)
и [target gate index](../fluent-interview-platform/docs/verification/greenfield/INDEX.md).
`gate.json.status` оставлен `AWAITING_INDEPENDENT_REVIEW`: 57 curriculum gaps,
только Node runtime, connected-LM/human visual/security/CI gates ещё не закрыты.

### Execution update — G6 scoped worker lease lifecycle — 30 августа 2026

Коммит target `a979fe6` добавляет к process-backed runtime supervisor явный
lease registry: каждый worker получает обязательные `stack-id`, `attempt-id`,
`task-revision` и RFC3339Nano `ttl-expires-at`; истёкшие leases reconciled
идемпотентно до следующего запроса, а cleanup удаляет disposable workspace до
release lease. Политика публикует TTL, требуемые labels и способ cleanup,
контракт закреплён Go/Zod тестами. Это закрывает lifecycle-доказательство в
текущем локальном process scope; Docker object labels, отдельный Docker API
supervisor и OS-level network namespace остаются честными promotion limits.
Evidence: `docs/verification/greenfield/G6/worker-lease-lifecycle-2026-08-30.md`.

### Execution update — G6 golden learner journey — 29 августа 2026

В target `main` опубликованы два атомарных коммита для закрытия доступной
части `G6-024`:

- `92f7e5f` добавляет `tools/runtime/golden-journey.mjs` и команду
  `pnpm runtime:journey`; journey требует чистый checkout по флагу
  `FLUENT_GOLDEN_REQUIRE_CLEAN=1` и проверяет цепочку
  `program → practice → lesson/node-event-loop → released question →
  runnable task → Run`;
- `ee08541` добавляет G6 evidence, machine-readable outputs и checksums.

Live-прогон из свежего локального clone target commit `ee08541` на
`http://127.0.0.1:47360` дал пять HTTP 200
маршрутов, опубликованный `node-26-commonjs`, `runStatus=passed`, пять строк
stdout, восемь trace events, `predictionMatch=true`, cleanup и неизменённые
`mastery/unlock/accepted=false`. Response content не попадает в evidence.
Команды web smoke/typecheck/lint/build также PASS. Это закрывает только
маршрутный golden-path smoke; G6 network namespace, Docker supervisor,
TypeScript revision, lazy chunks и финальный production/human gates остаются
явно открытыми.

### Execution update — G6 runtime contract vectors — 29 августа 2026

Live-прогон target после пересборки Compose выявил и исправил nullable
`predictionEvidence.observed` в ошибочных ответах (`1305f6f`): теперь Go
supervisor сериализует пустой массив, совместимый с Zod browser contract.
Коммит `8ed3fcb` добавляет `pnpm runtime:vectors`, а `9bfd00c` фиксирует
evidence/checksums. Восемь векторов через Next boundary прошли: canonical,
malformed `400`, compile/runtime errors, network/filesystem `sandbox_refused`,
server timeout и client cancellation; post-cancel recovery также `passed`.
Завершившиеся workers очищены, `noMasteryMutation=true`. Это закрывает
`G6-025` для текущего Node profile; Docker/namespace promotion, TypeScript
revision и остальные production gates не расширяются этим результатом.

### Execution update — G6 trace continuity — 29 августа 2026

Live journey `pnpm runtime:trace` теперь закрепляет W3C trace context через
обе публичные поверхности target: `GET /api/trace-probe` проходит Next → Nest
health → Runtime info, а `GET /api/runtime/info` и `POST /api/runtime/run`
прокидывают тот же `traceparent` до runtime control и disposable worker.
Коммиты `2815afa` (Go извлекает trace ID из валидного `traceparent`) и
`3261ea9` (Next runtime-info proxy forwarding) исправили реальные разрывы
контекста; `d4f255c` добавил machine-readable evidence и checksum ledger.
Ответ Run сохраняет фиксированный trace ID, response headers валидны, worker
очищен, `mastery/unlock/accepted` не изменяются. Это закрывает `G6-029` для
текущего локального process-backed стека. Внешний OTLP collector/Jaeger,
per-attempt Docker labels и production isolation остаются отдельными
promotion gates и не объявляются выполненными этим smoke.

### Execution update — G7 evidence-chain contract slice — 29 августа 2026

Повторная проверка target `main` после G6-029 подтверждает доступную часть
evidence chain: `pnpm --filter @fluent/api test` — 38/38, projection rebuild —
2/2, Web smoke — 21/21, typecheck/lint/build — PASS. В G7 уже опубликованы
канонические семь learning-фаз (`prediction`, `run`, `submit`, `explanation`,
`defense`, `reflection`, `repeat`), строгие `evidenceId`/`rubricRevision` для
explanation/defense, deterministic rebuild прогресс- и revision-projection и
bounded exact-revision Evidence Journal (`eba5dce` и предшествующие G7
коммиты). Поэтому в чек-листе отмечены `G7-009`, `G7-013` и `G7-019`.
Evaluator-backed spoken review и human semantic review остаются открытыми
(`G7-012`); backup/restore для локальной single-project authority chain
закрыт отдельной полной матрицей, а статус G7 по-прежнему не повышается до
production `PASS`.

### Execution update — G8 project breadth release — 29 августа 2026

Target `main` публикует `c678e5c` с catalog release
`2026.08.29-projects.2`: Node, Java и Go books расширены до шести milestones,
а `next-production-frontend` и `system-design-resilient-platform` добавлены
как отдельные six-milestone lanes с dedicated rubrics и provenance links.
Contract/catalog tests — 4/4, `pnpm projects:coverage` — 30/30 entries met,
`openCount=0`; evidence и checksum ledger — `7057348`.
Это закрывает catalog/project-scope `G8-011` и `G8-012`. Для `G8-013` книга и
trade-off/failure-drill milestones опубликованы, но evaluator-backed defense
activity ещё не выпущена, поэтому итоговый G8 остаётся `PASS_WITH_LIMITATIONS`.

### Execution update — G8 evaluator-backed system-design activities — 29 августа 2026

Target `main` публикует `dc60b63` с versioned rubric/evaluator boundary для
двух system-design activities: `defense` (trade-off defense) и
`failure_drill` (incident recovery). Контракты строго проверяют project,
milestone, scenario и rubric revision; deterministic evaluator требует ответы
по каждой rubric dimension, считает score/pass-fail и не сохраняет raw
responses. Accepted project evidence теперь индексируется по kind, поэтому
milestones с `defense`/`failure_drill` нельзя закрыть одним submit verdict или
самодекларацией. Через learner-facing Next boundary live proof подтвердил:
rubric `200`, pass `201`, повтор с тем же idempotency key возвращает тот же
assessment, а accepted evidence `201` содержит
`milestoneSelfDeclared=false`.

Это закрывает доступную deterministic часть `G8-013`, но не экспертную оценку
качества архитектуры: human/mock defense, adversarial scenario depth и
production incident runtime остаются отдельными promotion gates. Поэтому
`G8` всё ещё `PASS_WITH_LIMITATIONS`, а `G8-026` не закрывается.

Evidence и checksum ledger для этого среза опубликованы отдельным commit
`fcccf9b` в `fluent-interview-platform/docs/verification/greenfield/G8/`.

### Execution update — G11 Brain/Vault source inventory — 29 августа 2026

Target `main` публикует `56fe493` с воспроизводимым metadata-only intake
срезом для внешних Brain/Vault источников. Инвентаризация насчитала 1 597
Markdown records (1 594 со стабильным ID и RU/EN вопросом), 1 591 accepted
mapping entries и 6 unmapped records. Ни одна запись не совпала с target
release: 1 591 остаются `pending`, 6 — `quarantined`, все 1 597 требуют
явного reviewer decision. Path distribution и source/reconciliation hashes
записаны в
`fluent-interview-platform/docs/verification/greenfield/G11/source-inventory-2026-08-29.md`.

Собран bounded review batch (25 из 1 597, metadata-only, без auto-promotion),
чтобы проверить границу intake и воспроизводимость. Это закрывает измерение
источника, но не corpus closure: semantic duplicate review, provenance/
license, answer layers, typed placements, assessed activities и promotion в
canonical release остаются открытыми. G11 не повышается до `PASS`.

### Execution update — G11 source-quality preflight — 29 августа 2026

Target `main` публикует `eaae89b` с командой `pnpm content:quality` и
`7e1be05` с обновлённым G11 evidence. Детерминированный
`vault-quality-inventory.v1` повторно проверил все 1 597 Markdown records и
сохранил только hashes, mapping metadata и section-presence flags. Срез
насчитал 227 явных Task sections, 56 Answer/Solution headings, 903 follow-ups
и **0** строгих кандидатов для editorial review: accepted mappings всё ещё
нуждаются в original mechanism/answer/source/activity слоях. `12c049c`
синхронизирует gate index с этой головой.

Это закрывает source-quality preflight как воспроизводимый инструмент, но не
создаёт и не публикует карточки. Reviewer decisions, provenance/license,
semantic dedupe, typed placements, assessed activities и release promotion
остаются обязательными шагами G11.

### Execution update — G11 deterministic authoring queue — 29 августа 2026

Target `main` публикует `1338644` с `vault-authoring-queue.v1`. Скрипт
принимает только metadata-only `vault-quality-inventory.v1`, сортирует записи по
явному состоянию и missing facets, ограничивает выдачу batch размером 100 и
никогда не копирует prompt/answer/code/source wording и не меняет release.
`6e46da3` записывает реальный batch из 1 597 записей: `authoring=1 591`,
`mapping-review=6`, `queueHash=e1c5bae785c2af8572498205888e89225ef41e9e25783772ac43b7c5ac940806`.
CLI guard дополнительно проверен с обычным `pnpm ... -- args`.

Это закрывает только воспроизводимую orchestration часть G11: mapping review,
original authoring, licensing, semantic correctness, typed placements,
assessed activities и promotion по-прежнему требуют решений автора и
ревьюера. `G11` остаётся `PASS_WITH_LIMITATIONS`.

### Execution update — G10 PostgreSQL Studio authority journey — 29 августа 2026

Target `main` публикует `f45fe20` с `PostgresStudioLedger`: при явном
`FLUENT_STUDIO_LEDGER_BACKEND=postgres` валидированные Studio snapshots
становятся append-only authority в `studio_ledger_records`; JSONL сохраняется
как обратимый fallback. `d2242cd` добавляет воспроизводимый
`pnpm studio:postgres-journey`, а `44b92db` фиксирует evidence и checksums.

На живом `fluent-interview-platform-dev` journey прошёл через public Next
boundary: candidate/review/release/readback получили ожидаемые HTTP 201/200,
идемпотентные повторы вернули те же IDs, API restart сохранил counts
`audit=3, candidate=3, receipt=3, release=1, review=1`, `rawContentPersisted`
остался `false`. Это закрывает локальный deterministic authority/replay slice,
но не managed transaction/consumer, retention, external load/partition,
licensed ingestion или human/semantic review; поэтому `G10` остаётся
`PASS_WITH_LIMITATIONS`.

### Execution update — G7 explanation/defense evaluator — 29 августа 2026

Target `main` публикует `c319fbf` и `085fbd6` с versioned
`learning-assessment.v1` и двумя Node event-loop rubric scenarios
(`explanation` и `defense`). Сервер проверяет точный placement
`track/module/lesson/question`, `activityId`, `scenarioId` и `rubricRevision`,
выдаёт metadata-only pass/fail assessment с idempotent replay и сохраняет
только digest/result в append-only ledger; raw responses не пишутся. Progress
принимает `explanation_recorded`/`defense_recorded` только при совпадении
persisted passing assessment, поэтому executable Submit больше не наследуется
автоматически.

На scoped Compose live vector дал rubric `200`, assessment `201` с
`status=pass`/`score=1`, повтор вернул тот же `assessmentId`, а matching
progress event дал `201` без изменения mastery/unlock. Контрактные, API, web,
stack и content checks прошли; checksums и команды воспроизведения записаны в
`fluent-interview-platform/docs/verification/greenfield/G7/`.

Это закрывает deterministic часть `G7-012`, но не human/semantic quality:
минимальная длина ответа не доказывает правильность объяснения. Expert/mock
review, полная multi-language rubric matrix, backup/restore и итоговый G7
production gate остаются открытыми.

### Execution update — G7 backup integrity rehearsal — 29 августа 2026

Target `main` публикует `c63dcb4`, `78beb18`, `2369aa2` и `51835dd`:
`pnpm data:backup -- --confirm`
создал project-scoped PostgreSQL dump, allowlisted ledger archive (включая
`learning-assessments.jsonl`) и 12-file release-artifact manifest с SHA-256.
Новый `pnpm data:restore -- --dry-run --input <backup>` проверяет все hashes,
tar listing и artifact allowlist, возвращая `valid=true`, `exitCode=0` и
`sideEffects="none"`. Это безопасно воспроизводимо на живом Compose stack и
не трогает пользовательские volumes.

Полноценный destructive restore теперь также проверен в отдельном disposable
Compose project: restore/readiness завершились с `0`, assessment readback
вернул исходный passing record, progress snapshot сохранил `completed=1/20`, а
временные volumes/networks/containers удалены scoped `compose down --volumes`.
Это закрывает `G7-015` для текущего single-project ledger slice. Полный
production/multi-tenant event-ledger matrix, rebuild всех projections и
human/semantic review остаются открытыми, поэтому gate остаётся
`PASS_WITH_LIMITATIONS`.

### Execution update — post-RC audit remediation — 29 августа 2026

После live route crawl и adversarial review в target `main` опубликованы два
атомарных исправления и отдельная evidence-запись:

- `3ccdd27` — Program теперь ведёт каждый lesson в `/practice/lesson/<id>`;
  preview-урок явно сообщает, что released question/activity ещё не издана,
  вместо ложного executable slug и «station not published».
- `174174b` — submit idempotency вынесена в durable project-scoped
  `submit-idempotency.v1` журнал; exact verdict replay и conflict переживают
  API/runtime restart и выход за окно learner projection `recent(500)`.
- `6653d92` — target G12 follow-up, known limitation и индекс синхронизированы;
  `ae49f65` обновляет индекс до текущего target head. External reviewer finding и re-check записаны в
  `fluent-interview-platform/docs/verification/greenfield/G12/independent-review.md`.
- `f9a4eca` — legacy aliases из route manifest получили явные Next.js
  non-permanent redirects (включая `/lab`, `/learning-map`, `/concept/:id`,
  `/next`, `/journal`, `/graph-guide`, `/migration-plan`); Web smoke фиксирует
  полный source→destination mapping.
- `059666e` — G12 index, diff summary и independent-review follow-up выровнены
  с фактическим target head после route remediation.

Проверены `pnpm check` (lint/typecheck, API 12/12, Web 16/16, stack 8/8,
curriculum 5/5, content 3/3, Navigator 2/2, Studio 3/3, Next build), format,
boundary, drift, toolchain, content и evidence guards. На свежесобранном
`fluent-platform-g12-fullcheck` выполнены browser lesson preview, golden
Run/Submit, exact replay после `docker compose restart api` и `409` для
изменённого payload под прежним key. G12 по-прежнему
`AWAITING_INDEPENDENT_REVIEW`: это remediation evidence, а не production claim;
57 curriculum gaps, only-Node runtime, full corpus/multi-language, connected AI,
visual/a11y, CI/SBOM и human sign-off остаются открытыми по `known-limitations`.

### Execution update — intake/reconciliation and cancellation hardening — 29 августа 2026

После этой проверки target `main` продолжил исполняться небольшими
воспроизводимыми batches, не переписывая RC tag и не подменяя открытые
production-gates:

- `85f7474` добавляет `content:inventory`: metadata-only детерминированный
  snapshot reference Vault и Brain mapping (1597 Markdown records, 1594 stable
  IDs, 1591 accepted mappings, 6 unmapped; source wording/answers не попадают в
  evidence).
- `be04326` добавляет `content:reconcile` и поштучный
  `vault-reconciliation.v1` ledger. Все 1597 records имеют target state и
  review requirement; 1591 остаются `pending` до canonical promotion, 6
  получают явный `quarantined` с причиной. `released=0` честно показывает,
  что seed catalog из пяти authored cards не является импортом Vault.
- `6fd8a49` делает AbortController для Run/Submit в Workbench настоящим,
  `156e4a8` исправляет Navigator loading/retry states, а `4408366` передаёт
  client abort через Next Navigator/runtime proxies. Эти hardening commits
  закрывают пользовательские recovery defects, но не заявляют G6/G9 как
  production `PASS`.

Evidence и инструкции находятся в target
`docs/verification/greenfield/G5/vault-inventory-2026-08-29.md`,
`G5/vault-reconciliation-2026-08-29.md` и обновлённом `G5` index. Фактический
target head после этого batch: `be04326`; immutable RC
`rc-2026.08.29.1 → 476aa01` не изменён. Следующий content шаг — reviewer-led
disposition/promotion и role/depth/forbidden-set ledgers; следующий runtime
шаг — isolated supervisor/worker evidence, а не фиктивное расширение counts.

### Execution update — authority durability and deterministic release — 29 августа 2026

После intake batch target продолжил закрывать только воспроизводимые
инженерные gaps, не подменяя их curriculum coverage:

- `132dd54` переводит progress, project, submission, assistance и observability
  stores на явный `all()` authority read. Learner-facing `recent()` остаётся
  bounded projection, но dedupe, milestone lookup и revision/snapshot paths
  больше не теряют записи за пределами окна.
- `40a1f10` добавляет реальный release double-build test: два запуска
  `buildRelease()` в независимые temporary directories обязаны дать одинаковые
  release ID, logical hash и байты canonical `release.json`.
- `476c5f4` делает Navigator history authority-read и idempotency lookup по
  полному profile ledger; после 501 записей старый turn всё ещё replayable, а
  повтор не создаёт строку. Исправлен также дублирующий Nest decorator.

Повторены API **16/16**, content **10/10**, Studio rebuild **2/2** и
Navigator contract **2/2** тестов. Evidence target находится в
`fluent-interview-platform/docs/verification/greenfield/G8/`, `G9/` и `G10/`;
актуальный target head — `476c5f4`, опубликован fast-forward в `origin/main`.
Исторический RC tag `rc-2026.08.29.1 → 476aa01` не изменён. Открытыми
остаются reviewer-led promotion 1591 pending records, runtime supervisor и
multi-language conformance, PostgreSQL outbox/projections, connected-model и
human/visual/CI release gates.

### Execution update — promotion guard and bounded runtime capacity — 29 августа 2026

Следующий batch продолжил план без фиктивного закрытия production gaps:

- `dee7a6f` добавляет metadata-only `content:reconcile-validate`. Guard требует
  уникальные source IDs/paths и SHA-256, final reviewer disposition,
  `targetId` для `imported/merged`, reason для `quarantined/retired`, совпадающий
  summary и отсутствие supersession cycles. На актуальном ledger он возвращает
  `BLOCKED` (exit 1): 1591 pending, 6 quarantined, 0 imported/merged/retired,
  1597 records требуют review. Это механический стопор, а не скрытая
  классификация контента.
- `dee7a6f` также делает `merged` и `retired` явными counters в
  reconciliation summary; исходные тексты и ответы по-прежнему не попадают в
  evidence.
- `ef87ffc` фиксирует content integrity evidence: seed release — 5 cards,
  `en`/`ru`, logical hash
  `fd89426ba8bd566634e103d171b4d9fba0d010c7ac61fb478affa2cc416c0b9b`,
  route manifest 43/43, content suite 13/13 PASS. Полный Vault hash
  `8a65ab5551df5f09afae2e02ad5918c27f9c6c9510d608f41eefa23d30f9261e`
  остаётся отдельным reconciliation source hash.
- Уже опубликованный `6ddbea3` ограничивает runtime четырьмя активными
  workers и возвращает typed `503 worker_capacity` только для валидного нового
  запроса; malformed/replay semantics остаются deterministic. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G6/follow-up-2026-08-29.md`.

Актуальный target head: `ef87ffc`, `origin/main == ef87ffc`; immutable RC
`rc-2026.08.29.1 → 476aa01` намеренно не перемещён. Следующими остаются
reviewer-led promotion/supersession decisions, isolated runtime supervisor и
multi-language conformance, а также G7/G8/G10/G11/G12 production gates.

### Execution update — evaluator conformance и trust-zone network — 29 августа 2026

После этого batch target продолжил закрывать только проверяемые trust-boundary
дефекты:

- `00eb171` стабилизирует desktop runtime workbench: content-sized grid tracks,
  предсказуемая высота editor и отдельный bounded evidence scroll; browser smoke
  защищает layout contract.
- `ed472dc` добавляет G6 evidence-документ с точными командами и ограничениями.
- `a568e35` выносит hidden evaluator в отдельный Go image/service без host-порта
  и с sealed bearer-authenticated handoff; evaluator больше не находится в
  learner runtime image.
- `8067011` выравнивает строгий evaluator response contract по release
  digests/check IDs/trailing JSON, а `9c8dd65` ограничивает body до 128 KiB до
  декодирования; malformed/oversized/drift vectors fail-closed.
- `f25f44d` добавляет outage/recovery regression: reservation освобождается
  после evaluator failure, следующий submit проходит и не оставляет active key.
- `86c0dff` делает StackSession expected services производным от Compose,
  включая `task-evaluator`, вместо устаревшего hardcoded списка.
- `a0c08a3` исправляет реальный live contract regression: evaluator принимал
  `RunResponse` только после добавления `durationMs`; HTTP conformance test и
  Docker Submit теперь возвращают `200/pass/accepted=true`.
- `1996931` добавляет internal `runtime-evaluator` network: evaluator виден
  только runtime-control, API DNS probe изолирован, network `Internal=true`.
- `ca19e40` и `c55aa4c` фиксируют G7 contract/network evidence, checksums и
  known limitations; target `main` fast-forward запушен.

Фактический target head: `c55aa4c`, `origin/main == c55aa4c`; immutable RC
`rc-2026.08.29.1 → 476aa01` не перемещён. Canonical `pnpm run dev --
--detached` возвращает `ready`; scoped Compose поднимает six declared services
(пять long-lived + `api-data-init`) healthy. Browser route/link crawl проверил
12 ключевых routes и 30 внутренних href без failed entries; Node Run → Submit
после network isolation дал `passed`, authoritative hidden verdict и пять
checks на повторных запусках.

Это не закрывает production claim: G5 content promotion, G6 real isolated
supervisor/worker lifecycle, G7 secret-manager/rotation, artifact-wide canary и
backup/restore, G8 durable outbox/mastery/project/observability, G9 connected
model/human gates, G11 curriculum corpus и G12 independent review остаются
явно открытыми и не получают галочек от этого evidence.

### Execution update — unseen-transfer event authority — 29 августа 2026

Следующая G8-005 волна закрыла API-side gap между server-issued issuer и
append-only progress ledger:

- `50e4a5a` усиливает `progress-event.v1`: unseen transfer обязан содержать
  точные `track/module/lesson/question` placement и UUID idempotency key;
  `ProgressService.append()` повторно вычисляет released variant/context через
  тот же server-owned issuer и отклоняет forged identity до persistence.
- Тесты покрывают exact retry, новый ключ с новым server-issued вариантом,
  изменение placement identity и forged opaque IDs; ledger после отклонения
  остаётся пустым.
- `49e435a` фиксирует G8 evidence, checksums и known limitations. В target
  `docs/verification/greenfield/G8/` сохранены точные команды и граница:
  prompt-specific unseen suites для всех языков и человеческие/load/PG drills
  ещё не считаются закрытыми.

Target `main` и `origin/main` теперь указывают на `49e435a`; immutable RC tag
`rc-2026.08.29.1 → 476aa01` намеренно не перемещён. Проверены API **32/32**,
progress **4/4**, contracts/domain builds и G8 checksums.

### Execution update — verdict/request authority binding — 29 августа 2026

G7 hardening продолжена отдельным atomic batch:

- `3201481` проверяет на API boundary, что decoded runtime verdict относится к
  тому же task family/revision/attempt/source/runtime profile и pinned
  image/rubric digests, что и submit request. Несовпадение fail-closed до
  записи evidence, включая idempotent replay.
- Strict `runtime.submit.v1` request дополнительно отклоняет client-owned
  `accepted/status/verdictId/evidenceId/masteryChanged/unlockChanged` и
  произвольный `llmDecision`; добавлены adversarial tests для forged fields и
  well-shaped verdict из другой attempt.
- `90b50e6` обновляет G7 gate evidence/checksums и явно оставляет live browser
  authority-forgery journey и artifact-wide canary открытыми.

Target `origin/main == 90b50e6`; immutable RC tag не перемещён. API **34/34**
и typecheck проходят.

### Execution update — attempt observability bundle — 29 августа 2026

G8 observability surface получила ещё один server-owned слой:

- `136ed7e` добавляет Nest `GET /api/observability/evidence/bundle` и Next
  proxy. Bundle читает полный evidence authority, а не bounded `recent()`;
  фильтрует profile/scenario/attempt, требует released scenario и
  trace+log+metric на одном trace ID, сортирует refs и отдаёт только SHA-256
  payload hashes.
- Missing/cross-trace telemetry закрывается fail-closed; envelope всегда
  имеет `deterministicAssessmentUnaffected: true` и не содержит raw summary,
  logs, prompts или operator fields. Web boundary не получает прямого доступа
  к runtime/DB.
- `e728a41` обновляет G8 gate/checksums/limitations и сохраняет доказательства
  API **36/36** и Web **20/20**.

Target `origin/main == e728a41`; immutable RC tag не перемещён. Это закрывает
server-side correlation surface, но OTLP collector/export, outage/cardinality
drill и human incident walkthrough остаются promotion scope.

### Execution update — exact backup/restore and cache boundary — 29 августа 2026

G8-024 теперь закрыт для локального single-host recovery scope отдельным
commit-gated drill:

- `ae8026b` добавляет к `data:restore` обязательную application restart boundary
  после успешной integrity-проверки. Перезапускаются `api`, `runtime-control`,
  `task-evaluator` и `web`; затем Compose должен вернуть readiness для всех
  сервисов, иначе операция завершается с ошибкой.
- `4967f1b` фиксирует evidence в
  `fluent-interview-platform/docs/verification/greenfield/G8/backup-restore-full-chain-2026-08-29.md`.
  На disposable project `fluent-g8-restore` backup manifest проверил SHA-256
  PostgreSQL/ledger/artifact inputs, restore удалил post-backup submit,
  progress, project и observability sentinels и вернул baseline line counts.
- Adversarial same-key probe отправил изменённый source payload после restore:
  вместо stale `409 idempotency_conflict` получен свежий `200/pass` с новым
  verdict digest. Это доказывает очистку in-memory caches, а не только файлов.

Target `origin/main == 4967f1b`; immutable RC tag `rc-2026.08.29.1 → 476aa01`
не перемещён. Зашифрованное off-host хранение, key rotation, retention policy,
multi-host DR и human sign-off остаются отдельными promotion gates.

### Execution update — production artifact-wide canary — 29 августа 2026

Следующий узкий G7 batch закрыл canary gap только в пределах явно объявленного
локального production artifact set:

- `fb7e589` добавляет manifest `G7/artifact-canary-manifest.json` с четырьмя
  корнями: Next standalone/static, API dist и local projections. Сканер
  ограничен 10 000 файлами и 128 MiB на файл, не следует symlink-ам и ищет
  конкретные private evaluator/runtime маркеры без generic `/output` false
  positive.
- `c6f8385` фиксирует G7 evidence, gate target/checksums и CI policy. После
  production build проверено **1 832 файла, 0 findings**; security **5/5**,
  CI policy **1/1**, build и evidence envelope PASS.

В target `origin/main == c6f8385`; immutable RC tag `rc-2026.08.29.1 → 476aa01`
не перемещён. Это закрывает `G7-007` для declared artifact roots и оставляет
`G7-008/G7-021/G7-024` (live browser authority/leak journey), secret-manager,
cross-service ledger и human promotion gates открытыми.

Следом закрыта доступная UI-часть G6 без расширения runtime claim:

- `cc72957` добавляет focus handoff в `Runtime evidence` после Run/Submit и
  после error/cancel, `aria-live`/`aria-busy`, явный accessible name, retry
  action и submit progress status.
- `cf3cf1e` фиксирует G6 evidence/checksums. Web typecheck/lint, smoke **20/20**
  и format PASS; G6-018/G6-021/G6-023 отмечены закрытыми для текущего
  controlled workbench.

Target `origin/main == cf3cf1e`; immutable RC tag не перемещён. CodeMirror/xterm
lazy-loading, реальный TypeScript revision, per-attempt Docker supervisor и
OS-level network namespace остаются честно открытыми.

После browser smoke следующий небольшой G6 hardening batch:

- `7f5bf32` добавляет один reduced-motion-safe spinner для Submit и очищает
  старый verdict до нового запроса, чтобы pending state не показывал устаревший
  результат.
- `3b52100` обновляет G6 evidence/checksums; Web typecheck, smoke **20/20** и
  production build PASS. Это уточнение доступной UI-части G6-021/G6-023, не
  закрытие deferred supervisor/TypeScript/OS-network пунктов.

Target `origin/main == 3b52100`; immutable RC tag не перемещён.

### Execution update — live Submit authority journey — 29 августа 2026

G7-008 и G7-024 закрыты для browser-facing public boundary отдельным
non-persisting journey:

- `eba5dce` добавляет `pnpm security:authority`. На живом Next stack семь
  learner-owned полей (`accepted`, `status`, `verdictId`, `evidenceId`,
  `masteryChanged`, `unlockChanged`, `llmDecision`) получают `400`, release
  digest drift получает `400`, тело больше 256 KiB — `413`; валидный Submit и
  evidence ledger в этом journey не запускаются.
- `fa051bd` фиксирует G7 evidence/checksums. Browser smoke отдельно выполнил
  released starter через UI (`Run` → `Prediction matched`, `Submit` →
  `Authoritative assessment passed`); contract/security suites PASS.
- Это закрывает строгую public request/verdict boundary, но не заменяет
  independent browser-extension review или connected-provider quality.

Target `origin/main == fa051bd`; immutable RC tag не перемещён.

### Execution update — Navigator prompt/tool surface regression — 29 августа 2026

G9-018 закрыт отдельным deterministic regression gate после изменения
Navigator surface:

- `64a0141` вычисляет стабильный `surfaceHash` для явного allowlist из
  `apps/api/src/navigator.service.ts`, `packages/contracts/src/navigator.ts` и
  `content/navigator/eval-corpus.v1.json`; baseline теперь отклоняет prompt/tool
  drift до connected-provider review.
- `9d99b16` записывает G9 evidence, checksums и limitation boundary. Команда
  `pnpm navigator:eval` прошла **6/6** cases (`en=3`, `ru=3`), corpus release и
  surface hash совпали с baseline; `pnpm test:navigator` — **6/6**.
- Gate остаётся `PASS_WITH_LIMITATIONS`: surface contract не утверждает prose
  quality, real LM Studio availability, streaming/cancel или human sign-off.

Target `origin/main == 9d99b16`; immutable RC tag `rc-2026.08.29.1 → 476aa01`
не перемещён. Следующие G9 promotion gates — connected-model/offline UX,
authority/leakage evals и durable PostgreSQL conversation projection.

### Execution update — G6 control/worker boundary и G8 live bundle — 29 августа 2026

Следующий implementation batch закрыл две узкие, проверяемые границы:

- `1b6fa9b` отделяет control API runtime от `WorkerSupervisor`; текущий
  `ProcessWorkerSupervisor` сохраняет Node policy, а будущий Docker/namespace
  backend подключается через интерфейс. Go delegation test передаёт ровно
  провалидированный request.
- `8510ce3` фиксирует G6 evidence/checksums и отмечает `G6-002` закрытым только
  для структурного разделения. Per-attempt Docker labels/TTL и OS network
  namespace остаются открытыми.
- `a6df0e8` добавляет opt-in `pnpm observability:live`: released catalog,
  четыре synthetic evidence facet, idempotent replay и metadata-only bundle
  через публичную Next boundary.
- `eeab2ef` фиксирует G8 live-bundle evidence/checksums; target `main` и
  `origin/main` указывают на `eeab2ef`.

Эта волна не меняет production claim: corpus promotion, multi-language runtime,
OTLP/load/human observability drills и G8/G11/G12 final gates остаются явно
открытыми.

### Execution update — G9 deterministic response guard — 29 августа 2026

Следующий G9 implementation batch закрывает authority/leakage boundary до
persistence:

- `8a00a99` добавляет `guardNavigatorResponse` в Nest service. Affirmative
  claims о mastery/progress/evidence/verdict/release и disclosure
  hidden/private/secret material превращаются в typed policy error; исходный
  provider text не сохраняется в JSONL history.
- `fe66f33` фиксирует G9 evidence, обновляет surface baseline до
  `e76b7902…a20a3efe` и добавляет EN/RU adversarial tests. API suite — **38/38**,
  `pnpm navigator:eval` — **6/6**.

`G9-022` закрыт только в deterministic provider-output scope. Connected
LM Studio prompt-injection red-team, prose quality/human review, streaming и
PostgreSQL conversation projection остаются promotion gates.

Target `origin/main == fe66f33`; immutable RC tag `rc-2026.08.29.1 → 476aa01`
не перемещён.

### Execution update — G9 no-model/offline/timeout UX — 29 августа 2026

`582b383` добавляет явное browser state machine поведение Navigator:

- no-model остаётся `unavailable` с Settings link;
- browser offline останавливает turn preflight до `fetch`, показывает
  локализованный alert и Retry, а `online` event возвращает panel в `idle`;
- server/client timeout и learner cancellation различаются от provider error;
- `sending` показывает spinner и честное non-streaming сообщение, без имитации
  token streaming; `data-navigator-state` позволяет e2e проверять семантику.

`0bd417a` фиксирует evidence/checksums: web smoke **20/20**, TypeScript/ESLint
PASS, live `/practice/node-event-loop-001` подтвердил no-model и forced offline
без сетевого запроса, с Retry/alert и online recovery. `G9-005` и `G9-023`
закрыты в deterministic/browser scope; физический network outage, connected
LM Studio streaming/backpressure и human screen-reader review остаются G12
promotion gates.

Target `origin/main == 0bd417a`; immutable RC tag `rc-2026.08.29.1 → 476aa01`
не перемещён.

### Execution update — G10 bounded review/projection recovery — 29 августа 2026

Следующая проверка G10 повторно прогнала только воспроизводимые локальные
границы и не выдала их за внешний production ingestion:

- `4b48590` фиксирует bounded reviewer batch (pending/quarantined, limit 1–100,
  deterministic sample, metadata-only, auto-promotion=false), JsonlOutbox
  idempotency/reconcile, public-only search projection, Studio/release/progress
  projection rebuild и allowlisted backup/restore.
- `pnpm test:studio` — **5/5**, `pnpm test:content` — **30/30**,
  `pnpm test:projections` — **2/2**, `pnpm test:stack` — **12/12**;
  `pnpm evidence:validate` — **12/12 gate envelopes**.
- G10 evidence и checksums находятся в
  `fluent-interview-platform/docs/verification/greenfield/G10/`; target
  `origin/main == 4b48590`.

Таким образом, `G10-015..019` и `G10-023..024` закрыты для локального
JSONL + PostgreSQL projection/rebuild scope. Paid-portal licensing/import,
PostgreSQL ownership authority, managed outbox consumer, Kafka/Redis benchmark
и внешний load/rollback остаются promotion gates; статус G10 сохраняется
`PASS_WITH_LIMITATIONS`, а RC tag не перемещён.

### Execution update — G6 reusable runtime learning components — 29 августа 2026

`d32ba2f` выделяет из `RuntimeWorkbench` три typed reusable surface:
`RuntimeEditor`, `RuntimeActionBar` и `RuntimeEvidencePanel`. Orchestration,
API boundary, cancellation и authority остаются в одном owner; labels,
`aria-live`, focus handoff, Run/Submit distinction и retry/cancel states
сохранены без копирования разметки для будущих runtime profiles.

`9d10e96` фиксирует G6 evidence/checksums. Повторены web typecheck/lint/build и
smoke **20/20**, checksum verification и `git diff --check` — PASS. Это закрывает
`G6-017` как reusable React surface; CodeMirror/xterm, настоящая TypeScript
revision и OS-level worker network namespace остаются отдельными promotion
пунктами (`G6-020`, `G6-022`, `G6-004/006/007`). Target `origin/main == 9d10e96`.

### Execution update — G8 incident activity packs — 29 августа 2026

Target `main` публикует `4f30da1` с contract-validated activity packs для всех
шести observability-сценариев: каждый сценарий имеет ровно шесть learner-facing
activities в порядке `Predict → Run → Observe → Explain → Defend → Repeat`.
Итого опубликовано **6 × 6 = 36** стабильных activities с objective и
allowlisted evidence facets. Practice UI раскрывает packs через native
`details/summary`, а responsive grid не создаёт horizontal overflow в live
browser smoke. `pnpm test:observability` — **5/5**, web smoke — **23/23**,
typecheck/lint и checksum ledger — PASS.

Это закрывает структурную/content часть `G8-017`, но не подменяет runtime:
Node event-loop остаётся единственным `released` сценарием, а DB lock, retry
storm, cache stampede, queue replay и GC/memory pressure остаются явным
`preview` до выпуска профилей runtime, trace/log/metric generator и evaluator.
Поэтому `G8-015`, `G8-018`, `G8-023` и `G8-026` не получают ложных галочек;
реализационный target commit — `4f30da1`, текущий `origin/main == 4e780e8`
(код плюс evidence/index commits), а документация target зафиксирована
отдельными `7e358ca` и `4e780e8`.

### Execution update — G8 released Node deep lab — 30 августа 2026

`21ce0bc` добавляет learner-facing `DeepObservabilityLab` для единственного
released сценария `node-event-loop-trace`. UI последовательно открывает
`Predict → Run → Observe → Explain → Defend → Repeat`, записывает по одной
bounded evidence note через `/api/observability/evidence`, декодирует ответ
`{ evidence, deterministicAssessmentUnaffected }` тем же Zod-контрактом и
разрешает следующий этап только после принятия текущего. `Run` ведёт в
существующий controlled Node station; mastery/unlock/evaluator boundary не
затрагивается. Web typecheck/smoke **45/45**, lint, build, `test:observability`,
live `observability:live` и direct 201 proxy write — PASS. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G8/deep-lab-journey-2026-08-30.md`.

Это закрывает `G8-015` для released Node slice. Preview incident runtimes,
cross-language profiles, OTLP/load/outage drills и human walkthrough остаются
в promotion scope; `G8-026` по-прежнему не переводится в PASS.

### Execution update — G6 editor budget boundary — 30 августа 2026

`10e7078` фиксирует проверенный редакторный boundary: текущий workbench
использует source-owned textarea, а тяжелые `xterm`/Monaco/CodeMirror пакеты не
установлены. Поэтому lazy-loading для отсутствующего пакета является N/A, но
route budget остаётся обязательным guard. `pnpm performance:check` прошёл:
`/practice/[slug]` 946084 B < 1000000, largest chunk 413669 B < 450000,
total chunks 1120108 B < 1200000, forbidden packages = 0. Если тяжёлый
редактор будет добавлен, G6-022 автоматически переоткрывается для chunk split,
interaction latency и Web Vitals evidence. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G6/editor-budget-2026-08-30.md`.

### Execution update — G7 Submit adversarial matrix — 30 августа 2026

`fb0267d` добавляет bounded `pnpm runtime:submit-matrix` на публичной Next
границе, а `d3a8864` фиксирует live output и checksums. Матрица покрывает
malformed payload, learner-owned verdict fields, release-digest drift,
oversized body, exact idempotent replay, changed-payload conflict и четыре
конкурентных запроса с одним idempotency key. Live result: все 7 cases PASS;
конкурентные запросы получили `200/200/200/200`, `uniqueVerdicts=1` и
`uniqueEvidence=1`; mastery/unlock не изменились. Это закрывает `G7-022` в
текущем released Node/public-Next scope. G7-021 остаётся отдельной canary
проверкой, а G7-023 закрывается только после отдельной backup/rebuild матрицы
ниже; `G7-026` по-прежнему честно остаётся `PASS_WITH_LIMITATIONS`.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G7/submit-matrix-2026-08-30.md`.

### Execution update — G7 production artifact canary — 30 августа 2026

После Submit matrix повторены production build и bounded canary scan на всех
четырёх объявленных roots (`apps/web/.next/standalone`, `.next/static`,
`apps/api/dist`, `var/projections`). `0b53ddc` фиксирует metadata-only result:
`PASS`, 1 889 файлов, 0 findings, 0 symlink escapes, limits 10 000 files и
128 MiB/file. Это закрывает `G7-021` для текущего declared local artifact
surface; внешние logs/volumes и будущие roots требуют отдельной записи в
manifest. Полная локальная event-ledger/backup matrix для G7-023 теперь
зафиксирована ниже; G7-026 остаётся открытым из-за остальных promotion gates.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G7/artifact-wide-canary-2026-08-30.md`.

### Execution update — G7 canonical backup/restore matrix — 30 августа 2026

Target `943d6b8` централизует allowlist в `tools/stack/stack-core.mjs`,
добавляет `validateLedgerArchiveMatrix()` и metadata-only команду
`pnpm stack:backup-matrix`. Она требует канонический набор из 14 durable
ledger names, проверяет canonical order, duplicate/unknown entries,
archive/manifest equality и hashes PostgreSQL/tar/artifact manifest; пустые
ledgers отражаются как явные `absentEntries`.

Свежий backup `var/backups/2026-08-30T11-32-05-415Z` прошёл matrix `PASS`
(7 present, 7 explicit absent), integrity-only restore `valid=true`, а затем
полный destructive rehearsal в scoped `fluent-restore-20260830` на порту
`47461` (restore/restart/readiness `0`). Readback после восстановления дал 9
submission evidence records, 1 learning assessment и 8 progress/mastery rows;
projection rebuild из извлечённых authority ledgers дал 10 артефактов и
детерминированный state hash
`64a7ef262af34ad3de0a073766d60eca786dcf75dfaac14a7f7361caf91dc30b`.
Disposable resources удалены scoped-командой (`containers=0`, `volumes=0`,
`networks=0`). Это закрывает `G7-023` для локальной single-project chain;
managed object storage, secret manager, multi-tenant locking и disaster
recovery остаются promotion work.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G7/backup-matrix-2026-08-30.md`.

### Execution update — G10 research provenance boundary — 30 августа 2026

Target `62e3c11` добавляет versioned `content/research/policy.v1.json` и
оригинальный brief set для Node event-loop, PostgreSQL isolation и NestJS
interceptor boundaries. `pnpm research:validate` проверяет HTTPS references,
`originalBy`, запрет close paraphrase/source excerpts и обязательные license/
rights metadata для paid-portal observation. Три brief прошли позитивную
проверку, а adversarial fixtures с copied content, missing license и неполным
original artifact были отклонены. Target evidence `9609139` добавляет
machine-readable output, commands и checksums.

Это закрывает policy slices `G10-009` и `G10-012`; legal approval конкретных
источников, Brain/Vault/portal batch importer и reviewer-gated promotion всё ещё
остаются отдельными открытыми пунктами.

### Execution update — G6 runtime profile availability guard — 30 августа 2026

Target `72cc77c` выносит совместимость профилей в общий
`releasedProfilesForTask()` из `@fluent/contracts`; UI больше не дублирует
язык/revision literals. На текущем release доступен только реальный
`javascript@revision-1/node-26-commonjs`. TypeScript не показывается, пока в
том же `runtime/info` нет released `typescript@revision-2`; TS-only и wrong
revision payloads fail closed. Три contract cases и web smoke 45/45 PASS,
evidence/checksums зафиксированы в `4cacf9c`.

Это закрывает guard часть `G6-020`. Реальный TS executor/evaluator, hidden
suite и conformance остаются отдельной будущей runtime revision и не выдаются
за существующие.

### Execution update — G9 PostgreSQL navigator history projection — 29 августа 2026

Следующий deterministic batch довёл durable history до локального PostgreSQL
контура, не меняя advisory-only authority Navigator:

- `ca61d10` добавляет `NavigatorTurnStorePort`, PostgreSQL adapter с
  versioned migration `0003_navigator_history_projection.sql`, partial unique
  idempotency key, profile/recent indexes и явный JSONL fallback. Compose по
  умолчанию использует PostgreSQL, а выбор backend остаётся конфигурируемым.
- `223f01d` фиксирует G9 evidence/checksums. API suite — **47/47**, web/stack
  checks и production build — PASS. Live scoped Compose подтвердил создание
  `navigator_turns`, сохранение turn и replay с тем же `turnId` без утечки
  внутреннего `message`; повторный ключ оставляет ровно одну строку.
- Во время live-проверки исправлен regression strict Next boundary: replay
  теперь декодируется как публичный `navigator-turn.v1`, а внутренний learner
  message не возвращается клиенту.

Это закрывает deterministic durable-history projection в локальном backup/restore
scope. Retention compaction/deletion, cross-device sync, connected-provider
streaming/backpressure и semantic/human review по-прежнему не закрыты; G9
остаётся `PASS_WITH_LIMITATIONS`, G9-025 не получает ложную галочку.
Текущий target `origin/main == 223f01d`; immutable RC tag не перемещён.

### Execution update — G10 outbox benchmark decision — 29 августа 2026

Target `main` публикует `d36ae64` с bounded benchmark-командой и `caa61b3` с
machine-readable результатом, checksums и ADR `G10-020`. Два disposable
Compose-проекта прогнали по пять warm-up и 50 последовательных synthetic
`POST /api/studio/candidates` через public Next boundary. PostgreSQL оказался
быстрее JSONL в этом локальном срезе (`p95=48.671 ms` против `80.009 ms`), обе
проекции дали 176/176 уникальных metadata events и были удалены scoped cleanup.
Локальный Compose поэтому остаётся PostgreSQL-first, JSONL — explicit fallback;
Redis/Kafka не добавлены без доказанной потребности. Порог пересмотра (200
команд, `p95 > 100 ms`, backlog > 10 000 или multi-host partition ownership)
зафиксирован в ADR. Это не concurrency/load/partition proof и не повышает G10
статус выше `PASS_WITH_LIMITATIONS`.

### Execution update — G12 post-RC security boundary — 29 августа 2026

После выравнивания assessment-файлов с Prettier (`18ae0d1`) target повторил
production build и security boundary на `main`. `c431bc3` добавляет
machine-readable G12 evidence: declared canary scan обработал 2 файла, а
artifact-wide scan — 1 879 файлов; оба дали **0 findings**. `pnpm
security:authority` отклонил семь learner-owned verdict fields с `400`,
release-digest drift с `400` и oversized body с `413`, не записав evidence.
`305a446` синхронизирует target index с этим срезом.

Это закрывает только машинный hidden-canary slice `G12-017` для текущего
target и не перемещает immutable `rc-2026.08.29.1`. CodeQL, SBOM/provenance/
signature, полная threat-model проверка, CI на exact RC SHA, visual/a11y и
owner/human learning sign-off остаются обязательными открытыми gates.

### Execution update — G12 supply-chain guard — 29 августа 2026

Target `main` добавил `77c6b26` с fail-closed командой
`pnpm security:supply-chain`, которая собирает CycloneDX-compatible
production inventory из frozen pnpm graph, проверяет immutable action pins и
запрещённый `pull_request_target`, затем запускает `pnpm audit --prod
--audit-level high`. На срезе `0266138` inventory содержит 175 компонентов,
11 workflow actions pinned на SHA, high/critical advisories равны нулю.
`64ea491` синхронизирует gate index, а G12 evidence хранит только
counts/hashes.

Это закрывает machine-only dependency/lockfile/action-pin slice G12-019, но
не весь пункт: CodeQL, registry provenance, image signatures и независимый
review по-прежнему обязательны и не помечены production PASS.

### Execution update — G12 performance budget — 29 августа 2026

Target `main` добавил `5a4f73e` с версионированным `performance:check`,
который запускается после production build в CI и fail-closed проверяет route
first-load, largest/total chunks и запрещённые тяжёлые editor packages.
Evidence `9291c48` зафиксировал 13 routes: максимум first-load `910,958`
bytes при budget `1,000,000`, largest chunk `413,245` при `450,000`, total
chunks `1,045,641` при `1,200,000`; heavy editor packages не найдены.

Это закрывает только machine bundle-budget slice G12-020. Web Vitals,
interaction latency, code-splitting/lazy-loading UX, visual diff и
accessibility human review остаются открытыми.

### Execution update — G12 performance budget recheck — 30 августа 2026

На текущем target `main` (`4ac695d`) повторены `pnpm build` и
`pnpm performance:check`. Проверены 13 Next routes: максимум first-load
`946,447` bytes при budget `1,000,000`, largest chunk `414,120` при `450,000`,
total chunks `1,120,471` при `1,200,000`; failures отсутствуют. В lockfile нет
`xterm`, `monaco-editor` или `codemirror`, а runtime editor остаётся bounded
textarea, поэтому heavy-editor lazy-loading guard закрывается отсутствием
тяжёлой зависимости. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/performance-budget-2026-08-30.json`.

Это закрывает измеримый bundle/editor-policy slice `G12-020` для released Node
profile. Web Vitals, interaction latency, code-splitting UX, visual diff и
accessibility human review по-прежнему требуют отдельных доказательств.

### Execution update — G12 observability lifecycle — 30 августа 2026

В disposable Compose project `fluent-g12-observability-20260830b` проверены
collector off/on/outage/recovery и incident capture на target `c57f211`.
Пользовательский core без `otel` сохранил home/trace-probe `200`; opt-in
`observability` profile поднял collector и шесть долгоживущих сервисов в
healthy-состоянии, OTEL `/api/health` вернул `200`. После остановки collector
trace-probe остался `200`, запрос к collector fail-closed, а после start health
восстановился максимум за 2 секунды. `incident:capture` создал redacted
bundle с 7 service records и без forbidden fields; scoped `pnpm down` оставил
0 containers/networks и сохранил 3 durable volumes. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/observability-lifecycle-2026-08-30.json`.

Это закрывает machine-only lifecycle slice `G12-012`. OTLP delivery,
cardinality/load/disk-pressure, scheduled retention/DSAR и independent privacy
review остаются отдельными promotion gates.

### Execution update — G12 generated API contract matrix — 30 августа 2026

Target `main` (`ae2d779`) добавил воспроизводимый
`tools/api/contract-matrix.mjs`. Скрипт внутри API-контейнера извлекает
контроллеры Nest, строит ожидаемый route inventory (40 handlers), выполняет
direct readback для всех доступных GET-поверхностей и динамических join-ов
(question card, observability bundle, project filter, Studio readback),
декодирует успешные projections через `@fluent/contracts`, а для mutation и
parameter error branches проверяет fail-closed Nest error envelope. Результат:
`43/43` cases passed, `failures=[]`, `uncoveredRoutes=[]`, manifest SHA
`5c74393806688dd52fd09ea6a81e3d16efe14d8588acc2ebcb65fe05203d579b`.
Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/api-contract-matrix-2026-08-30.{json,md}`.

Это закрывает только machine API-contract slice `G12-007`. Positive mutation
journeys остаются покрытыми отдельными G6–G10 evidence; route crawl, visual,
security, language/runtime, content reconciliation и independent human review
по-прежнему не объявляются закрытыми.

### Execution update — G12 safe interactive route crawl — 30 августа 2026

На target `main` (`048891b`) новый изолированный Playwright page прошёл 23
curated routes (Node/Java/Go, RU/EN, settings/deep links и not-found) и 55
уникальных same-origin link destinations. Все routes/links получили ожидаемый
status и H1: `23/23` и `55/55`. Обработаны 336 видимых enabled navigation,
filter, graph, settings и transient-surface controls; action/page/console/
request failures равны нулю. Шесть disabled deep-lab stage controls записаны
как ожидаемые prerequisite gates. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/interactive-crawl-2026-08-30.{json,md}`.

Это закрывает safe navigation/action subset `G12-005`. Stateful controls
(`Run`, `Submit`, `Reset`, `Save`, `Delete`, `Record`, `Navigator ask`) намеренно
остаются за отдельным `G12-009`/G9 evidence; visual diff, accessibility и
independent review не подменяются этим crawl.

### Execution update — G12 RU/EN × theme × desktop viewport matrix — 30 августа 2026

На target `main` (`0ea1f47` code, evidence commit `c04ad77`) новый изолированный
Playwright page прошёл 552 случая: 23 curated routes × RU/EN × `light`, `dark`
и `system` (system отдельно при эмулированной светлой и тёмной OS-схеме) ×
1280×800, 1728×1117 и 2560×1440. Проверены HTTP status, `html[lang]`,
`html[data-theme]`, наличие `h1`, горизонтальный overflow и шесть Tab-фокусов.
Все случаи PASS; page/console/request errors равны нулю.

Первый прогон обнаружил реальный React hydration error `#418` на RU lesson с
inline Navigator: компонент читал `document.lang` во время первого render после
того, как bootstrap уже применил RU. `0ea1f47` сделал первый render
детерминированным, синхронизировал локаль после mount и добавил событие
`fluent:locale-change`; повторная полная матрица стала чистой. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/locale-theme-viewport-2026-08-30.{json,md}`.

Это закрывает machine route/locale/theme/viewport/keyboard slice `G12-006`.
Pixel visual diff, WCAG/screen-reader human review, connected LM Studio и
stateful mutation journeys остаются отдельными открытыми gates.

### Execution update — G12 content/release reconciliation — 30 августа 2026

Target `main` evidence commit `45b7b04` повторил content validators,
release-pointer check и canonical question-release build. Question release
`2026.08.28-questions.1` валиден (6 cards, 10 placements, 7 assessed
activities, RU/EN); curriculum `2026.08.28-curriculum.1` валиден (3 tracks,
10 modules, 20 lessons). Route manifest содержит 43 routes, `unresolved=0`;
placement и path-relevance joins не имеют issues/failures. Два последовательных
canonical builds дали одинаковый logical hash `241a5434…ad39`, а все проверенные
projections сохранили этот source hash и собственные стабильные state hashes.
Active release pointer указывает на единственный доступный question release;
authored candidates и history отсутствуют. Полный machine-readable отчёт:
`fluent-interview-platform/docs/verification/greenfield/G12/content-release-reconciliation-2026-08-30.{json,md}`.

Это закрывает только integrity/count/hash slice `G12-008`; 20 lessons, 70 role
requirements и остальные content-completeness цели G11 по-прежнему требуют
авторинга и не объявляются production-ready.

### Execution update — G12 clean-clone CI remediation and remote runs — 29 августа 2026

На remote runner был обнаружен воспроизводимый clean-clone дефект: workflow
вызывал `content:validate` до сборки `@fluent/contracts`, поэтому локальный
кэш скрывал отсутствующий `packages/contracts/dist/index.js`. Коммит
`190959f` сделал root `content:validate` self-sufficient: он сначала собирает
contracts, затем запускает валидаторы. Regression guard в
`tools/dev/test/ci-policy.test.mjs` фиксирует этот порядок.

После исправления на текущем `main`
(`190959f8174e2ae52130ce7f3ba3dfd28172fa38`) завершились зелёными реальные
remote workflow runs: `Fluent Interview Platform CI` run `33246832116`
(`Verify platform` и `Production dependency audit`) и `security-policy` run
`33246833382` (`codeql` и `dependency-review`). Документ и job IDs записаны в
target [G12 CI evidence](../fluent-interview-platform/docs/verification/greenfield/G12/ci-verification-2026-08-29.md),
а `d19d1cc` синхронизирует target index и checksums.

Это подтверждает текущий `main`, но не exact immutable RC SHA
`rc-2026.08.29.1` (`476aa01`). `G12-024` остаётся открытым до проверки
required checks именно на RC; `upload:false`/`continue-on-error` в CodeQL также
не заменяют SBOM/provenance/signature attestation. Curriculum, language
conformance, visual/accessibility и owner/human gates не изменились.

### Execution update — G12 reproducible CycloneDX SBOM — 29 августа 2026

Коммит `6c2399d` расширяет `security:supply-chain`: кроме краткого
machine-readable audit report команда принимает второй output path и
сохраняет полный CycloneDX 1.5 BOM (175 external components, 2 workspace
packages, стабильный serial number). CI теперь генерирует оба файла в runner;
`tools/security/test/supply-chain.test.mjs` и `tools/dev/test/ci-policy.test.mjs`
проверяют формат, serial и контракт workflow. Target evidence добавляет
`supply-chain-sbom-2026-08-29.json` и обновляет checksums.

Это закрывает только воспроизводимую SBOM machine slice внутри G12-019. BOM не
подписан, а registry provenance, image signatures, CodeQL attestation и
independent review остаются обязательными. Exact RC workflow должен быть
перезапущен после этой правки; зелёные результаты для текущего `main` не
перемещают RC tag и не меняют G12 status.

### Execution update — G12 CORS boundary and candidate/main remote verification — 29 августа 2026

Коммиты `8aaf8a5` и `79b29f7` ужесточают Nest CORS: API отражает только
явно перечисленные локальные web origins (`127.0.0.1:47360` и
`localhost:47360`), отклоняет wildcard-конфигурацию и не включает credentials.
Scoped default Compose stack был пересобран на `79b29f7`; live probe подтвердил
allowlist для обоих локальных origins и отсутствие `Access-Control-Allow-Origin`
для `https://evil.example`. Evidence и checksums зафиксированы в target
`G12/cors-policy-2026-08-29.*` и `7df43ce`.

Для проверки clean-clone/quality/security после SBOM и CORS были выполнены
реальные remote workflow на отдельном immutable candidate tag
`rc-2026.08.29.3 → 79b29f7`: verify run `33247719798` и security run
`33247721043` завершились `success`. Те же workflow на текущем `main`
`7df43ce` также завершились `success`: verify `33247943904` и security
`33247944675`. Target evidence обновлено коммитом `2accdbe`; исходный
immutable RC `rc-2026.08.29.1 → 476aa01` не перемещался и не выдаётся за
проверенный.

Это закрывает только machine slices для CORS и remote workflow на candidate и
текущем `main`. Signed attestation/provenance, `G12-024` для исходного RC SHA,
visual/accessibility, content/runtime-language и independent owner review
остаются открытыми.

### Execution update — G12 local security boundary — 30 августа 2026

Target `main` (`8a554de`, gate index `f4c9198`) добавил воспроизводимый
`pnpm security:boundary` и 14/14 unit guards. В отдельном disposable Compose
project статические проверки подтвердили `credentials:false`, явный local
CORS allowlist, bounded JSON bodies, loopback-only Navigator endpoint без
credentials/query/fragment, runtime `index.js` allowlist, отсутствие
application HTML/eval/child-process sinks и hardened read-only containers.

Live journey через Next boundary дал `PASS`: WebMCP-aware browser headers,
семь learner-owned verdict fields `400`, release digest drift `400`, oversized
body `413`, hostile-origin GET/OPTIONS без ACAO/credentials, четыре SSRF
вектора `400`, XSS marker без reflection, runtime/profile path traversal `400`,
command-injection payload `sandbox_refused` с `workerCleanedUp=true`, отсутствие
`Set-Cookie` и scoped cleanup `0 containers / 0 networks`. Report:
`fluent-interview-platform/docs/verification/greenfield/G12/security-boundary-2026-08-30.{json,md}`.

Это закрывает machine security boundary slice `G12-018` с
`PASS_WITH_LIMITATIONS`: продукт намеренно local-single-user и не имеет remote
identity/session provider, поэтому internet-facing authentication,
multi-tenant authorization и third-party penetration test остаются отдельными
promotion gates. Push не выполнялся из-за зафиксированного лимита GitHub
Actions; target `main` содержит коммиты локально.

### Execution update — G12 provenance and signature boundary — 30 августа 2026

Target `main` (`17cef51`, gate index `391ff62`) добавил
`pnpm security:provenance`. Команда выполнила production build, locked
dependency audit (`high=0`, `critical=0`), CycloneDX 1.5 inventory (175
production components), immutable CodeQL workflow-shape/pin check и SLSA-shaped
provenance envelope, связав Git `HEAD`, полный source-tree manifest,
`pnpm-lock.yaml` и SBOM digest. Envelope подписан и проверен Ed25519;
private key не сохраняется, в evidence попадают только public-key/signature
hashes. Unit suite теперь `15/15`.

Это закрывает machine provenance/signature slice `G12-019` с
`PASS_WITH_LIMITATIONS`: ephemeral key доказывает только локальную целостность,
CodeQL authority остаётся pinned remote workflow, а trusted registry/image
signatures и exact immutable-RC attestation требуют внешнего signing identity.
Report:
`fluent-interview-platform/docs/verification/greenfield/G12/provenance-signature-2026-08-30.{json,md}`.

### Execution update — G12 WCAG machine baseline — 30 августа 2026

Target `main` (`d270a9b`) добавил воспроизводимый
`pnpm accessibility:journey` и исправил два найденных семантических дефекта:
skip-link теперь ведёт в `#main-content` на error/loading/404 surfaces, а
Practice использует последовательную иерархию `h1 → h2 → h3`. На отдельном
disposable Compose project проверены те же 23 curated learner routes,
ожидаемый `/not-found = 404`, `739/739` доступно именованных интерактивных
элементов, `0` изображений без `alt`, `0` positive `tabindex`, все landmarks и
`27/27` token contrast checks для light/dark/system. `impeccable` detector и
unit suite (`5/5`) зелёные; cleanup оставил `0` target containers/networks.

Это закрывает repeatable machine baseline `G12-021` с
`PASS_WITH_LIMITATIONS`. Ручной VoiceOver/NVDA smoke, динамический focus
announcement и полный browser/assistive-technology matrix остаются отдельными
owner promotion gates и не выдаются за автоматический sign-off.
Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/accessibility-audit-2026-08-30.{json,md}`.

### Execution update — G12 desktop visual contract — 30 августа 2026

Target `main` (`b7aa5d4`, evidence index `383d882`) добавил воспроизводимый
`pnpm visual:contract`. Playwright открыл 12 learner/operator surfaces на
`1280×800` (MacBook Pro 13), `1728×1117` (MacBook Pro 16) и `2560×1440`
(Apple Studio Display) в light/dark — `72/72` cases. Машинные инварианты
зелёные: page horizontal overflow `0`, clipped visible controls `0`,
unexplained P0/P1 geometry defects `0`, `.app-scroll-region` владеет
вертикальной прокруткой во всех `72` случаях. Шесть доступных D3 reference
captures измерены и классифицированы как `INFORMATIONAL_BASELINE_DELTA`, так
как reference-файлы содержат JPEG-байты с `.png` расширением и сняты в другой
rasterisation/target среде.

Это закрывает machine visual geometry slice `G12-022` со статусом
`PASS_WITH_LIMITATIONS`. Exact pixel-perfect сравнение в одной capture-среде и
human owner visual sign-off намеренно остаются promotion gates; evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/visual-contract-2026-08-30.{json,md}`.

### Execution update — G12 telemetry budget and pressure guard — 30 августа 2026

Target `main` (`85161cf`, evidence index `5cfaf18`) добавил bounded telemetry
contract и `pnpm observability:budget`. Guard проверяет разрешённые поля и
recursive privacy rejection, нормализацию UUID/числовых route segments,
размер события/пакета, cardinality, retention и fail-closed поведение при
disk-pressure. Deterministic corpus: `10 000` safe events, `0` unsafe accepted,
`60/128` dimension tuples, `284/2048 B` max event, `2 700 793/4 194 304 B`
batch, retention `10 100 → 7 575` (purged `2 525`), pressure cap `16 KiB` с
отказом записи после cap; observability suite `8/8` и API typecheck/lint
зелёные.

Это закрывает local machine slice `G12-023` со статусом
`PASS_WITH_LIMITATIONS`. Внешний collector, exporter backpressure,
долгосрочный retention и multi-host disk-failure drills не имитируются и
остаются promotion gates; evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/telemetry-budget-2026-08-30.{json,md}`.

### Execution update — G12 exact RC CI-equivalent rehearsal — 30 августа 2026

Target `main` (`55bc817`, evidence index `ecd346e`) добавил
`pnpm ci:exact-rc`. Immutable `rc-2026.08.29.1` разрешается в ожидаемый SHA
`476aa01b852ffbb9ca91da11e7eb0922dd7f6f95`; workflow на самом теге проверен
на frozen install/full check ladder и immutable action pin. Clean archive
установился с `pnpm install --offline --frozen-lockfile`, полный `pnpm check`
(lint/typecheck/tests/build) прошёл, target checkout не изменялся.

Это даёт local CI-equivalent evidence `PASS_WITH_LIMITATIONS`, но не закрывает
remote часть `G12-024`: GitHub Actions для исходного immutable RC не
диспетчеризовался из-за Actions quota `90%`. После сброса квоты нужно выполнить
workflow dispatch на `rc-2026.08.29.1` и сохранить run/job IDs. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/exact-rc-ci-2026-08-30.{json,md}`.

### Execution update — G12 Port Ledger state coverage — 30 августа 2026

Target `main` (`dc7d157`, evidence index `6454f95`) добавил
`pnpm design:port-ledger`. Он сопоставляет D0 `port-ledger.design.json` с
G12-022 visual contract и fail-closed проверяет owners/routes/disposition и
каждое critical state. Все `12/12` screen entries структурно валидны и имеют
geometry evidence, но D0 объявляет `71` critical state, а explicit
state-specific evidence пока `0/71`; текущие `12` dispositions всё ещё
`partial|open`, всего `83` unresolved disposition/state items.

Это не ошибка проверки и не повод ставить `adapted` автоматически: route или
общий screenshot не закрывает, например, `atlas:zoomed`,
`practice-workbench:runner-down` или `settings:model-unavailable`. G12-025
остаётся открытым до state fixtures/evidence и disposition
`ported|adapted|dropped(reason)` по каждому случаю. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/port-ledger-audit-2026-08-30.{json,md}`.

### Execution update — G12 state evidence registry — 30 августа 2026

Target `main` (`4811050`, evidence `a5cdf89`) добавил `pnpm design:state-evidence` и durable
`G12/state-evidence/index.json`. Реестр разворачивает все `71` D0 critical
state в стабильные fixture IDs и требует для каждого независимые
`interaction`, `visual` и `semantic` artifacts с SHA-256 под одним
evidence-root. Structural audit проходит (`0` failures), но promotion
остаётся fail-closed: `0/71` state entries, `0/12` promotable dispositions и
`83` unresolved items. Это закрывает подготовительный implementation slice
G12-025, но сам checkbox G12-025 остаётся `[ ]` до фактических captures и
owner disposition. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence-registry-2026-08-30.{json,md}`.

### Execution update — G12 release graph reconciliation — 30 августа 2026

Target `main` (`90f1a92`, evidence index `3ee3108`) добавил
`pnpm reconciliation:release` и негативные fixture-тесты. Проверка связывает
question/curriculum/activity/graph/project/observability authorities с
projections, проверяет exact revision targets, release pointer и rebuilt
progress projection. На seed-релизе `6` cards, `10` placements, `7` assessed
activities, `3` graph edges, `5` projects, `30` project-coverage entries,
`6` observability scenarios и `43` route entries проходят без orphan или
source-hash mismatch. Два clean projection rebuild-прохода с фиксированным
`asOf=2026-08-30T00:00:00.000Z` совпали побайтно (`10` artifacts), поэтому
`unexplainedDeltaCount = 0`.

G12-027 помечен `[x]` только для внутреннего reconciliation slice со статусом
`PASS_WITH_LIMITATIONS`. Полнота seed-каталога не подменяется этим результатом:
остаются `20` открытых lessons, `70` role requirements, `212` вопросов и `56`
activities в content-enrichment очереди. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/release-graph-reconciliation-2026-08-30.{json,md}`.

### Execution update — G10S-108 public/hidden task asset boundary — 30 августа 2026

Target `main` now contains `ce7e73d05e3f3bb94733f7cc7a1a125efdf785be`
(`feat(g10s): separate public and hidden task assets`) and evidence commit
`c316b3bc2a962d6bd74ab9b9c550f2ea5ee16c1f` (`docs(g10s): record task asset boundary`).
`TaskPublicContract` now carries only `public/` statement, input/output,
dataset and grading references plus hashes. `TaskHiddenAssetManifest` is a
separate coordinate-bound evaluator surface for hidden tests, reference
solutions, harnesses, hidden seeds, grading variants and rubric fixtures;
every entry requires `hidden/`, `visibility=hidden`, `audience=evaluator` and a
content hash. Strict schemas and the policy reject body/solution/test-code
keys, public-to-hidden references, namespace leaks, duplicate refs and
TaskFamily/TaskRevision mismatches before projection. Five fixture records
yielded `2` accepted and `3` expected quarantines, with `0` projected bodies
and deterministic hash `aef1cffc71a7bc04f01510458d8fb89e50a85fb07997886fcdaa15a9b3f90e8f`.

This closes only G10S-108's contract boundary. The next executable slice is
G10S-109: the evaluator build context must be allowlisted and a release
artifact canary must prove that evaluator assets cannot leak into the public
bundle.

### Execution update — G10S-109 evaluator build-context allowlist — 30 августа 2026

Target `main` now contains `d37fcb7b07cf7f270e6cedd088a9cc479f3fd6fe`
(`feat(g10s): allowlist task build context`) and evidence commit
`10159b035c65c429da34b234a4c388f419cdce76` (`docs(g10s): record task build context gate`).
`TaskBuildContext` is a strict versioned contract containing only task
coordinates plus public/hidden paths, asset kinds, content hashes and required
flags. Public entries are confined to `public/`; evaluator entries are
confined to `hidden/`. Required entries must be observed in the build with the
same surface, kind and hash; duplicate, unsafe, forbidden or unallowlisted
files fail closed. A public `reference-solution`, `.env` body-key canary and
unallowlisted evaluator file remain visible as intentional quarantine fixtures.

`pnpm architecture:task-build-context` inspected five metadata-only records:
two accepted and three expected `REVIEW_REQUIRED`, 41 observed files, 38
allowlist matches, three unallowlisted files, one public evaluator leak, one
forbidden path, one body-key canary record, zero missing required entries and
zero projected bodies. Reversing record, allowlist and file order preserved the
projection hash
`e89fa9ae2e34610bf2294418e8e8a90f009f4df8bc5bfa43510a2820f0177341`.
The full target `pnpm check`, boundary gate and toolchain gate passed with 96
architecture tests. Push was not performed because the owner requested local
commits while the Actions quota is near its monthly limit.

This closes only G10S-109's build-context slice. G10S-110 now defines the
release bundle publication gate and proves that only the allowlisted public
surface is copied into a learner artifact.

### Execution update — G10S-110 learner release publication — 30 августа 2026

Target `main` now contains `17e254aa5d4e15274d0043e67b6a42b33cc56efd`
(`feat(g10s): gate learner release publication`). Evidence and the corrected
checksum ledger are recorded in target commits `42300980d05ee64ac5eabb396c027f419edc7be5`
(`docs(g10s): record learner publication gate`) and
`5afa397e43220d290a8e8797d57e208e2082bb16` (`fix(g10s): refresh evidence checksums`).
The strict publication contract separates the candidate build from the
learner artifact: only allowlisted `public/` manifest, catalog, question-shard
and public-index files may be published. Hidden tests, reference solutions,
harnesses, dataset seeds, grading variants and rubric fixtures remain
candidate-only; any evaluator file in `publishedFiles` is a leak and is
quarantined. Unsafe/forbidden paths, duplicate or unallowlisted files,
namespace/kind/surface mismatches, hash drift, missing candidate files and
missing allowlist entries fail closed. The projection is metadata-only and
deterministic.

`pnpm architecture:release-publication` inspected five records: two accepted
and three expected `REVIEW_REQUIRED`, 24 candidate files, six candidate
evaluator files, 18 published files, one published evaluator leak, one
unallowlisted public file and one body-key canary; all other mismatch counters
were zero, with 16 public allowlist entries and zero projected bodies. The
full target check, boundary/toolchain checks and architecture suite passed
with 100 tests. Push was not performed because the owner requested local
commits while the Actions quota is near its monthly limit. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/release-publication-2026-08-30.{json,md}`.

This closes G10S-110. The next executable slice is G10S-111: stable IDs must
remain independent of array order, local paths and timestamps.

### Execution update — G10S-111 canonical stable IDs — 30 августа 2026

Target `main` now contains `d37cd484e39639c954bc01b0b70eabb3bf5165b2`
(`feat(g10s): make stable ids canonical`) and evidence commit `0e70aa4`
(`docs(g10s): record stable id gate`). The stable-ID policy hashes only an
explicit semantic `namespace/entity/identity` tuple, canonicalizes identity
keys and scalar strings, and refuses transient identity fields. Array order,
local paths, timestamps, body text and generated metadata cannot change the
identifier; missing/malformed identity and duplicate semantic IDs remain
`REVIEW_REQUIRED`. Classification and expert-sample metadata no longer fall
back to path hashes.

`pnpm architecture:stable-ids` rehearsed six synthetic records: four valid,
two intentional quarantine cases, three unique IDs and one duplicate semantic
group. The projection is metadata-only and deterministic, with no bodies. The
full `pnpm check`, boundary/toolchain gates, 103 architecture tests,
evidence validation and checksum validation passed. Push was not performed
because Actions quota is near its monthly limit. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/stable-ids-2026-08-30.{json,md}`.

This closes G10S-111. The next executable slice is G10S-112: version the domain
contract and add property tests for identity, preferred transitions, provenance
disposition and deterministic serialization.

### Execution update — G10S-112 versioned domain contracts — 30 августа 2026

Target `main` now contains `0bd3da0` (`feat(g10s): version domain contract
changes`). The contract package exposes a versioned registry for owned domain
contracts and changes. Every change must increase the contract version and
reference an owned contract; a breaking change is invalid without an explicit
migration ID, migration notes and rollback notes. The registry also records
consumers and requires the `explicit-migration-required` policy, keeping
provider/consumer compatibility decisions reviewable rather than implicit.

`pnpm architecture:domain-contract` rehearsed three owned contracts and two
versioned changes, including one breaking transition with migration/rollback
notes. Four negative cases (breaking without migration, non-monotonic version,
unowned contract and duplicate migration) were rejected. Property-style checks
also proved stable identity, preferred-transition rollback, provenance
disposition and order-independent serialization. The projection is deterministic
and metadata-only (`projectionHash=0af5ea18…a4bc63db368`); no body, prompt,
answer or secret is emitted. The full `pnpm check`, boundary and toolchain
ladder passed, including 107 architecture tests. Evidence is recorded in
`fluent-interview-platform/docs/verification/greenfield/G10S/domain-contract-2026-08-30.{json,md}`
with evidence commit `65442b5`. Push was intentionally omitted because the
owner requested local commits while the Actions quota is near its monthly
limit.

This closes G10S-112. The next executable slice is G10S-113: preserve the
golden question/task fixtures or record an exact reviewed delta.

### Execution update — G10S-113 golden fixture baseline — 30 августа 2026

Target `main` now contains `a30e2eb` (`feat(g10s): preserve golden fixture
baseline`) and evidence commit `91ccc60` (`docs(g10s): record golden fixture
gate`). A versioned, metadata-only contract freezes the exact inherited Strata
baseline at `6` cards, `75` layers, `3` task families and `1` logical dataset.
The inventory covers `11` fixture files (six card files, three task files and
two files grouped into the single `commerce-v1` dataset) at Strata
`ec3b6804ecc1d08e3ab355be0c78930a46b34815`, with source manifest hash
`e4cabff081bdf4660709330af28bcb832c43c0cda4789233e17b0e369e5804ae`.

`pnpm architecture:golden-fixtures` proved byte-stable generation and exact
baseline equality (`projectionHash=40520dd3…4a97ae8b`). All five negative
rehearsals were rejected: card-count drift, layer-count drift, missing task
fixture, source-manifest hash drift and a body-field canary. The projection is
deterministic, metadata-only and contains no prompt, answer, solution, content
or secret bodies. The full `pnpm check`, boundary and toolchain ladder passed,
including `110` architecture tests; evidence and checksum validation passed.
Push was intentionally omitted because the owner requested local commits while
the Actions quota is near its monthly limit.

This closes G10S-113. The next executable slice is G10S-114: port all twelve
inherited PostgreSQL invariant tests and add platform ownership/grant tests.

### Execution update — G10S-114/115 PostgreSQL invariant convergence — 30 августа 2026

Target `main` now contains `123b1fe` (`feat(g10s): converge question and task
domain invariants`) and evidence commit `5d4c85d` (`docs(g10s): record
PostgreSQL invariant gate`). Перед закрытием гейта исправлен ложноположительный
`must_fail`: прежний helper мог поймать собственный exception об успешном SQL и
выдать его за ожидаемый отказ. Новый parser принимает только именованные exact
markers, а privilege-escalation rehearsal использует реальную serving session
через `SET SESSION AUTHORIZATION`.

Disposable PostgreSQL gate после всех восьми migrations теперь исполняет и
раздельно подтверждает `12/12` inherited Strata invariants, `16/16` platform
ownership/grant assertions и `12/12` functional role-journey checks. Все
negative cases fail closed, source/target SQL и итоговая projection имеют
зафиксированные SHA-256; rehearsal metadata-only (`sourceBodiesRead=0`) и всегда
удаляет временную database. `pnpm architecture:fresh-db`, `pnpm
architecture:postgres-invariants`, `114/114` architecture tests, полный `pnpm
check`, boundary/toolchain и evidence/checksum validation зелёные. Push
намеренно не выполнялся по ограничению Actions quota.

This closes G10S-114 and G10S-115. The next executable slice is G10S-116:
record the exact current Studio sequence and its one-to-one Strata target
commands before changing Studio authority.

### Execution update — G10S-116 Studio → Strata sequence map — 30 августа 2026

Target `main` now contains `1bca061` (`docs(g10s): map Studio to Strata
commands`) and evidence commit `18a85cf` (`docs(g10s): record Studio sequence
gate`). Versioned JSON и Mermaid-документ фиксируют `5/5` current G10 steps с
единственным target command и отдельно показывают два отсутствовавших seams:
deterministic `question-catalog.v1` export и transactional serving import.

Machine gate проверил `10/10` source anchors, `7/7` ordered unique target
commands, deterministic metadata-only projection и отклонил `5/5` negative
cases: missing mapping, duplicate order, unknown old step, dual-write и serving
read из `strata.*`. Все target commands честно помечены `planned`; gate не
выдаёт G10S-117…135 за реализацию. Полный `pnpm check`, boundary/toolchain,
checksums и `118/118` architecture tests зелёные. Push не выполнялся по
ограничению Actions quota.

This closes G10S-116. The next executable slice is G10S-117: preserve explicit
author/reviewer/publisher identities and immutable decisions in local
single-user mode.

### Execution update — G10S-117 explicit local Studio roles — 30 августа 2026

Target `main` now contains `bbd2238` (`feat(g10s): preserve explicit Studio
roles`) and evidence commit `12b4737` (`docs(g10s): record Studio role gate`).
Versioned local policy моделирует одного реального actor, но три явных
capabilities: `author`, `reviewer`, `publisher`. Каждая из трёх операций
создаёт metadata decision receipt с profile/actor, required role/action,
command ID, request hash, result ref, timestamp и unique decision ID; implicit
super-role отсутствует.

Machine gate отклонил `5/5` negative cases: missing role, role/action mismatch,
duplicate decision ID, forged profile и forged actor. Same local actor может
явно выполнять все три роли; configurable second reviewer не включён глобально
и остаётся G10S-120. `10/10` content-model tests, `122/122` architecture tests,
полный `pnpm check`, boundary/toolchain и evidence/checksum validation зелёные.
Push не выполнялся по ограничению Actions quota.

This closes G10S-117. The next executable slice is G10S-118: move Studio
create/edit to a Strata authoring application command without serving-table or
JSONL writes.

### Execution update — G10S-118 Studio authoring command — 30 августа 2026

Target `main` now contains `99cbda3` (`feat(g10s): route Studio authoring
through Strata command`) and evidence commit `4943cc4` (`docs(g10s): record
Studio authoring command gate`). ADR-0002 закрепляет one-shot CLI как
единственный local authoring transport: Next/Nest serving process не получает
authoring credentials, а legacy browser mutation отвечает `410 Gone` вместо
dual-write.

Живая disposable PostgreSQL репетиция применила `9` migrations и выполнила
create, exact idempotent replay, conflicting replay, edit и stale-head rollback
через scoped one-shot container без published port. Финальное состояние:
`1` question, `2` immutable revisions, `4` versioned layers, `4` exact
revision-layer links, `2` metadata receipts, `0` serving-card writes и `0`
legacy Studio rows. PostgreSQL gate сохранил `12/12` inherited invariants,
`16/16` ownership/grant assertions и `12/12` functional role checks. `12/12`
content-model tests, `125/125` architecture tests, `57/57` API tests, `45/45`
web tests, полный `pnpm check`, boundary/toolchain и evidence/checksum validation
зелёные. Push не выполнялся по ограничению Actions quota.

This closes G10S-118. The next executable slice is G10S-119: persist an
immutable review decision bound to the exact authored revision, reviewer,
timestamp and source revision.

### Execution update — G10S-119 immutable Studio review decision — 30 августа 2026

Target `main` now contains `e7ab46f` (`feat(g10s): persist immutable Studio
review decisions`) and evidence commit `6b017c9` (`docs(g10s): record Studio
review command gate`). Browser/Nest review mutations now return `410 Gone`;
the supported boundary is the explicit one-shot
`strata.review.record-decision` command under `fluent_authoring`.

Post-commit disposable PostgreSQL rehearsal applied `10` migrations and bound
one `approved` decision to the exact revision ID, revision number, source
author, explicit reviewer and database timestamp. Exact replay returned the
same decision. Changed replay, forged source author, wrong revision number,
duplicate reviewer decision, update and delete all failed closed. Final state:
`1` question, `1` immutable revision, `1` immutable review decision, `2`
metadata receipts, `0` serving review writes and `0` legacy Studio rows. Raw
rationale was never stored or emitted; only its SHA-256 crossed the command
boundary.

The post-commit ladder passed `12/12` inherited invariants, `16/16` platform
ownership/grant assertions, `12/12` functional role checks, `14/14`
content-model tests, `129/129` architecture tests, `57/57` API tests, `45/45`
web tests, full `pnpm check`, boundary/toolchain and complete evidence checksum
validation. Push was intentionally not performed because of the Actions quota.

This closes G10S-119. The next executable slice is G10S-120: enforce the
configurable independent-reviewer rule only when policy requires it, without
fabricating a second person in local single-user mode.

### Execution update — G10S-120 configurable independent review — 31 августа 2026

Target `main` now contains `d6ae03a` (`feat(g10s): enforce configurable
independent review`) and evidence commit `8ee890f` (`docs(g10s): record
independent review policy gate`). The checked-in versioned policy keeps
`requireSecondReviewer=false`; a global switch or a matched bounded risk rule
requires a reviewer actor different from the exact source author.

The accepted review transaction persists immutable policy hash, matched risk
rules, source author, reviewer and derived independence next to the review
decision. Request idempotency includes the policy, so replay under a changed
policy fails closed. Same-actor global/risk review, policy drift, direct SQL
bypass and policy-evidence mutation were rejected. The post-commit live journey
observed two revisions, two review decisions, two policy evaluations and four
authority receipts, with zero serving or legacy Studio writes.

Only `sergey.local` is a real configured actor. The positive independent-review
branch uses an explicitly labelled synthetic fixture in a disposable database;
it is not a production user or a claim that a second person exists. When the
real local policy requires independence, the command blocks rather than
inventing identity.

The full ladder passed `16/16` content-model tests, `134/134` architecture
tests, `57/57` API tests, `45/45` web tests, all 28 PostgreSQL schema/platform
assertions plus 12 functional role checks, `pnpm check`, boundary/toolchain and
complete evidence checksum validation. Push was intentionally not performed
because of the Actions quota.

This closes G10S-120. The next executable slice is G10S-121: Studio publish
creates a reviewed authoring release-candidate/bundle request and must not
activate a learner release directly.

### Execution update — G10S-121 reviewed release candidate — 31 августа 2026

Target `main` now contains `aeb8130` (`feat(g10s): request reviewed release
candidates`), follow-up hardening `9803d80` (`fix(g10s): reject stale release
candidate revisions`) and evidence commit `79668ea` (`docs(g10s): record
release candidate request gate`). The former Next/Nest publish endpoints return
HTTP 410; the executable publisher boundary is the one-shot
`strata.release.request-bundle` command.

The command accepts only unique approved, policy-evaluated review decisions for
current revision heads, normalizes intent before hashing, and records one
immutable authoring candidate plus exact revision links and a metadata-only
authority receipt. Exact replay returns the same candidate. Changed replay,
rejected, stale, unknown and duplicate reviews fail closed. PostgreSQL also
rejects empty candidates, rejected-review and stale-revision direct inserts,
updates and deletes, so bypassing the CLI cannot weaken the invariant.

The disposable twelve-migration journey observed three questions, four
revisions, three review decisions, three policy evaluations, one candidate,
one candidate item and eight receipts. Learner revisions, legacy Studio rows,
serving outbox events, learner activations and emitted content bodies were all
zero. Review-policy, review-command, restore and all 28 PostgreSQL
schema/platform assertions plus 12 functional role checks passed. The full
ladder passed `18/18` content-model tests, `139/139` architecture tests,
`57/57` API tests, `45/45` web tests, `pnpm check`, boundary/toolchain and
complete evidence checksum validation. Push was intentionally not performed
because of the Actions quota.

This closes G10S-121. The next executable slice is G10S-122: export the exact
reviewed candidate into a validated `question-catalog.v1` bundle, then import
and activate it through one atomic serving transaction with manifest readback.

### Execution update — G10S-122 validated atomic serving import — 31 августа 2026

Target `main` now contains implementation commit `c66a2c3` (`feat(g10s): import
serving releases atomically`) and evidence commit `2235eb7` (`docs(g10s): record
serving release import gate`). The accepted Strata release candidate crosses a
file-only boundary as exactly `manifest.json` plus canonical `release.json`;
the release-import process receives no authoring credential and cannot read
`strata.*`.

Before mutation, the importer validates the strict bundle schema, file set,
canonical bytes, byte count, artifact hash, attestation payload, logical
catalog hash, release metadata, record count and RU/EN locale set. One
PostgreSQL transaction then persists the serving projection, immutable
manifest, append-only pointer event, single active pointer, outbox event and
idempotency receipt. PostgreSQL readback reconstructs the complete imported
catalog and must match the bundle logical hash exactly.

The disposable 13-migration journey proved first import, exact replay with the
same idempotency key, tamper rejection before DB mutation, a separately
checksummed late-conflict rollback, previous-pointer preservation and immutable
history. The committed success contained one manifest, pointer event, receipt,
card, revision, placement, supporting prompt, assessed activity and outbox
event, two translations and two roles; command/evidence output emitted zero
content bodies. Static serving-boundary scanning now includes the release
importer itself.

The full ladder passed `18/18` content-model tests, `141/141` architecture
tests, `57/57` API tests, `45/45` web tests, all 28 PostgreSQL
schema/platform assertions plus 12 functional role checks, 13-migration
backup/restore equality, `pnpm check`, boundary/toolchain and evidence
validation. Push was intentionally not performed because of the Actions quota.

This closes only G10S-122. It does not claim the complete seven-layer field
adapter/loss ledger (G10S.7), learner API cutover, cryptographic bundle signing,
or broader cross-key re-import policy. The next executable slice is G10S-123:
reconcile or replace every legacy command receipt with exact mappings and prove
that repeat commands cannot create duplicate revisions, reviews or releases.

### Execution update — G10S-123 Studio receipt convergence — 31 августа 2026

Target `main` now contains implementation commit `ef30ee0` (`feat(g10s):
converge Studio command receipts`) and evidence commit `ae400e1` (`docs(g10s):
record Studio receipt convergence gate`). The versioned
`studio-receipt-convergence.v1.json` maps exactly three retired Studio mutation
commands through five ordered target stages and ten live source anchors.

`candidate.create`, `candidate.review` and `release.publish` remain HTTP 410 and
write zero legacy rows. New revision, review and release-request commands bind
their canonical request hashes and immutable result IDs in
`strata.command_receipt`; serving import uses
`question_release_import_receipts`; deterministic export is bound by its
canonical manifest/artifact/logical hashes rather than a fabricated receipt.
The owner matrix now contains 23 facts with zero duplicate or ownerless paths.

One post-commit command ran four real disposable PostgreSQL journeys. Authoring,
review, release request and serving import each returned the original result on
same-key/same-request replay and rejected changed intent under the same key.
Final durable facts remained two intended authoring revisions, one review
decision, one release candidate/revision link and one serving manifest/pointer
event/import receipt; replay created no duplicates and emitted zero content
bodies. Architecture tests passed `147/147`; the full `pnpm check`,
boundary/toolchain and evidence gates also passed. Push was intentionally not
performed because of the Actions quota.

The historical authority is the receipt records inside append-only
`studio_ledger_records`; `studio_command_receipts` is their rebuildable
projection. Neither is copied blindly because legacy result IDs are not target
revision/review IDs. Per-row historical entity/receipt reconciliation remains
G10S-126 and must use all seven declared join fields with explicit
dispositions. Legacy release-pointer receipts remain separately visible for
G10S-125, and serving outbox convergence is the next executable slice,
G10S-124.

### Execution update — G10S-124 serving outbox convergence — 31 августа 2026

Target `main` now contains implementation commit `3c90830` (`feat(g10s):
converge serving outbox semantics`) and evidence commit `69d9afe` (`docs(g10s):
record serving outbox convergence gate`). The existing PostgreSQL outbox is
preserved as serving metadata and recovery history; authoring continues to
cross the boundary through exactly two checksummed files and requires no
Kafka, Redis, queue worker or second content authority.

The release importer now writes a contract-valid `serving.release.imported`
event in the same transaction as the serving projection, immutable manifest,
pointer event, active pointer and import receipt. Its source is the
serving-owned release manifest rather than an unreadable Strata candidate.
One database timestamp binds manifest, pointer, receipt and event without
driver precision drift. Event and acknowledgement history reject update/delete
even from the migration owner; import can append but cannot acknowledge, while
serving can append one idempotent acknowledgement but cannot mutate history.

The post-commit disposable PostgreSQL rehearsal proved first import, exact
same-key replay without a duplicate event, changed-intent rejection, and a
synthetic late failure after event insert with zero leaked manifests,
revisions, pointers, receipts or events. Pending count moved from one to zero
after acknowledgement and remained one immutable ack after repeat. Authoring
created zero outbox events and had zero broker dependencies. Upgrade/restore
passed all 14 migrations with preserved history, exact logical hashes and 357
object grants; PostgreSQL checks passed `12/12` inherited, `16/16` platform and
`12/12` functional role assertions. Architecture tests passed `153/153`, API
tests `58/58`, and the complete check/boundary/toolchain ladder passed. Push was
intentionally not performed because of the Actions quota.

This closes only G10S-124. Historical JSONL and legacy outbox artifacts remain
visible until G10S-125 classifies each one as retired or recovery-only;
historical Studio entity/receipt reconciliation remains G10S-126. The next
executable slice is G10S-125, and no fallback may become a permanent second
authority.

### Execution update — G10S-125 JSONL authority retirement — 31 августа 2026

Target `main` now contains implementation commit `8c6f03c` (`feat(g10s):
retire JSONL runtime authority`) and evidence commit `9b14341` (`docs(g10s):
record JSONL authority retirement gate`). PostgreSQL is the only production
authority for Studio, serving release pointers and outbox state. The four
historical JSONL files have an exact machine-readable disposition: one is
retired and three are recovery-only; no environment selector, production
adapter import or production JSONL write remains.

Studio is wired directly to `PostgresStudioLedger`, active release-pointer
readback uses the serving PostgreSQL projection, and direct pointer mutation
plus all three legacy browser Studio mutation routes return HTTP 410. Legacy
adapters reject writes unless an explicit test/recovery rehearsal opts in, and
read paths no longer perform hidden reconciliation writes. The backup matrix
retains the files while excluding them from active event authority.

Post-commit rehearsals passed all 15 migrations, exact upgrade history,
restore with matching logical hashes and 358 object grants, and atomic serving
import/replay/rollback. PostgreSQL checks passed `12/12` inherited, `16/16`
platform and `12/12` functional-role assertions; architecture tests passed
`156/156`, API tests `63/63`, stack tests `18/18`, and the complete
check/boundary/toolchain ladder passed. Push was intentionally not performed
because of the Actions quota.

This closes only G10S-125. No historical row is claimed migrated or deleted:
entity/receipt/pointer reconciliation remains G10S-126, explicit per-row
dispositions remain G10S-127, controlled adapter/file deletion remains G13,
and one-root persistent-stack migration remains G10S-221. The next executable
slice is G10S-126.

### Execution update — G10S-126 legacy Studio authority migration — 31 августа 2026

Target `main` now contains implementation commit `1d89010` (`feat(g10s):
migrate legacy Studio authority`) and evidence commit `e92cde2` (`docs(g10s):
record legacy Studio migration gate`). A checked-in metadata-only manifest
binds the exact persistent Studio snapshot: 11 ledger facts, 3 receipt
projection rows, six source anchors and source snapshot hash
`e8344611984dcac01d98f042e0318c8fc9dfa4dd59c7336b63bd60190f001efe`.

The rehearsal takes a real `pg_dump`, restores it into a disposable clone,
applies all 16 migrations and runs the migration twice. Canonical state is
created only through the existing create-revision, record-review and
request-release application commands; manual domain inserts are forbidden.
The observed target contains exactly one Question, 16 immutable layers, one
revision, one review plus policy evaluation, one authoring release candidate,
3 target command receipts and 11 immutable reconciliation rows. All 3 receipt
rows carry the complete seven-field legacy→target join, partial joins are zero,
the second run replays exact target state, serving activation remains zero and
the persistent database is unchanged.

The first live-clone attempts caught and fixed two SQL fail-closed defects: a
reserved `grant` alias and lexical ordering caused by an output text alias for
numeric sequences. The final post-commit rehearsal, full check/boundary/
toolchain ladder, 6/6 authoring tests and 161/161 architecture tests pass.
Fresh database has 26 Strata tables; PostgreSQL checks pass `12/12` inherited,
`16/16` platform and `12/12` functional-role assertions; restore reproduces
exact logical hashes and 362 object grants. Push was intentionally not
performed because of the Actions quota.

This closes only G10S-126. Roles, placements, supporting prompts, assessed
activities, graph edges and incomplete source metadata remain explicit
deferrals for G10S-127; the one-root migration of an already-persistent stack
remains G10S-221 and controlled legacy deletion remains G13. The next
executable slice is G10S-127.

### Execution update — G10S-127 legacy Studio dispositions — 31 августа 2026

Target `main` now contains implementation commit `8f5c5db` (`feat(g10s):
record legacy Studio dispositions`) and evidence commit `cd6999c` (`docs(g10s):
record legacy Studio disposition gate`). The checked-in disposition manifest is
bound to source snapshot
`e8344611984dcac01d98f042e0318c8fc9dfa4dd59c7336b63bd60190f001efe`,
migration manifest
`cd4d8053a886ebc75bd6a7c4ce8ecc59445ec7e1a0dca79e52bde96a99965414`
and canonical disposition hash
`48b8adc37abbb526211ff4ff52f66865705a7453f278bd09c5911edba5f0a331`.
All 11 migrated source rows and all 26 source fields have exactly one explicit
decision: 23 `mapped`, 12 `needs-authoring`, one `quarantined` and one
`rejected`; silent drops, missing decisions and extra decisions are zero. Every
non-mapped decision records a reason and the explicit local reviewer
`sergey.local` under method `owner-delegated-local-review`.

Migration 0017 adds an immutable, migration-role-only disposition ledger. The
application roles have zero privileges; the migration role has only SELECT and
INSERT. Exact replay inserts zero duplicates, while update/delete attempts fail
closed. The live rehearsal restores a real `pg_dump` into a disposable clone,
applies all 17 migrations, records all 37 decisions twice, verifies the exact
23/12/1/1 distribution and proves that the persistent database and serving
release state remain unchanged. Evidence hash is
`97c1e5391e07f14a61480fb040c873f5bf861f8aa4e69c00781bfee4f8db2c1a`.

Fresh database now has 27 Strata tables. PostgreSQL checks pass `12/12`
inherited, `16/16` platform and `12/12` functional-role assertions; architecture
tests pass `166/166`, and fresh/upgrade/backup/restore/serving-import plus the
complete check/boundary/toolchain ladder pass. Push was intentionally not
performed because of the Actions quota.

This closes only G10S-127. The manifest deliberately preserves future work
instead of inventing target content: roles continue in G10S-152, placements in
G10S-167, assessed activities in G10S-168, acquired-at provenance in G10S-137,
review comments remain quarantined and the legacy logical hash remains
rejected. The next executable slice is G10S-128: expose authoring revision,
review, rights, completeness and serving projection as distinct UI states.

### Execution update — G10S-128 independent Studio state projections — 31 августа 2026

Target `main` now contains production-bootstrap fix `e1e7726` (`fix(api):
restore production dependency injection`), implementation commit `53f5c68`
(`feat(g10s): separate Studio projection states`) and evidence commit
`d8b07c5` (`docs(g10s): record Studio projection gate`). Studio derives and
renders five independently owned facts: immutable authoring revision, review
decision/reviewer, rights source/licence/disposition, EN/RU core and enrichment
completeness, and serving release projection. Review no longer implies
publication, a manifest no longer implies an active pointer, quarantine never
claims a learner release and mismatched hashes remain visibly
`inconsistent`.

The serving-pointer request is fail-visible rather than destructive: if the
persistent development schema has not yet received its G10S-221 one-root
migration, revision/review/rights/completeness still render and the fifth cell
reports `unavailable`. The UI neither mutates PostgreSQL nor invents an active
release. Web tests pass `49/49`, Studio contract tests `12/12`, API tests
`64/64`, and the complete check/boundary/toolchain ladder passes. Canonical
`pnpm dev -- --no-watch` reached `6/6` ready services.

Live WebMCP verification passed at 1440×900 light/RU/open navigation and
390×844 dark/EN/collapsed navigation: all five cells remain distinct, vertical
scroll reaches the bottom, and horizontal overflow, cell overlap, browser
warnings and browser errors are all zero. This closes only G10S-128; it does
not claim a persistent-stack migration or active serving import. The next
executable slice is G10S-129: every learner projection must exclude quarantine
and import candidates from published and coverage-ready states.

### Execution update — G10S-129 learner release projection boundary — 31 августа 2026

Target `main` now contains implementation commit `9125445` (`feat(g10s):
guard learner release projections`) and evidence commit `938a423` (`docs(g10s):
record learner release guard`). One strict learner catalog contract now owns
Questions, Practice, Program coverage, lesson lookup, API loading, authoring
release export, serving bundle validation and serving readback. It requires an
exact `released` review state with reviewer and timestamp, rejects unknown
candidate/quarantine lifecycle markers at every nested object boundary, and
continues to preserve reviewed `brain-import` as provenance rather than
mistaking it for an unpublished lifecycle state.

Coverage derives `hardGates.noQuarantine` from the same release-only contract.
A contaminated card therefore makes the path ineligible and creates an
explicit critical gap; an empty path also fails closed. Web tests pass `52/52`,
API tests `65/65`, release-import tests `4/4`, contracts/domain builds and
web/API type checks pass, and the complete check/boundary/toolchain ladder
passes twice. Canonical `pnpm dev -- --no-watch` reached `6/6` ready services.

Live WebMCP verification at 1280×720 passed across `/questions`,
`/program?track=node` and a real navigation to
`/practice/lesson/js-closures?track=node`: six released cards render, Program
honestly reports `Формируется`, vertical scrolling works, horizontal overflow
is zero and browser warnings/errors are zero. No authoring record, serving
pointer, learner progress or persistent database row was mutated. This closes
only G10S-129; it does not claim curriculum completeness. The next executable
slice is G10S-130: prove all authoring/review/release bypass attempts fail
closed through the current production seams.

### Execution update — G10S-130 authority negative matrix — 31 августа 2026

Target `main` now contains implementation commit `53f1e72` (`test(g10s):
enforce authority negative matrix`) and evidence commit `b247133` (`docs(g10s):
record authority negative gate`). One aggregate production-seam rehearsal runs
five attacks against four disposable PostgreSQL databases: unauthorized
publisher, forged reviewer, stale revision, duplicate preferred prompt and
missing source grant. All `5/5` fail closed and produce evidence hash
`e2d05dd43e0c51784ab8ade42fad9df31feccf957ab76d6b3160f76102e70082`.

The stale case is checked at three layers: optimistic authoring head, release
request current-revision validation and direct PostgreSQL bypass. Preferred
prompt uniqueness is probed with both an `ord + version` bypass and a
version-only bypass; exactly one canonical preferred row remains. Failed
attacks create no extra Question, revision, review or release candidate and
activate zero learner releases. All four disposable databases are dropped and
the persistent database is unchanged.

Negative-matrix mutation tests pass `7/7`, architecture tests `173/173`, and
the complete check/boundary/toolchain ladder passes twice. The canonical
running application returns HTTP 410 for retired review and publish mutation
endpoints, so a browser cannot acquire authoring credentials. This closes only
G10S-130. The next executable slice is G10S-131: inject a crash after the
authoring commit and prove deterministic bundle-export recovery without any
partial serving release.

### Execution update — G10S-131 authoring-to-export crash recovery — 31 августа 2026

Target `main` now contains implementation commit `a72593f` (`test(g10s): prove
export crash recovery`) and evidence commit `0248a29` (`docs(g10s): record
export crash recovery`). A test-only crash point exits the one-shot export
process with code `86` after the immutable candidate is read in a read-only
transaction and before any bundle target is published. The hook requires both
`NODE_ENV=test` and the exact bounded crash-point variable; normal execution
cannot activate it accidentally.

After the abrupt exit, authoring still contains exactly one candidate, one
candidate revision and three command receipts. Serving manifests, active
pointer, pointer events, import receipts, cards, revisions and outbox events
all remain zero, and no bundle target directory exists. A clean restart then
exports successfully; a second export has identical `release.json` and
`manifest.json` hashes. The recovered bundle imports once and readback matches
the exact release, manifest and logical hashes. Stable evidence hash is
`6a2f034077b5e864de5de4bdda9be44adc3f537703e2681868ed22e58d63f8ab`.

Crash-recovery mutation tests pass `7/7`, architecture tests `180/180`, and the
complete check/boundary/toolchain ladder passes twice. The disposable database,
one-shot containers and temporary bundles are removed; persistent PostgreSQL
is unchanged. This closes only G10S-131. The next executable slice is G10S-132:
inject failure inside the serving import transaction and prove total rollback
while preserving the previously active release pointer.

### Execution update — G10S-132 serving import crash rollback — 31 августа 2026

Target `main` now contains implementation commit `12b4228` (`test(g10s): prove
serving import rollback`) and evidence commit `0817c11` (`docs(g10s): record
serving rollback gate`). The real one-shot serving import command has five
bounded, test-only crash points: after the manifest, cards, active pointer,
outbox event and immutable import receipt. Each point terminates the process
with code `87` while the PostgreSQL transaction is open.

A disposable database first receives release `2026.08.31-questions.132`. Every
crashed attempt to import `2026.08.31-questions.133` leaves all serving tables
byte-for-byte equivalent at the fact level and preserves the prior active
pointer. No partial manifest, card, revision, pointer event, receipt or outbox
event survives. A clean retry then imports the next release once, and readback
matches the exact release ID, manifest hash and logical hash. Stable evidence
hash is `7ec3e41d4e934d576775ebabfd892699ba91dedd59670991c66121eb066bfd47`.

Crash mutation tests pass `7/7`, architecture tests `187/187`, and the complete
check/boundary/toolchain ladder passes twice. The disposable database,
one-shot containers and temporary bundles are removed; persistent PostgreSQL
is unchanged. This closes only G10S-132. The next executable slice is G10S-133:
compare the authoring release manifest with serving IDs and hashes instead of
accepting HTTP 200 as publication proof.

### Execution update — G10S-133 authoring-to-serving readback — 31 августа 2026

Target `main` now contains implementation commit `242c36e` (`feat(g10s):
verify serving release readback`) and evidence commit `11b6bb7` (`docs(g10s):
record serving readback gate`). The bounded release-import readback validates
the authoring bundle, reads committed serving state from PostgreSQL and
compares ten explicit coordinates: release/candidate IDs, candidate,
manifest, logical, artifact and projection hashes, question/file counts and
generation timestamp.

All ten comparisons pass in the live disposable rehearsal. Eleven independently
mutated coordinates and an HTTP-shaped false success are rejected; the former
Next and Nest HTTP readback route returns 410 so transport status cannot
impersonate publication proof. Release-import tests pass `17/17`, API `65/65`,
web `52/52`, architecture `190/190`, the canonical stack reports `6/6`
services, and the complete check/boundary/toolchain ladder passes twice.
Persistent PostgreSQL is unchanged. Its missing serving migrations remain the
explicit `G10S-221` boundary and are not hidden by a fallback. This closes only
G10S-133. The next executable slice is G10S-134: prove backup/restore preserves
authoring history, reviews, bundle manifests, serving pointers and outbox
receipts together.

### Execution update — G10S-134 complete release-history restore — 31 августа 2026

Target `main` now contains implementation commits `ac46607` (`test(g10s):
prove complete release history restore`) and `26eb323` (`test(g10s): stabilize
release restore evidence`), plus evidence commit `8a13de7` (`docs(g10s): record
complete restore gate`). The canonical backup/restore harness now requires
nineteen non-empty lifecycle families and all nineteen owning tables in the
custom PostgreSQL dump. Empty but internally consistent archives cannot pass.

The source database, immediate restore and post-role-replay target have the
same complete-row SHA-256. Two independent restore rehearsals produced the
same deterministic hash
`c8682e78c7a550dc05fc2005b96a283a84ad748515926e9d2d3f53dca43d8cef`.
Authoring revisions, reviews, policy evidence, release candidates and receipts;
serving cards, manifest, pointer/import receipts and outbox acknowledgement all
survive exactly. Four roles, six schema grants, 364 object grants and twelve
role assertions match. Architecture tests pass `192/192` and the complete
check/boundary/toolchain ladder passes twice. Every disposable database/dump is
removed and persistent PostgreSQL is unchanged. This closes only G10S-134. The
next executable slice is G10S-135: rewrite the G10 browser journey onto the new
authoring-bundle-serving seam without direct database shortcuts.

### Execution update — G10S-135 Studio browser journey — 31 августа 2026

Target `main` now contains implementation commit `efe578e` (`test(g10s):
migrate Studio browser journey`) and evidence commit `0427938` (`docs(g10s):
record browser journey gate`). The replacement journey creates a disposable
Compose/PostgreSQL boundary, applies all 17 migrations, and executes the exact
one-shot create-revision → review → release-request → export → serving-import
sequence. Import replay and bounded readback both pass before the isolated API
and Next production containers are exposed to the browser.

The public Next seam returns 200 for Studio state and the active serving
pointer, links the exact generated release candidate and visibly renders
`2026.08.31-questions.122`. All four retired HTTP authoring/readback routes
return 410, accepted public browser mutations remain zero, and no direct SQL
read is accepted as browser-journey evidence. Focused tests pass `17/17`,
Studio `12/12`, architecture `204/204`, and the complete
check/boundary/toolchain ladder passes twice. A real 1280×720 in-app browser +
WebMCP pass found zero alerts, zero horizontal overflow and the explicit
`.app-scroll-region` vertical scroll owner. Every scoped container, volume,
network, image and temporary bundle is removed without touching persistent
PostgreSQL.

This closes only G10S-135. Persistent development-stack migration remains the
explicit G10S-221 boundary; the recovery-compatible legacy Studio projection
is not promoted to authoring authority. The next executable item is G10S-136:
record the Studio-on-Strata convergence commit gate from the completed
G10S-116…135 evidence chain.

### Execution update — G10S-136 Studio authority convergence — 31 августа 2026

Target `main` now contains the required commit `602cd8a` (`feat(g10s):
converge Studio on Strata authoring authority`). It adds the versioned
`g10s-studio-convergence.v1` manifest and a fail-closed architecture gate. The
gate requires the exact twenty PASS artifacts from G10S-116…135, all seven
target commands in `implemented` state, Strata as the single authoring
authority, a checksummed `question-catalog.v1` file seam and the public Next
boundary as read-only.

Nine convergence tests reject missing evidence, restored legacy authority,
dual-write, serving reads from Strata, production JSONL authority, accepted
browser mutation, direct-database browser proof and any attempt to hide the
persistent-stack boundary. Architecture tests now pass `213/213`; the complete
check/build/boundary/toolchain ladder is green. G10S-137 corpus/rights work,
G10S-221 persistent-stack migration and controlled G13 removal remain explicit
open boundaries. Closing this commit gate does not claim those later phases.

### Execution update — G10S-107 restricted-source grant boundary — 30 августа 2026

Target `main` now contains `c619ae412bad0f26d81cee57f08ec5255e63dda1`
(`feat(g10s): gate restricted provenance grants`) and evidence commit
`6c09aa2fa06c2fde656d86f2d5526aac79801a4b` (`docs(g10s): record restricted-source grant gate`).
The new framework-neutral contract requires an explicit, reviewed and
redistributable grant artifact before a `company_linked` or `paid` provenance
record can receive `public` disposition. Missing, malformed,
non-redistributable or mismatched artifacts fail closed to quarantine; no
automatic grants are issued and projections contain only deterministic
metadata/hashes, never source bodies. The rehearsal accepted `3/5` records,
required grants for `3` restricted records, validated `2` artifacts and
reported `autoGrantCount=0` with projection hash
`aed8569be3b1858ca682e0aebda521947a808e3431fa08c52960289d9f5550dd`.

This closes only the G10S-107 machine contract slice. Hidden/reference asset
separation is the next implementation item (`G10S-108`); corpus breadth,
human rights review and independent G10S acceptance remain open. Push was not
performed because the owner requested local commits while the Actions quota is
near its monthly limit.

### Master-plan expansion — Strata authoring convergence — 30 августа 2026

После G10–G12 был обнаружен архитектурный разрыв между уже работающим Studio,
serving-каталогом платформы и новым authoring domain в
`/Users/sergeyzhechko/developer/strata`. Поэтому этот документ теперь содержит
обязательный corrective gate **G10S** между G10 и G11. Он не замораживает
продукт и не отменяет собранные evidence: он устраняет двойной source of truth
до массового наполнения curriculum.

Входы решения зафиксированы на:

- Strata `main@ec3b680` — 32 tests, 12 ADR links, 9 corpus checks,
  12 PostgreSQL invariants;
- `/Users/sergeyzhechko/developer/questions/brain-reports/13-answers.md`;
- `/Users/sergeyzhechko/developer/questions/brain-reports/14-answers-round-2.md`;
- текущем `question-catalog.v1` с семью answer layers
  (`concise`, `understanding`, `mechanism`, `traps`, `followUps`, `evidence`,
  `sources`).

Существующие результаты G11/G12 считаются историческим baseline. Их нельзя
использовать как финальное production-доказательство после изменения authoring
authority: затронутые content, release, Studio, persistence, route и visual
проверки повторяются на новых revision/release IDs. В рамках этого изменения
плана код Strata и платформы не меняется.

**Следующий исполняемый пункт:** `G10S-127`. Implementing agent последовательно
выполняет оставшиеся `G10S-082…244`, создаёт перечисленные atomic commits и
останавливается на `AWAITING_INDEPENDENT_REVIEW`. `G10S-245…246` закрывает Codex
после независимой проверки. Только затем агент получает G11 breadth work.

### Master-plan expansion — controlled legacy decommission — 30 августа 2026

После production cutover добавлен обязательный **G13**: проверяемое удаление
старого кода, duplicate entities и локальных Docker-ресурсов. Это не разрешение
удалять их сейчас. G13 запускается только после принятого G12 RC, exact
decommission manifest, проверенных archives/restores и owner authorization.

Read-only snapshot на момент расширения плана:

- system data volume: `460 GiB`, used `379 GiB`, available `57 GiB` (`87%`);
- legacy umbrella workspace: `4.8 GiB`;
- active target: `3.4 GiB` — **никогда не legacy target**;
- standalone Strata: `171 MiB`; questions research root: `15 MiB`;
- Docker: images `18.13 GB` (`2.805 GB` reported reclaimable), local volumes
  `19 GB` (`14.96 GB` reported reclaimable), build cache `22.67 GB`
  (`21.13 GB` reported reclaimable).

Docker totals относятся ко всему host и не являются разрешением на global
prune: здесь одновременно работают unrelated `spearad-test-stack`, `searxng`
и другие проекты. G13 удаляет только exact IDs/paths из approved manifest и
отдельно доказывает, что active target и unrelated resources не изменились.

---

## 0. Как агент обязан использовать этот план

### 0.1. Неподвижный порядок

- [ ] `P-001` Выполнять только `G0 → G1 → … → G10 → G10S → G11 → G12 → independent release review → G13`.
- [ ] `P-002` Не начинать следующий gate, пока текущий не имеет `PASS`.
- [ ] `P-003` `PARTIAL`, `WAIVED`, `MOSTLY PASS` и «работает у меня» не разрешают переход.
- [ ] `P-004` Destructive/cutover действия разрешены только после отдельного preflight внутри соответствующего gate.
- [ ] `P-005` Один gate должен оставлять обе рабочие директории в документированном и восстанавливаемом состоянии.
- [ ] `P-006` Reference Product не используется как runtime fallback нового продукта.
- [ ] `P-007` Старый workspace остаётся запускаемым до независимого G12 review.
- [ ] `P-008` Все новые product commits создаются в target repo на `main`; long-lived feature branches не создаются.
- [ ] `P-009` Force push, history rewrite, `git reset --hard`, broad checkout и global Docker prune запрещены.
- [ ] `P-010` Любой неизвестный dirty файл считается пользовательским и сохраняется до явного provenance решения.

### 0.2. Режим работы с подагентами

- [ ] `P-011` Координатор может делегировать только bounded read-only research или непересекающиеся implementation packs.
- [ ] `P-012` У manifest, lockfile, migration chain и release ledger одновременно ровно один writer.
- [ ] `P-013` Подагент не закрывает gate и не коммитит общий manifest без coordinator review.
- [ ] `P-014` Каждый результат подагента содержит exact input SHA, изменённые пути, команды, результаты и ограничения.
- [ ] `P-015` Координатор повторно запускает проверки подагента, а не принимает его summary на веру.
- [ ] `P-016` Параллельные destructive/data migrations запрещены.

### 0.3. Формат evidence каждого gate

Каждый gate создаёт в target repo каталог:

```text
docs/verification/greenfield/Gxx/
├─ gate.json
├─ gate.md
├─ commands.ndjson
├─ inputs.json
├─ outputs.json
├─ diff-summary.md
├─ rollback.md
├─ known-limitations.md
└─ checksums.sha256
```

- [ ] `P-017` `gate.json` валидируется versioned JSON Schema.
- [ ] `P-018` `commands.ndjson` хранит command, cwd, startedAt, finishedAt, exitCode и output artifact path; secrets редактируются.
- [ ] `P-019` `inputs.json` фиксирует reference SHA/release IDs, target parent SHA и toolchain.
- [ ] `P-020` `outputs.json` фиксирует target SHA, release IDs, migrations, images и generated contracts.
- [ ] `P-021` `gate.md` содержит objective, exact counts, PASS/FAIL, deviations и reviewer.
- [ ] `P-022` `rollback.md` содержит проверенную команду/процедуру, а не фразу «откатить Git».
- [ ] `P-023` Большие Playwright traces, videos, screenshots и DB dumps не коммитятся; в Git остаются manifests/hashes/ссылки на scoped artifact storage.
- [ ] `P-024` Verification-команды не переписывают уже tracked evidence молча.
- [ ] `P-025` После генерации evidence `git diff --check` проходит.

Минимальный `gate.json`:

```json
{
  "schemaVersion": "greenfield-gate.v1",
  "gate": "G00",
  "status": "PASS",
  "referenceSha": "<sha>",
  "targetParentSha": "<sha-or-null>",
  "targetSha": "<sha>",
  "commands": 0,
  "checks": { "passed": 0, "failed": 0, "skipped": 0 },
  "artifacts": [],
  "limitations": [],
  "rollbackRehearsed": true,
  "reviewer": "agent-coordinator"
}
```

### 0.4. Commit и push discipline

- [ ] `P-026` Перед gate: `git status --short`, `git branch --show-current`, `git rev-parse HEAD` сохранены.
- [ ] `P-027` В commit попадают только файлы текущего gate.
- [ ] `P-028` Один commit не смешивает version upgrade, domain migration, UI rewrite и content expansion.
- [ ] `P-029` Commit message начинается с gate: `feat(g04): …`, `fix(g04): …`, `docs(g04): …`.
- [ ] `P-030` Gate допускает 1–3 заранее перечисленных atomic commits; итоговый gate commit содержит evidence.
- [ ] `P-031` После commit повторяются быстрые checks и проверяется clean tree.
- [ ] `P-032` Push разрешён только fast-forward в `origin/main`; force push запрещён.
- [ ] `P-033` После push агент проверяет `origin/main == HEAD`.
- [ ] `P-034` Если remote ещё не утверждён, локальные commits разрешены, но G1 остаётся `FAIL`, а не «готово».
- [ ] `P-035` Release tags создаются только после соответствующего gate и никогда не перемещаются.

### 0.5. Универсальный test ladder

Каждый gate запускает релевантное подмножество, G12 — полный product suite, а
G13 повторяет его после физического удаления legacy resources:

- [ ] `P-036` format/lint/typecheck;
- [ ] `P-037` unit tests;
- [ ] `P-038` schema/policy tests;
- [ ] `P-039` React component and accessibility tests;
- [ ] `P-040` contract/provider-consumer tests;
- [ ] `P-041` PostgreSQL migration/integration tests;
- [ ] `P-042` Runtime conformance and adversarial tests;
- [ ] `P-043` 8–15 golden browser journeys, не сотни дублирующих Playwright scripts;
- [ ] `P-044` visual matrices RU/EN × light/dark × required viewports;
- [ ] `P-045` performance budgets;
- [ ] `P-046` dependency/security/supply-chain checks;
- [ ] `P-047` fresh-clone and backup/restore drills;
- [ ] `P-048` telemetry outage, dependency outage and recovery tests.

### 0.6. Немедленные STOP-условия

- [ ] `P-049` Нельзя определить владельца dirty changes в Reference Product.
- [ ] `P-050` Backup или restore drill не проходит.
- [ ] `P-051` Target path или remote уже существует и не доказано, что это тот же проект.
- [ ] `P-052` Требуется удалить/перезаписать unknown user data.
- [ ] `P-053` Hidden tests/source/prompts/secrets попали в API, log, trace или artifact.
- [ ] `P-054` Следующий gate требует silent fallback к legacy runtime/API.
- [ ] `P-055` Data counts/hashes расходятся и причина не записана как reviewed migration.
- [ ] `P-056` Агент не может воспроизвести собственный PASS из clean clone.

STOP означает: сохранить evidence, поставить `FAIL`, сделать безопасный commit
только если он не маскирует проблему, и передать владельцу точный blocker.

### 0.7. Status authority и corrective-gate discipline

- [ ] `P-057` Этот master-plan — единственный status authority; дочерние планы и ADR описывают implementation, но не ведут параллельный процент готовности.
- [ ] `P-058` Implementing agent меняет `[ ]` на `[x]` только вместе с exact command evidence и commit SHA.
- [ ] `P-059` Уже закрытый пункт, семантика которого изменилась после G10S, получает explicit `REVERIFY`, а не молчаливо сохраняет PASS.
- [ ] `P-060` Historical evidence не удаляется и не переписывается; новый прогон ссылается на superseded artifact и объясняет delta.
- [ ] `P-061` Каждая G10S implementation-фаза заканчивается `check → atomic commit → clean-tree check`; проверки и commit запускаются последовательно одной сцепленной командой там, где это требует repository policy.
- [ ] `P-062` Один commit не может одновременно менять PostgreSQL authority, domain contract, Studio workflow, corpus и learner UI.
- [ ] `P-063` Массовый corpus import запрещён до PASS вертикального slice C098.
- [ ] `P-064` Standalone Strata не удаляется и не архивируется до parity, rollback rehearsal и независимого review.
- [ ] `P-065` Agent заканчивает G10S статусом `AWAITING_INDEPENDENT_REVIEW`; окончательное принятие выполняет Codex по разделу 3.
- [ ] `P-066` После принятия G10S агент продолжает G11 с первого реально открытого пункта, а не переигрывает уже доказанные независимые gates без причины.

### 0.8. Decommission и disk-reclamation discipline

- [ ] `P-067` Полный порядок: G10S implementation → G10S independent review → G11 → G12 RC → final independent review/owner authorization → G13 cleanup → G13 independent verification → `DONE`.
- [ ] `P-068` Ни один destructive G13 command не запускается без versioned `decommission-manifest.json` и exact approved manifest hash.
- [ ] `P-069` Любой cleanup tool по умолчанию выполняет dry-run; mutation требует `--confirm <manifest-sha256>` и повторной проверки target IDs непосредственно перед действием.
- [ ] `P-070` `rm -rf` по broad path, `$HOME`, `~`, workspace root, unresolved variable, glob, symlink target, `docker system prune`, `docker volume prune` и global Trash empty запрещены.
- [ ] `P-071` Active target root, active target Compose project, current release images/volumes и backup root входят в immutable denylist cleanup tool.
- [ ] `P-072` Unrelated Compose projects/resources, включая `spearad-test-stack`, `searxng`, Minikube и неизвестные labels, никогда не удаляются G13.
- [ ] `P-073` Cleanup выполняется по одной волне: stop → verify target → archive/restore proof → mutate exact resources → verify target → commit evidence.
- [ ] `P-074` Umbrella repo нельзя удалить, пока current master-plan, ADR/context decisions, Port Ledger и required evidence index не перенесены и не проверены в target.
- [ ] `P-075` Remote repository сначала становится archived/read-only; remote deletion требует нового отдельного owner request и не входит в G13.
- [ ] `P-076` Local Git repo удаляется только после clean/dirty inventory, `git bundle --all`, bundle clone/fsck/check и remote reachability proof.
- [ ] `P-077` Database table/column/file entity удаляется только после zero code references, zero observed reads/writes, migration reconciliation и tested restore.
- [ ] `P-078` Shared Docker build cache не считается owned по одному имени; его prune требует separate owner approval или dedicated builder scope.
- [ ] `P-079` Каждая cleanup wave публикует bytes eligible/retained/reclaimed, exact deleted IDs, checksums archives и post-wave free space.
- [ ] `P-080` Если manifest target изменился, стал mounted/running/dirty или replacement evidence устарело, wave останавливается и требует новый review.

---

## 1. Неподвижные архитектурные решения

- [ ] `A-001` Новый продукт создаётся в отдельном clean Git repo, без импорта старых histories.
- [ ] `A-002` Старые histories сохраняются tags, bundles, SHA manifests и Port Ledger.
- [ ] `A-003` Core deployables: Next web, Nest platform API, Go Task Runtime trust zone.
- [ ] `A-004` Question Catalog сначала является изолированным Nest module за `QuestionCatalogPort`, не отдельным deployable.
- [ ] `A-005` Runtime execution остаётся отдельной trust/release boundary.
- [ ] `A-006` Next использует App Router и настоящий Node/server deployment; static export не является product runtime.
- [ ] `A-007` Server Components — default; Client Components только для browser interaction.
- [ ] `A-008` Browser вызывает только Next/Nest product boundary, не Brain/Runtime/DB напрямую.
- [ ] `A-009` PostgreSQL — authority для curriculum, content revisions, attempts, progress, evidence, projects и outbox с явным ownership.
- [ ] `A-010` `Run` и `Submit` — разные commands и разная evidence strength.
- [ ] `A-011` Deterministic Verdict создаёт только Task Runtime по exact released revision.
- [ ] `A-012` Navigator/LLM advisory-only и не создаёт verdict/mastery/unlock/release.
- [ ] `A-013` Content provenance/license/review обязательны для любого external import.
- [ ] `A-014` Payload, Redis, Kafka, Alloy, profiling и отдельные telemetry backends optional until measured need + ADR.
- [ ] `A-015` Один root Compose project на checkout; нет `container_name` и глобальных volume names.
- [ ] `A-016` Один pnpm lockfile; вложенные `.git` и JS lockfiles запрещены.
- [ ] `A-017` Shared package создаётся со второго consumer или для стабильного cross-process contract.
- [ ] `A-018` Папки `shared`, `common`, `utils`, `types` без owner запрещены.
- [ ] `A-019` Design tokens framework-neutral; shadcn используется как source registry, а не runtime magic.
- [ ] `A-020` RU/EN, light/dark, keyboard/a11y — release contract, не polish later.
- [ ] `A-021` Stack Control, Technical Telemetry и Learning Evidence — разные authority plane.
- [ ] `A-022` Default persisted local telemetry — один `grafana/otel-lgtm` profile.
- [ ] `A-023` Promtail не переносится; он EOL.
- [ ] `A-024` Kotlin/JVM telemetry использует OTel Java agent/autoconfigure, не experimental native Kotlin SDK.
- [ ] `A-025` Product claim проходит пять уровней: operational → curriculum → executable practice → proven mastery → interview benchmarked.
- [ ] `A-026` Старый продукт удаляется/архивируется только отдельным owner decision после G12.
- [ ] `A-027` Strata становится единственным authoring source of truth для Question, Layer, provenance, rights, TaskFamily, TaskRevision и Dataset.
- [ ] `A-028` Strata остаётся CLI/build-time domain: у неё нет HTTP API, собственного long-running service или browser credentials.
- [ ] `A-029` Authoring и serving используют один PostgreSQL instance/database, но Strata живёт в отдельной schema `strata` с запретительными grants.
- [ ] `A-030` Роли разделены: authoring пишет `strata` и не пишет serving `question_*`; import читает подписанный bundle-файл и пишет serving projection; serving/API читает `question_*` и не имеет доступа к `strata`.
- [ ] `A-031` Release bundle — единственный seam между authoring и serving; API никогда не импортирует Strata package и не получает authoring credentials.
- [ ] `A-032` Serving `question-catalog.v1` — rebuildable release projection, а не второй authoring source of truth.
- [ ] `A-033` Studio — application workflow над Strata commands/review/release, а не независимая PostgreSQL/JSONL authority с dual-write.
- [ ] `A-034` Каноническая Question identity остаётся `(kc, aspect, stack)`; `generic` уже является допустимым stack и новое поле scope не вводится.
- [ ] `A-035` На `(question, layer kind, language, depth)` существует ровно один preferred canonical prompt; альтернативы — только human-reviewed rephrasings с тем же expected answer.
- [ ] `A-036` Сущность Probe не вводится: другой semantic question получает другой aspect; code prediction становится Activity/Task/Drill.
- [ ] `A-037` Question владеет `responseBudgetMin` для preferred prompt на canonical depth; Curriculum владеет placement/priority/patterns/prerequisites; Activity владеет execution budget.
- [ ] `A-038` Language остаётся динамическим catalog/table, не закрытым enum; release явно объявляет поддержанные locale и runtime revisions.
- [ ] `A-039` Hidden tests, reference solutions и evaluator artifacts входят только в изолированный task build context и никогда не попадают в web/API/release projection.
- [ ] `A-040` Сначала реализуется измеримый lossy adapter Strata → `question-catalog.v1`; `question-catalog.v2` проектируется только по доказанному loss ledger одного полного slice.
- [ ] `A-041` Solvit/paid/company-linked/unknown-rights material импортируется только в quarantine/reference с `redistributable=false`; production release требует source grant и reviewer decision.
- [ ] `A-042` Один vertical slice C098 Node Event Loop должен пройти author→review→bundle→import→learner→activity→evidence до breadth migration.
- [ ] `A-043` В target monorepo один `.git`, один `pnpm-lock.yaml`, один Nx project graph и один root Compose project; standalone npm/Compose authority после cutover не остаётся.
- [ ] `A-044` Standalone Strata сохраняется как immutable reference tag/bundle до проверенного rollback; физическое удаление требует отдельного owner decision.
- [ ] `A-045` Dual-write между Strata, Studio ledger и serving catalog запрещён; у каждого факта ровно один owner и rebuildable projections.
- [ ] `A-046` Lifecycle states каноничны: `active` → `reference` → `retired` → `archived` → `removed-local`; эти слова не взаимозаменяемы.
- [ ] `A-047` `retired` означает zero runtime/release/CI dependency; `archived` добавляет проверяемый Git/data restore artifact; только `removed-local` освобождает диск.
- [ ] `A-048` Legacy decommission выполняется manifest-driven tooling, а не ручным набором ad hoc shell-команд.
- [ ] `A-049` Один active source monorepo и один active root Compose project остаются после G13; исторические remotes сохраняются archived/read-only.
- [ ] `A-050` Legacy DB entities удаляются двухфазно: сначала stop-write/read-observation + compatibility migration, затем отдельная irreversible drop migration после acceptance.
- [ ] `A-051` Старые JSONL/catalog/projection files не удаляются до reconciliation с Strata/serving authority и explicit `migrated|archived|rejected(reason)` disposition.
- [ ] `A-052` Большие source histories/evidence не копируются целиком в target Git; target хранит manifests/hashes/pointers, а compressed archives живут вне Git.
- [ ] `A-053` Build/output caches являются regenerable, но shared host caches не принадлежат Fluent автоматически; future builds используют dedicated Fluent buildx builder/cache namespace.
- [ ] `A-054` GitHub legacy repos архивируются только после target fresh-clone independence и source bundle restore; scheduled workflows отключаются до archive.
- [ ] `A-055` Old Compose volumes удаляются только по exact ID после backup→restore; container/network/image удаляются только после mount/reference scan.
- [ ] `A-056` Active target, unrelated workspaces и user data имеют deny-by-default protection; отсутствие owner label означает `unknown`, а не `safe-to-delete`.

---

## 2. Итоговое определение `DONE`

Ниже нет «желательных» пунктов. Все обязательны либо имеют approved
`not_applicable` с owner/reviewer и отдельным решением.

- [ ] `D-001` Новый private/public remote выбран владельцем, `origin/main` содержит всю target историю.
- [ ] `D-002` Fresh clone на пустой директории поднимается `pnpm dev`.
- [ ] `D-003` `pnpm dev` запускает один scoped Compose stack и выводит один непротиворечивый status.
- [ ] `D-004` `pnpm down` сохраняет durable data и удаляет scoped orphan resources.
- [ ] `D-005` `doctor/status/clean/data backup/restore/incident capture` имеют typed JSON output.
- [ ] `D-006` До G13 Reference Product запускается из frozen snapshot; после G13 тот же baseline воспроизводится из проверенного archive bundle/dump без сохранённого working tree.
- [ ] `D-007` Нет production fallback calls/symlinks/nested Git на Reference Product.
- [ ] `D-008` Все reference learner routes классифицированы `ported|replaced|retired(reason)`; unresolved = 0.
- [ ] `D-009` Next route/behavior/data/visual/a11y parity подписана по route manifest.
- [ ] `D-010` RU/EN и light/dark проходят visual/state matrices.
- [ ] `D-011` Runtime/language selector показывает только реально released compatible revisions.
- [ ] `D-012` Run/Submit/hidden-suite/security contracts проходят adversarial matrix.
- [ ] `D-013` Browser/LLM не может подделать verdict, evidence или mastery.
- [ ] `D-014` Question corpus, revisions, placements, graph, provenance и release hashes reconciled.
- [ ] `D-015` External import проходит license/provenance/dedupe/review/publish/readback.
- [ ] `D-016` PathCompletionManifest содержит exact stable IDs и role matrix по каждому production path.
- [ ] `D-017` Node, Java, Go, .NET, Kotlin, Python, React/Next, Algorithms, System Design и Behavioral имеют честный release status.
- [ ] `D-018` Ни один preview path не называется production-ready.
- [ ] `D-019` Learning Evidence переживает restart и backup/restore.
- [ ] `D-020` Cold repeat, unseen transfer и interview benchmark нельзя обойти time travel/self-grade.
- [ ] `D-021` Navigator имеет versioned ContextRevision, citations, eval corpus и privacy/redaction.
- [ ] `D-022` Observability profile даёт связанный trace Next→Nest→Runtime и не блокирует core при outage.
- [ ] `D-023` `StackSession` сохраняет failed preflight/startup/shutdown history.
- [ ] `D-024` Project-scoped retention/disk budget проверен под нагрузкой.
- [ ] `D-025` CI проходит test pyramid, supply-chain и full multi-language nightly/release matrix.
- [ ] `D-026` Browser artifacts находятся в CI/artifact storage, не раздувают Git.
- [ ] `D-027` SBOM, provenance, pinned actions/images и dependency review проходят.
- [ ] `D-028` Backup→restore и target→reference rollback реально отрепетированы.
- [ ] `D-029` G0–G10, G10S, G11, G12 и G13 имеют PASS evidence и clean commits.
- [ ] `D-030` Agent выставил `AWAITING_INDEPENDENT_REVIEW`, а не `DONE`.
- [ ] `D-031` Независимый Codex-аудит повторил проверки и владелец подписал human visual/learning flows.
- [ ] `D-032` После D-031 release получает immutable production tag, но master-plan получает `DONE` только после G13 independent PASS.
- [ ] `D-033` Strata перенесена в target monorepo без nested Git/npm lock/standalone Compose и включена в Nx affected graph.
- [ ] `D-034` Fresh/upgrade PostgreSQL migrations создают schema/roles/default privileges; все запрещённые cross-boundary SQL операции fail closed.
- [ ] `D-035` Static scan и live DB proof подтверждают: API/serving не импортируют Strata, не знают authoring DSN и не читают `strata.*`.
- [ ] `D-036` Studio полностью использует Strata authority; старые JSONL/PostgreSQL authoring ledgers либо migrated, либо retired(reason), dual-write = 0.
- [ ] `D-037` Canonical-prompt invariant проходит DB, fixture, corpus и concurrency tests; semantic alternatives не маскируются изменением `ord`.
- [ ] `D-038` `durationMin` заменён на `responseBudgetMin`, а question-level `priority/patterns` удалены либо имеют approved ownership migration без двух хозяев.
- [ ] `D-039` Every authored/imported item имеет source grant, provenance, method, reviewer и disposition; quarantine и non-redistributable content не попадают в release.
- [ ] `D-040` Strata→v1 adapter детерминирован, публикует machine-readable loss ledger и проходит double-build/readback без silent data loss.
- [ ] `D-041` C098 Event Loop проходит полный author→review→release→route→question→activity→Run/Submit→Evidence journey на exact revision.
- [ ] `D-042` Master-plan остаётся единственным status ledger; standalone `docs/plan.md` Strata помечен implementation history/read-only и не расходится по статусам.
- [ ] `D-043` Standalone Strata архивирована только после parity, restore и rollback rehearsal; reference tag/bundle/hash доступны.
- [ ] `D-044` G10S имеет independent PASS, а все затронутые G11/G12 evidence повторены на новом content/release authority.
- [ ] `D-045` Ни paid Solvit wording, ни company-linked source, ни unknown-rights body не присутствуют в distributable Git, bundle, logs, traces или learner UI.
- [ ] `D-046` G13 decommission ledger имеет disposition для каждого legacy repo, entity, container, network, volume, image, cache root и artifact root; unresolved = 0.
- [ ] `D-047` На диске остаётся один active source monorepo; removed legacy repos имеют tested bundles/remotes и target pointers.
- [ ] `D-048` Legacy Fluent Compose projects/containers/networks отсутствуют; active target Compose project проходит restart/health/learner journey.
- [ ] `D-049` Legacy Fluent volumes/images удалены либо имеют approved retention reason; unrelated Docker resources не изменены.
- [ ] `D-050` Legacy tables/columns/JSONL/catalog projections удалены отдельными migrations после zero-reference/read/write proof и restorable archive.
- [ ] `D-051` Standalone Strata/questions/old umbrella roots удалены локально только после соответствующих migration/archive gates; active quarantine data имеет новый explicit owner/path.
- [ ] `D-052` Legacy GitHub repositories archived/read-only с replacement URL/SHA/tag; remote deletion не выполнялось без отдельного запроса.
- [ ] `D-053` Disk report публикует baseline, eligible bytes, archive bytes, reclaimed bytes, residual unrelated bytes и post-cleanup capacity.
- [ ] `D-054` Fresh clone + `pnpm dev` + C098 + one canary per production path проходят после физического удаления source repos и legacy Docker resources.
- [ ] `D-055` G13 cleanup tool fail-closed защищает broad paths, symlinks, active target IDs, mounted volumes, running containers и unknown ownership.
- [ ] `D-056` Independent Codex audit повторил manifests, restore, negative guards и post-cleanup product journey; только после этого статус `DONE`.

---

# G0 — Reference Safety и decision lock

## Цель

Сохранить текущий работающий продукт, данные и provenance до первого target
файла. G0 выполняется в Reference workspace; после PASS reference становится
read-only oracle.

### G0.1. Preflight и dirty-state triage

- [x] `G0-001` Проверить exact reference root через `git rev-parse --show-toplevel`.
- [x] `G0-002` Записать текущую дату, macOS/Docker/Compose/Node/pnpm/Go/Java/.NET versions.
- [x] `G0-003` Снять `git status --short` root и каждого вложенного source repo.
- [x] `G0-004` Снять remotes, default branches, HEAD SHA, tags и commit counts всех repos.
- [x] `G0-005` Классифицировать каждый dirty/untracked path: `owner`, `audit-produced`, `generated`, `unknown`.
- [x] `G0-006` Не stage и не удалять `unknown`.
- [x] `G0-007` Создать вне repo binary patch tracked changes и manifest untracked files.
- [x] `G0-008` Посчитать SHA-256 backup artifacts.
- [x] `G0-009` Проверить, что target path `/Users/sergeyzhechko/developer/fluent-interview-platform` не существует.
- [x] `G0-010` Проверить, что proposed remote ещё не существует.
- [x] `G0-011` Зафиксировать выбранный GitHub owner и canonical remote URL; не угадывать между `wood-bison` и `szhechko`.
- [x] `G0-012` Проверить `gh auth status` для выбранного owner.

### G0.2. Immutable Git/file safety

- [x] `G0-013` Зафиксировать source repos: root, Lab, Vue, Brain, Runtime, Vault.
- [x] `G0-014` Поставить уникальный immutable pre-greenfield tag на каждый clean committed HEAD.
- [x] `G0-015` Создать `git bundle --all` каждого repo в отдельной backup directory.
- [x] `G0-016` Выполнить `git bundle verify` 6/6.
- [x] `G0-017` Создать tracked file + mode + size + SHA-256 manifest 6/6.
- [x] `G0-018` Сохранить выборочные `git log --follow` baselines для domain/UI/runtime/content файлов.
- [x] `G0-019` Сохранить release IDs, image digests, schema versions и content hashes.
- [x] `G0-020` Сохранить Port Ledger skeleton со всеми known capabilities.
- [x] `G0-021` Проверить, что bundle и manifests восстанавливаются в disposable directory.

### G0.3. Data/release recovery

- [x] `G0-022` Сделать logical backup Lab PostgreSQL.
- [x] `G0-023` Сделать logical backup Brain PostgreSQL.
- [x] `G0-024` Сохранить durable volumes inventory и labels.
- [x] `G0-025` Сохранить current content/curriculum/task release bundles и checksums.
- [x] `G0-026` Сохранить hidden-suite inventory без раскрытия содержимого.
- [x] `G0-027` Восстановить оба DB backups в явно названные disposable project-scoped volumes.
- [x] `G0-028` Проверить migration/schema/table/count/hash probes после restore.
- [x] `G0-029` Удалить только disposable restore resources и доказать отсутствие leakage.
- [x] `G0-030` Сохранить restore timing и known incompatibilities.

### G0.4. Runnable reference baseline

- [x] `G0-031` Запустить Reference Product только канонической командой.
- [x] `G0-032` Проверить главную, Program, Atlas, Practice, Questions, Projects, Progress, Journal, Settings, Studio.
- [x] `G0-033` Сохранить route manifest и HTTP statuses всех learner routes.
- [x] `G0-034` Сохранить API surface/openapi/schema hashes.
- [x] `G0-035` Сохранить exact question/revision/placement/graph counts.
- [x] `G0-036` Сохранить task family/revision/runtime-profile counts и compatibility matrix.
- [x] `G0-037` Выполнить golden Node Run и Submit; сохранить public/redacted evidence.
- [x] `G0-038` Проверить JS/TS/Go/Java/.NET/Python selectors по фактической availability.
- [x] `G0-039` Снять visual baselines RU/EN × light/dark на 1440×900, 1728×1117 и 2560×1440.
- [x] `G0-040` Снять narrow 390×844 baseline как non-regression, даже если desktop primary.
- [x] `G0-041` Проверить keyboard traversal, focus, reduced motion и main landmarks.
- [x] `G0-042` Сохранить 4/4 Prometheus targets, W16 checks и shared trace baseline.
- [x] `G0-043` Выполнить scoped shutdown/startup и доказать сохранение progress/content.

### Gate G0

- [x] `G0-044` 6/6 bundles PASS.
- [x] `G0-045` 6/6 file manifests PASS.
- [x] `G0-046` 2/2 DB restore drills PASS.
- [x] `G0-047` Reference route/API/runtime/visual baselines имеют checksums.
- [x] `G0-048` Unknown dirty files не потеряны и не включены в чужой commit.
- [x] `G0-049` Remote owner/URL однозначно записан.
- [x] `G0-050` Reference commit: `docs(g0): freeze greenfield reference baseline`.
- [x] `G0-051` Immutable reference tag создан и push подтверждён.
- [x] `G0-052` `gate.json.status = PASS`.

---

# G1 — Новый remote, toolchain и architectural skeleton

## Цель

Создать пустой source-monorepo с одной историей, точным toolchain и запрещёнными
edges до переноса product code.

### G1.1. Repo bootstrap

- [x] `G1-001` Создать target directory только после G0 PASS.
- [x] `G1-002` `git init -b main`; проверить, что `.git` ровно один.
- [x] `G1-003` Создать выбранный remote как private по умолчанию, если owner не указал public.
- [x] `G1-004` Добавить `origin`; проверить fetch/push dry connectivity.
- [x] `G1-005` Создать README с product purpose, local-only boundary и status.
- [x] `G1-006` Добавить `CONTEXT.md`, ADR directory, security policy и contribution rules.
- [x] `G1-007` Добавить `AGENTS.md` с safety, gates и domain language.
- [x] `G1-008` Добавить `.editorconfig`, `.gitattributes`, `.gitignore`, secret patterns.
- [x] `G1-009` Запретить nested `.git`, extra lockfiles и generated evidence в Git.

### G1.2. Exact toolchain

- [x] `G1-010` Сверить официальные releases на дату выполнения; не использовать плавающий `latest`.
- [x] `G1-011` Зафиксировать production Node LTS и отдельные learning runtime lanes.
- [x] `G1-012` Зафиксировать exact pnpm, Nx, Next, React, TypeScript, Nest, Go, Java/.NET/Kotlin toolchains.
- [x] `G1-013` Сохранить источник и дату каждого version decision в `toolchain.lock.json`.
- [x] `G1-014` Один risky major upgrade = отдельный commit/gate amendment.
- [x] `G1-015` Настроить Corepack/frozen lockfile.
- [x] `G1-016` Создать root `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`.
- [x] `G1-017` Создать Go workspace только для Go-owned projects, без TS dependency cycles.

### G1.3. Target tree и boundaries

- [x] `G1-018` Создать `apps/web`, `apps/api`, `services/task-runtime` placeholders.
- [x] `G1-019` Создать `packages/contracts`, `clients`, `domain`, `data`, `ui`, `observability`, `testkit`.
- [x] `G1-020` Создать `content`, `infra`, `tools`, `docs` roots.
- [x] `G1-021` Ввести Nx tags `scope`, `type`, `owner`, `runtime`, `stability`.
- [x] `G1-022` Запретить domain→domain direct imports; orchestration только application layer.
- [x] `G1-023` Запретить UI→DB/Runtime internals.
- [x] `G1-024` Запретить contracts package содержать business policy/content.
- [x] `G1-025` Добавить intentionally failing fixtures и доказать, что boundary tests их ловят.
- [x] `G1-026` Добавить CODEOWNERS по bounded context.

### G1.4. CI bootstrap

- [x] `G1-027` Создать PR workflow: install, format, lint, typecheck, unit, boundary, secret scan.
- [x] `G1-028` Pin Actions к full commit SHA и минимальным permissions.
- [x] `G1-029` Добавить dependency review и CodeQL для relevant languages.
- [x] `G1-030` Добавить lock/generated drift checks.
- [x] `G1-031` Cache не содержит secrets, DB, hidden tests или browser recordings.
- [x] `G1-032` Remote cache не вводить без measured team need; local/Nx cache достаточно.

### Gate G1

- [x] `G1-033` Fresh clone install проходит frozen.
- [x] `G1-034` Nx graph строится и не имеет forbidden cycles.
- [x] `G1-035` Policy negative fixtures PASS.
- [x] `G1-036` Один `.git`, один pnpm lockfile, zero nested sources.
- [x] `G1-037` CI на `main` зелёный.
- [x] `G1-038` Commits: `build(g1): bootstrap greenfield platform workspace`; `ci(g1): establish policy gates`.
- [x] `G1-039` `origin/main == HEAD`.
- [x] `G1-040` `gate.json.status = PASS`.

---

# G2 — One-command stack, StackSession и local observability

## Цель

Сделать local lifecycle продуктовой capability до переноса UI/domain.

### G2.1. One Compose project

- [x] `G2-001` Создать один root `compose.yaml`.
- [x] `G2-002` `FLUENT_STACK_ID` уникален для checkout/worktree/CI.
- [x] `G2-003` Удалить `container_name` и explicit global volume names.
- [x] `G2-004` Core: web, api, runtime-control, PostgreSQL; optional profiles: observability, ai, labs, debug.
- [x] `G2-005` Web — единственный обязательный host port.
- [x] `G2-006` Healthchecks + `service_healthy`; приложения имеют retry/backoff.
- [x] `G2-007` Containers non-root, read-only root, tmpfs scratch, dropped capabilities и limits.
- [x] `G2-008` Durable/projection/cache/worker resources имеют owner/stack/kind/TTL labels.
- [x] `G2-009` Никакой core application service не получает Docker socket.

### G2.2. Lifecycle CLI

- [x] `G2-010` `pnpm doctor --json` read-only проверяет toolchain/Docker/ports/env/resources.
- [x] `G2-011` `pnpm dev` выполняет doctor → build/up --wait --remove-orphans → summary → watch.
- [x] `G2-012` `pnpm status --json` показывает ровно один stack ID и expected/observed resources.
- [x] `G2-013` `pnpm down` не использует `-v` и сохраняет durable data.
- [x] `G2-014` `pnpm clean:ephemeral --dry-run` показывает exact allowlist.
- [x] `G2-015` `--apply` удаляет только previewed stack-labeled set.
- [x] `G2-016` `pnpm data:backup|restore|reset --confirm` versioned и scoped.
- [x] `G2-017` Никогда не вызывать global prune/builder prune.
- [x] `G2-018` Fresh clone cold target и warm restart target измеряются и записываются.

### G2.3. StackSession и incident history

- [x] `G2-019` Создать schema `StackSession.v1`.
- [x] `G2-020` Session начинается до Postgres/Collector preflight.
- [x] `G2-021` Сохранять source/release/toolchain/expected resources.
- [x] `G2-022` Сохранять observed health transitions, migration/cache/volume state.
- [x] `G2-023` Сохранять shutdown/failure/cleanup result.
- [x] `G2-024` Append-only state имеет 90-day/100 MiB policy.
- [x] `G2-025` `doctor` ловит orphan containers/volumes/networks, missing labels, expired workers и drift.
- [x] `G2-026` `pnpm incident:capture --session` создаёт redacted checksummed bundle.
- [x] `G2-027` Failed preflight и failed startup имеют отдельные tested scenarios.

### G2.4. Technical telemetry

- [x] `G2-028` Создать vendor-neutral observability contract и forbidden-field list.
- [x] `G2-029` Использовать semantic service roles, не `prometheus|loki|jaeger` как domain enum.
- [x] `G2-030` Добавить один `grafana/otel-lgtm` observability profile с pinned digest и `/data` volume.
- [x] `G2-031` Promtail, отдельные Jaeger/Prometheus/Loki/Grafana не добавлять.
- [x] `G2-032` Alloy отсутствует до отдельного measured log-collection ADR.
- [x] `G2-033` Trace/metric exporter outage не влияет на readiness/verdict.
- [x] `G2-034` Structured stdout JSON имеет trace/span IDs и bounded Docker logging.
- [x] `G2-035` Next/Nest/Go skeleton trace проходит через OTLP.
- [x] `G2-036` Raw source/answers/prompts/hidden tests/secrets отсутствуют в telemetry.
- [x] `G2-037` Retention/disk budget проверяется `doctor`, общий target 6–8 GiB.

### Gate G2

- [x] `G2-038` Fresh clone `pnpm dev` PASS.
- [x] `G2-039` `status` не показывает одновременно противоречащие dev/package realities.
- [x] `G2-040` Start/stop/restart/failure sessions persisted.
- [x] `G2-041` Orphan/cache/schema/image drift negative tests PASS.
- [x] `G2-042` Telemetry off/on/outage journeys PASS.
- [x] `G2-043` Zero Fluent resources остаются после disposable stack test; durable test data сохранены где ожидается.
- [x] `G2-044` Commit: `feat(g2): establish deterministic local control and telemetry planes`.
- [x] `G2-045` `gate.json.status = PASS`.

---

# G3 — Next foundation, design system и settings

## Цель

Построить production Next shell, не пустой mock и не механическую копию Vue.

### G3.1. Next architecture

- [x] `G3-001` Next App Router и Node runtime настроены exact versions.
- [x] `G3-002` Server Components default; Client boundary inventory reviewable.
- [x] `G3-003` Route groups разделяют learner, Studio и operator surfaces.
- [x] `G3-004` Session/auth boundary не полагается на browser-supplied authority.
- [x] `G3-005` Server actions используются только там, где ownership и retry semantics ясны.
- [x] `G3-006` I/O boundaries валидируются generated Zod decoders; domain internals не оборачиваются Zod повсеместно.
- [x] `G3-007` Error/loading/not-found/empty/offline/degraded states существуют до feature pages.
- [x] `G3-008` `instrumentation.ts` и `onRequestError` подключены без browser leakage.

### G3.2. Fluent design system

- [x] `G3-009` Перенести primitive/semantic/component/motion tokens через Port Ledger.
- [x] `G3-010` Создать packages `ui/tokens`, `ui/primitives`, `ui/learning`, `ui/icons`.
- [x] `G3-011` Tailwind theme генерируется из tokens, не дублирует значения вручную.
- [x] `G3-012` shadcn используется как audited source registry; copied code принадлежит repo.
- [x] `G3-013` Radix/headless primitives не форкаются без причины.
- [x] `G3-014` Variant API типизирован, component anatomy документирована.
- [x] `G3-015` Instrument Glass/Liquid Glass применяется иерархично, без blur-on-everything.
- [x] `G3-016` Contrast, forced-colors, reduced-motion и transparency fallback PASS.
- [x] `G3-017` Custom icons имеют единый grid/stroke/fill и accessible naming.
- [x] `G3-018` Storybook/state catalog покрывает interactive states и long RU/EN copy.

### G3.3. Shell/settings

- [x] `G3-019` Port header, collapsible navigation, profile/settings, search/command palette.
- [x] `G3-020` Port RU/EN и light/dark/system preferences server-safely.
- [x] `G3-021` Нет hydration flash или theme mismatch.
- [x] `G3-022` Profile menu/popover позиционируется у trigger, а не случайно в центре.
- [x] `G3-023` Focus management, escape, outside click и keyboard loop корректны.
- [x] `G3-024` Navigation fully collapsed освобождает layout, а не только уменьшает ширину.
- [x] `G3-025` Scroll ownership определён для shell и каждой workbench page; body-lock только у modal.
- [x] `G3-026` Control Center route показывает StackSession projection, не vendor iframe как authority.

### Gate G3

- [x] `G3-027` Story/unit/component/a11y checks PASS.
- [x] `G3-028` Visual matrix 1440×900, 1728×1117, 2560×1440, 390×844 × RU/EN × themes PASS.
- [x] `G3-029` Keyboard-only shell journey PASS.
- [x] `G3-030` No horizontal clipping/overlap/scroll trap in required viewports.
- [x] `G3-031` Visual deltas against reference classified and signed, не скрыты threshold.
- [x] `G3-032` Commits: `feat(g3): establish Next application shell`; `feat(g3): port Fluent design system`.
- [x] `G3-033` `gate.json.status = PASS`.

---

# G4 — Program, TrackView, route registry и Atlas

## Цель

Перенести навигационную модель и граф, сохранив смысл и доступность.

### G4.1. Curriculum domain

- [x] `G4-001` Зафиксировать `TrackView`, `LearningModule`, `Lesson`, `QuestionPlacement`, `Activity`, readiness dimensions.
- [x] `G4-002` Создать provider-owned curriculum contracts и generated clients.
- [x] `G4-003` Route registry строится только из released curriculum projection.
- [x] `G4-004` Browser не выводит readiness по labels/title/task filenames.
- [x] `G4-005` Generic modules переиспользуются placement, а не copy/paste.
- [x] `G4-006` Path-specific forbidden-set policy предотвращает JVM в Node native, Node event loop в Java native и т.п.
- [x] `G4-007` Versioned prerequisites DAG валидируется на cycles/orphans/unreachable nodes.

### G4.2. Learner surfaces

- [x] `G4-008` Port Program landing с честными path statuses и denominators.
- [x] `G4-009` Port TrackView modules/lessons/checkpoints/progress.
- [x] `G4-010` Port Atlas graph с zoom/pan/fit/reset/minimap по evidence необходимости.
- [x] `G4-011` Node hit areas, label collision, zoom text scale и connector routing tested.
- [x] `G4-012` Atlas имеет semantic list/tree fallback и keyboard navigation.
- [x] `G4-013` Selected/current/ready/locked/mastered states визуально и семантически различимы.
- [x] `G4-014` Graph selection синхронизирует detail panel и URL.
- [x] `G4-015` Empty/partial/degraded release states объясняют причину и next action.

### G4.3. Reference parity

- [x] `G4-016` Frozen route manifest полностью классифицирован.
- [x] `G4-017` Каждый reference route имеет target URL/redirect/retired rationale.
- [x] `G4-018` 43-route baseline или его frozen successor reconciled 100%.
- [x] `G4-019` Deep links и browser back/forward PASS.
- [x] `G4-020` Program/Track/Atlas data parity сравнивается по IDs, не по тексту screenshot.

### Gate G4

- [x] `G4-021` DAG/cycle/orphan/relevance policy tests PASS.
- [x] `G4-022` Route manifest unresolved = 0.
- [x] `G4-023` Atlas desktop/narrow visual and interaction journeys PASS.
- [x] `G4-024` Accessibility list fallback даёт все действия графа.
- [x] `G4-025` Commits: `feat(g4): complete route registry and Atlas navigation`; `feat(g4): add provider-owned curriculum contracts`.
- [x] `G4-026` `gate.json.status = PASS`.

---

# G5 — Question Catalog, Lesson и content release

## Цель

Перенести знания без переноса dual authority и CMS topology.

### G5.1. Canonical content model

- [x] `G5-001` Определить schemas QuestionCard, semantic revision, translation, provenance, placement и review.
- [x] `G5-002` Question Catalog реализовать как Nest module за `QuestionCatalogPort`.
- [x] `G5-003` Не копировать Brain service boundary автоматически.
- [x] `G5-004` PostgreSQL migrations имеют expand/contract и rollback/recovery plan.
- [x] `G5-005` RU/EN — revisions одного semantic card, не разные learner items.
- [x] `G5-006` Primary Question отделён от Supporting Prompt и raw Brain row.
- [x] `G5-007` Theory card не рекламирует Open Lab без assessed Activity.
- [x] `G5-008` Answer layers: concise, understanding, mechanism, traps, follow-ups, evidence, sources.
- [x] `G5-009` Citation/provenance/license обязательны для publish.
- [x] `G5-010` Graph edges typed, reviewed, versioned и не выводятся из embedding автоматически.

### G5.2. Import и deterministic release

- [x] `G5-011` Создать read-only legacy importer по frozen release IDs.
- [x] `G5-012` Import идемпотентен и пишет quarantine вместо silent fallback.
- [ ] `G5-013` Reconcile all reference cards/revisions/placements/edges: imported|merged|quarantined|retired(reason).
- [ ] `G5-014` Duplicate resolution сохраняет provenance и supersession chain.
- [x] `G5-015` Release bundle использует canonical JSON, stable sort, sharded JSONL.zst, checksums и attestation.
- [x] `G5-016` Двойная сборка одного release даёт одинаковые logical hashes.
- [x] `G5-017` Большие media/sealed artifacts идут через `ArtifactStorePort`; local adapter project-scoped, S3 adapter optional.
- [x] `G5-018` Developer checkout materializes ignored Markdown; он не становится second authority.

### G5.3. Learner Lesson UI

- [x] `G5-019` Lesson показывает route context, primary question, supporting prompts и assessed activities.
- [x] `G5-020` Long RU/EN headings, code, tables, citations и callouts не ломают layout.
- [x] `G5-021` Конспект, practice, evidence и related graph имеют ясные отдельные actions.
- [x] `G5-022` Reveal/hint события persisted как Assistance Events, не mastery.
- [x] `G5-023` Search/filter results сохраняют path placement context.
- [x] `G5-024` Direct question URL не теряет Lesson/Track navigation.

### Gate G5

- [ ] `G5-025` Frozen content counts/hashes reconciled 100%; unexplained delta = 0.
- [x] `G5-026` Migration rollback + restore PASS.
- [x] `G5-027` Release double-build determinism PASS.
- [x] `G5-028` No raw prompt/answer/hidden content in telemetry.
- [x] `G5-029` Question/Lesson/search/graph browser journeys PASS RU/EN/themes.
- [x] `G5-030` Commit: `feat(g5): port governed question catalog and lesson releases`.
- [ ] `G5-031` `gate.json.status = PASS` — seed release gate is `PASS_WITH_LIMITATIONS`; full corpus reconciliation is G11.

> G5 note: the greenfield repository has a fully verified five-card seed slice.
> `G5-013`, `G5-014`, `G5-025` and the final `G5-031` remain open until the
> complete Brain/Vault corpus is reconciled with explicit supersession and zero
> unexplained delta. See `fluent-interview-platform/docs/verification/greenfield/G5/`.

---

# G6 — Golden Node Run и safe execution boundary

## Цель

Доказать первый полный executable slice без mastery.

### G6.1. Runtime port

- [x] `G6-001` Port exact Runtime contracts, manifests, digest/resource/sanitization primitives через Port Ledger.
- [x] `G6-002` Разделить control API, sandbox supervisor и disposable workers:
      `WorkerSupervisor` boundary отделяет control plane от process-backed
      disposable worker; Docker/namespace implementation остаётся отдельным
      hardening scope.
- [x] `G6-003` Web/Nest/runtime-control не имеют Docker socket.
- [x] `G6-004` Если local sandbox supervisor использует Docker API, он isolated, allowlisted, authenticated и отдельно threat-modeled. Для текущего process-backed supervisor Docker API не используется; отдельная Docker trust zone остаётся promotion scope.
- [x] `G6-005` Supervisor разрешает только pinned image, fixed command, one approved file и project-scoped runtime labels.
- [x] `G6-006` Worker: network none by default, non-root, read-only root, tmpfs, caps drop, seccomp, pids/cpu/memory/time limits. Текущий runtime container и Node permission model покрывают non-root/read-only/tmpfs/caps/pids/cpu/memory/time; OS-level namespace none остаётся promotion scope.
- [x] `G6-007` Attempt/revision/stack/TTL labels обязательны; reconciler удаляет expired workers. Реализовано для process-backed leases; Docker object labels/container reconciler остаются promotion scope.
- [x] `G6-008` Host paths, arbitrary images/commands/env/secrets отклоняются.
- [x] `G6-009` Cancellation/timeout/crash/cleanup имеют typed results.
- [x] `G6-010` Runtime status перечисляет exact supported profiles/releases.

### G6.2. Run contract

- [x] `G6-011` `Run` использует public/starter feedback и не создаёт mastery.
- [x] `G6-012` Request содержит exact TaskFamily/TaskRevision/runtime profile/source digest.
- [x] `G6-013` Idempotency и retry semantics versioned.
- [x] `G6-014` Output sanitized, bounded, ordered и корректно различает compile/runtime/timeout/refusal.
- [x] `G6-015` Run сохраняет PredictionEvidence до reveal.
- [x] `G6-016` Run event и Technical Telemetry связаны trace/attempt IDs, не user labels.

### G6.3. Practice workbench

- [x] `G6-017` Port editor, terminal/output и task instructions как reusable
      learning components (`RuntimeEditor`, `RuntimeActionBar`,
      `RuntimeEvidencePanel`; CodeMirror/xterm остаются optional до измеренной
      необходимости).
- [x] `G6-018` Editor заполняет доступную высоту, resize/scroll ownership tested.
- [x] `G6-019` Language/runtime selector показывает только compatible released options.
- [x] `G6-020` Node golden task предлагает JS/TS только если обе revisions реально существуют. Shared `releasedProfilesForTask()` показывает JS-only при текущем release и разрешает TS только с released revision 2; target `72cc77c`/`4cacf9c`.
- [x] `G6-021` Run, reset, hints, errors, loading/cancel/retry имеют ясные states.
- [x] `G6-022` xterm/large editor chunks lazy-loaded; initial route budget соблюдён. Для текущего source-owned textarea heavy editor отсутствует (N/A); измеренный route/chunk budget PASS, при добавлении пакета пункт reopen.
- [x] `G6-023` Keyboard, screen-reader labels, focus after run и terminal fallback PASS.

### Gate G6

- [x] `G6-024` Golden Node path→lesson→question→task→Run проходит fresh clone;
      clean-checkout journey `92f7e5f`/`ee08541`, 5 HTTP 200 routes и live Run
      evidence записаны в target G6.
- [x] `G6-025` Canonical/starter/malformed/compile/runtime/timeout/cancel/security vectors PASS;
      `1305f6f`/`8ed3fcb`/`9bfd00c`, live `runtime:vectors`, 8 vectors и
      post-cancel recovery evidence.
- [x] `G6-026` Seeded wrong solutions действительно падают.
- [x] `G6-027` Run не создаёт accepted/mastery/unlock.
- [x] `G6-028` Worker cleanup leaves zero expired containers/resources. В текущем process scope registry после cleanup/reconcile оставляет `activeLeases=0`; Docker per-attempt resources остаются promotion scope.
- [x] `G6-029` Shared trace Next→Nest→Runtime→worker PASS; `2815afa`/`3261ea9`/`d4f255c`,
      live `pnpm runtime:trace` сохраняет W3C trace ID в probe/info/Run и
      подтверждает cleanup без learner-state mutation. Внешний collector и
      isolated production worker остаются в promotion scope.
- [x] `G6-030` Commit: `feat(g6): deliver safe golden Node run slice`.
- [ ] `G6-031` `gate.json.status = PASS`.

---

# G7 — Submit, hidden suites, verdict и Evidence

## Цель

Добавить authoritative assessment и доказать non-disclosure.

### G7.1. Submit contract

- [x] `G7-001` `Submit` — отдельный endpoint/command/schema/operation.
- [x] `G7-002` Hidden suite хранится вне learner-readable image/mount/source tree.
- [x] `G7-003` Runtime получает sealed suite только в execution trust zone.
- [x] `G7-004` Verdict связывает task/revision/profile/image/suite/rubric/source digests.
- [x] `G7-005` Result types: pass, fail, error, timeout, refused; learner fail ≠ platform error.
- [x] `G7-006` Retry/idempotency/replay policy не создаёт duplicate Evidence.
- [x] `G7-007` Hidden suite canary ищется во всех объявленных API/log/trace/stdout/stderr/artifact surfaces; production artifact manifest scan PASS.
- [x] `G7-008` Browser tampering/self-grade/LLM text не меняют verdict.

### G7.2. Evidence chain

- [x] `G7-009` Prediction, Run, Submit, Explanation, Defense, Reflection и Repeat имеют отдельные evidence kinds; canonical mapping и mismatch guards зафиксированы в G7 evidence contract.
- [x] `G7-010` Evidence references immutable revisions и evaluator policy.
- [x] `G7-011` Accepted executable evidence создаётся только из pass verdict.
- [x] `G7-012` Explanation/defense требуют versioned rubric/evaluator, точный placement и не наследуют pass автоматически; deterministic Node slice PASS, human/semantic review остаётся отдельным promotion gate.
- [x] `G7-013` Progress projection rebuildable из canonical events/evidence; deterministic rebuild test PASS.
- [x] `G7-014` Replay не раскрывает forbidden content.
- [x] `G7-015` Backup/restore сохраняет chain и hashes для текущего single-project ledger slice; disposable restore/readback/restart PASS, полный multi-tenant matrix остаётся promotion gate.

### G7.3. Learner UX

- [x] `G7-016` Run и Submit визуально различимы по intent/effect.
- [x] `G7-017` До Submit UI не обещает mastery.
- [x] `G7-018` Public feedback объясняет next action без hidden-test hints.
- [x] `G7-019` Evidence drawer/journal показывает источник verdict и exact revision; bounded Next proxy и empty/error/retry states проверены.
- [x] `G7-020` Failure recovery не теряет source/prediction.

### Gate G7

- [x] `G7-021` Hidden canary leakage = 0 по текущим declared artifact/API/log
      surfaces; `0b53ddc`, свежий scan 1 889 файлов, 0 findings. Future roots
      должны добавляться в manifest до release.
- [x] `G7-022` Submit adversarial/concurrency/idempotency matrix PASS;
      `fb0267d` + `d3a8864`, live 7-case matrix and four-way same-key replay
      proof.
- [x] `G7-023` Evidence rebuild + canonical backup/restore matrix PASS для
      локальной single-project authority chain; `943d6b8` и
      `backup-matrix-2026-08-30.json`. Managed multi-tenant DR остаётся
      отдельным promotion gate.
- [x] `G7-024` Browser authority forgery tests PASS.
- [x] `G7-025` Commit: `feat(g7): add authoritative submit verdict and evidence chain`.
- [ ] `G7-026` `gate.json.status = PASS` (остаётся `PASS_WITH_LIMITATIONS`:
      human/semantic review, secret-manager/remote trust and multi-language
      promotion gates остаются впереди, хотя локальная evidence/rebuild chain
      теперь закрыта).

---

# G8 — Progress, mastery, revision, projects и observability labs

## Цель

Сделать обучение долговременным и связать теорию с инженерной практикой.

### G8.1. Progress/mastery model

- [x] `G8-001` Progress, completion, mastery и interview readiness остаются разными claims.
- [x] `G8-002` Mastery policy требует нужные evidence facets и versioned rubric.
- [x] `G8-003` Cold repeat назначается server-side через реальное окно времени.
- [x] `G8-004` Time travel/browser clock не закрывает repeat.
- [x] `G8-005` Unseen transfer использует новую server-issued variant/context,
      привязанную к released placement и UUID idempotency key; forged IDs не
      попадают в ledger. Prompt-specific evaluator families остаются отдельным
      promotion scope.
- [x] `G8-006` Hint/AI dependence сохраняется как AssistanceEvent и влияет на claim policy прозрачно.
- [x] `G8-007` Revision planner использует prerequisites, decay и failed concepts.
- [x] `G8-008` Learning history переживает telemetry deletion/restart.

### G8.2. Projects

- [x] `G8-009` Port project books/milestones/rubrics/evidence links.
- [x] `G8-010` Project milestone считается Activity только при persisted assessed evidence.
- [x] `G8-011` Backend projects включают concurrency, data, messaging, resilience, deployment и observability; Node/Java/Go books имеют по 6 milestones, coverage 30/30 met.
- [x] `G8-012` Frontend project включает Next architecture, performance, a11y, security и design system; `next-production-frontend` опубликован отдельной lane.
- [x] `G8-013` System design project требует trade-off defense и failure drill;
      versioned rubrics и deterministic evaluator отклоняют неполные ответы,
      принимают только passing assessment evidence и не сохраняют raw
      responses. Human/mock semantic sign-off и production failure runtime
      остаются открытыми.
- [x] `G8-014` Reference repo/project links versioned и не становятся hidden fallback.

### G8.3. Observability как учебная поверхность

- [x] `G8-015` Deep lab поддерживает Predict→Run→Observe→Explain→Defend→Repeat для released Node scenario; UI sequential unlock и bounded evidence write подтверждены `21ce0bc`.
- [x] `G8-016` Trace/log/metric evidence scoped по attempt и redacted в
      server/local bundle boundary; OTLP export и load/cardinality promotion
      остаются частью G8-023.
- [x] `G8-017` Создать incident activities: event loop, DB lock, retry storm, cache stampede, queue replay, GC/memory. Структурный six-stage activity-pack/UI slice закрыт; runnable non-Node scenarios остаются promotion scope `G8-018`/`G8-023`.
- [ ] `G8-018` Создать Go/Kotlin/JVM/.NET diagnostic scenarios по мере runtime availability.
- [x] `G8-019` Learner не получает доступ к operator secrets/global logs: strict
      contract и metadata-only Next/Nest bundle отвергают raw fields.
- [x] `G8-020` Telemetry outage не отменяет deterministic assessment в Next
      observability write boundary; collector outage drill остаётся открытым.

### Gate G8

> Progress/project/recovery slice evidence: `fluent-interview-platform/docs/verification/greenfield/G8/`
> at target `dc60b63` (`PASS_WITH_LIMITATIONS`). Project catalog breadth for
> backend and Next.js plus deterministic system-design evaluator activities is
> closed; non-Node observability activities, off-host recovery, semantic
> defense review and the final G8 gate remain open.

- [x] `G8-021` Progress rebuild, cold-repeat timing, unseen transfer and hint-dependence tests PASS.
- [x] `G8-022` Project milestone evidence cannot be self-declared.
- [x] `G8-023` Observability lab trace/log/metric correlation PASS (local server bundle; OTLP/outage/load promotion remains).
- [x] `G8-024` Data backup/restore сохраняет progress/mastery/revision/projects (scoped local drill with exact ledger restore and cache restart boundary).
- [x] `G8-025` Atomic G8 commits: `136ed7e`, `66dd331`, `ae8026b`, `4967f1b`,
      `a6df0e8`, `eeab2ef`, `c678e5c`, `7057348`, `dc60b63`, `fcccf9b`.
- [ ] `G8-026` `gate.json.status = PASS`.

---

# G9 — Navigator/Tutor Orchestrator

## Цель

Перенести локального AI-помощника как contextual action engine, а не глобальный чат.

> G9 implementation and live evidence: `fluent-interview-platform/docs/verification/greenfield/G9/`
> at target `b487793` (evidence/index `e4abb67`/`e184912`; follow-up hardening
> includes `5f33982`, `37b84ad`, `c4de6e3`, `544e40b`, and PostgreSQL projection).
> The gate remains `PASS_WITH_LIMITATIONS` because automatic retention
> scheduling, cross-device sync, streaming/backpressure, real-provider
> availability and semantic review are deferred.

### G9.1. Provider/settings

- [x] `G9-001` Settings поддерживает LM Studio/OpenAI-compatible local endpoint и model discovery.
- [x] `G9-002` Connection test проверяет endpoint/model/capabilities без сохранения secret в logs.
- [x] `G9-003` Active model/provider config versioned и имеет explicit unavailable state.
- [x] `G9-004` AI optional: core learning работает без модели.
- [x] `G9-005` Spinner/stream/cancel/timeout/retry states честные (request/
  response contract; token streaming deferred).

### G9.2. Context and actions

- [x] `G9-006` Каждый turn получает immutable server-owned ContextRevision.
- [x] `G9-007` Context references exact track/lesson/question/task/attempt/evidence/rubric revisions.
- [x] `G9-008` Browser summary не является authority.
- [x] `G9-009` Actions typed: Socratic hint, misconception check, trace explainer, route planner, spoken coach, authoring proposal.
- [x] `G9-010` Hint ladder раскрывает минимально необходимое и фиксирует reveal level.
- [x] `G9-011` Ответы имеют citations/provenance на разрешённые sources.
- [x] `G9-012` Navigator никогда не вызывает submit/verdict/mastery/unlock/publish напрямую.
- [x] `G9-013` Tool allowlist, budgets и timeouts versioned.

### G9.3. Privacy/evals/observability

- [x] `G9-014` Prompts/outputs/source/answers не экспортируются в OTel.
- [x] `G9-015` Telemetry содержит provider/model/prompt-template hash/context hash/latency/tokens/status.
- [x] `G9-016` Conversation retention и deletion policy explicit.
- [x] `G9-016a` Explicit user-confirmed 90-day profile prune is server-clocked,
  contract-validated and covered by JSONL/PostgreSQL adapter tests plus live
  disposable Compose evidence; automatic scheduling remains deferred.
- [x] `G9-017` Eval corpus покрывает helpfulness, grounding, leakage, over-reveal, authority refusal и RU/EN.
- [x] `G9-018` Regression eval запускается при model/prompt/tool change.
- [x] `G9-019` AI failure не меняет learner evidence.

### Gate G9

- [x] `G9-020` Settings→connect→select→contextual help journey PASS.
- [x] `G9-021` Stale/forged context rejected.
- [x] `G9-022` Authority escalation/leakage evals PASS (deterministic output
  guard; connected-provider semantic red-team remains open).
- [x] `G9-023` No-model/offline/timeout UX PASS (deterministic + live browser
  no-model/offline scope; real provider outage remains G12).
- [x] `G9-024` Commit: `feat(g9): port contextual advisory Navigator`.
- [x] `G9-024a` Commit `b487793` + evidence `e4abb67` + index `e184912`:
  explicit Navigator retention prune, checksum ledger and live proxy proof.
- [ ] `G9-025` `gate.json.status = PASS`.

---

# G10 — Content Studio, governed import и release operations

## Цель

Закрыть author→review→publish→release→readback без обязательного Payload.

> G10 implementation and live evidence: `fluent-interview-platform/docs/verification/greenfield/G10/`
> at target `caa61b3`. The local Studio lifecycle, PostgreSQL authority, outbox
> projection, durable command-receipt projection and bounded JSONL/PostgreSQL
> benchmark are verified; managed transactions, batch ingestion and external
> consumers remain open.

### G10.1. Studio workflow

- [x] `G10-001` Protected Next Studio работает через Nest application commands.
- [x] `G10-002` Roles: author, reviewer, publisher; single-user local mode всё равно сохраняет явные decisions.
- [x] `G10-003` Draft/version/review comments/localization/provenance modeled.
- [x] `G10-004` Publish создаёт immutable revision, но learner видит только released placement bundle.
- [x] `G10-005` Two-person rule configurable для external/high-risk content.
- [x] `G10-006` Readback проверяет exact released IDs/hashes.
- [x] `G10-007` Payload adapter отсутствует, пока не доказаны multi-editor/scheduling/autosave needs.

### G10.2. External ingestion

- [x] `G10-008` Source snapshot, rights/license, acquisition date и reviewer обязательны.
- [x] `G10-009` Paid portals используются для product-pattern research, не bulk copying без разрешения. Versioned policy требует `pattern_only`, `observation_only`, `copiedContent=false` и license evidence; target `62e3c11`/`9609139`.
- [x] `G10-010` Candidate проходит exact/fuzzy/semantic dedupe, но auto-merge запрещён.
- [x] `G10-011` Import сохраняет source wording hash и transformed-original distinction.
- [x] `G10-012` Research brief создаёт оригинальный high-signal content, а не close paraphrase. Validator требует original author, transformation notes, no excerpt/close paraphrase и непустые original artifacts; target `62e3c11`/`9609139`.
- [x] `G10-013` TaskCandidate должен стать typed Activity/TaskFamily или rejected(reason).
- [x] `G10-014` Quarantine не считается production coverage.
- [x] `G10-015` Agent import batches имеют bounded size и reviewer samples
      (metadata-only local batch; promotion всё ещё reviewer-gated).

### G10.3. Release operations

- [x] `G10-016` Outbox обеспечивает reliable projection без Kafka по умолчанию
      (append-only PostgreSQL authority в выбранном режиме, JSONL fallback,
      metadata outbox projection и idempotent retry/reconcile; managed external
      consumer remains open).
- [x] `G10-017` Search/index/release projections rebuildable из authority
      (локальный deterministic rebuild manifest).
- [x] `G10-018` Backup/restore включает revisions, provenance, placements, outbox
      и artifacts manifest в allowlisted scoped bundle.
- [x] `G10-019` Rollback release не удаляет authored history; pointer transition
      append-only и проверен stale/unknown guards.
- [x] `G10-019a` Studio create/review/publish transitions are assembled before
      authority append and are atomic on the PostgreSQL ledger; deterministic
      `BEGIN → COMMIT`/rollback proof and live replay/restart evidence are
      recorded in target G10.
- [x] `G10-020` Redis/Kafka подключаются только после benchmark/ADR. The
      50-command disposable JSONL/PostgreSQL benchmark and explicit ADR select
      PostgreSQL locally; Redis/Kafka remain deferred until the documented
      `p95 > 100 ms`/backlog/multi-host triggers are met.

### Gate G10

- [x] `G10-021` Real author→review→publish→release→readback journey PASS.
- [x] `G10-022` Unauthorized publish/forged provenance/quarantine leakage tests PASS.
- [x] `G10-023` Release deterministic double-build PASS.
- [x] `G10-024` Rebuild projections from authority PASS (JSONL fallback и
      PostgreSQL authority/outbox projection проверены в disposable live
      stack).
- [x] `G10-025` Commit: `feat(g10): deliver governed authoring and release pipeline`.
- [x] `G10-025a` Commits `d36ae64` + `caa61b3`: bounded outbox benchmark,
      G10-020 ADR, machine-readable evidence and checksums; temporary stacks
      were scoped and removed.
- [ ] `G10-026` `gate.json.status = PASS` только после G10S-246; до этого
      G10 имеет `REMEDIATION_REQUIRED`. G10S является corrective subgate самого
      G10 и поэтому его выполнение не нарушает P-002.

---

# G10S — Strata authoring convergence и Question Brain migration

## Цель

Устранить двойную content authority до масштабного G11: перенести проверенную
модель Strata в target monorepo, связать её с существующим Studio через один
command/review workflow, выпускать детерминированный file bundle и импортировать
его в serving catalog без доступа API к authoring schema. Первый и обязательный
proof — полный slice `C098 / Node.js Event Loop`.

## Статус и граница

- Source Strata: `/Users/sergeyzhechko/developer/strata`, baseline
  `main@ec3b680`.
- Source research/quarantine: `/Users/sergeyzhechko/developer/questions`, включая
  `questions.jsonl` (`2526` records; rights/disposition проверяются заново, а не
  доверяются summary).
- Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`.
- G10S не считается начатым, пока preflight ниже не сохранён в evidence.
- Уже реализованные G10 Studio и `question-catalog.v1` являются migration inputs,
  а не параллельными permanent authorities.
- До independent review standalone Strata остаётся clean, запускаемым и
  неизменяемым reference oracle.

| Пакет | Диапазон | Результат/commit boundary | Кто закрывает |
| --- | --- | --- | --- |
| Input freeze | `001–018` | source manifests + `docs(g10s): freeze…` | implementing agent |
| Decisions | `019–039` | ADR/ownership/rollback + `docs(g10s): lock…` | implementing agent |
| Workspace | `040–060` | Nx projects/toolchain/boundaries + `feat(g10s): integrate…` | implementing agent |
| Database | `061–090` | schema/roles/grants/migrations + `feat(g10s): establish…` | implementing agent |
| Domain | `091–115` | identity/layers/tasks/invariants + `feat(g10s): converge…` | implementing agent |
| Studio | `116–136` | one command authority/no dual-write + `feat(g10s): converge Studio…` | implementing agent |
| Corpus | `137–161` | rights/quarantine/import metadata + `feat(g10s): migrate…` | implementing agent |
| Adapter | `162–186` | deterministic bundle/loss ledger/import + `feat(g10s): export…` | implementing agent |
| Vertical slice | `187–209` | complete C098 journey + `feat(g10s): prove…` | implementing agent |
| Retirement readiness | `210–225` | parity/archive/rollback + conditional `chore(g10s): retire…` | implementing agent |
| Machine handoff | `226–244` | evidence + `AWAITING_INDEPENDENT_REVIEW` | implementing agent |
| Independent acceptance | `245–246` | P0/P1 closure and G10S PASS | Codex/owner |

### Execution update — G10S-240 fast-forward push policy — 1 сентября 2026

Target `main` закрыл G10S-240 двумя локальными commit-gated коммитами без
push из-за ограничения GitHub Actions quota: implementation `383bc64`
(`feat(g10s): add fast-forward push policy gate`) и evidence `a3b032d`
(`docs(g10s): record fast-forward push policy gate`). Policy и schema
`g10s-gate-240.v1` требуют fast-forward-only, local PASS и exact direct-child
anchor G10S-239; allowlist implementation содержит ровно пять путей.

На implementation/evidence boundaries полный `pnpm check`,
`pnpm boundary:check` и `pnpm toolchain:check` прошли. Machine report
`G10S-240-push-policy-2026-09-01.json` фиксирует `15/15` локальных assertions
PASS: commit/path/parent/diff, пять receipts, main/ancestry/direct-child/clean,
предыдущий G10S-239 full-check receipt и push-disabled control. Read-only
`git ls-remote origin refs/heads/main` оставлен как `OPEN`; `pushAllowed=false`
и `pushPerformed=false` намеренно отражают владельческий запрет, а не скрывают
неподтверждённый remote state. Evidence metadata-only: тела команд, исходники,
вопросы/ответы, секреты, DB/Docker mutations и внешние записи отсутствуют.

Следующий executable пункт — `G10S-241`: пересмотреть retained limitations
G10 и разнести каждую открытую capability в G11/G12 с owner и exact trigger.

### Execution update — G10S-241 limitation routing — 1 сентября 2026

Target `main` закрыл G10S-241 двумя локальными commit-gated коммитами без
push из-за ограничения GitHub Actions quota: implementation
`3783ca7f8c78ddef99552ba7b820f682c1cdbb59` (`feat(g10s): classify G10
limitations`) и evidence `764645a81af52fa37a97f1c65de4c7afa212ea8f`
(`docs(g10s): record G10 limitation routing gate`). Implementation является
прямым ребёнком G10S-240 evidence `a3b032d`; allowlist содержит ровно пять
путей. В процессе обнаружен и исправлен ложный порядок ключей в
`destinationCounts`, поэтому финальный gate не допускает зависимость от
порядка JSON-полей.

Machine report
`G10S-241-limitation-routing-2026-09-01.json` фиксирует **34/34 PASS, 0 FAIL,
6 OPEN, 0 SKIPPED**. Все шесть retained limitations из G10 покрыты ровно по
одному маршруту, с ordinal 1–6, owner, exact trigger и следующим G11/G12 gate;
состояние каждой записи — `TRANSFERRED_OPEN`, а не product `DONE`. Источники
G10 и предыдущий G10S-240 receipt проверены по SHA-256. Gate metadata-only:
тела контента/команд и секреты не записываются, DB/Docker mutations и push не
выполнялись. Полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` зелёные на implementation/evidence границах.

Evidence и handoff:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-241-limitation-routing-2026-09-01.{json,md}`.
Следующий executable пункт — `G10S-242`: отметить затронутые G11/G12 items как
`REVERIFY_AFTER_G10S` в evidence index и сохранить эту связь при миграции.

### Execution update — G10S-242 successor re-verification index — 1 сентября 2026

Target `main` закрыл G10S-242 двумя локальными commit-gated коммитами без
push из-за ограничения GitHub Actions quota: implementation
`c6e2aac7e050fa897d9ea58e5aceaaf8edd7c847` (`feat(g10s): mark successor
reverification items`) и evidence
`c7480f3cd0b9c7d6b6fad8c2d30f8f0f1e0052ab`
(`docs(g10s): record successor reverification gate`). Implementation является
прямым ребёнком G10S-241 evidence `764645a`; allowlist содержит ровно шесть
путей.

Machine report `G10S-242-reverification-2026-09-01.json` фиксирует **35/35
PASS, 0 FAIL, 4 OPEN, 0 SKIPPED**. Sidecar
`g10s-reverification-index.v1.json` помечает `G11-037`, `G12-R01`, `G12-R06` и
`G12-R16` состоянием `REVERIFY_AFTER_G10S`; их owner/trigger/evidence path
связаны с шестью limitation IDs G10 ровно по одному разу. Исторический
`G10S/evidence-index.v1.json` не переписан: entry count `428` и SHA-256
проверяются явно. G11/G12 statuses и source hashes зафиксированы; product
`DONE` не выставляется. Полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` зелёные на implementation/evidence границах, push не
выполнялся.

Evidence и handoff:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-242-reverification-2026-09-01.{json,md}`.
Следующий executable пункт — `G10S-243`: запретить implementing agent
выставлять product `DONE` и подготовить exact
`AWAITING_INDEPENDENT_REVIEW` handoff package.

### Execution update — G10S-243 independent review handoff — 1 сентября 2026

Target `main` закрыл G10S-243 двумя локальными commit-gated коммитами без
push из-за ограничения GitHub Actions quota: implementation
`fd4e85e2eaee24dce45e8a63cbe122993093b9d0` (`feat(g10s): freeze independent
review handoff`) и evidence
`d7969aa` (`docs(g10s): record independent review handoff`). Implementation
является прямым ребёнком G10S-242 evidence
`c7480f3cd0b9c7d6b6fad8c2d30f8f0f1e0052ab`; implementation allowlist содержит
ровно шесть путей.

Machine report
`G10S-243-independent-review-handoff-2026-09-01.json` фиксирует
`24/24 PASS, 0 FAIL, 1 OPEN, 0 SKIPPED`. Handoff package
`g10s-handoff-package.v1.json` связывает repository/remote `main`, anchor и
current implementation SHA, команду `pnpm install --frozen-lockfile && pnpm
dev`, migrations `1..18`, target PostgreSQL authority, четыре release IDs,
C098 route/revision/activity и evidence index. `reviewStatus` остаётся
`AWAITING_INDEPENDENT_REVIEW`, `productClaim` — `NOT_PRODUCTION_READY`,
`implementingAgentMaySetDone=false`, `ownerSignoffRequired=true`.

Обе границы прошли полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check`; post-evidence focused checks `3/3` также зелёные.
Evidence metadata-only: source/answer bodies, command outputs, secrets,
database/Docker mutations и push отсутствуют; historical G10S index не
переписан. Следующий executable пункт — `G10S-244`: отдельно проверить
полноту и immutable binding handoff package.

### Execution update — G10S-244 handoff completeness — 1 сентября 2026

Target `main` закрыл G10S-244 двумя локальными commit-gated коммитами без
push из-за ограничения GitHub Actions quota: implementation
`b0c75557d03cb9da68cee3d5380a181113123894` (`feat(g10s): verify handoff
completeness`) и evidence
`c2dfb81bac0ac73d4efdd04f9d6baee4db0b0dd1` (`docs(g10s): record handoff
completeness`). Implementation является прямым ребёнком G10S-243 evidence
`d7969aaa4655a0a0985efa255390988ec3c4f38a`; allowlist содержит ровно пять
путей.

Machine report
`G10S-244-handoff-completeness-2026-09-01.json` фиксирует **24/24 PASS,
0 FAIL, 1 OPEN, 0 SKIPPED** и статус `AWAITING_INDEPENDENT_REVIEW` при
чистом target `main`. Gate проверяет immutable SHA handoff package, prior
G10S-243 report, исторический evidence index (428 записей), прямую lineage
implementation/evidence и все coordinate groups: repository/remote/branch/
HEAD, start command, PostgreSQL migrations `1..18`, четыре release IDs,
C098 route/revision/activity, commits и evidence paths. Package controls,
coverage и prior report checks совпали; product `DONE` не выставляется.

Обе границы прошли полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check`; post-evidence focused `test:gate-244` — `3/3 PASS`.
Evidence metadata-only: source/answer bodies, command outputs, secrets,
database/Docker mutations и push отсутствуют; исторический G10S index не
переписан. Report SHA-256:
`e25e605e0ac565842c8fa1cf28c04f2d4dff980d3cc6d388260a85645debd5c5`.
Следующий executable пункт — `G10S-245`: независимый Codex review и
исправление всех найденных P0/P1 отдельными commit-gated slices.

### Execution update — G10S-245 independent review и fail-closed hardening — 1 сентября 2026

Target `main` закрыл G10S-245 локальными commit-gated slices без push из-за
Actions quota. Review `codex-cli 0.151.0-alpha.7.2` подтвердил исходный P1
по package schema, а повторная adversarial ревизия lineage implementation
`8ac2d4f76f3ef1557759a50a122823508af09087` нашла ещё два обхода: symbolic
`HEAD` принимался вместо immutable commit SHA и `target.clean=false` мог пройти
при чистом текущем checkout.

Закрывающая цепочка target:

- `8ac2d4f76f3ef1557759a50a122823508af09087` — immutable correction SHA,
  полная lineage и policy-count hardening;
- `9ff974f60f85efb3550da262ef045a319c72a399` — fail-closed validator:
  `cat-file -t` + 40-символьные SHA, реальный parent commit, строгий
  `clean=true`, два regression vectors;
- `b54e229452d286558d05fc1cf00f6310324f4ca6` — canonical object-ID check:
  40-hex branch aliases fail-closed, disposable Git regression vector;
- `b02ee63` — evidence/report docs обновлены на target `b54e229`, review P2
  зафиксирован.

Machine report
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-245-independent-review-and-fix-2026-09-01.json`
фиксирует `34/34 PASS, 0 FAIL, 1 OPEN, 0 SKIPPED`,
`target.lineageVerified=true`, `target.clean=true`, `promotion.g10s246=UNLOCKED`
при `productClaim=NOT_PRODUCTION_READY`. `validateReport` возвращает пустой
список failures на текущем target; adversarial mutations `clean=false`,
`currentHead=HEAD` и 40-hex branch alias теперь отклоняются. Полный `pnpm check`,
`pnpm boundary:check`, `pnpm toolchain:check` и focused `test:gate-245`
проходят; push не выполнялся.

Следующий executable пункт — `G10S-246`: owner sign-off и финальная
acceptance boundary. До него G11 breadth migration остаётся закрытой.

### Execution update — G10S-008 Studio startup baseline — 1 сентября 2026

Target `main` закрыл оставшийся preflight `G10S-008` локальным evidence-коммитом
`6179a77` (`docs(g10s): record Studio startup baseline`) без push из-за
ограничения Actions quota. Штатный `pnpm run dev` поднял scoped Compose project
`fluent-interview-platform-dev` на `http://127.0.0.1:47360/`: migrations `18/18`,
pending `0`, ожидаемые сервисы `6/6` (5 healthy, `api-data-init` exited `0`).
Read-only baseline подтвердил HTTP `200` для `/`, `/studio`,
`/api/studio/releases/active` и `/api/studio`; active release
`2026.08.28-questions.1`, Studio state: `1` candidate, `1` review, `1` release,
`3` audit events и `3` command receipts.

Изолированный `pnpm studio:postgres-journey` также прошёл полный
author→review→publish→readback seam: release
`2026.08.31-questions.122`, `importReplayStable=true`,
`readbackVerified=true`, четыре retired endpoint вернули `410`, disposable
Compose resources удалены в `finally`. Evidence metadata-only, без durable target
mutation, raw bodies и secrets; статус `PASS_WITH_LIMITATIONS` честно сохраняет
границу, что G10S-246 owner sign-off и G11 breadth всё ещё открыты.
Evidence: `fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-008-studio-baseline-2026-09-01.{json,md}`.
Полная `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` лестница
зелёная; push не выполнялся.

Следующий executable пункт остаётся `G10S-246`: owner sign-off и финальная
acceptance boundary. До него G11 breadth migration остаётся закрытой.

### Execution update — G10S-194 learner track-filter correction — 1 сентября 2026

В live-проверке после G10S-194 обнаружилась проекционная ошибка: `/practice`
рендерил весь observability-каталог на каждой языковой дорожке. Из-за этого
Java и Go показывали Node/PostgreSQL incidents, а planned-счётчик не отражал
реальный lane-specific набор. Это был дефект learner-проекции, а не повод
ослаблять уже закрытый path-join gate.

Target `main` исправлен двумя локальными commit-gated slices без push:

- `fa3979d` (`fix(g11): isolate observability labs by track`) добавляет
  доменный `observabilityScenariosForTrack(trackId)`, переводит learner
  страницу и её счётчики на этот helper и добавляет точный regression test;
- `aecce6b` (`docs(g11): record observability track-filter evidence`) сохраняет
  metadata-only evidence с browser-проверкой всех трёх дорожек.

После пересборки web-образа штатным `pnpm run dev -- --detached` live DOM
показал: Node — `node-event-loop-trace` и `postgres-db-lock` (2 planned, 1
released), Java — `cache-stampede` и `gc-memory-pressure` (2 planned), Go —
`retry-storm` и `queue-replay` (2 planned). На всех маршрутах `0` alerts и
`crossLanguageScenarioCount=0`. `pnpm --dir apps/web test` — `53/53 PASS`;
полные `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` — PASS.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-194-observability-track-filter-2026-09-01.{json,md}`.
Evidence metadata-only: тела контента, database/Docker mutations и push
отсутствуют. Это correction без изменения общего checkbox-счётчика; G10S-246
human owner sign-off и широкий G11 curriculum gate остаются открытыми.

### G10S.0. Preflight, baselines и decision intake

- [x] `G10S-001` Проверить exact roots через `git rev-parse --show-toplevel` для umbrella, target, Strata и questions; сохранить paths, branches, HEAD и remotes. Evidence: target `40122ae`, `G10S/preflight.json`.
- [x] `G10S-002` Проверить `git status --short --branch` во всех четырёх roots; неизвестные изменения остановят migration до provenance решения. Evidence records `questions` as known external-unversioned (no Git root), with no unknown working-tree changes.
- [x] `G10S-003` Подтвердить Strata baseline `ec3b680` либо записать reviewed SHA delta и повторить весь source baseline. Evidence: `G10S/source-manifest.json`.
- [x] `G10S-004` В Strata выполнить `npm run check`; сохранить 32 test results, 12 ADR links, 9 corpus gates или актуальные exact counts. Evidence: `G10S/preflight.json` and `commands.ndjson`.
- [x] `G10S-005` Выполнить `npm run db:up && npm run db:load && npm run db:load && npm run db:verify`; второй load обязан быть idempotent, invariants = 12 или reviewed delta. Evidence: 12 invariants and two successful loads.
- [x] `G10S-006` Выполнить representative queries из `schema/queries.sql`; сохранить metadata/results без paid prompt/answer bodies. Evidence: `G10S/preflight.json`.
- [x] `G10S-007` В target выполнить `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, `pnpm content:gates`; любой baseline FAIL исправляется отдельным pre-migration commit. Evidence: target check and boundary/toolchain runs are green.
- [x] `G10S-008` Запустить target `pnpm dev` в scoped Compose project и проверить current Studio author→review→publish→readback baseline. Evidence: target commit `6179a77`; `G10S-inputs/G10S-008-studio-baseline-2026-09-01.{json,md}`; `PASS_WITH_LIMITATIONS`, migrations `18/18`, services `6/6`, read-only routes `4/4` HTTP 200, isolated journey PASS and cleanup verified.
- [x] `G10S-009` Снять current serving counts/hashes: cards, revisions, translations, placements, reviews, graph edges, activities и release pointer. Evidence: `G10S/preflight.json` references G12 reconciliation hashes.
- [x] `G10S-010` Снять current Studio storage owners: PostgreSQL tables, JSONL fallback, outbox, command receipts, projections и backup members. Evidence: `servingBaseline.studioOwners`.
- [x] `G10S-011` Снять current Strata counts: questions, layers per kind/lang/depth, grants, provenance, task families/revisions, datasets и grading artifacts. Evidence: `strataBaseline` plus database query output.
- [x] `G10S-012` Пересчитать `questions.jsonl`: total, paid, company-linked, Claude/generated, external/unknown, duplicate/hash groups и malformed records; summary не заменяет command output. Evidence: metadata-only analysis in `preflight.json` and command receipt.
- [x] `G10S-013` Прочитать полностью `AGENTS.md`, `README.md`, `docs/migration.md`, `docs/plan.md`, `docs/adr/README.md` и все ADR Strata перед первым target edit. Evidence: source baseline was read before `40122ae`.
- [x] `G10S-014` Прочитать полностью `brain-reports/13-answers.md` и `14-answers-round-2.md`; решения перенести в target ADR без reinterpretation. Evidence: reports are recorded as source inputs; no body copied.
- [x] `G10S-015` Создать immutable source manifest с SHA-256 всех Strata schema/docs/fixtures и metadata-only manifest questions corpus. Evidence: `G10S/source-manifest.json` and `preflight.json`.
- [x] `G10S-016` Создать recoverable Git bundle/tag Strata baseline; проверить bundle clone и `npm run check` из него. Evidence: complete-history bundle clone passed 32 tests.
- [x] `G10S-017` Зафиксировать список данных, которые запрещено копировать в target Git: paid wording, paid answers, company-linked bodies, credentials, hidden evaluator assets и unknown-rights bodies. Evidence: `forbiddenCopy` and quarantine policy in `preflight.json`.
- [x] `G10S-018` Evidence commit: `feat(g10s): freeze migration inputs`; после commit Strata remains clean and the external questions corpus remains read-only/unversioned. Evidence: target commit `40122ae`; no push performed.

### G10S.1. ADR reconciliation и ownership map

- [x] `G10S-019` Создать target ADR «Strata is the authoring source of truth» со статусом Accepted и ссылками на source ADR, reports 13/14 и G10 evidence. Evidence: `fluent-interview-platform/docs/architecture/adr/0001-strata-authoring-and-release-seam.md`, commit `07fb21b`.
- [x] `G10S-020` ADR фиксирует, что Strata — CLI/build-time domain, не HTTP service и не дополнительный deployable/container. Evidence: target ADR §Decision summary/role matrix.
- [x] `G10S-021` ADR фиксирует одну PostgreSQL database, отдельную schema `strata` и отсутствие второй content database. Evidence: target ADR §Decision summary and rejected alternatives.
- [x] `G10S-022` ADR фиксирует три operational roles: authoring, release import, serving; naming может измениться, но privilege matrix — нет. Evidence: target ADR §Ownership and privilege matrix.
- [x] `G10S-023` ADR фиксирует file bundle как единственный Strata→serving seam; прямой cross-schema read import-процессом запрещён. Evidence: target ADR §Data flow and release seam.
- [x] `G10S-024` ADR фиксирует Studio как application workflow над Strata authority, а не отдельную authoring authority. Evidence: target ADR §Decision summary and Studio port ledger.
- [x] `G10S-025` ADR фиксирует Question identity `(kc, aspect, stack)` и challenge test: менять identity можно только с двумя reviewed non-duplicate counterexamples. Evidence: target ADR §Canonical content model.
- [x] `G10S-026` ADR фиксирует `generic` как существующий stack; запрещает ввод redundant `scope` в Question. Evidence: target ADR §Canonical content model.
- [x] `G10S-027` ADR фиксирует canonical prompt invariant и human-only review альтернативных rephrasings. Evidence: target ADR §Canonical content model.
- [x] `G10S-028` ADR фиксирует отказ от Probe; semantic variants получают aspect, executable prediction — Activity/Task/Drill. Evidence: target ADR §Canonical content model.
- [x] `G10S-029` ADR фиксирует `responseBudgetMin` как canonical-answer budget и явное исключение Activity execution time. Evidence: target ADR §Canonical content model.
- [x] `G10S-030` ADR фиксирует ownership: Question — response budget; Curriculum — placement/priority/patterns/prerequisites; Activity — execution budget. Evidence: target ADR §Canonical content model and owner matrix.
- [x] `G10S-031` ADR фиксирует v1 lossy adapter first и запрещает проектировать/выпускать v2 до фактического C098 loss ledger. Evidence: target ADR §Migration contract.
- [x] `G10S-032` ADR фиксирует rights policy: Solvit и любой paid/company-linked/unknown corpus — quarantine/reference only без публикации. Evidence: target ADR §Rights and quarantine.
- [x] `G10S-033` ADR фиксирует standalone retirement условия: parity, rollback, immutable archive, owner acknowledgement; до них deletion запрещён. Evidence: target ADR §Rollback and review boundary.
- [x] `G10S-034` Создать owner matrix «fact → command owner → DB owner → projection → reviewer»: для identity, prompt, answer layers, provenance, rights, revision, placement, graph edge, activity, verdict и progress. Evidence: `G10S/owner-matrix.json`, 16 facts.
- [x] `G10S-035` Проверить owner matrix на duplicate owner и ownerless facts; обе группы должны быть 0 до schema work. Evidence: `architecture:ownership` and test: 0 duplicate fact IDs, 0 ownerless facts, 0 duplicate command owners.
- [x] `G10S-036` Обновить Port Ledger: каждый G10 Studio capability получает `kept|adapted|replaced|retired(reason)` и target owner. Evidence: `G10S/studio-port-ledger.json`, 3 kept / 6 adapted / 0 replaced / 1 retired.
- [x] `G10S-037` Добавить rollback decision tree для каждой миграционной стадии: docs-only, schema-created, corpus-loaded, serving-imported, standalone-retired. Evidence: `G10S/rollback-decision-tree.md`.
- [x] `G10S-038` Проверить ADR links и vocabulary consistency; `check:links` должен иметь негативный fixture для broken relative ADR link. Evidence: `architecture:links` 6 files valid plus negative fixture test (target `816de78`).
- [x] `G10S-039` Commit: `docs(g10s): lock authoring authority and migration decisions`. Evidence: target commit `07fb21b`; `pnpm check`, `boundary:check`, `toolchain:check` green; no push.

### G10S.2. Monorepo project и toolchain integration

- [x] `G10S-040` Выбрать и документировать Nx project layout без generic dump folders: domain package, authoring CLI/tool, content assets и PostgreSQL migrations имеют отдельных owners. Evidence: `docs/architecture/monorepo-project-layout.md`, `nx show projects --json`, commits `e114cf5`/`85d951f`.
- [x] `G10S-041` Создать `packages/content-model` либо эквивалентный named package для framework-neutral schemas/types; не помещать DB/process code в contract package. Evidence: `packages/content-model`, strict Zod tests, commit `e114cf5`.
- [x] `G10S-042` Создать `tools/content-authoring` либо эквивалентный Nx project для CLI commands, gates и bundle export. Evidence: `tools/content-authoring/project.json`, integration output, commit `e114cf5`.
- [x] `G10S-043` Поместить authoring fixtures/content в явный versioned root с README о rights, language, review и release policy. Evidence: `content/authoring/README.md` and rights-cleared C098 fixture, commit `e114cf5`.
- [x] `G10S-044` Поместить Strata PostgreSQL migrations в единственную platform migration chain; runtime DDL и duplicate bootstrap SQL запрещены. Evidence: target `infra/postgres/migrations/0001..0008`, `architecture:migrations`, commit `6bc6f12`.
- [x] `G10S-045` Перенести только source files по source manifest; `.git`, `node_modules`, npm lock, standalone Compose state и generated artifacts не копировать. Evidence: `G10S/source-transfer-ledger.json` and `architecture:provenance`, commit `f52d925`.
- [x] `G10S-046` Сохранить source file→target file provenance map и SHA before/after; intentional edits имеют rationale. Evidence: `G10S/source-transfer-ledger.json` validates 41-file manifest, 13 mapped inputs and recalculated target hashes, commit `f52d925`.
- [x] `G10S-047` Конвертировать scripts с npm на root pnpm; новый nested `package-lock.json` не создаётся. Evidence: root `pnpm` scripts and single `pnpm-lock.yaml`, `drift:check`/`toolchain:check`, commit `e114cf5`.
- [x] `G10S-048` Согласовать TypeScript, Node, Zod, Vitest, Biome и Oxlint с root toolchain; любое version change — отдельный toolchain commit, без floating `latest`. Evidence: Node `v26.7.0`, root pins and Zod `4.5.1`, `pnpm toolchain:check`, commits `e114cf5`/`85d951f`.
- [x] `G10S-049` Разрешить текущий Zod delta Strata/platform осознанным pin/upgrade и записать compatibility proof. Evidence: `packages/content-model` pins Zod `4.5.1`; three compatibility tests pass, commit `e114cf5`.
- [x] `G10S-050` Добавить Nx `project.json` targets: typecheck, lint, test, fixtures, links, corpus, bundle, db-verify и integration. Evidence: target definitions and `pnpm architecture:affected`, commits `e114cf5`/`caf9d82`.
- [x] `G10S-051` Добавить tags/ownership (`scope:content`, `type:domain|tool|data`, owner) в принятый target taxonomy. Evidence: project tags plus 16-fact owner matrix with zero ownerless/duplicate facts, `architecture:ownership`.
- [x] `G10S-052` Добавить реальное boundary enforcement для content projects; наличие tags без fail-closed import rule не засчитывается. Evidence: `boundary:check` and negative fixtures for API→authoring/content-model→runtime, commits `07fb21b`/`e114cf5`.
- [x] `G10S-053` Создать негативный import fixture, который доказывает: web/API не может импортировать authoring CLI/DB adapters/hidden task assets. Evidence: `tools/dev/fixtures/forbidden-api-authoring.ts`, `boundary:check` expected violation.
- [x] `G10S-054` Разрешить serving использовать только versioned contract/projection types, не Strata repositories или migration internals. Evidence: `G10S/serving-boundary-2026-08-30.json`, `architecture:serving-boundary`, commit `6bc6f12`.
- [x] `G10S-055` `pnpm nx graph`/machine project graph включает новые projects без cycles и ownerless nodes. Evidence: `architecture:graph` reports 12 nodes, 9 edges, required content projects present, `cycles=[]`, `ownerless=[]`; commit `caf9d82`.
- [x] `G10S-056` `nx affected` на изменении prompt fixture запускает content gates/adapter tests, но не unrelated runtime builds; сохранить exact affected set. Evidence: `architecture:affected` records fixture → `content-authoring`, contract → `content-authoring + content-model`; all six content targets declared and dry-run is green; commit `caf9d82`.
- [x] `G10S-057` `nx affected` на contract change включает producer и consumers; негативный test ломает consumer при несовместимом schema change. Evidence: `architecture:affected` plus `contract-compatibility-2026-08-30.json` and negative test, commit `6bc6f12`.
- [x] `G10S-058` Root `pnpm check` включает новые targets и не вызывает Docker для pure unit path. Evidence: full target `pnpm check` green with content-model/content-authoring build, test and integration; `db-verify` remains `database=not-connected`, commits `e114cf5`, `816de78`, `85d951f`, `caf9d82`.
- [x] `G10S-059` `pnpm dev/down/doctor/status` остаются единственными product lifecycle commands; Strata не добавляет второй stack. Evidence: `docs/architecture/monorepo-project-layout.md`, authoring CLI is build-time only, no new Compose service.
- [x] `G10S-060` Commit: `feat(g10s): integrate Strata authoring projects into Nx workspace`; `pnpm check && git commit` или эквивалентная repo-required chain обязательна. Evidence: `e114cf5`; follow-up test/architecture commits `816de78`, `85d951f`, `caf9d82`; no push.

### G10S.3. One-database schema и role isolation

- [x] `G10S-061` Инвентаризировать platform migration authority и выбрать monotonic migration IDs без переписывания применённых migrations. Evidence: `G10S/migration-chain-2026-08-30.json`, `architecture:migrations`, commit `6bc6f12`.
- [x] `G10S-062` Создать schema `strata` через migration, не через application startup. Evidence: live disposable chain and `0007_strata_authoring.sql`, commit `6bc6f12`.
- [x] `G10S-063` Перенести language/layer-kind/KC/aspect/edge/question/layer/source-grant/provenance/task/dataset schema с сохранением constraints. Evidence: 17 Strata tables in the fresh rehearsal, `role-isolation-2026-08-30.md`, commit `6bc6f12`.
- [x] `G10S-064` Перенести migration 003 canonical preferred layer так, чтобы uniqueness не включала `ord`. Evidence: `layer_preferred_uk` migration plus live schema ownership assertion, commit `6bc6f12`.
- [x] `G10S-065` Добавить migration для `response_budget_min`; определить unit, bounds, nullability/default и conversion старого `duration_min`. Evidence: `strata.question.response_budget_min` constraint/default and content-model Zod contract, commit `6bc6f12`.
- [x] `G10S-066` Удалить/не переносить question-level `priority` и `patterns` после backfill ownership в Curriculum; before/after report обязан иметь unresolved = 0. Evidence: question schema omits both fields and disposable ownership assertion passes, commit `6bc6f12`.
- [x] `G10S-067` Создать DB roles с least privilege; credentials генерируются lifecycle tooling и не коммитятся. Evidence: four NOLOGIN roles and credential-free `0008`, `role-isolation-2026-08-30.md`, commit `6bc6f12`.
- [x] `G10S-068` Authoring role получает needed DML/sequence rights только в `strata`; write в serving `question_*` запрещён. Evidence: authoring transaction and INSERT/UPDATE/DELETE negative SQL, commit `6bc6f12`.
- [x] `G10S-069` Release-import role получает write только в allowlisted serving projection/release/outbox tables и не получает USAGE/SELECT на `strata`. Evidence: atomic projection transaction and denied Strata read, commit `6bc6f12`.
- [x] `G10S-070` Serving/API role получает read/command rights только для serving/application tables и не получает USAGE/SELECT на `strata`. Evidence: serving read/learner write and denied Strata SELECT/INSERT/UPDATE, commit `6bc6f12`.
- [x] `G10S-071` Migration/admin role не используется application containers после migrations. Evidence: `fluent_migration` is NOLOGIN and Compose has no migration application service, `role-isolation-2026-08-30.md`, commit `6bc6f12`.
- [x] `G10S-072` Настроить default privileges так, чтобы новые tables/sequences не расширяли роли автоматически. Evidence: explicit `ALTER DEFAULT PRIVILEGES ... REVOKE ALL` in `0008`, live role rehearsal, commit `6bc6f12`.
- [x] `G10S-073` Настроить explicit `search_path`; unqualified table names не могут подменить object в другой schema. Evidence: per-role search paths in `0008` and live privilege matrix, commit `6bc6f12`.
- [x] `G10S-074` Negative SQL: authoring `INSERT/UPDATE/DELETE question_*` fail. Evidence: three denied DML assertions in `g10s_role_checks.sql`, commit `6bc6f12`.
- [x] `G10S-075` Negative SQL: import `SELECT strata.question` и `USAGE ON SCHEMA strata` fail. Evidence: denied Strata read plus `has_schema_privilege(..., 'USAGE') = false` for import role, commit `6bc6f12`.
- [x] `G10S-076` Negative SQL: serving/API `SELECT/INSERT/UPDATE strata.*` fail. Evidence: three denied serving access assertions in `g10s_role_checks.sql`, commit `6bc6f12`.
- [x] `G10S-077` Negative SQL: public role не имеет create/use privileges в application schemas. Evidence: denied public CREATE and role privilege matrix, commit `6bc6f12`.
- [x] `G10S-078` Negative SQL: role cannot `SET ROLE` в migration/admin/другую application role. Evidence: denied `SET ROLE fluent_migration`, commit `6bc6f12`.
- [x] `G10S-079` Positive SQL: authoring может выполнить полный Strata authoring transaction. Evidence: committed synthetic KC/question/provenance/layer transaction, commit `6bc6f12`.
- [x] `G10S-080` Positive SQL: import может атомарно materialize serving release из bundle staging. Evidence: committed cards/revision/translation transaction, commit `6bc6f12`.
- [x] `G10S-081` Positive SQL: serving читает active release и пишет только разрешённые learner/application facts. Evidence: projection read plus assistance event append, commit `6bc6f12`.
- [x] `G10S-082` Concurrency test: два preferred prompt с разным `ord` одновременно — ровно один commit успешен. Evidence: `G10S/concurrency-2026-08-30.json`/`.md`; `pnpm architecture:concurrency` observed one `ord=0` commit, `ord=7` conflict on `layer_preferred_uk`, final preferred rows=1; target commits `72eea78` and `37bd477`.
- [x] `G10S-083` Idempotency test: migrations и fixture load повторяются без duplicates/data drift. Evidence: target `docs/verification/greenfield/G10S/idempotency-2026-08-30.json`/`.md`, `pnpm --filter @fluent/content-authoring integration` twice with byte-identical normalized output, migration-chain second apply with 17 Strata tables and source `npm run db:load` twice; target commit `9ed7c4a`.
- [x] `G10S-084` Fresh-database test применяет всю migration chain с нуля и проходит 12 inherited + platform invariants. Evidence: target `docs/verification/greenfield/G10S/fresh-database-2026-08-30.json`/`.md`; `pnpm architecture:fresh-db` created a disposable database, applied 8 migrations, observed 17 Strata tables, 4 least-privilege roles, all 12 inherited assertions and 7 platform invariants, then dropped the database; target commit `00b2163`.
- [x] `G10S-085` Upgrade-database test берёт copy текущего G10 database, применяет migrations, сверяет counts/hashes и Studio history. Evidence: target `docs/verification/greenfield/G10S/upgrade-database-2026-08-30.json`/`.md`; `pnpm architecture:upgrade-db` restored a custom-format dump into a disposable database, applied 8 migrations, preserved the 5 pre-existing public-table counts and Studio history hash (`b58fd792…61947`), materialized 8 new platform tables (5 → 13), then dropped the disposable database and removed the dump; target commits `c68293b` (implementation) and `62936ec` (evidence).
- [x] `G10S-086` Backup/restore включает schema, roles/grants metadata, serving projection и authoring records без credentials. Evidence: target `docs/verification/greenfield/G10S/backup-completeness-2026-08-30.json`/`.md`; `pnpm architecture:backup` applied all 8 migrations in a disposable database, captured four least-privilege roles (6 schema grants, 271 object grants, 0 memberships), verified Strata authoring plus public serving objects in the custom dump, and reported `credentialsDetected=false`; target commits `c018ed2` (rehearsal) and `51d24d4` (evidence).
- [x] `G10S-087` Restore в disposable database повторяет grants/invariants и exact logical hashes. Evidence: target `docs/verification/greenfield/G10S/restore-database-2026-08-30.json`/`.md`; `pnpm architecture:restore-db` restored a custom dump from a migrated source into a second disposable database, replayed the allowlisted role metadata, matched source/restored/target logical hash `4f528310…70f5cc`, matched role metadata (4 roles, 6 schema grants, 271 object grants, 0 memberships), and passed 12/12 role assertions; target commits `74c3242` (rehearsal) and `f1cb582` (evidence).
- [x] `G10S-088` API container environment/static bundle scan подтверждает отсутствие authoring DSN/role/password. Evidence: `G10S/serving-boundary-2026-08-30.json` scans API source/dist and Compose API environment; zero authoring DSN/role/password markers, commit `6bc6f12`.
- [x] `G10S-089` Static scan `apps/api`/`apps/web` подтверждает 0 imports authoring repositories и 0 raw `strata.` SQL. Evidence: `G10S/serving-boundary-2026-08-30.json` and `architecture:serving-boundary`; 629 files, zero violations, commit `6bc6f12`.
- [x] `G10S-090` Commit: `feat(g10s): establish isolated Strata schema and database roles`. Evidence: target commit `6bc6f12` plus follow-up evidence refresh `8de0a43`.

### G10S.4. Domain model и invariant convergence

- [x] `G10S-091` Перенести triple identity и сохранить unique `(kc_code, aspect, stack)` без дополнительного band/scope discriminator. Evidence: target `docs/verification/greenfield/G10S/domain-identity-2026-08-30.json`/`.md`; `pnpm architecture:identity` applied all 8 migrations in a disposable database, observed exact `UNIQUE (kc_code, aspect, stack)` constraint/index, accepted generic and node variants, rejected a duplicate triple, and confirmed no band/scope discriminator; target commits `2b8a20d` (rehearsal) and `4abd375` (evidence).
- [x] `G10S-092` Создать migration rejection report для source collisions; auto-merge вопросов запрещён. Evidence: target `docs/verification/greenfield/G10S/collision-report-2026-08-30.json`/`.md`; `pnpm architecture:collisions` grouped two normalized candidates for `c099|timers|generic` as `REVIEW_REQUIRED`, rejected one malformed identity, kept a distinct node candidate non-promotable, and reported `autoMergedRecords=0`; target commits `a6e9fed` (implementation) and `108e8ef` (evidence).
- [x] `G10S-093` Сохранить dynamic language table и ISO/BCP-47 normalization policy; closed enum RU/EN не использовать в authoring. Evidence: target `docs/verification/greenfield/G10S/language-policy-2026-08-30.json`/`.md`; `pnpm architecture:language` accepted dynamic `es`, `pt-BR`, and `zh-Hant` rows, canonicalized `pt-br`/`zh-hant`, rejected malformed tags, and reported no closed enum; target commits `7c590bc` (implementation) and `de6b8f7` (evidence).
- [x] `G10S-094` Сохранить layer kinds и versioned layers; edit создаёт новую version/preferred transition, а не destructive overwrite. Evidence: target `docs/verification/greenfield/G10S/layer-versioning-2026-08-30.json`/`.md`; `pnpm architecture:layers` preserved 14 layer kinds, rejected an in-place body update, retained two distinct version hashes, and atomically transitioned v1 `deprecated` → v2 `preferred`; target commits `e9c1f8f` (implementation) and `401c0b4` (evidence).
- [x] `G10S-095` Canonical prompt uniqueness действует на `(question, layer_key=prompt, lang, depth)` независимо от `ord/version`. Evidence: target `docs/verification/greenfield/G10S/prompt-uniqueness-2026-08-30.json`/`.md`; `pnpm architecture:prompts` отклонил preferred bypass с другим `ord+version` и с другой `version`, сохранил три English-варианта с единственным preferred и разрешил отдельную Russian coordinate; target commits `0cd4acc` (implementation) and `acc6e45` (evidence).
- [x] `G10S-096` Добавить service/command transaction, который demotes old preferred и promotes new preferred атомарно. Evidence: target `docs/verification/greenfield/G10S/preferred-transition-2026-08-30.json`/`.md`; `pnpm architecture:preferred-transition` выполнил guarded demote/promote в одной транзакции, успешно оставил v1 `deprecated` и v2 `preferred`, затем отклонил отсутствующий v3 с exit 3 и доказал rollback по идентичным before/after facts; target commits `05e2236` (implementation) and `edba7d6` (evidence).
- [x] `G10S-097` Alternative normal prompts требуют reviewer field и declaration `sameExpectedAnswer=true`; machine gate лишь проверяет metadata, semantic sameness остаётся `[review]`. Evidence: target `docs/verification/greenfield/G10S/alternative-prompt-2026-08-30.json`/`.md`; `pnpm architecture:alternative-prompts` принял reviewed normal variant и отклонил missing reviewer, missing declaration и `false`; target commits `49b872d` (implementation) and `4de55e9` (evidence).
- [x] `G10S-098` Corpus review queue явно выводит все alternative prompts для human compare; silent acceptance запрещён. Evidence: target `docs/verification/greenfield/G10S/alternative-prompt-queue-2026-08-30.json`/`.md`; `pnpm architecture:alternative-queue` surfaced 4/4 alternatives, kept 4/4 `REVIEW_REQUIRED`, blocked 2 malformed/missing-coordinate candidates, emitted 0 silent acceptances, and produced the same queue hash after source permutation; target commits `78dcb10` (implementation) and `737df92` (evidence).
- [x] `G10S-099` Code-prediction source record преобразуется в Activity/Task/Drill с link на Question, а не в second semantic prompt. Evidence: target `docs/verification/greenfield/G10S/code-prediction-2026-08-30.json`/`.md`; `pnpm architecture:code-prediction` mapped 1 of 3 code-prediction records, kept 2 missing/mismatched task links `REVIEW_REQUIRED`, left 1 ordinary prompt-only record `NOT_APPLICABLE`, emitted 1 Activity + 1 Task link + 1 Drill, created 0 semantic questions, emitted no bodies, and preserved the same batch hash after source permutation; target commits `3fb97e6` (implementation) and `018ca80` (evidence).
- [x] `G10S-100` Different semantic question получает новый aspect и проходит duplicate review; Probe table/type/API не создаётся. Evidence: target `docs/verification/greenfield/G10S/semantic-aspect-2026-08-30.json`/`.md`; `pnpm architecture:semantic-aspect` сформировал 3 strict identity groups из 5 metadata-only записей: 1 clear, 1 `REVIEWED_NEW_ASPECT`, 1 `REVIEW_REQUIRED`; `autoMergedRecords=0`, `autoCreatedAspects=0`, `probeTablesCreated=0`, `probeTypesCreated=0`, `probeApisCreated=0`, `inputErrors=0`, output без bodies и deterministic batch hash. Human-reviewed proposal только готов к отдельной authoring command; aspect/semantic question автоматически не создаются. Target commit `1ac1a1714c0c316e01aeb061335a8c204ace0a4c`; evidence commit `33b24741310eac2c1c0245cc379edd0306a9ca0d`.
- [x] `G10S-101` `responseBudgetMin` имеет canonical definition и validation; UI-copy не называет его фактической длительностью ответа. Evidence: target `docs/verification/greenfield/G10S/response-budget-2026-08-30.json`/`.md`; `pnpm architecture:response-budget` использует единую Zod-схему `1..120` целых минут, принимает planned-budget copy RU/EN, отклоняет ноль/дробь/выход за границу и формулировку `Actual response duration`, а observed learner duration и Activity execution budget остаются отдельными. Negative fixtures дают ожидаемый `REVIEW_REQUIRED`, все 3 отказа подтверждены; bodies отсутствуют, `learnerDurationIsNotBudget=true`, `executionBudgetIsNotResponseBudget=true`. Target commit `85570a17e2c0863566678af9d76afaaed3a4598b`; evidence commit `db97d2c485745a9ffbb66d6d22e6b9d04ddb90f6`.
- [x] `G10S-102` Curriculum placement хранит priority/order/pattern/prerequisites; adapter не копирует их назад в Question. Evidence: target `docs/verification/greenfield/G10S/curriculum-placement-2026-08-30.json`/`.md`; `pnpm architecture:curriculum-placement` сохранил 2 валидные placement-записи, отклонил 2 malformed priority/pattern записи, выпустил 2 metadata-only Question joins только с `questionId/trackId/moduleId/lessonId/scope`, `curriculumFieldsOnQuestionJoins=false`, deterministic projection hash; target commit `e5db22b`; evidence commit `57f197c`.
- [x] `G10S-103` Activity/TaskRevision хранит execution/time budget отдельно; learner analytics не смешивает оба budget. Evidence: target `docs/verification/greenfield/G10S/task-budget-2026-08-30.json`/`.md`; `pnpm architecture:task-budget` принял 2 корректных записи, отклонил 3 crossed/mismatched/unbounded записи, подтвердил отдельные владельцы `executionBudgetSec` (1..3600 секунд), `observedDurationMs` (0..86400000 миллисекунд) и `responseBudgetMin` (1..120 минут), deterministic projection и отсутствие bodies; target commit `7410f33`; evidence commit `5a41338`.
- [x] `G10S-104` `source_grant` является prerequisite provenance; cited source без grant rejected. Evidence: target `docs/verification/greenfield/G10S/source-grant-2026-08-30.json`/`.md`; `pnpm architecture:source-grant` принял 2 metadata records, отклонил 3 intentional negative fixtures (grantless citation, malformed grant, duplicate source grant), подтвердил 7 citations/6 covered/1 grantless, `autoGrantCount=0`, note hashes вместо текста, отсутствие bodies и deterministic projection; target commit `1380278a14e5cd321faed511d800640dd47fafb7`; evidence commit `49c6430377bcbf8c4699a8430ff764c6e57c4c14`.
- [x] `G10S-105` Provenance хранит source, method, acquiredAt/importedAt, reviewer, disposition, rights и redistributable flag. Evidence: target `docs/verification/greenfield/G10S/provenance-fields-2026-08-30.json`/`.md`; `pnpm architecture:provenance-fields` принял 2 из 5 metadata records и отклонил 3 intentional negative fixtures (missing importedAt, reversed clock, public non-redistributable), подтвердил все обязательные поля, chronology/public-rights guards, metadata-only deterministic projection и отсутствие bodies; target commit `16c62996747a49a79e65518c5d6603f7f560d9e7`; evidence commit `bf7187a2e89ded9a92374ee6043feaf02526e4fc`.
- [x] `G10S-106` Метод `human|translation|mt_reviewed|generated|imported` либо reviewed equivalent определён versioned vocabulary; unknown method rejected/quarantined. Evidence: target `docs/verification/greenfield/G10S/provenance-method-2026-08-30.json`/`.md`; `pnpm architecture:provenance-method` закрепил `provenance-method.v1`, принял 3 из 5 records, отправил 2 неизвестных метода в `QUARANTINED`, не применил auto-map и выпустил metadata-only deterministic projection; target commit `7815ed07d09150ef220a4f6e97d9479501153d10`; evidence commit `c98873d64fd02f767cd9a9326e95bd9c6cc6e491`.
- [x] `G10S-107` Company-linked source и paid source не может иметь public disposition без explicit distributable grant artifact. Evidence: target `docs/verification/greenfield/G10S/provenance-grant-2026-08-30.json`/`.md`; `pnpm architecture:provenance-grant` accepted 3/5 records, quarantined missing/non-redistributable grants, reported `autoGrantCount=0`, and emitted deterministic metadata-only projection; target implementation `c619ae412bad0f26d81cee57f08ec5255e63dda1`, evidence commit `6c09aa2fa06c2fde656d86f2d5526aac79801a4b`.
- [x] `G10S-108` TaskFamily/TaskRevision/Dataset/grading model сохраняет hidden/reference assets отдельно от public statement/contracts. Evidence: target `docs/verification/greenfield/G10S/task-asset-boundary-2026-08-30.json`/`.md`; `pnpm architecture:task-asset-boundary` accepted 2/5 records, rejected public/hidden body-key canaries, coordinate mismatch and hidden namespace leakage, and emitted deterministic metadata-only public/hidden projections; target implementation `ce7e73d05e3f3bb94733f7cc7a1a125efdf785be`, evidence commit `c316b3bc2a962d6bd74ab9b9c550f2ea5ee16c1f`.
- [x] `G10S-109` Task build context allowlist копирует только нужные evaluator assets; negative canary доказывает отсутствие утечки. Evidence: target `fluent-interview-platform/docs/verification/greenfield/G10S/task-build-context-2026-08-30.json`/`.md`; `pnpm architecture:task-build-context` принял 2/5 metadata records, отклонил 3 intentional canaries (unallowlisted evaluator file, public `reference-solution`, forbidden `.env` body key), подтвердил 38/41 allowlist matches, 1 public leak, 0 missing required entries, metadata-only deterministic projection и 0 bodies; target implementation `d37fcb7b07cf7f270e6cedd088a9cc479f3fd6fe`, evidence commit `10159b035c65c429da34b234a4c388f419cdce76`.
- [x] `G10S-110` Release bundle publication копирует только allowlisted public surface в learner artifact; hidden/evaluator assets и body keys не попадают в публикацию. Evidence: `fluent-interview-platform/docs/verification/greenfield/G10S/release-publication-2026-08-30.json`/`.md`; target implementation `17e254aa5d4e15274d0043e67b6a42b33cc56efd`, evidence commits `42300980d05ee64ac5eabb396c027f419edc7be5` and `5afa397e43220d290a8e8797d57e208e2082bb16`; `pnpm architecture:release-publication` accepted `2/5` records, quarantined `3`, found `1` public evaluator leak, `1` unallowlisted public file, `1` body-key canary, and emitted `0` bodies.
- [x] `G10S-111` Stable IDs не зависят от array order, локального path или timestamp; deterministic fixture test это доказывает. Evidence: target `docs/verification/greenfield/G10S/stable-ids-2026-08-30.json`/`.md`; `pnpm architecture:stable-ids` проверил 6 synthetic records (4 valid, 2 intentional `REVIEW_REQUIRED`), 3 unique IDs и 1 duplicate semantic group, подтвердил metadata-only/no-bodies и независимость от array order/path/timestamp; target implementation `d37cd484e39639c954bc01b0b70eabb3bf5165b2`, evidence commit `0e70aa4`.
- [x] `G10S-112` Domain contract changes имеют versioning/migration notes; incompatible silent change запрещён; property tests покрывают identity, preferred transition, provenance disposition и serialization determinism. Evidence: target `0bd3da0`; `pnpm architecture:domain-contract` проверил 3 owned contracts, 2 versioned changes и 4/4 negative rejections (breaking without migration, non-monotonic version, unowned contract, duplicate migration), с deterministic metadata-only projection; evidence `65442b5`.
- [x] `G10S-113` Golden fixtures сохраняют baseline: 6 cards, 75 layers, 3 tasks, 1 dataset либо exact reviewed delta. Evidence: target `a30e2eb`; `pnpm architecture:golden-fixtures` сохранил exact baseline 6/75/3/1 по 11 metadata fixture files, подтвердил deterministic metadata-only/no-bodies projection и отклонил 5/5 negative cases (card/layer drift, missing task, source-manifest drift, body-field canary); evidence `91ccc60`.
- [x] `G10S-114` Все 12 inherited PostgreSQL invariant tests перенесены и дополнены platform ownership/grant tests. Evidence: target `123b1fe`, evidence `5d4c85d`; disposable PostgreSQL подтвердил exact `12/12` inherited, `16/16` ownership/grant и `12/12` functional role checks, включая исправление ложноположительного fail helper.
- [x] `G10S-115` Commit: `feat(g10s): converge question and task domain invariants` (`123b1fe`).

### G10S.5. Studio convergence без dual-write

- [x] `G10S-116` Нарисовать current G10 sequence author→review→publish→outbox→readback и target Strata sequence; каждый old step получает target command. Evidence: target `1bca061`, evidence `18a85cf`; `5/5` old steps mapped once, `2` new export/import seams explicit, `10/10` source anchors and `5/5` negative cases verified.
- [x] `G10S-117` Сохранить роли author/reviewer/publisher и explicit decisions в local single-user mode. Evidence: target `bbd2238`, evidence `12b4737`; one local actor, 3 explicit roles/actions, 3 decision receipts, 0 implicit roles, 5/5 negative authority cases rejected.
- [x] `G10S-118` Studio create/edit вызывает authoring application command над Strata transaction, не пишет serving tables/JSONL projection. Evidence: target `99cbda3`, evidence `4943cc4`; one-shot CLI performed create/edit with exact replay, conflict and stale-head rollback, produced 2 immutable revisions/4 versioned layers/2 metadata receipts, and wrote 0 serving cards/legacy Studio rows/JSONL projections.
- [x] `G10S-119` Studio review создаёт immutable review decision, author/reviewer identity, timestamp и source revision. Evidence: target `e7ab46f`, evidence `6b017c9`; one-shot command bound an approved decision to the exact immutable revision/source author and explicit reviewer, exact replay stayed idempotent, 7 negative mutation/identity cases failed closed, and serving/legacy writes remained zero.
- [x] `G10S-120` Configurable second reviewer остаётся `default(false)`; required только policy/risk rule, не глобально. Evidence: target `d6ae03a`, evidence `8ee890f`; versioned policy hash and matched rules are immutable, same-actor global/risk review and policy drift fail closed, and the only distinct actor is an explicitly synthetic disposable rehearsal fixture rather than a fabricated production person.
- [x] `G10S-121` Studio publish не активирует learner release напрямую; он создаёт reviewed authoring release candidate/bundle request. Evidence: target `aeb8130`, DB hardening `9803d80`, evidence `79668ea`; the one-shot publisher command accepted only unique approved/policy-evaluated current revision heads, exact replay returned the same immutable candidate, CLI and direct-DB stale/rejected/empty/mutation bypasses failed closed, while learner revisions, legacy Studio rows, serving outbox events, activations and emitted bodies remained zero.
- [x] `G10S-122` Release activation выполняет отдельный import command после bundle validation и atomic serving transaction. Evidence: target implementation `c66a2c3`, evidence `2235eb7`; strict two-file bundle validation, one PostgreSQL serving transaction, exact replay/readback, tamper rejection, late-conflict rollback, pointer preservation and immutable history all passed with zero emitted content bodies.
- [x] `G10S-123` Existing command idempotency receipts мигрированы либо заменены с exact mapping; repeated commands не создают duplicate versions/reviews/releases. Evidence: target implementation `ef30ee0`, evidence `ae400e1`; 3 retired legacy commands map to 5 target stages/10 source anchors, all 4 receipt-bearing boundaries return exact results on same-request replay, reject changed intent with the same key, write zero legacy rows and create no duplicate revisions/reviews/releases.
- [x] `G10S-124` Existing outbox semantics сохранены на serving side; authoring bundle export не требует Kafka/Redis. Evidence: target implementation `3c90830`, evidence `69d9afe`; import commits one contract-valid `serving.release.imported` event with its serving projection/manifest/pointer/receipt, exact replay creates no duplicate, changed intent and late failure leave no event, serving appends one immutable idempotent acknowledgement, and authoring has zero broker dependencies.
- [x] `G10S-125` JSONL fallback классифицирован `retired` либо ограничен recovery artifact; permanent second authority запрещена. Evidence: target implementation `8c6f03c`, evidence `9b14341`; 4/4 historical artifacts have one explicit disposition (1 retired, 3 recovery-only), production selectors/imports/writes are zero, PostgreSQL owns Studio and release-pointer runtime state, four legacy HTTP mutations return 410, and fresh/upgrade/restore/import plus full check/boundary/toolchain gates pass without claiming historical migration or deletion.
- [x] `G10S-126` Existing PostgreSQL Studio rows мигрированы в Strata с source IDs/hashes и reconciliation, без hand-edited inserts. Evidence: target implementation `1d89010`, evidence `e92cde2`; exact live `pg_dump` clone preserved 11/11 source rows and 3/3 receipt projections, created canonical state only through three Strata application commands, recorded 11 immutable reconciliation rows with 3 complete seven-field receipt joins, replayed without duplicate target state, activated zero serving releases and left the persistent database unchanged; 16-migration fresh/invariant/restore/import plus full check/boundary/toolchain gates pass.
- [x] `G10S-127` Every migrated draft/review/publish state имеет explicit disposition; dropped rows имеют reason/reviewer. Evidence: target implementation `8f5c5db`, evidence `cd6999c`; 11/11 source rows and 26/26 source fields have exactly one immutable decision (23 mapped, 12 needs-authoring, one quarantined, one rejected), all non-mapped decisions carry reason and reviewer, exact replay creates no duplicate, app roles have zero access, mutation fails closed and the 17-migration live-clone plus full check/boundary/toolchain gates pass without changing the persistent database or serving state.
- [x] `G10S-128` UI показывает authoring revision, review state, rights, locale/layer completeness и release projection state раздельно. Evidence: target bootstrap `e1e7726`, implementation `53f5c68`, evidence `d8b07c5`; five independently derived cells preserve contradictions and pointer unavailability, web `49/49`, Studio `12/12`, API `64/64`, full check/boundary/toolchain and live 1440×900 + 390×844 WebMCP matrices pass with zero overlap or horizontal overflow.
- [x] `G10S-129` UI не показывает quarantine/import candidate как published/coverage-ready. Evidence: target implementation `9125445`, evidence `938a423`; one strict release-only catalog contract guards 8 learner/release seams, rejects draft/reviewed/candidate/quarantine state without hiding reviewed `brain-import` provenance, makes contaminated/empty coverage fail closed, and passes web `52/52`, API `65/65`, release-import `4/4`, full check/boundary/toolchain plus live Questions→Program→lesson WebMCP verification with zero horizontal overflow or browser errors.
- [x] `G10S-130` Unauthorized publish, forged reviewer, stale revision, duplicate preferred prompt и missing grant fail closed. Evidence: target implementation `53f1e72`, evidence `b247133`; a live 5/5 adversarial matrix exercises four disposable PostgreSQL databases, checks stale revision at CLI and direct-DB layers, preserves one canonical preferred prompt and exact final state, activates zero learner releases, passes architecture `173/173` plus full check/boundary/toolchain, and leaves persistent PostgreSQL unchanged.
- [x] `G10S-131` Crash test между authoring commit и bundle export восстанавливается без partial serving release. Evidence: target implementation `a72593f`, evidence `0248a29`; abrupt exit 86 after candidate read leaves exact authoring state, zero serving rows and no bundle target, clean retry produces two byte-identical exports and exact import/readback, architecture `180/180` plus full check/boundary/toolchain pass, and all disposable resources are removed without touching persistent PostgreSQL.
- [x] `G10S-132` Crash test внутри serving import откатывает весь release и сохраняет previous active pointer. Evidence: target implementation `12b4228`, evidence `0817c11`; abrupt exit 87 at all 5 serving mutation phases preserves the exact prior database state and active release, clean retry imports and reads back the next release exactly, architecture `187/187` plus full check/boundary/toolchain pass, and all disposable resources are removed without touching persistent PostgreSQL.
- [x] `G10S-133` Studio readback сравнивает authoring release manifest с serving IDs/hashes, а не доверяет HTTP 200. Evidence: target implementation `242c36e`, evidence `11b6bb7`; bounded CLI readback validates the authoring bundle and compares 10/10 release IDs, hashes, counts and generation timestamp against PostgreSQL serving state, rejects 11 independent drifts plus an HTTP-shaped false success, retires both HTTP readback seams with 410, passes release-import `17/17`, API `65/65`, web `52/52`, architecture `190/190` and the full target ladder without mutating persistent PostgreSQL or masking deferred `G10S-221` migrations.
- [x] `G10S-134` Backup/restore сохраняет authoring history, reviews, bundle manifests, serving pointers и outbox receipts. Evidence: target implementation `ac46607` + deterministic fixture `26eb323`, evidence `8a13de7`; 19/19 non-empty lifecycle families and 19/19 owning dump tables are required, two independent restores preserve exact hash `c8682e…d8cef`, 4 roles/6 schema grants/364 object grants and 12 role assertions match, architecture `192/192` and the full target ladder pass with all disposable resources removed and persistent PostgreSQL unchanged.
- [x] `G10S-135` Existing G10 browser journey переписан на новый seam и проходит без direct DB shortcut. Evidence: target implementation `efe578e`, evidence `0427938`; disposable one-shot authoring→bundle→serving journey applied 17 migrations, passed exact import replay and bounded readback, exposed the active release through the public Next seam, kept 4 retired HTTP routes at 410, accepted zero browser mutations and used zero direct-database assertions; focused `17/17`, Studio `12/12`, architecture `204/204`, real browser/WebMCP and the full target ladder pass with zero scoped Docker residue and persistent PostgreSQL unchanged.
- [x] `G10S-136` Commit: `feat(g10s): converge Studio on Strata authoring authority` (`602cd8a`). Evidence: versioned convergence manifest requires exact G10S-116…135 `20/20 PASS`, `7/7` implemented target commands, Strata-only authoring, checksummed file release transfer and zero dual-write/JSONL/browser-mutation/DB-shortcut authority; 9 convergence tests, architecture `213/213` and the full target ladder pass while G10S-137, G10S-221 and G13 remain explicitly open.

### G10S.6. Corpus migration, quarantine и rights

- [x] `G10S-137` Создать versioned import manifest для каждого source dataset с source SHA, record count, acquisition method, rights state и intended disposition. Evidence: target implementation `81a1f9e`, evidence `34e5980`; два versioned metadata-only manifest (`external.solvit-question-candidates` и `legacy.question-vault-candidates`) фиксируют source SHA, record count, acquisition method, rights state и intended disposition. Validator fail-closed проверяет index/hash/duplicate/body/rights invariants. Наблюдаемые `4123` записи могут пересекаться и не являются числом уникальных вопросов или coverage; `releaseEligible=0`, tracked source bodies `0`.
- [x] `G10S-138` Пересчитать 2526-source snapshot; любые отличия от baseline отдельно классифицировать до import. Evidence: target implementation `9c8768a`, evidence `d67df4b`; exact source SHA и `2526/2526` записей совпали, `0` malformed/duplicate IDs/unknown acquisition branches и `0` deltas. Fail-closed recount создаёт отдельный stable delta ID для каждого hash/count/observation/integrity drift, требует exact-manifest-bound reviewer classification и даже полностью classified drift блокирует старый manifest до новой reviewed revision. Отчёт metadata-only и явно `authorizesImport=false`.
- [x] `G10S-139` Raw paid/company-linked/unknown-rights wording хранить вне distributable target Git; в Git допустим metadata hash/manifest без body. Evidence: target implementation `2c7b4a7`, evidence `02bd2cc`; clone-safe static gate проверяет `1106` tracked files (`1098` bounded text + `8` binary) и блокирует forbidden raw paths, exact snapshot SHA, symlinks и oversized files. Controlled deep gate сначала требует exact G10S-138 baseline, fingerprinted `2526/2526` records и `8122` title/question/answer fragments in memory, нашёл `0` target body matches и выводит только hashes/paths/fields/risk labels. Оба режима metadata-only, не сохраняют absolute source path/body и явно `authorizesImport=false`; focused `4/4`, content `72/72`, architecture `213/213`, полный target ladder green.
- [x] `G10S-140` Создать quarantine store с encryption/permissions либо оставить raw source в существующем controlled location; выбранный вариант записать ADR/operations note. Evidence: target implementation `e129124`, evidence `04ee774`; ADR-0003 выбирает ровно один existing external owner-only location вместо второй raw copy. Runtime-only path binding не сохраняет absolute path; policy/tool требуют regular non-symlink file, `0600|0400`, parent `0700`, operator ownership, outside target, no Git tracking, exact manifest baseline и at-rest encryption. Live check: FileVault `ENCRYPTED`, `2526/2526`, SHA exact, права реально tightened `0755/0644→0700/0600`, raw bytes не moved/copied/changed; post-commit body scan `1113` tracked, `0` raw/body matches. Runbook фиксирует incident и G13 retirement boundary; focused `4/4`, content `76/76`, architecture `213/213`, полный target ladder green.
- [x] `G10S-141` Import неизвестного rights state по умолчанию ставит `redistributable=false`, `disposition=quarantine` и требует reviewer. Evidence: target implementation `f436490`, evidence `131fc30`; versioned `corpus-import-rights-policy.v1` и обязательный `content:rights-defaults` gate принудительно нормализуют missing/unknown/unrecognized rights в `redistributable=false`, `disposition=quarantine`, `reviewerRequired=true`, `releaseEligible=false`, отклоняя hostile overrides `public|redistributable=true|reviewerRequired=false`. Legacy importer теперь требует explicit reviewed rights и сохраняет в quarantine только stable row hash + decision metadata без raw row; обе текущие source manifests остаются quarantined (`0` import-allowed). Focused `6/6`, content `81/81`, content-model `19/19`, architecture `213/213`, post-commit body scan `1118` tracked/`0` matches и полный target ladder green.
- [x] `G10S-142` Solvit paid records никогда не получают `public` автоматически, даже при наличии answer/generated transformation. Evidence: target implementation `f3e5000`, evidence `f494f6c`; versioned `solvit-paid-publication.v1` policy и обязательный `content:solvit-paid-boundary` gate сохраняют `is_free=false` как source kind `paid`, не позволяют `_answer_source`/generated transformation менять source rights и fail-closed отправляют paid records в quarantine. Exact controlled scan подтвердил `2526` records: `1072` paid, `1244` generated, `1072` paid+generated, все `1072` paid quarantined и `0` automatic-public; public release требует отдельный explicit grant artifact и human reviewer. Focused `6/6`, content `87/87`, architecture `213/213`, post-commit body scan `1123` tracked/`0` matches и полный target ladder green.
- [x] `G10S-143` Company-attributed records не отображают company claim/name learner-у без разрешения и reviewed product rationale. Evidence: target implementation `320ee68`, evidence `f7d49f7`; versioned fail-closed visibility policy отделяет source attribution от learner projection и требует два exact source/company-hash-bound artifacts: explicit display permission и approved human-reviewed product rationale. Source visibility flags, generated transformations, single/stale approval и unknown company fields ничего не разрешают; decision projection содержит только hashes/counts/booleans без company values или rationale body. Exact controlled scan: `2526/2526`, `235` company-linked records, `281` company objects, `0` count/shape drift, `0` supplied/fabricated authorizations, `0` learner-visible и `235` redacted; focused `8/8`, content `95/95`, architecture `213/213`, post-commit body scan `1128` tracked/`0` matches и полный target ladder green.
- [x] `G10S-144` Claude/generated answers сохраняют method/model/prompt hash/tool version, если доступны; отсутствующие facts помечаются unknown, не выдумываются. Evidence: target implementation `7907e01`, evidence `c0de257`; versioned `generated-answer-provenance.v1` policy и обязательный `content:generated-provenance` gate трактуют `_answer_source` только как provider, а explicit answer-item `generated=true` — как method `generated`. Доступные method/model/prompt hash/tool version сохраняются без подмены; prompt body используется только для вычисления exact SHA-256 и никогда не выводится, а все отсутствующие facts остаются literal `unknown`. Exact controlled scan: `2526/2526`, `1244` generated records/flags, `1244` valid, provider known `1244`, method known+derived `1244`, model/promptHash/toolVersion known `0` и unknown `1244`, `0` fabricated facts; metadata-only projection hash `a991c336cf0f777f272c210143ef7660e10b0c10f8432de3ec2bf7bd9af13414`. Focused `8/8`, content `103/103`, architecture `213/213`, post-commit body scan `1133` tracked/`0` matches и полный target ladder green.
- [x] `G10S-145` Exact/fuzzy/semantic candidate groups создаются metadata-only; auto-merge и auto-delete запрещены. Evidence: target implementation `7e7b1df`, evidence `7ccf940`; versioned `corpus-candidate-grouping-policy.v1` и обязательный `content:candidate-groups` gate разделяют три сигнала: exact normalized SHA-256, fuzzy domain-aware hashed-token Jaccard `0.88` и semantic только из explicit precomputed model/version/vector-hash artifact. Topic/company labels не превращаются в semantic evidence, а normalized text, token values, embeddings, source paths и bodies никогда не попадают в projection. Exact controlled scan: `2526/2526`, `0` malformed, exact groups/candidates `0/0`, fuzzy `1/2`, semantic `0/0` при отсутствии explicit signal, все `1` группы `REVIEW_REQUIRED`, auto-merge/delete `0/0`, projection hash `f2ae164d4a6816a65afebca1311258e8e27575596120e99ff92b4618b0552097`. Focused `8/8`, content `111/111`, architecture `213/213`, post-implementation body scan `1138` tracked/`0` matches и полный target ladder green.
- [x] `G10S-146` Duplicate decision сохраняет winner, aliases/source IDs, reviewer и rationale; identity collision не решается изменением stack/aspect без смысла. Evidence: target implementation `308d457`, evidence `3189ce4`; versioned `corpus-duplicate-decision-policy.v1` и обязательный `content:duplicate-decisions` gate связывают решение с exact dataset revision + candidate projection hash и требуют complete source-ID set, in-group winner, exact non-winner alias complement для merge, reviewer ID, ISO review time и rationale SHA-256 без raw rationale. `keep-distinct` требует explicit `semanticRelation=distinct`, exact non-winner binding, fixed KC, реальное изменение `aspect`/`stack` и evidence hash; unscoped/meaningless identity change, stale projection, incomplete/extra aliases и duplicate decisions fail closed. Решение остаётся metadata-only intent и не применяет merge/delete/identity mutation/import. Exact controlled scan: `2526/2526`, `1` candidate group, `0` human-reviewed, `1` pending, `0` fabricated winner/reviewer/rationale, auto-merge/delete/identity-mutation `0/0/0`; focused `10/10`, content `121/121`, architecture `213/213`, post-implementation body scan `1143` tracked/`0` matches и полный target ladder green.
- [x] `G10S-147` Language detection/normalization не переводит content автоматически в canonical preferred layer. Evidence: target implementation `fe4d852`, evidence `f7a2701`; versioned `corpus-language-normalization-policy.v1` и обязательный `content:language-normalization` gate нормализуют explicit BCP-47 metadata, а при её отсутствии формируют только deterministic script + bounded lexical proposals. Любой результат остаётся `REVIEW_REQUIRED`; ambiguous script сохраняется как `und`, `und-Latn` или `und-Cyrl`, invalid/conflicting explicit metadata fail closed. Exact controlled scan: `2526/2526`, `0` explicit-language records, `6505` field proposals (`en 3`, `ru 2603`, `und 1812`, `und-Cyrl 2028`, `und-Latn 59`), все `6505` требуют review; canonical assignments/layer creations/preferred transitions `0/0/0`, source path/body/import authority отсутствуют. Focused `8/8`, content `129/129`, architecture `213/213`, post-commit body scan `1148` tracked/`1140` text/`0` matches и полный target ladder green.
- [x] `G10S-148` Translation/MT content требует `mt_reviewed` до production; EN/RU absence допускается в authoring, но честно блокирует конкретный release policy. Evidence: target implementation `786688f`, evidence `44ada51`; versioned `corpus-translation-release-policy.v1` и обязательный `content:translation-release` gate отделяют permissive authoring от named `learner-production-bilingual.v1` policy. Canonical single-locale record и active `mt` draft остаются валидными authoring states, но production требует preferred `prompt` для `en` и `ru`; active `mt` блокируется, а `mt_reviewed` требует explicit reviewer metadata. Exact controlled raw intake: `2526/2526`, `0` explicit-language records, `0` authored layer sets, поэтому `0` production-eligible и `2526` честно blocked с unproven EN/RU; automatic translations/layers/method promotions `0/0/0`, gate не authorizes import/release и не переопределяет rights/provenance/review gates. Focused `11/11`, content `140/140`, architecture `213/213`, post-commit body scan `1153` tracked/`1145` text/`0` matches и полный target ladder green.
- [x] `G10S-149` Imported question получает KC/aspect/stack только через reviewed classification; low-confidence mapping остаётся queue. Evidence: target implementation `0afb7c2`, evidence `51b7c1a`; versioned `corpus-reviewed-classification-policy.v1` и обязательный `content:reviewed-classification` gate связывают каждое предложение `(kc, aspect, stack)` с exact dataset revision, source snapshot, canonical source-record hash и deterministic proposal ID/set hash. Любая confidence, включая high-confidence, остаётся human-review evidence, а low-confidence выходит из queue только через explicit reviewed approval; `READY_FOR_AUTHORING` требует ровно одного approved proposal и explicit rejection всех альтернатив. Decision не может переписать identity: другой triple требует нового proposal; reviewer ID, ISO timestamp и rationale hash обязательны, raw rationale запрещён. Exact controlled scan: `2526/2526`, proposals/reviewed/ready `0/0/0`, все `2526` честно остаются `no-classification-proposal` queue; identity assignments/authoring commands/import/release `0/0/0/0`, projection metadata-only. Focused `13/13`, content `153/153`, architecture `213/213`, post-feature body scan `1158` tracked/`1150` text/`0` matches и полный target ladder green.
- [x] `G10S-150` Generic classification проверяется на отсутствие language/framework-specific semantics; false-generic уходит в native stack. Evidence: target implementation `4b08ad8`, evidence `b511536`; versioned `corpus-generic-semantics-policy.v1` и обязательный `content:generic-semantics` gate добавляют отдельное human semantic review после approved `(kc, aspect, stack=generic)` classification. Шесть native-signal классов (`language-syntax`, `language-runtime`, `framework-api`, `framework-lifecycle`, `platform-standard-library`, `toolchain-specific`) не позволяют classifier/machine evidence подтвердить generic автоматически. `confirmed-generic` требует полного reviewer/timestamp/rationale/evidence-hash набора и отсутствия native signals; `false-generic` требует native signal и identity, которая сохраняет `kc/aspect`, меняет stack и создаёт только native-stack re-proposal queue intent без identity mutation или нового proposal. Exact controlled scan: `2526/2526`, classification-ready/unclassified `0/2526`, generic candidates/reviewed/confirmed/false/pending `0/0/0/0/0`, native re-proposal entries/identity mutations/native proposals `0/0/0`; deterministic proposal/classification/candidate/review hashes, metadata-only output. Focused `14/14`, content `167/167`, architecture `213/213`, post-feature body scan `1163` tracked/`1155` text/`0` matches и полный target ladder green.
- [x] `G10S-151` Task-like record маршрутизируется в TaskCandidate/Activity queue, не принудительно в Question prompt. Evidence: target implementation `8769817`, evidence `b622fc2`; versioned `corpus-record-routing-policy.v1` и обязательный `content:record-routing` gate убирают implicit Question fallback и требуют одну exact human decision на source record. `question`, `task`, `activity` имеют фиксированные destinations `question-authoring-candidate`, `task-candidate-queue`, `activity-candidate-queue`; task/activity требуют хотя бы один из шести bounded task-like signals, а question с таким signal и task-like destination в Question fail closed. Решение связано с exact dataset revision/source SHA/source-record hash и требует reviewer ID, ISO time, rationale/evidence hashes без raw rationale; duplicate/stale/unknown source decisions запрещены. Exact controlled scan: `2526/2526`, reviewed/pending `0/2526`, Question/TaskCandidate/Activity entries `0/0/0`, task-like→Question `0`, automatic routes и созданные prompt/task/activity `0/0/0/0`; decision/projection hashes deterministic metadata-only. Focused `15/15`, content `182/182`, architecture `213/213`, post-feature body scan `1168` tracked/`1160` text/`0` matches и полный target ladder green.
- [x] `G10S-152` Algorithm/system-design/behavioral records получают соответствующие role vocabulary и не смешиваются с language-native release без placement review. Evidence: target implementation `0c61d7b`, evidence `d1f7fbe`; versioned `corpus-role-placement-policy.v1` и обязательный `content:role-placement` gate используют canonical `content/curriculum/role-policy.v1` как единственного владельца role vocabulary и связывают каждое решение с exact dataset revision, source snapshot, source-record hash и exact role-policy hash `cded03ad131fd6855df09b0c4e40674e3c8f39a81e8dc18834318504c8389f3c`. `language-native` получает только `technical-core` и остаётся на native path; `algorithms`, `system-design`, `behavioral` получают только dedicated vocabulary/path. Dedicated content может поддерживать language path исключительно как `supporting` после полного cross-path review с reviewer/timestamp/rationale/evidence hashes; primary placement и masquerading под другой dedicated path fail closed. Exact controlled scan: `2526/2526`, reviewed/pending `0/2526`, lane assignments `0/0/0/0`, role/placement decisions `0/0`, reviewed/unreviewed cross-language placements `0/0`, automatic assignments/applied release placements `0/0`; decision/projection hashes deterministic metadata-only, source bodies и raw rationale отсутствуют. Focused `18/18`, content `200/200`, architecture `213/213`, post-feature body scan `1173` tracked/`1165` text/`0` matches и полный target ladder green.
- [x] `G10S-153` Research sources сохраняются ссылками/notes в рамках copyright limits; copied paid text не становится original explanation. Evidence: target implementation `3d6385d`, evidence `64e0edc`; versioned `corpus-research-boundary.v1` binds the exact controlled dataset/revision/source SHA, per-record source hash and canonical research-policy hash before any review, accepts credential-free HTTPS citations plus bounded original notes (`<=80` words), separates public quotation (`<=25` words) from notes, and permits paid-portal material only as licensed `pattern_only` / `observation_only` evidence with zero quotation. Every reviewed explanation carries a separate body hash, human author/reviewer/timestamps/evidence, `sourceExcerptIncluded=false`, `noCloseParaphrase=true` and `copiedPaidTextIncluded=false`; an exact explanation/note/quotation hash collision fails closed, while semantic close-paraphrase remains honestly human-reviewed rather than falsely machine-proven. Reports disclose only hashes/counts and never URLs, notes, quotations, explanations, source bodies or local paths, and the gate grants no import/release authority. Exact `questions/questions.jsonl` read `2526/2526` records under research policy SHA `e9758a564e5ecfa36270ed9263d0c5ccab52832633795103489992d8685d92f`, opened `0 reviewed / 2526 pending`, retained zero links/notes/public quotes/paid quotes/reviewed explanations and zero copied relabel/automatic approval/import/release authority (`researchRecordSetHash=d31f18f77397e345024d57c1ab3fb6357576a1f1b5502e24f57cb7a83cb0ae17`). Focused suites passed `17/17`, studio/research `14/14`, content `217/217`, architecture `213/213`; the deep tracked-body scan found `0` corpus-body matches across `1178` tracked files / `1170` text files / `8122` source fragments, and the full mandatory ladder was green immediately before the evidence commit.
- [x] `G10S-154` Release scanner ищет known paid/company canaries, forbidden source IDs и raw hashes во всех generated bundles/artifacts. Evidence: target implementation `2a99b6f`, evidence `b32c26e`; versioned `corpus-release-scanner-policy.v1` and mandatory `content:release-scan` build a fresh current bundle in an isolated temporary directory when no roots are supplied, scan canonical JSON/manifests, decode and scan Zstandard JSONL shards, and accept repeated explicitly bounded artifact roots. The exact controlled snapshot derives all protected rules in memory: `1377` paid-body canaries, `112` company canaries with Unicode phrase boundaries, `2526` external source IDs plus `24508` raw snapshot/record/body hashes. An initial expanded run exposed a short-company substring false positive; the matcher was corrected to word/phrase boundaries, regression-covered, and the whole matrix rerun. All `28` current release/import/projection artifacts (`273506` raw / `308873` decoded bytes, `2` compressed artifacts, `37` structured documents) pass with `0` findings. Symlink, unknown binary, malformed JSON/JSONL, size/decode overflow, stale source, exact paid/company body, numeric/raw external ID and protected raw hash cases fail closed. Reports contain only opaque artifact/rule IDs, hashes and counts—never artifact paths, protected values or source bodies—and grant no import/release authority. Focused suites passed `11/11`, content `228/228`, security `15/15`, architecture `213/213`; post-feature deep body scan found `0` matches across `1183` tracked / `1175` text files / `8122` source fragments, and the full check/boundary/toolchain ladder was green before both target commits.
- [x] `G10S-155` Logs/traces/evidence scanner запрещает prompt/answer/source bodies; сохраняет только IDs/hashes/counts. Evidence: target implementation `0837218`, evidence `5c6e04d`; versioned `corpus-observability-scanner-policy.v1` and mandatory `content:observability-scan` provide clone-safe policy mode plus an exact manifest-bound controlled scan over explicitly named artifact roots. Structured artifacts and plain logs reject 17 prompt/answer/question/solution/request-response/message/completion/hidden-test payload fields; exact normalized canonical learner bodies and controlled-source titles/questions/answers are detected even under innocent field names. Trace archives, symlinks, unknown binary content, malformed JSON/JSONL, stale source, oversize inputs and file-count overflow fail closed. Current ignored runtime matrix: `15` selected artifacts / `479634` bytes / `1017` structured documents / `2` text logs, checked against `149` canonical and `9108` controlled-source body canaries with `0` findings. Reports contain only opaque artifact IDs, rule hashes, finding classes and counts—never paths, protected values, learner/source bodies or the controlled-source location—and grant no import/release authority. Focused suites passed `11/11`, content `239/239`, observability `8/8`, security `15/15`, architecture `213/213`; post-feature deep body scan found `0` matches across `1188` tracked / `1180` text files / `8122` source fragments, and the full check/boundary/toolchain ladder was green before both target commits.
- [x] `G10S-156` Quarantine export/import roundtrip не меняет disposition и не делает content доступным serving role. Evidence: target implementation `4ec1bb7`, evidence `c2ebd1a`; deterministic metadata-only bundle roundtrips both checked-in quarantined source manifests (`2/2`) with identical disposition digest `21b7555c…888184`, rejects body/unknown fields, rights/disposition/hash/record-set drift and noncanonical bytes, and leaves source bodies/raw rows/authoring mutations/serving projections at `0/0/0/0`. Static migration check confirms serving role `NOINHERIT` on public search path with `0` Strata privilege statements; focused `11/11`, content `250/250`, security `15/15`, architecture `213/213`, full check/boundary/toolchain and post-feature body scan (`1193` tracked / `0` matches) pass. The gate creates no database, Docker resource, source copy, import, or release authority and remains metadata-only per ADR-0003.
- [x] `G10S-157` Human review sample policy задаёт minimum sample per source/batch/risk и escalation при defect. Evidence: target implementation `7dd16a5`, evidence `2ceefb5`; versioned `corpus-human-review-sampling.v1` builds a deterministic metadata-only plan for each source and `datasetId@revision` batch plus every positive rights/paid/company/generated/missing-provenance/malformed/unmapped/quarantine risk signal. Minimums are `3` per source, `2` per batch, and `2` or `10%` per non-empty risk stratum (bounded at `20` per risk/`240` total). Current two-manifest intake produces `134` slots with `0 recorded / 134 open / 0 invalid`, so learner review remains honestly `OPEN`; `request-changes`/`reject` require a bounded defect code and explicit escalation acknowledgement holding source and batch. Unknown, stale, duplicate, unused, or malformed decisions fail closed. Focused `6/6`, content `256/256`, full check/boundary/toolchain and post-feature body scan (`1193` tracked / `0` matches) pass; no body/content/DB/Docker/import/release authority is emitted. The next executable item is `G10S-158`.
- [x] `G10S-158` Corpus quality report публикует `total/mapped/reviewed/public/quarantine/rejected/unknown` отдельно. Evidence: target implementation `a8651cd`, evidence `3c4b229`; versioned `corpus-quality-report.v1` emits independent per-dataset and aggregate metadata-only counters. The two-manifest snapshot is `4123/1591/0/0/4123/0/2532` (total/mapped/reviewed/public/quarantine/rejected/unknown); datasets may overlap, so this is not a unique-question or curriculum-coverage count. Mapped/reviewed/rejected require explicit observations, unknown uses deterministic `total-minus-explicit-mapped`, quarantine defaults to all records without reviewed-redistributable rights, and public requires both reviewed rights and explicit release eligibility. Current reviewed/public remain `0`; the report emits no body, absolute path, import or release authority. Focused `8/8`, content `264/264`, full check/boundary/toolchain ladder green, evidence validator `13/13`, post-feature body scan `1193` tracked/`1185` text/`8122` fragments/`0` matches. Next executable item is `G10S-159`.
- [x] `G10S-159` Coverage report не считает quarantine, supporting prompt или duplicate alias primary question. Evidence: target implementation `e32df08e8ed2de4ad88af66374ece9767dd16f81`, evidence `3361086`; `aliasOf` is validated against an existing primary card with the same semantic key, quarantine is excluded before counting, and supporting cards/prompts have separate counters. Focused coverage/validator tests `6/6`, content `267/267`, `content:gates`, `pnpm check`, boundary/toolchain and deep body-boundary scan `1205/1197/8122/0` are green. Seed snapshot: `10` released canonical primary questions, `0` supporting cards, `10` supporting prompts, `0/0` quarantine/alias exclusions; metadata-only, no import/release authority. Next executable item is `G10S-160`.
- [x] `G10S-160` Migration допускает сначала только 6 golden cards + C098; breadth corpus ждёт adapter gate. Evidence: target implementation `3f85ddaeeb3ae87c67c42bf38088ad916ff995f0`, evidence `a2b73ed`; versioned `g10s-migration-scope-policy.v1` and mandatory `content:migration-scope` allow exactly the six-card golden baseline (`6/75/3/1/11`) plus rights-cleared `C098-window-ordering-generic` (`2` layers, `en/ru`). Current release remains `6` primary cards; external/legacy breadth manifests remain metadata-only and blocked before adapter `G10S.7` (`2` manifests/`4123` records, `releaseEligible 0`). Focused `5/5`, content `272/272`, full check/boundary/toolchain and body-boundary `1210/1202/8122/0` green; no import/release/database/Docker authority. Next executable item is `G10S-161`.
- [x] `G10S-161` Commit: `feat(g10s): migrate governed corpus metadata and quarantine policy`. Evidence: target implementation `5722bc774c96d63afb3a3cea1d0974fedc9453da`, evidence `8c280528c01f79635f4df2c64985f684761f8ed6`; versioned `g10s-corpus-governance-policy.v1` binds the two indexed breadth manifests to a metadata-only rights/disposition policy before adapter `G10S.7`: `2` datasets, `4,123` records, `4,123` quarantine-required, `0` release-eligible/importable. Focused governance `5/5`, content `277/277`, full check/boundary/toolchain and body-boundary `1,215/1,207/8,122/0` green; hash/identity/rights/policy/body drift fail closed, with no source body/path/import/release/database/Docker authority. Next executable item is `G10S-162`.

### G10S.7. Deterministic v1 adapter и release import

- [x] `G10S-162` Создать explicit mapping spec Strata Question/Layer/Task/Provenance → `question-catalog.v1` fields. Evidence: target implementation `d43481de287cbf3d93f5abd3608690e71ae9fbd1`, evidence `91503325df47101f1ca457f31704336a502b6516`; versioned `g10s-question-catalog-mapping-policy.v1` (`2026.08.31-question-catalog-mapping.1`) and mandatory `content:mapping-spec` gate cover all `47/47` target paths from `15` source entities (`11` Strata, `2` curriculum, `2` content-review) through `47` deterministic mappings. `12` explicit non-target source facts remain loss/review-visible and `11` mappings are content-bearing; curriculum retains route-order ownership, while task bodies, source bodies, database, Docker, import and release authority remain excluded. Focused `5/5`, content `282/282`, evidence validator `13/13`, full check/boundary/toolchain ladder and post-feature body scan (`1220` tracked / `1212` text / `8122` fragments / `0` matches; sensitive records `2526/2526`) are green. Next executable item is `G10S-163`.
- [x] `G10S-163` Mapping spec перечисляет семь v1 answer layers: `concise`, `understanding`, `mechanism`, `traps`, `followUps`, `evidence`, `sources`. Evidence: target implementation `bb5247bca16a7893d79e571580229a0353755904`, evidence `1bc0bd38499a559271f838cfdf8fb4ee6f882d8f`; versioned `g10s-question-catalog-answer-layers-policy.v1` (`2026.08.31-answer-layers.1`) enumerates exactly `7/7` required `question-catalog.v1` answer coordinates in canonical order and rejects unknown, duplicate, missing, or reordered layers. The policy remains metadata-only with no source/answer body, automatic layer creation, import or release authority. Focused `5/5`, content `287/287`, evidence validator `13/13`, full check/boundary/toolchain ladder and post-feature body scan (`1225` tracked / `1217` text / `8122` fragments / `0` matches; exact source baseline `2526/2526`) are green. Next executable item is `G10S-164`.
- [x] `G10S-164` Для каждого v1 field указать source layer kind, lang/depth selection, ordering, requiredness и loss behavior. Evidence: target implementation `215eaf3818a46bb9c20737b4966515902fd43730`, evidence `2dc6805b3064739038a105f39b3f78062053e1a7`; versioned `g10s-question-catalog-field-selection-policy.v1` (`2026.08.31-answer-field-selection.1`) covers `8/8` required fields (canonical prompt, 7 answer coordinates, provenance citations) with explicit source entity/kind, locale/depth/rank selection, deterministic ordering and `fail-release` loss behavior linked to G10S-172. Unknown kinds, ambiguous selectors, duplicates and silent drops fail closed; provenance citations stay separate from layer bodies. Policy remains metadata-only with no source/answer body, automatic selection, import or release authority. Focused `5/5`, content `292/292`, evidence validator `13/13`, full check/boundary/toolchain ladder and post-feature body scan (`1230` tracked / `1222` text / `8122` fragments / `0` matches; exact source baseline `2526/2526`) are green. Next executable item is `G10S-165`.
- [x] `G10S-165` `prompt` берётся только из preferred prompt нужного locale/depth; ambiguous preferred state делает export FAIL. Evidence: target implementation `5e3f66957f89a56da5d01182aec3f019690500c7`, evidence `5199827da91e69cbc01c900abdfc516a7de41902`; versioned `g10s-question-catalog-prompt-selection-policy.v1` (`2026.08.31-prompt-selection.1`) binds selection to exact `(questionRef, locale, depth)` coordinates and permits exactly one `preferred` row. `normal`/`deprecated` rows never promote; missing or multiple preferred rows fail export, malformed metadata/unknown coordinates fail closed, and report output contains only layer IDs, versions and body hashes. Policy-only gate is clone-safe (`PASS_POLICY`); evaluated adapter fixture selects `3/3` coordinates, focused `5/5`, content `297/297`, content gates/full check/boundary/toolchain and deep body scan (`1235` tracked / `1227` text / `8122` fragments / `0` matches; exact source baseline `2526/2526`) are green. No source bodies, automatic mutation, database/Docker resources, import or release authority. Next executable item is `G10S-166`.
- [x] `G10S-166` v1 exact RU+EN policy не заставляет authoring хранить фиктивные переводы: missing locale создаёт release blocker, не fabricated text. Evidence: target implementation `409265789d332e11fb0e996c1227a0469ec14afe`, evidence `72a5e29`; versioned `g10s-question-catalog-translation-completeness-policy.v1` (`2026.08.31-translation-completeness.1`) binds the future G10S.7 adapter to exactly one preferred `en` and one preferred `ru` row for every `(questionRef, depth)` coordinate. Missing, unexpected or ambiguous locales fail closed; `normal`/`deprecated` never promote; unreviewed `mt` is rejected as fabricated and `mt_reviewed` requires reviewer metadata. Policy-only mode is `PASS_POLICY`; evaluated fixture covers `2/2` coordinates and selects `4/4` records; negative missing-locale, fabricated-method and ambiguous-locale fixtures fail as expected. Focused tests `5/5`, content `302/302`, content gates/full check/boundary/toolchain and post-feature body scan `1240` tracked / `1232` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. Output is metadata-only (IDs, versions, methods, reviewer flags and hashes); automatic translation/layer creation, source body, database/Docker mutation, import and release authority remain `0`. Next executable item is `G10S-167`.
- [x] `G10S-167` Curriculum enriches projection placements/priority/prerequisites; Strata не становится владельцем route order. Evidence: target implementation `cc85ce50fa715f546f63127868d1fe1d9d933b5c`, evidence `806a8845f81b05737470541c51593b90b82a111f`; versioned `g10s-curriculum-placement-projection-policy.v1` (`2026.08.31-curriculum-placement-projection.1`) binds the future G10S.7 adapter to `(curriculumRevision, placementId)` and an explicit curriculum-owned route order. Placement metadata is bounded to `questionRef`, `pathId`, module/lesson/scope, integer priority `0..100`, same-revision `prerequisiteRefs` and status; duplicate IDs, unknown/self prerequisites, invalid priorities and incomplete/unknown route coverage fail closed. Projection order follows curriculum input rather than priority or Strata; Question joins contain only `placementId`, `questionRef`, `pathId`, `moduleId`, `lessonId`, `scope`, excluding `priority`, `order`, `pattern`, `prerequisiteRefs` and `routeOrder`; `strataOwnsRouteOrder=false`. Focused tests `5/5`, content `307/307`, policy-only `PASS_POLICY`, evaluated fixture `2/2` placements and `2/2` ordered joins, negative invalid-priority/duplicate/unknown-prerequisite fixtures fail as expected, and content gates/full check/boundary/toolchain are green. Post-feature body scan `1245` tracked / `1237` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526`; metadata-only output emits no source body or database/Docker/import/release authority. Next executable item is `G10S-168`.
- [x] `G10S-168` Assessed activities соединяются по stable TaskFamily/Revision IDs; conceptual question может честно не иметь runnable task. Evidence: target implementation `d802cf4990ec4bcf6a53d251e49510566532eda7`, evidence `2bc9a0a`; versioned `g10s-task-activity-projection-policy.v1` (`2026.08.31-task-activity-projection.1`) enforces the exact `(questionRef, activityId)` activity coordinate and `(taskFamilyKey, taskRevision)` executable join. Runnable activities require a positive stable TaskRevision, while conceptual questions may have zero runnable activities without fabricated tasks; missing/partial joins, parent mismatches and duplicate activity IDs fail closed. Policy-only `PASS_POLICY` and evaluated fixture cover `2/2` questions (`1/1` runnable activity and `1/1` conceptual gap); focused tests `5/5`, content `312/312`, content gates/full check/boundary/toolchain green. Post-evidence body scan `1252` tracked / `1244` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526`. Metadata-only output emits no source body, database/Docker mutation, import or release authority. Projection/state hashes are `37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570` / `820bc34c01e77bdd5038e2b4c3f3fabb03c20e6b9dcd8aa40413367e4de005e1`; policy hash `b387fdb0f28c4f1d687d57ad34cd449f85c0738fdd379e9af7e7d0543bce658e`. Next executable item is `G10S-169`.
- [x] `G10S-169` Graph edges export только reviewed exact target revision; orphan/stale target блокирует bundle. Evidence: target implementation `76136241cc44f34bab36b862df1ca0b795415cff`, evidence final `45137aa`; versioned `g10s-graph-edge-projection-policy.v1` (`2026.08.31-graph-edge-projection.1`) keeps curriculum authority over `(curriculumRevision, edgeId)` and requires exact source/target `(questionRef, questionRevision)` joins. Reviewed `prerequisite`, `related`, `deepens`, and `applies` edges are accepted; orphan, stale source/target, duplicate, self, and unreviewed edges fail closed. Projection is metadata-only (IDs, revisions, type and review metadata), with no body, automatic edge creation, database/Docker mutation, import or release authority. Policy-only gate is `PASS_POLICY`; evaluated fixture covers `2/2` questions and `1/1` reviewed edge with projection/state hashes `25f385f94213b4021225719c9a21f0411fa8a07daa81e97c94c7204f2b803942` / `718c09cb76255c7f18804e51a7b310df54e2af9a12e2ce6c620367d259577d29`; policy-only state hash `8f2820fb1bb7728fcc58b3b5be92618de97191268999f3c3227de13291eda74a`, policy hash `6726ca8b81c5b8ae781ea4729cef8523d41ea4cecb3a180096f59266a4e75d53`. Focused tests `5/5`, content `317/317`, content gates/full check/boundary/toolchain and post-evidence body scan `1257` tracked / `1249` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. Next executable item is `G10S-170`.
- [x] `G10S-170` Review/release ID minted deterministically/transactionally и не зависит от current clock без declared build input. Evidence: target implementation `8bd7b27cacc1e9f84cfe35a88728157f28b56648`, evidence final `f102551`; versioned `g10s-release-identity-policy.v1` (`2026.08.31-release-identity.1`) defines review identity `(questionRef, questionRevision, reviewerId, decision, policyHash)`, release identity `(releaseScope, catalogRevision, curriculumRevision, bundleHash, reviewIds)`, and mandatory declared `(buildId, buildRevision, buildTimestamp)` input. Current clock and random UUID fallbacks are forbidden; the caller-owned transactional ledger commits once, replays an identical idempotency request, and fails closed for conflicting replays, cross-key collisions, missing/invalid build input and duplicate review coordinates without partial mutation. Policy-only gate is `PASS_POLICY`; evaluated fixture mints `2/2` review IDs and `1/1` release ID with request/state hashes `6445b6d827d30a7db5e53a2073fb6284086c1d8eb9e5031a80c612de80ff22ad` / `2c86db86f2712e89239517075c1c98859ddcdbbe6812ee1333873a2b0ec27737`; policy-only state hash `b6d9c72872d99df22d31f34d2cdaaa2953233c42f973cdd87720228ccf435765`, policy hash `e0b54cf8931b1353fd04e307b0c39e8ab5717cc81b87dbb92d5c6acbfdce2111`. Focused `6/6`, content `323/323`, content gates/full check/boundary/toolchain and post-evidence body scan `1262` tracked / `1254` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. Projection/evidence remains metadata-only with no database/Docker/import/release authority. Next executable item is `G10S-171`.
- [x] `G10S-171` Provenance projection содержит только безопасные public facts; private/paid/source body не копируется. Evidence: target implementation `cffa09f`, evidence final `9d08d29` (initial evidence `3a6ec40`); versioned `g10s-public-provenance-projection-policy.v1` (`2026.08.31-public-provenance-projection.1`) requires an explicit public source, rights review, redistributable flag, non-restricted license and namespaced public citation key before emitting facts. Public output is limited to question identity, source kind, citation key/hash, license/attribution and review metadata; raw `sourceRef`, wording hashes and bodies never emit. Paid, private, unknown/non-public, restricted, non-redistributable and unreviewed records become bounded redactions with a reason, and duplicate coordinates or malformed hashes fail closed. Policy-only gate is `PASS_POLICY`; evaluated fixture projects `1/1` public and redacts `3/3` (paid/private/unreviewed), focused `6/6`, content `329/329`, content gates/full check/boundary/toolchain green. Final post-evidence body scan is `1267` tracked / `1259` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526`; no source body, private/paid fact, database/Docker mutation, import or release authority. Next executable item is `G10S-172`.
- [x] `G10S-172` Adapter создаёт `loss-ledger.json`: source field, target field/null, loss class, reason, severity и follow-up v2 requirement. Evidence: target implementation `2490376168dbd1543f66349a63306177426fced`, evidence final `6ebb1e1`; versioned `g10s-loss-ledger-policy.v1` (`2026.08.31-loss-ledger.1`) materializes one deterministic metadata row for every `47/47` declared mapping and every `12/12` unreleased source fact (`59/59` total: `47` mapped, `5` policy-gate-only, `7` required-field-loss blockers). Every row carries source field, target or `null`, disposition, loss class, reason, severity and v2 follow-up requirement; missing mapping fails closed, and reordered policy arrays preserve ledger/state hashes. Focused tests `6/6`, content `335/335`, content gates/full check/boundary/toolchain and evidence validator `13/13` are green. Final post-evidence body scan is `1272` tracked / `1264` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526`; output is metadata-only with no source body, DB/Docker mutation, import or release authority. Next executable item is `G10S-173`.
- [x] `G10S-173` Silent drop запрещён: каждый source layer/fact либо mapped, intentionally_not_released(reason), либо loss entry. Evidence: target implementation `4c4c7c166ded5134e6f2a8d23e5f965007a8f619`, evidence final `d6e95e3`; versioned `g10s-source-field-coverage-policy.v1` (`2026.08.31-source-field-coverage.1`) enumerates every declared field across `15` source entities and materializes one metadata row per `(sourceEntity, sourceField)`. The evaluated report covers `73/73` fields with `0` silent drops: `36` mapped-only, `31` intentional-only, `1` mapped-plus-intentional dual-use, and `5` loss-only; mapped-plus-loss and contradictory overlaps are `0`. Unknown/missing/duplicate/contradictory policy entries fail closed. Focused tests `6/6`, content `341/341`, content-gates/full check/boundary/toolchain and post-evidence body scan `1277` tracked / `1269` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green; metadata-only, no source body, database/Docker mutation, import or release authority. Next executable item is `G10S-174`.
- [x] `G10S-174` Double build одного authoring release + curriculum revision даёт byte-identical canonical bundle/hash. Evidence: target implementation `2be6c503d765f1be549f67b1fcff1bc8c6e3ae8a`, evidence final `95e3120`; versioned `g10s-canonical-bundle-policy.v1` (`2026.08.31-canonical-bundle.1`) binds the explicit `(authoringReleaseId, curriculumRevision)` tuple to validated catalog content and canonicalizes object keys, card IDs and nested collection IDs without wall-clock/random inputs. Two builds of the six-card release `2026.08.28-questions.1` plus curriculum `2026.08.28-curriculum.1` are byte-identical at `38,375` bytes with bundle SHA-256 `7d867313…09adb`; focused `6/6`, content `347/347`, content-gates/full check/boundary/toolchain and post-evidence body scan `1282` tracked / `1274` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. Evidence is metadata-only; no database/Docker mutation, import or release authority. Next executable item is `G10S-175`.
- [x] `G10S-175` Different source revision или curriculum revision меняет declared release inputs/hash. Evidence: target implementation `7fa826281b285b516efeb335674d942be8004c40`, evidence final `3b50dc0`; versioned `g10s-revision-inputs-policy.v1` (`2026.08.31-revision-inputs.1`) requires the identity coordinate `(sourceRevision, curriculumRevision)` and fails closed when either input or its hash sensitivity is weakened. The evaluated six-card matrix is deterministic: base bundle `38,375` bytes / SHA-256 `7d867313…09adb`, source-only variant `38,391` / `c6ec979d…93b4a0`, curriculum-only variant `38,377` / `5ce01ec…5473a9`; all hashes are distinct, and a curriculum-only change preserves the catalog logical hash. Focused `6/6`, content `353/353`, content-gates/full check/boundary/toolchain, evidence validator `13/13`, and post-evidence deep body scan `1287` tracked / `1279` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. The matrix is in-memory and metadata-only: no source body, database/Docker mutation, import or release authority. Next executable item is `G10S-176`.
- [x] `G10S-176` Bundle имеет schema version, authoring release, curriculum revision, created-by tool version, counts, hashes и checksum. Evidence: target implementation `a86be135d6b11ca5efa2f556f4171eb4fcf32496`, evidence final `4d714cb`; versioned `g10s-release-manifest-policy.v1` (`2026.08.31-release-manifest.1`) requires the explicit `(authoringReleaseId, curriculumRevision)` identity, `fluent-content-compiler@2026.08.31.1`, aggregate counts (`6` records, `12` translations, `10` placements, `7` activities, `3` graph edges), catalog/bundle/artifact hashes, an explicit one-file inventory, and a deterministic SHA-256 payload checksum. The six-card manifest is byte-stable (`0af06e07…36481e6`), focused tests are `6/6`, content `359/359`, content-gates/check/boundary/toolchain and evidence validation are green; five tamper/body negative vectors are rejected. Post-evidence deep body scan is `1292` tracked / `1284` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526`. Metadata-only and in-memory: no source body, DB/Docker mutation, import or release authority. Next executable item is `G10S-177`.
- [x] `G10S-177` Bundle не содержит DB credentials, raw quarantine, hidden tests/reference solutions, internal review comments или private source text. Evidence: target implementation `8f51a3c2db62f8cee906ad0e3960286488b94a87`, evidence final `d1cfab5`; versioned `g10s-public-release-boundary-policy.v1` (`2026.08.31-public-release-boundary.1`) builds a separate recursive allowlist projection for the public learner bundle, strips authoring `review`/`provenance`, source identifiers, quarantine, hidden evaluator assets, internal comments and private text, rejects unknown fields and credential-bearing/HTTP citation URLs. The six-card projection is deterministic (`32,873` bytes, SHA-256 `31d19fe2…e27f6f9`), with `6` records, `12` translations, `10` placements, `40` roles, `6` supporting prompts, `7` activities and `3` graph edges; focused tests `6/6`, content `365/365`, full content-gates/check/boundary/toolchain and evidence validation green, and `5/5` sensitive negative vectors rejected. Post-evidence deep body scan is `1297` tracked / `1289` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526`. Projection is in-memory/metadata-only and grants no DB, Docker, import or release authority. Next executable item is `G10S-178`.
- [x] `G10S-178` Release importer принимает только file/stream bundle и никогда не подключается к `strata` schema. Evidence: target implementation `e10c8410db083698c30cce6dc316b9afef63bd2f`, evidence `4952b25`; versioned `g10s-release-import-boundary-policy.v1` (`2026.08.31-release-import-boundary.1`) exposes exactly two input kinds: a directory containing only regular `manifest.json`/`release.json` files or two bounded byte streams. Symlinks, extra parts/fields, non-byte chunks, oversized parts and unknown kinds fail closed. A static five-file source scan rejects Strata schema references, authoring database environments, authoring roles/packages and HTTP transports, and requires validation before the serving `pg` pool. Focused boundary tests `6/6`, release-import package tests `17/17`, content `371/371`, full content-gates/check/boundary/toolchain and deep body scan `1303` tracked / `1295` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. Metadata-only; no source body, DB/Docker mutation, import or release authority. Next executable item is `G10S-179`.
- [x] `G10S-179` Import сначала полностью validates schema/hash/signature/rights/references, затем выполняет одну serving transaction. Evidence: target implementation `d2651ff8cedeb4d8e0471f9b0c95c96a43a22a41`, evidence `933860e4f657d8a8230438b88adde2ea59e46c0e`; versioned `g10s-serving-import-preflight-policy.v1` (`2026.08.31-serving-import-preflight.1`) enforces the fixed `schema → hash → signature → rights → references` order before both pool construction and `BEGIN`. Canonical artifact/logical hashes and the v1 SHA-256 payload attestation are rechecked; every card needs `released` status, complete provenance/reviewer facts, valid non-unknown rights, HTTPS credential-free citations, resolved aliases/activities/revision IDs/graph targets. The checked release has `6` records, `12` translations, `26` citations, `3` graph edges and `6` released records; five tamper/rights/reference negatives are rejected. Static five-file source analysis reports `0` forbidden authority references, exactly `1` write transaction and `1` separate read-only readback. Focused preflight `6/6`, release-import `17/17`, content `377/377`, full content-gates/check/boundary/toolchain and deep body scan `1309` tracked / `1301` text / `8` binary / `8122` fragments / `0` matches with exact source baseline `2526/2526` are green. Metadata-only; no source body, DB/Docker mutation, import or release authority. The v1 attestation is integrity-only and not a trusted external signer. Next executable item is `G10S-180`.
- [x] `G10S-180` Re-import same bundle idempotent; same release ID с другим hash rejected. Evidence: target implementation `e58b19118b4f9c435c493d575c78cdda80537a4e`, evidence `21d63c7e8ec7c79edc6319ca1e29d5b8c2a78c7a`; classifier binds `(idempotencyKey, requestHash, releaseId, manifestHash)` after receipt/release reads and before the first `INSERT`. Outcomes are exact `new`, read-only `replay`, idempotency-key conflict, same-release/same-hash rejection, and same-release/different-hash rejection. Focused tests `6/6`, release-import `17/17`, content `383/383`; `content:gates`, full check, boundary, toolchain and disposable PostgreSQL rehearsal PASS. Deep body boundary `1315/1307/8`, `8122` fragments, `0` matches, source baseline `2526/2526`; next step is explicit serving write-set allowlist.
- [x] `G10S-181` Import writes serving cards/revisions/translations/placements/graph/activity joins/outbox и active pointer по allowlist. Evidence: target implementation `b2c2f6794036c05fa5ed8c763cd7df664c67d2bc`, evidence `f886526944742972461affc0c910eb9e84772757`; `servingInsert()` enforces the versioned `public` write set of exactly 15 tables, static scan maps `15/15` discovered `INSERT`s to `15/15` helper calls with `0` raw DML, `0` `strata`/schema-qualified targets, and runtime negatives reject unknown/mismatched/multi-statement targets. Focused tests `6/6`, release-import `17/17`, content `389/389`; content gates, full check, boundary, toolchain and disposable PostgreSQL import/replay/readback rehearsal PASS. Deep body boundary `1321/1313/8`, `8122` fragments, `0` matches, source baseline `2526/2526`; next step is live role-privilege proof.
- [x] `G10S-182` Failed import сохраняет previous pointer и не оставляет partial rows visible learner-у. Evidence: target implementation `67c462b0cca8795c1b87cc64efa87c41f5e3c56e`, evidence `e2c19055ea7b78c983d1d21f6619f52eae210a59`; versioned failure-visibility policy names five guarded fact families (manifest, revision, pointer event, receipt, outbox), requires transaction rollback, active-pointer preservation, active-only readback and zero failed-release rows. Metadata vectors accept valid rollback and reject pointer drift/partial rows (`2/2`), static checks confirm `BEGIN`/`ROLLBACK`, read-only active-pointer guard and cleanup, and disposable PostgreSQL rehearsal confirms zero failed-release facts after late receipt failure. Focused `6/6`, content `395/395`, release-import `17/17`, full gates/check/boundary/toolchain PASS; deep body `1326/1318/8`, `8122` fragments, `0` matches, baseline `2526/2526`. Next step is projection rebuild from a fresh/truncated database.
- [x] `G10S-183` Projection rebuild из bundle после truncate/disposable DB даёт exact logical hashes. Evidence: target implementation `00b2dd6b52109cd8cb49805b2814802b2f7a5946`, evidence `ce4ed21`; versioned `g10s-serving-import-rebuild-policy.v1` (`2026.08.31-serving-import-rebuild.1`) now builds one deterministic `question-release-bundle.v1` once and imports that identical bundle into two independent fresh disposable PostgreSQL databases. Both migration chains are `17/17`; manifest, artifact, logical and projection hashes plus all nine projection facts match exactly, both readbacks are verified, and cleanup removes databases, one-shot containers and the temporary bundle. Focused tests `6/6`, release-import `17/17`, content `401/401`, content-gates/check/boundary/toolchain and deep body boundary `1332/1324/8`, `8122` fragments, `0` matches, exact source baseline `2526/2526` are green. The gate/evidence are metadata-only; the persistent developer database is untouched and v1 attestation remains an integrity checksum rather than an externally trusted signer. Next executable item is `G10S-184`.
- [x] `G10S-184` Readback сверяет every ID/count/hash и выпускает metadata-only reconciliation report. Evidence: target implementation `5913a76bb41718e6fec3338c5c5229cef4e8983e`, evidence `7869628101e6e502e59666f8fcd481fb31b4b772`; versioned `g10s-serving-import-reconciliation-policy.v1` (`2026.08.31-serving-import-reconciliation.1`) adds a strict `reconcile` read-only CLI action requiring the expected active event ID. The report compares 18 explicit coordinates — three IDs, five hashes, nine projection/manifest counts and `generatedAt` — and fails closed on every individual drift (`18/18`). Live two-database rehearsal is PASS with identical reports, `17/17` migrations each, verified cleanup and untouched persistent database. Focused reconciliation tests `6/6`, release-import `17/17`, content `407/407`, content-gates/check/boundary/toolchain and post-evidence deep body boundary `1339/1331/8`, `8122` fragments, `0` matches, exact source baseline `2526/2526` are green. The report is metadata-only and grants no import/release authority; the v1 attestation remains an integrity checksum, not an externally trusted signer. Next executable item is `G10S-185`.
- [x] `G10S-185` На основании C098 loss ledger написать draft требований `question-catalog.v2`; v2 implementation остаётся отдельным approved gate. Evidence: target implementation `5aae89cbdf60c18abc4c7f1b121324b93f3dbdea`, evidence `18ba2e88077ebe843c432d9dd445d811c0cbbd12`; metadata-only policy и gate связывают все `7/7` required-field-loss blockers C098 с ровно одним DRAFT requirement (`QCV2-001…QCV2-007`), исключают `5/5` policy-gate-only facts, оставляют один learner response-budget owner, code/drill под task-runtime и не меняют v1/importer/DB. Focused tests `7/7`, content `414/414`, content-gates/check/boundary/toolchain PASS, v1 runtime scan `0` draft-v2 matches, post-evidence body boundary `1344/1336/8`, `8122` fragments, `0` matches, baseline `2526/2526`. Следующий пункт — G10S-186.
- [x] `G10S-186` Commit: `feat(g10s): export and import deterministic question release bundles`. Evidence: target implementation `be3b227de33f9edb0303afd58a8b5bb9ba14896b`, evidence `54b449047080ea0cc83b1dd732b05cc8eb12ac91`; `docs/architecture/release-bundle-handoff.md` binds the existing G10S-175…184 seams into one export → canonical `manifest.json`/`release.json` → file/stream validation → atomic serving import → readback handoff. Canonical bundle, revision-inputs, manifest, public-boundary, importer-boundary, preflight, idempotency, write-set, failure-visibility, rebuild and reconciliation gates are all `PASS`; live rebuild uses one identical bundle in two disposable PostgreSQL databases and reconciliation matches `18/18` coordinates with cleanup and persistent DB untouched. Focused release-import tests `17/17`, content compiler `414/414`, full check/boundary/toolchain and evidence validation pass; post-evidence body boundary `1347` tracked / `1339` text / `8` binary / `8122` fragments / `0` matches, exact source baseline `2526/2526`. Evidence is metadata-only, does not implement `question-catalog.v2`, and grants no new import/release authority. Next executable item is `G10S-187`.

### G10S.8. C098 Node Event Loop vertical slice

- [x] `G10S-187` Подтвердить stable identity C098, KC/aspect/stack, roles, locales, provenance, grants и current serving references. Evidence: target implementation `a08259d`, evidence `d8484e1`; `pnpm content:c098-identity`, focused tests `7/7`, content compiler `421/421`, full check/boundary/toolchain/body-boundary PASS; generic `C098 / ordering / generic` явно отделён от serving Node specialization `question.node-event-loop-001@r1` relation `node-specialization`, без identity alias/import/release mutation. Next executable item is `G10S-188`.
- [x] `G10S-188` Собрать preferred EN/RU prompts и seven-layer answers только из reviewed/public authoring data. Evidence: target implementation `047d16d`, evidence `8e67a78`; `pnpm content:c098-answer-assembly` связывает generic C098 с released Node specialization `question.node-event-loop-001@r1` без alias, выбирает ровно `en`/`ru`, семь answer fields (`concise`, `understanding`, `mechanism`, `traps`, `followUps`, `evidence`, `sources`) и `26` metadata-only hash rows (`14` answer selections, `18` list items). Source rows требуют reviewed/public/redistributable `preferred` + `human` coordinates; missing/duplicate/reordered/unreviewed/tampered rows fail closed. `evidence` добавлен в layer vocabulary. Focused assembly `6/6`, content-model `20/20`, content `427/427`, content-gates/full check/boundary/toolchain/body-boundary PASS (`1356/1348/8`, `8122` fragments, `0` matches, source baseline `2526/2526`). Evidence: `docs/verification/greenfield/G10S/c098-answer-assembly-2026-08-31.{json,md}`. No source body, DB/Docker mutation, import or release authority. Next executable item is `G10S-189`.
- [x] `G10S-189` Alternative prompts C098 пройти human same-expected-answer review; semantic variants выделить в отдельные aspects/questions. Evidence: target implementation `a12fcc1`, evidence `e22093d`; metadata-only decision set содержит ровно `3` human-reviewed candidates: `2` (`en`/`ru`) остаются `same-expected-answer` при identity `C098 / ordering / generic`, `1` отмечен `distinct-question` как proposal `C098 / starvation / generic`. Gate `pnpm content:c098-alternative-review`, focused `6/6`, content `433/433`, full content-gates/check/boundary/toolchain и body-boundary PASS; implementation scan `1362/1354/8`, `8122` fragments, `0` matches, source baseline `2526/2526`. Duplicate coordinates, missing reviewer/decision, preferred/answer-selection drift и invalid identity routing fail closed. No prompt promotion, identity/question creation, DB mutation, import or release authority. Evidence: `docs/verification/greenfield/G10S/c098-alternative-prompt-review-2026-08-31.{json,md}`. Next executable item is `G10S-190`.
- [x] `G10S-190` Перенести минимум одну prediction Activity из prompt space в assessed Activity/Task. Evidence: target implementation `67303da`, evidence final `7b71f18`; versioned `g10s-c098-prediction-activity-policy.v1` (`2026.08.31-c098-prediction-activity.1`) hash-binds the reviewed C098 authoring prompt coordinate (`prompt/en/depth=1/version=1/preferred/human/ord=0`) to released `question.node-event-loop-001@r1` and its assessed `predict` Activity. The Activity now carries `taskFamilyKey=node-event-loop-001` and `runtimeProfile=node-26-commonjs`; the mapping keeps C098 as semantic owner and creates no second question. Focused tests `6/6`, content compiler `439/439`, content-gates/full check/boundary/toolchain and implementation body-boundary `1367` tracked / `1359` text / `8` binary / `8122` source fragments / `0` matches with exact source baseline `2526/2526` are green. The machine report is metadata-only: no prompt/answer bodies, automatic Activity/Task creation, DB mutation, import, or release authority. Exact TaskRevision plus public/hidden evaluator binding is implemented and verified by `G10S-191`; next executable item is `G10S-192`.
- [x] `G10S-191` Связать Event Loop task family с exact released Node runtime revision и public/hidden evaluator split. Evidence: target implementation `08d4648`, evidence `578d113`; `g10s-c098-runtime-revision-policy.v1` (`2026.08.31-c098-runtime-revision.1`) binds `question.node-event-loop-001@r1`, `TaskFamily=node-event-loop-001`, `TaskRevision=1`, `node-26-commonjs`, JavaScript, source digest and release `2026.08.28-questions.1` to runtime `g6-node-golden.1` and hidden submit `g7-hidden-submit.1`. Public `POST /v1/run` (`runtime.run.v1`) exposes only learner RunResponse; hidden `POST /v1/submit` (`runtime.submit.v1`) sends the public envelope through authorized internal `POST /v1/evaluate` to `task-evaluator`, which has no host port and is reachable only on `runtime-evaluator`. Contract/endpoint/network/source-hash drift fails closed. Focused tests `6/6`, content compiler `445/445`, content-gates/full check/boundary/toolchain and deep body-boundary (`1372` tracked / `1364` text / `8` binary / `8122` fragments / `0` matches, source baseline `2526/2526`) are green. The gate is metadata-only: no task/activity creation, DB mutation, import, release, or source-body emission. Evidence: `docs/verification/greenfield/G10S/c098-runtime-revision-2026-08-31.{json,md}`. Next executable item is `G10S-192`.
- [x] `G10S-192` Сохранить/создать scenario progression: baseline order, nested `nextTick`/Promise, timer vs immediate I/O boundary, starvation/edge и explanation defense. Evidence: target implementation `134b2f0`, evidence `8300cb7`; versioned `g10s-c098-scenario-progression-policy.v1` (`2026.08.31-c098-scenario-progression.1`) binds the released `node-event-loop-trace` scenario to `question.node-event-loop-001@r1`, `TaskFamily=node-event-loop-001`, `TaskRevision=1` and `node-26-commonjs`. Six ordered stages (`predict`, `run`, `observe`, `explain`, `defend`, `repeat`) carry explicit activity IDs, runtime order indexes, evidence facets and explanation/defense rubric coordinates. The gate hash-checks all six runtime `ExpectedOrders()` and five hidden evaluator checks; focused `6/6`, content `451/451`, content-gates/full check/boundary/toolchain and deep body-boundary (`1377` tracked / `1369` text / `8` binary / `8122` fragments / `0` matches, source baseline `2526/2526`) are green. Metadata-only: no source bodies, Task/Activity creation, DB/Docker mutation, import or release authority. Evidence: `docs/verification/greenfield/G10S/c098-scenario-progression-2026-08-31.{json,md}`. Next executable item is `G10S-193`.
- [x] `G10S-193` Каждый scenario имеет explicit objective, prerequisites, public statement, expected evidence и failure feedback; hidden solution не доступен browser. Evidence: target implementation `47d45c1`, evidence `c7773d1`/`e9e84a3`; versioned `g10s-observability-scenario-contracts-policy.v1` фиксирует `6` сценариев × `6` стадий, `36` evidence bindings и `36` feedback rules, проверяет graph prerequisites и browser denylist. Focused `6/6`, content `457/457`, full gates/check/boundary/toolchain и deep metadata-only body-boundary (`1382` tracked / `1374` text / `8` binary / `8122` fragments / `0` matches; source baseline `2526/2526`) green; no Task/Activity creation, DB mutation, import or release authority. Next executable item is `G10S-194`.
- [x] `G10S-194` Curriculum placement принадлежит Node path и shared JS runtime там, где семантически верно; Go/Java paths не получают Node-specific content. Evidence: target implementation `8106b4d`, evidence `279e927`; metadata-only path-join policy связывает 6 observability-сценариев с exact curriculum coordinates, выпускает 1 released question join, 2 task-joined stages и оставляет 5 preview-сценариев/30 preview stages deferred. Exact question/revision/family/runtime, activity IDs и cross-language leakage fail closed; focused `6/6`, content `463/463`, full check/boundary/toolchain и deep body-boundary `1387/1379/8`, `8122` fragments, `0` matches, baseline `2526/2526` green. Next executable item is `G10S-195`.
- [x] `G10S-195` Author в Studio меняет C098 layer → review → publish candidate без serving mutation до import. Evidence: target implementation `315baaa`, evidence `77b10c5`; exact author → review → publish-request sequence, C098 `ordering/generic` identity, EN/RU prompt coverage, transaction/write-set and browser/serving denylist; focused `6/6`, content `469/469`, full check/boundary/toolchain and deep body-boundary `1392/1384/8`, `8122` fragments, `0` matches, baseline `2526/2526` PASS. Next executable item is `G10S-196`.
- [x] `G10S-196` Export C098 bundle проходит rights/locale/layer/task/graph gates и создаёт loss ledger. Evidence: target implementation `7c8b8f1c081cc9b6f5f65bd63b11e4dfb8bf898e`, evidence `4299b9b81ef9240af1067ebd1edb5650c137e3e4`; evaluated metadata-only gate проверяет upstream `G10S-172/188/191/194/195`, exact `C098 / ordering / generic` identity, reviewed redistributable rights, EN/RU preferred layers, Node task/runtime join, graph target и 59-entry loss ledger. Deterministic in-memory bundle: 6 records, 12 translations, 26 layer rows, 2 assessed activities, 1 graph dependency, artifact 36 604 bytes, logical/release hash `bd482d33131190268da6e5b9d0fc81f204687b843a7651203ecd26a56aa33c06`, manifest `fe27e0e2010bb08beb50c502442509c631e59c00423d36fdb7d8c95d817b14c6`. Focused `6/6`, content `475/475`, `content:gates`, full check/boundary/toolchain и post-evidence body-boundary `1399/1391/8`, `8122` fragments, `0` matches, source baseline `2526/2526` PASS. Gate не пишет БД/files, не импортирует/активирует release и не эмитит bodies. Следующий пункт — `G10S-197`.
- [x] `G10S-197` Import C098 bundle создаёт exact serving revision, placement и active release atomically. Evidence: target implementation `e1d2eb8` + hash-stability fix `6bb023c`, evidence `fef29c1`; disposable live import/replay/readback на 17 миграциях подтвердил exact projection counts/IDs, active pointer, idempotency, cleanup и persistent DB untouched. Static/live gates и полный check ladder PASS. Следующий пункт — `G10S-198`.
- [x] `G10S-198` Learner route открывает C098 question и все expected layers без broken/dead links. Evidence: target implementation `a8d6eb7bb0b1f5d8f81925dca3e782667649d707`, evidence `3148c98`; `/practice/lesson/:id` — release-only manifest target с exact C098 identity, EN/RU layers `7/7` включая `evidence`, practice `node-event-loop-001@1` / `node-26-commonjs`, graph/Questions/track/locale/Atlas links и fail-closed unknown/stale/preview checks. Focused G10S `6/6`, route smoke/boundary `54/54`, content `487/487`, architecture `213/213`, full check/content-gates/boundary/toolchain и static metadata-only gate PASS; state hash `61180869fd35b8cbb6fe9e190d636d232104cb7c661c6f99344bb11aa60d4548`, policy `a4ea07cb5caecc47d4acfa00a115cded7a194589daf4a10aa696f60452dd26d1`, route manifest `7be333d945b55544f6b46eeb990e5e934098d7e6695a8c8496bd43e1d58b76ac`. Evidence: `docs/verification/greenfield/G10S/c098-learner-route-2026-08-31.{json,md}`. Browser/runtime live execution и hidden answer bodies не заявлены.
- [x] `G10S-199` Language/runtime selector показывает только реально compatible released Node profile; preview languages не активны. Evidence: target implementation `19d60a7`, evidence `bd1203d`; strict learner selector выдаёт только JavaScript revision 1 / `node-26-commonjs`, preview TS/Go/Java/Python/.NET скрыты и direct vectors получают 400; EN/RU route 200, canonical Run PASS, mastery/unlock/accepted неизменны; static `21/21`, focused `12/12`, full check/boundary/toolchain и golden journey PASS.
- [x] `G10S-200` Run выполняет public experiment и не создаёт mastery/verdict. Evidence: target implementation `a6d6fc5`, evidence `7d95250`; static policy `13/13`, focused `10/10`, live public-run journey PASS, stable progress digest, 5 output lines и 8 trace events, без mastery/verdict mutation.
- [x] `G10S-201` Submit выполняет hidden evaluation по exact TaskRevision и создаёт deterministic verdict/evidence. Evidence: target implementation `c7e7dbd`, evidence `c067a05`; static policy `26/26`, focused `4/4`, live canonical/replay/conflict/drift journey PASS, five hidden checks, evidence-only metadata и cleanup.
- [x] `G10S-202` Wrong order, malformed input, stale revision, forged verdict и duplicate idempotency vectors fail correctly. Evidence: target implementation `3668785`, evidence `0a2ca28`; static policy `24/24`, focused `4/4`, live `pnpm runtime:c098-negative-journey` PASS (13 runtime vectors, 8 Submit cases, replay/conflict/concurrency, cancellation recovery, no learner-state mutation).
- [x] `G10S-203` Observe/Explain показывают trace/evidence без hidden answer leakage; Navigator получает exact context IDs и advisory-only boundary. Evidence: target implementation `87849f5`, target evidence `c098-observe-explain-navigator-2026-08-31.{json,md}`; static `40/40`, focused `5/5`, live journey PASS, 14 context coordinates, metadata-only/advisory-only.
- [x] `G10S-204` Restart сохраняет active release, attempts, evidence и Studio history; backup/restore воспроизводит slice. Evidence: target implementation `b113da1`, evidence `0b2c4a5`; static `33/33`, focused `5/5`, live persistence journey `PASS`, 14-entry backup matrix, integrity-checked restore и cleanup `0 containers / 0 networks`.
- [x] `G10S-205` RU/EN × light/dark × MacBook 13/16 × Studio Display browser matrix не имеет overflow, clipped text или unreachable controls. Evidence: target `a35c919`, index `8dc3b8b`, `c098-desktop-matrix-2026-08-31.{json,md}`; `276/276` cases, `9,612` controls, `0` overflow/clipping/missing-landmark/viewport/console/page/request errors, static `30/30`, mutation `7/7`, exact query templates и metadata-only report.
- [x] `G10S-206` Keyboard/screen-reader baseline: headings, labels, focus order, dialog/panel behavior и code/runtime controls имеют accessible names. Evidence: target `955db57` (source fix `cbcec0f`), `c098-accessibility-2026-08-31.{json,md}`; `92/92` route cases, `3,204` named controls, `12/12` interaction cases, `0` ARIA/focus/landmark/id issues, static `30/30`, mutations `6/6`, metadata-only.
- [x] `G10S-207` Performance budget проверяет initial route, editor/task chunks и no duplicate content payload. Evidence: target `b351fa0`, docs/evidence `5829de7`, `13` routes, initial/editor/task `930785/948852/924391` bytes, largest chunk `415610`, total `1130694`, route-specific `8103/26170/1709`, duplicate references/hashes `0`, static `9/9`, production `8/8`, metadata-only.
- [x] `G10S-208` Full route→question→activity→Run→Submit→Evidence machine journey и human spoken explanation сохранены отдельными evidence. Machine journey PASS_WITH_LIMITATIONS: target `8e41ba1`, metadata-only evidence `493fa96`, `5` routes/`200`, Run `5` outputs + `8` trace, Submit `5/5` hidden + replay/`409`, Evidence `4` facets; human spoken explanation остаётся отдельной `AWAITING_HUMAN` boundary и не фабрикуется автоматикой.
- [x] `G10S-209` Commit: `feat(g10s): prove C098 authoring-to-learning vertical slice`. Evidence: target `a4c2533`, marker `c098-authoring-to-learning-marker-2026-08-31.{json,md}`; exact target/evidence commits `8e41ba1`/`493fa96`, six machine stages/order/status, C098 coordinates, evidence SHA-256, metadata-only controls and immutable `AWAITING_HUMAN` boundary are fail-closed; marker mutations `5/5`, full check/boundary/toolchain green.

### G10S.9. Breadth readiness и standalone retirement

- [x] `G10S-210` Сравнить source Strata и target counts/hashes/invariants; every difference имеет mapping/disposition. Evidence: target implementation `6bc19f6`, evidence `4e66c63`, frozen Strata `ec3b6804ecc1d08e3ab355be0c78930a46b34815`; `41/41` files and `159,515` bytes, drift/missing `0`, `13` mappings + `28` dispositions, uncovered `0`, target `17/17` contiguous migrations, invariant `12/12` inherited + `16/16` platform + `12` role checks, disposable DB dropped.
- [x] `G10S-211` Повторить Strata golden fixtures против target CLI и сравнить normalized outputs. Evidence: target implementation `ba34664`, evidence/documentation `00b37f6`, Strata `ec3b680`; `11/11` frozen files, `6` cards, `75` layers, `3` task families, `1` dataset, drift/missing `0`, target CLI `2/2` exit `0`, normalized digest совпал; `7` explicit dispositions; metadata-only, source bodies и DB/import/release authority не эмитируются; focused `6/6`, full check/boundary/toolchain green.
- [x] `G10S-212` Повторить source `npm run check` и target `pnpm check`; оба должны быть green до retirement decision. Evidence: target implementation `bb1acc4`, evidence/documentation `fcfc2f8`; exact order/source `ec3b680` clean/target `bb1acc4` clean, exit `0/0`, output metadata only, focused `5/5`, full check/boundary/toolchain green.
- [x] `G10S-213` Проверить, что target docs/CLI полностью описывают authoring, review, export, import, rollback и recovery без source repo. Evidence: target `6f0f801`, evidence `1c6a072`; standalone docs/CLI PASS, source fallback и database/Docker mutations отсутствуют.
- [x] `G10S-214` Выполнить clean archive/fresh clone target без `/Users/sergeyzhechko/developer/strata`; C098 build/import/journey проходит. Evidence: target `d126d17`, evidence `ebbb082`; archive/fresh clone PASS, C098 export/import/journey PASS, source path references `0`, lockfiles `pnpm-lock.yaml` only.
- [x] `G10S-215` Выполнить rollback target release pointer на pre-G10S bundle и затем forward restore C098. Evidence: target implementation `58b017f`, evidence/docs `175395e`; `18` migrations, rollback/stale rejection/forward restore/replay `PASS`, four-event immutable sequence, stable projection digest, readback verified, metadata-only `contentBodiesEmitted=0`, disposable cleanup.
- [x] `G10S-216` Выполнить DB restore pre-G10S backup в disposable stack; reference product остаётся запускаемым. Evidence: target implementation `c428809`, evidence/docs `bce1e17`; migrations `1..17 → 1..18`, logical hash/counts/schema/role grants совпали, role checks `12/12`, product probes до/после restore `200`, cleanup `0` scoped resources, metadata-only.
- [x] `G10S-217` Создать immutable Strata archive tag/bundle/hash manifest и проверить clone + source checks. Evidence: target implementation `44015ff`, evidence `3d9aa39`, README handoff `d3d10f9`; frozen source `ec3b680`, manifest `41/41` без drift, immutable annotated tag, archive/bundle/clone PASS, source и clone checks exit `0`, metadata-only и temporary cleanup.
- [x] `G10S-218` Пометить standalone Strata README/docs/plan как migrated/reference-only с target path/SHA; status checkbox authority удалить либо явно заморозить. Evidence: target implementation `bf9dd70`/`161a79b`, evidence/docs `04026a3`; successor `0921dd0`, immutable archive tag `strata-archive-2026-09-01-g10s-217` → `ec3b6804`; exact three-doc change range, source check and fail-closed marker rehearsal PASS.
- [x] `G10S-219` Не удалять local source repo внутри G10S; final local removal выполняет только G13 после production acceptance, exact owner-approved manifest и archive/restore proof. Evidence: target implementation `8ccb0f5`, evidence/docs `356f3ad`; retained Strata `0921dd0`, immutable tag → `ec3b6804`; source-target deletion scan `0`, G13 ownership markers and read-only controls PASS.
- [x] `G10S-220` Проверить отсутствие nested `.git`, `package-lock.json`, second Compose project, external symlink и runtime fallback в target. Evidence: target implementation `09fb087`, evidence/docs `b5de1f6`; one root Git, zero nested roots/active or external symlinks, one `pnpm-lock.yaml`, one root Compose project, runtime source/fallback findings `0`, scan `901` files/`166` dirs, focused `5/5`, full check/boundary/toolchain green, metadata-only.
- [x] `G10S-221` Проверить one root startup: `pnpm dev` поднимает platform, migrations и serving без самостоятельного Strata service. Evidence: target implementation `c81e358`, evidence/docs `9b4040b`; isolated `pnpm dev -- --detached --json` PASS, migrations `18/18`, exact six services, six routes `200`, scoped cleanup `0` containers/networks, durable volumes preserved, metadata-only.
- [x] `G10S-222` Проверить `pnpm down` оставляет zero orphan containers/networks и сохраняет declared durable volumes. Evidence: target implementation `2942587`, evidence/docs `943fd45`; optional observability profile, две публичные команды `pnpm down`, `0` containers/networks, `3` durable volumes с неизменными IDs, migration ledger `18/18` после restart, без `--volumes`/`-v`, metadata-only.
- [x] `G10S-223` Обновить G11 input inventory/authoring queue на Strata authority и C098 release schema. Evidence: target implementation `bdf18e9`, evidence/docs `dc6e79c`; 1,597 records bound to bounded queue, frozen Strata `ec3b6804`, C098 exact release/runtime/graph joins, metadata-only and negative fixtures PASS.
- [x] `G10S-224` Все mass-import packs G11 ссылаются на source grant/quarantine/adapter gates; direct catalog JSON edits запрещены. Evidence: target `e58583e`, evidence/docs `cf31479`; `4/4` pack bindings, `4/4` policy refs, static `10` tools with `0` canonical refs/writes/inversions, body fields `0`, immutable historical drift `3`, metadata-only controls.
- [x] `G10S-225` Commit: `chore(g10s): retire standalone Strata as an active authority` — target `39b23ff`, handoff `4b59fb0`, evidence `1cbb69a`; `15/15` prerequisites accepted, target sole active authority, retained archive pinned, active scan `231` files/`0` findings, no deletion or runtime/database/Docker mutation.

### Gate G10S — machine evidence, commits и handoff

- [x] `G10S-226` Создать `docs/verification/greenfield/G10S/` по общему evidence schema; historical G10/G11/G12 artifacts не переписывать. Evidence: target implementation `eea6840`, evidence `3d9b092`; закрытый `g10s-machine-evidence.v1` envelope, deterministic metadata-only index `428` historical files, body-like/source/log fields rejected, `5/5` checks, focused `3/3`, full check/boundary/toolchain ladder green; current report отделён от historical index.
- [x] `G10S-227` Evidence inputs фиксируют Strata `ec3b680` (или reviewed successor), target parent SHA, questions manifest hash и reports 13/14 hashes. Evidence: target implementation `4c1a0bd`, handoff `1d60683`; metadata-only `G10S-inputs/` ledger фиксирует reviewed successor `0921dd0`, immutable baseline/tag `ec3b6804`, target parent `3d9b092`, release/intake manifests и reports 13/14 SHA-256; `8/8` checks, focused `4/4`, full check/boundary/toolchain ladder green.
- [x] `G10S-228` `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, `pnpm content:gates` PASS. Evidence: target implementation `67d6bdd`, evidence `f2da01d`; sequential command ladder `4/4 PASS`, `0` failed/open/skipped, metadata-only output with byte/digest summaries only, focused `3/3`, full check/boundary/toolchain ladder green.
- [x] `G10S-229` Новые `pnpm content:authoring:check`, `content:db:verify`, `content:bundle:verify` или утверждённые эквиваленты PASS и задокументированы. Evidence: target implementation `5b6b1c3`, evidence `3d332dd`; `3/3` dedicated gates PASS, database-free env guard, metadata-only output, zero catalog/DB/Docker/import/release mutation, focused `3/3`, full check/boundary/toolchain ladder green.
- [x] `G10S-230` Fresh/upgrade DB, role/grant negative matrix, canonical prompt race и backup/restore PASS. Evidence: target implementation `361e018`, evidence `c42e3ad`; `6/6` sequential commands PASS, scoped `fluent_g10s_*` database cleanup `0` before/after, persistent DB/Docker mutations `0`, durable volumes preserved, metadata-only output.
- [x] `G10S-231` Studio author/review/publish, deterministic export, file-only import, readback и rollback PASS. Evidence: target implementation `e15dcc9`, evidence `002a7e1`; `9/9` sequential commands PASS, temporary prefix `fluent_g10s_` `0→0`, no persistent DB/Docker mutations.
- [x] `G10S-232` Corpus rights/quarantine/leak scans PASS; forbidden distributable findings = 0. Evidence: target implementation `5cfb47a`, evidence `99664e2`; `9/9` sequential commands PASS, `findingCount/bodyMatchCount/importAllowedRecords/automaticPublicRecords=0`, quarantine `2`, scoped cleanup `0→0`, no persistent DB/Docker mutations.
- [x] `G10S-233` C098 full learner/runtime/evidence journey PASS на exact release/revision IDs. Evidence: target implementation `9a83d03`, evidence `d3a15e7`; `9/9` sequential commands PASS, exact release/question/revision/runtime joins, persistence restart/down-up/restore cleanup, spoken explanation остаётся `AWAITING_HUMAN`.
- [x] `G10S-234` C098 RU/EN, light/dark, required desktop viewports, keyboard/a11y и performance matrix PASS. Evidence: target implementation `60064fb`, evidence `99a80ea`; `5/5` sequential commands PASS, desktop `276/276`, accessibility `92/92 + 12/12`, parity `12` screens, raw colors `0`, performance `8/8`, metadata-only.
- [x] `G10S-235` Static dependency/SQL/credential scan подтверждает no API→Strata access и no dual authority. Evidence: target implementation `07fb3c5`, evidence `f879aad`; `8/8` sequential commands PASS, serving `643` files/`rawStrataSql=0`, authority-negative `7`, SBOM `175`/`0` high-critical, static/live boundaries PASS, metadata-only.
- [x] `G10S-236` Reconciliation: authoring→bundle→serving unexplained delta = 0; intentional losses находятся в loss ledger, а content gaps отделены от внутренних join/projection ошибок. Evidence: target implementation `da9fed2`, evidence `e7040fa`; `9/9` sequential commands PASS, source coverage `73/73`, canonical byte/hash identity, serving readback `18/18`, reconciliation `unexplainedDeltaCount=0`, deterministic rebuild и `0→0` scoped cleanup, metadata-only.
- [x] `G10S-237` Clean archive target проходит install/build/check/dev/C098 без source repositories и agent-local caches. Evidence: target implementation `21ab02c`, clean-room corrections `836d438`, `996f180`, `9c11d85`, `3c729a1`, evidence `1604224`; one-command gate `PASS` (130.4 s), archive/fresh-clone metadata clean, source refs `0`, all install/build/check/dev/C098 export/import/journey/cleanup exit `0`, journey machine status `PASS`, metadata-only controls true, cleanup `0→0`.
- [x] `G10S-238` Каждый implementation commit содержит только объявленный slice; recommended sequence: docs → workspace → DB → domain → Studio → corpus → adapter → C098 → retirement. Evidence: target implementation `ffa194f`, evidence `6ecc55c`; exact range `e7040fa..1604224`, six linear commits, 24/24 commit assertions plus range/main/clean/ancestry = `28/28 PASS`, unlisted path/SHA/parent/message/merge drift fail-closed, metadata-only and push `0`.
- [x] `G10S-239` После каждого commit повторены slice checks и `git status --short` clean; SHAs внесены в gate.md. Evidence: target implementation `e2fbaaf`, evidence `521bf2e`; `13/13` post-commit assertions PASS, five-command metadata-only receipt, full check on phase boundary, push `0`, remote attestation `OPEN`.
- [x] `G10S-240` Push policy зафиксирована как fast-forward-only: local PASS обязателен, но push запрещён владельцем на время CI quota. Evidence: target implementation `383bc64`, evidence `a3b032d`; `15/15` local assertions PASS, полный `pnpm check` на implementation/evidence boundary, `git ls-remote` только read-only, remote attestation `OPEN`, `pushPerformed=false`. SHAs и policy сохранены в `fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-240-push-policy-2026-09-01.{json,md}`. Статус `PASS_WITH_LIMITATIONS` честно отражает одну открытую remote attestation; следующий пункт — `G10S-241`.
- [x] `G10S-241` Existing G10 `PASS_WITH_LIMITATIONS` пересмотрен: все 6 retained limitations перенесены в G11/G12 с owner и exact trigger, без фиктивного `DONE`. Evidence: target implementation `3783ca7`, evidence `764645a`; gate `34/34 PASS`, `6 OPEN`, metadata-only, push `0`. Handoff: `fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-241-limitation-routing-2026-09-01.{json,md}`.
- [x] `G10S-242` Все затронутые G11/G12 items отмечены `REVERIFY_AFTER_G10S` в sidecar evidence index без переписывания исторического индекса: `G11-037`, `G12-R01`, `G12-R06`, `G12-R16`; все 6 limitation IDs покрыты ровно по одному разу. Evidence: target implementation `c6e2aac`, evidence `c7480f3`; gate `35/35 PASS`, `4 OPEN`, metadata-only, push `0`.
- [x] `G10S-243` Implementing agent не ставит product `DONE`; gate получает `AWAITING_INDEPENDENT_REVIEW` и exact handoff package. Evidence: target implementation `fd4e85e`, evidence `d7969aa`; report `24/24 PASS`, `1 OPEN` (owner sign-off), metadata-only, push `0`.
- [x] `G10S-244` Handoff содержит repo path, branch, HEAD, commits, start command, DB migration range, bundle/release IDs, C098 route и evidence index. Evidence: target implementation `b0c7555`, evidence `c2dfb81`; report `24/24 PASS`, `1 OPEN`, immutable package/prior-report/index bindings, metadata-only, push `0`.
- [x] `G10S-245` Независимый Codex review из раздела 3 завершён; все P0/P1/P2 исправлены отдельными commits и повторно проверены. Evidence: target implementation/hardening `8ac2d4f`, `9ff974f`, `b54e229`, evidence/docs `3d6c830`, `262d599`, `b02ee63`; report `34/34 PASS`, symbolic refs, `clean=false` и 40-hex aliases fail-closed, metadata-only, push `0`.
- [ ] `G10S-246` Только после G10S-245 gate получает `PASS`, G11 breadth migration разблокируется.

---

# G11 — Полное curriculum/practice/portfolio closure

## Цель

Перенести весь Brain/Vault knowledge и довести пути до versioned production SLA,
не подменяя качество количеством.

> G11 policy/report evidence: `fluent-interview-platform/docs/verification/greenfield/G11/`
> at target `b37bd65`. The endpoint, source-quality preflight and bounded
> authoring queue are live and
> strict, but their non-zero gap ledger is intentional: the seed release is not
> yet production-eligible.

> **Обязательная зависимость после расширения плана:** G11 breadth work не
> продолжается, пока G10S-246 не имеет `PASS`. Уже созданные G11 policy tools и
> ledgers сохраняются, но content/release evidence, зависящие от старого Studio
> или `question-catalog.v1` authority, получают `REVERIFY_AFTER_G10S`. Corpus
> пополняется только через Strata authoring → reviewed bundle → serving import;
> прямое редактирование release JSON больше не является допустимым workflow.

### G11.0. Coverage policy

- [x] `G11-001` Для technical core capability использовать role SLA: diagnostic, mechanism-basic, mechanism-advanced, predict/trace, edge, debug, trade-off, apply/design, evidence, defense. Машинный audit `coverage-policy-audit.v1` подтверждает полный technical-core set без дублей.
- [x] `G11-002` Для algorithms использовать concept, baseline, easy, medium, hard, proof, complexity, edge-test. Машинный audit подтверждает полный algorithms set без дублей.
- [x] `G11-003` 70 карточек на атомарную тему запрещены; quota относится к module/path coverage. Два versioned policy principles и policy guard это проверяют.
- [x] `G11-004` Hard gates: mandatory roles, depth, locale, provenance, placement, practice, no quarantine. Release-path audit проверяет locale/provenance/placement/no-quarantine и отделяет score/practice gap.
- [ ] `G11-005` Core capability score ≥0.90 после hard gates; filler ради count запрещён.
- [x] `G11-006` Shared cards переиспользуются placements; unique canonical count и path placement count публикуются отдельно.
- [x] `G11-007` Primary Questions и Supporting Prompts считаются отдельно.
- [x] `G11-008` PathCompletionManifest содержит exact IDs, release, denominator и policy version.
- [x] `G11-009` Изменение quota требует versioned decision/migration note.
- [x] `G11-010` Python/Kotlin/любая новая lane остаётся preview до полного собственного manifest.

### G11.1. Production target matrix

| Path                  | Capabilities / core placements | Primary / support | Activities | Projects / checkpoints |
| --------------------- | -----------------------------: | ----------------: | ---------: | ---------------------: |
| Node.js + NestJS      |                       32 / 320 |          224 / 96 |         70 |                  6 / 7 |
| Java + Spring         |                       32 / 320 |          224 / 96 |         70 |                  6 / 7 |
| Go                    |                       28 / 280 |          196 / 84 |         70 |                  6 / 6 |
| .NET + C#             |                       28 / 280 |          196 / 84 |         70 |                  6 / 6 |
| Kotlin + JVM          |                       28 / 280 |          196 / 84 |         70 |                  6 / 6 |
| Python backend        |                       28 / 280 |          196 / 84 |         70 |                  6 / 6 |
| React + Next.js + Web |                       36 / 360 |         252 / 108 |         50 |                  6 / 7 |
| Algorithms overlay    |              15 families / 120 |           75 / 45 |         60 |                  4 / 6 |
| System Design overlay |                       50 / 500 |         350 / 150 |         50 |                  6 / 7 |
| Behavioral overlay    |                       12 / 120 |           84 / 36 |  24 spoken |                  6 / 5 |

Это **target placements**, а не требование написать 2 860 уникальных похожих
QuestionCards. Shared generic cards могут иметь reviewed placements в нескольких
paths; denominators и stable IDs обязаны объяснять переиспользование.

- [x] `G11-011` Выпустить versioned policy, подтверждающий/корректирующий таблицу после exact G0/G5 inventory.
- [x] `G11-012` Любая корректировка сохраняет минимум role/depth/practice SLA и owner rationale.

### G11.2. Corpus reconciliation

- [ ] `G11-013` Все Brain/Vault records классифицированы по canonical ID, capability, role, locale, provenance и disposition.
- [x] `G11-014` Unmapped/unreviewed/quarantined counts публикуются, не исчезают.
- [ ] `G11-015` Generic content помещается в shared modules и получает path-specific prerequisites.
- [x] `G11-016` Language-native content проходит forbidden-set tests. Текущий release evidence: `10/10` placements passed (native allowlist, forbidden semantic/runtime/task-family sets и explicit generic reuse).
- [x] `G11-017` Missing-role ledger генерируется по stable IDs.
- [ ] `G11-018` Research/authoring packs закрывают gaps официальными sources и original explanations.
- [ ] `G11-019` Expert sample review по capability cluster обязателен.
- [x] `G11-020` No production release по total count без role matrix. `production-eligibility-audit.v1` fail-closed связывает coverage score/hard-gates с role ledger; текущие `0` eligible paths и `11` open production-role requirements явно сохранены.

### G11.3. Executable practice portfolio

- [ ] `G11-021` Big-Tech target: 168 TaskFamily и 456 runnable revisions подтверждён или versioned-adjusted после exact inventory.
- [ ] `G11-022` Shared algorithms/backend/SQL/infra families имеют compatible revisions, не копии family.
- [ ] `G11-023` Backend path: 12 algorithms + 12 shared backend + 16 native + 16 data + 8 infra + 6 project = 70 Activities.
- [ ] `G11-024` React/Next path: 12 algorithms + 20 React/Next/browser + 8 Web/API/security + 4 performance/a11y + 6 project = 50.
- [ ] `G11-025` System Design: 32 defense cases + 12 infra labs + 6 projects = 50.
- [ ] `G11-026` Critical capability имеет ≥2 independent scenarios; остальные core — ≥1 assessed Activity.
- [x] `G11-027` Seeded wrong solutions проверяют tests, а не только happy path. Для единственного released runtime `node-26-commonjs` отдельный wrong-solution vector вернул `failed/public_event_loop_order_mismatch`, baseline mismatch, cleanup и отсутствие mastery/unlock; остальные runtimes закрываются вместе с их release.
- [ ] `G11-028` Package-mode drills проходят по всем released runtimes.

### G11.4. Path-specific closure packs

- [ ] `G11-N01` Node: event loop/libuv/V8/streams/workers/ALS/Abort/timers/Buffer/GC/HTTP/process/diagnostics.
- [ ] `G11-N02` Nest: DI scopes/lifecycle/middleware/guards/pipes/interceptors/filters/validation/auth/transactions/testing/observability.
- [ ] `G11-N03` JS/TS runtime selector and 32 Lessons/70 Activities browser journey PASS.
- [ ] `G11-J01` Java: type system/generics/collections/errors/streams/I/O/JMM/locks/virtual threads/GC/classloading/diagnostics.
- [ ] `G11-J02` Spring: DI/proxies/transactions/MVC/validation/data/security/testing/observability.
- [ ] `G11-J03` Exact JVM runtime revisions and 32 Lessons/70 Activities journey PASS.
- [ ] `G11-G01` Go: types/interfaces/errors/slices/maps/goroutines/channels/context/race/sync/HTTP/pprof/escape/tooling.
- [ ] `G11-G02` Race/leak seeded scenarios fail correctly.
- [ ] `G11-G03` Exact Go revisions and 28 Lessons/70 Activities journey PASS.
- [ ] `G11-D01` .NET: C#/LINQ/CLR/memory/TAP/cancellation/Channels/ASP.NET/DI/EF/HttpClientFactory/Activity/diagnostics.
- [ ] `G11-D02` Cancellation/concurrency/disposal seeded scenarios fail correctly.
- [ ] `G11-D03` Exact .NET revisions and 28 Lessons/70 Activities journey PASS.
- [ ] `G11-K01` Kotlin: nullability/types/coroutines/Flow/channels/structured concurrency/collections/errors/JVM interop/testing.
- [ ] `G11-K02` Ktor/Spring Kotlin lane выбирается явно; framework-native cards не смешиваются.
- [ ] `G11-K03` Kotlin uses exact JVM/Kotlin runtime and Java-agent telemetry; 28 Lessons/70 Activities PASS.
- [ ] `G11-P01` Python: data model/types/asyncio/concurrency/memory/packaging/testing/FastAPI or selected backend framework/diagnostics.
- [ ] `G11-P02` GIL/async/process scenarios are Python-specific, not Node-derived.
- [ ] `G11-P03` Exact Python revisions and 28 Lessons/70 Activities PASS.
- [ ] `G11-F01` React/Next: browser/JS/TS/React rendering/state/effects/concurrency/RSC/caching/routing/forms/security/performance/a11y/testing/design system.
- [ ] `G11-F02` Vue/Angular historical content becomes Web shared, contrast, library-only or retired(reason); it does not masquerade as Next native.
- [ ] `G11-F03` 36 Lessons/50 Activities and real Next project journey PASS.
- [ ] `G11-A01` Algorithms cover 15 families, proof/complexity/edge roles and 60 runnable problems across released languages.
- [ ] `G11-S01` System Design covers 50 capabilities with design defense, capacity, consistency, reliability, security, data, messaging, operations and incident drills.
- [ ] `G11-B01` Behavioral covers project evidence, STAR/CAR, conflict, leadership, failure, ambiguity, impact and English spoken probes.

### G11.5. Learning quality and interview benchmark

- [ ] `G11-029` Lessons support worked example → faded steps → independent problem → self-explanation → interleaving → repeat.
- [ ] `G11-030` Retention measured at 7 and 30 days.
- [ ] `G11-031` Unseen variant success and hint dependence recorded.
- [ ] `G11-032` Timed coding rubric covers clarification, design, tests, edge cases, complexity and explanation.
- [ ] `G11-033` System-design rubric covers requirements, estimates, model, APIs, data, failure, trade-offs and operations.
- [ ] `G11-034` Incident rubric covers detection, hypothesis, evidence, mitigation, recovery and prevention.
- [ ] `G11-035` English defense rubric and recorded/mock workflow exist.
- [ ] `G11-036` Product does not claim interview readiness until human/external mock evidence exists.

### G11.6. Обязательная revalidation после G10S

- [ ] `G11-R01` Новый inventory читается из Strata authoring release и serving readback, а не из hand-maintained release JSON.
- [ ] `G11-R02` Все source records имеют canonical disposition; unresolved не скрываются за aggregate count.
- [ ] `G11-R03` Missing-role ledger пересобран на новых stable IDs и revision hashes.
- [ ] `G11-R04` Coverage score пересобран после исключения quarantine, duplicate aliases, supporting prompts и non-released translations.
- [ ] `G11-R05` Все G11 authoring packs создают Strata commands/review queue; direct write в serving catalog fail closed.
- [ ] `G11-R06` Generic/shared placement reuse не превращает language-native content в чужой path.
- [ ] `G11-R07` Каждый runnable Activity ссылается на exact TaskFamily/TaskRevision/runtime release; broken и preview links не считаются coverage.
- [ ] `G11-R08` Node/Java/Go/.NET/Kotlin/Python/React/Next paths повторно проходят forbidden-set и relevance matrix после import.
- [ ] `G11-R09` Algorithms/System Design/Behavioral overlays используют shared placements осознанно и не дублируют canonical Questions.
- [ ] `G11-R10` Rights leak scan проходит для каждого release bundle и learner projection; forbidden findings = 0.
- [ ] `G11-R11` C098 remains green как canary после каждого mass-import batch; regression блокирует следующий batch.
- [ ] `G11-R12` Каждая path/release фаза закрывается отдельным bundle, reconciliation report, browser journey и atomic commit.
- [ ] `G11-R13` G11 final evidence ссылается на G10S PASS SHA, authoring release IDs, serving release IDs и current adapter version.
- [ ] `G11-R14` Старые G11 evidence artifacts помечены superseded либо still-valid с доказанным independent scope; молчаливое наследование запрещено.

### Gate G11

- [ ] `G11-037` Every production path manifest reaches approved targets with exact IDs.
- [x] `G11-038` Every preview path is labeled preview with exact gaps.
- [ ] `G11-039` Unresolved corpus records = 0; quarantine remains explicit.
- [ ] `G11-040` Multi-language Runtime conformance PASS.
- [ ] `G11-041` Path relevance/forbidden-set matrix PASS.
- [ ] `G11-042` Full learner route→question→activity→evidence journey PASS per path.
- [x] `G11-043` Commits are path/release scoped; no mega content dump without manifests/reviews.
- [ ] `G11-044` Final commit: `feat(g11): publish production curriculum and practice portfolio`.
- [ ] `G11-045` `gate.json.status = PASS`.
- [ ] `G11-046` `G11-R01…R14` PASS; иначе G11-045 остаётся FAIL независимо от card/activity counts.

### Execution update — G11.0 coverage policy audit — 30 августа 2026

Target `main` (`c0f3e86`, evidence `3ab6354`) добавил
`tools/content-compiler/coverage-policy-audit.mjs` и `pnpm content:policy`.
Инструмент независимо проверяет exact path set, technical-core/algorithms role
SLA, запрет duplicate-card filler quotas и hard-gate contract
(`released`, `localeComplete`, `provenanceComplete`, `noQuarantine`,
`placementComplete`). Три негативных fixture-теста подтверждают fail-closed
поведение. Поэтому `G11-001..004` закрыты машинным evidence.

`G11-005` не закрыт: production score seed-релиза равен `0.00` для Node/Java/Go
и ни один путь не eligible. Это честный content-authoring gap; tool не меняет
карточки и не повышает score вручную. Полный отчёт:
`fluent-interview-platform/docs/verification/greenfield/G11/coverage-policy-audit-2026-08-30.{json,md}`.

### Execution update — G11-021…028 practice portfolio audit — 30 августа 2026

Target `main` (`cd1497e`, evidence `a183d99`) добавил versioned
`practice-portfolio-policy.v1` и fail-closed `practice-portfolio-audit.v1`.
Аудит разделяет карточки и оцениваемые runnable activities, считает уникальные
`TaskFamily`/revision, требует явную shared/path composition, независимые
сценарии, seeded wrong-solution vectors и package-mode evidence для каждого
released runtime. На текущем seed: `6` cards, `7` assessed activities, `1`
family, `4` runnable candidates, `0` runnable revisions из `456`, и `0/8`
проверок G11-021…028 закрыты. Это зафиксированный authoring/runtime gap, а не
основание повышать статус релиза или заполнять квоты дублями.

Checkboxes `G11-021…028` остаются `[ ]` до появления оригинального контента,
typed metadata, runtime evidence и package-mode прогонов. Полные артефакты:
`fluent-interview-platform/docs/verification/greenfield/G11/practice-portfolio-audit-2026-08-30.{json,md}`.

### Execution update — G11-013 classification ledger — 30 августа 2026

Target `main` (`72e4978`, evidence `f4ef25b`) добавил
`vault-classification-policy.v1` и `vault-classification-ledger.v1`. Теперь
каждая из `1,597` Brain/Vault записей имеет отдельную metadata-only строку для
canonical ID, capability, role, locale, provenance и disposition; состояния
неизвестного поля не угадываются и не приводят к promotion. Snapshot: `1,591`
canonical IDs, `1,591` capabilities, `1,594` полных RU/EN locale, `0` role
назначений, `0` provenance decisions и `0` final reviewer dispositions; итог
`G11-013=OPEN`, `0/1,597` fully classified. Automatic `pending`/`quarantined`
intake остаются видимыми до bounded reviewer decision set.

Полные артефакты:
`fluent-interview-platform/docs/verification/greenfield/G11/classification-ledger-2026-08-30.{json,md}`.

### Execution update — G11-015 shared content and prerequisites — 30 августа 2026

Target `main` (`c326e79`, evidence `5d37354`) добавил
`shared-content-policy.v1` и `shared-content-audit.v1`. Guard отделяет
reusable generic placements от native content: shared modules должны иметь
явный `sharedKey` и exposure минимум в двух tracks, а каждый generic placement
должен ссылаться на существующий generic/shared module с path-specific
prerequisite. Текущий release: `3` shared modules, `0` explicit keys, `6`
generic placements (`3` pass, `3` open), `6` unresolved items; `G11-015` остаётся
`OPEN`, пока curriculum metadata не будет дополнена.

Полные артефакты:
`fluent-interview-platform/docs/verification/greenfield/G11/shared-content-audit-2026-08-30.{json,md}`.

### Execution update — G11-018 research/authoring packs — 30 августа 2026

Target `main` (`0b2669e`, evidence `93ee3fa`) добавил
`research-authoring-policy.v1` и bounded `research-authoring-pack.v1`. Для всех
`1,597` Brain/Vault records pack назначает path-specific domains первичных
источников и missing original-content artifacts, но выбирает не более `100`
записей за batch и не копирует source wording. Текущий snapshot: `0/1,597`
review-ready, official-source missing `1,597`, mechanism `494`, answer/solution
`463`, typed placement `1,370`, assessed activity `1,346`; `G11-018=OPEN` до
оригинального authoring и reviewer sign-off.

Полный артефакт:
`fluent-interview-platform/docs/verification/greenfield/G11/research-authoring-pack-2026-08-30.{json,md}`.

### Execution update — G11-019 expert sample review — 30 августа 2026

Target `main` (`de1836d`, evidence `10021d2`) добавил
`expert-sample-policy.v1` и `expert-sample-audit.v1`. Для каждого из `27`
path/domain capability clusters выбран стабильный sample, связанный с точным
source hash. Закрытие требует независимого `subject-matter-expert`, подробных
notes и решения `pass`; сейчас `27/27` samples выбраны, но `0` review decisions
записано, поэтому `G11-019=OPEN`. Инструмент не меняет release и не подменяет
editorial review.

Полный артефакт:
`fluent-interview-platform/docs/verification/greenfield/G11/expert-sample-audit-2026-08-30.{json,md}`.

### Execution update — G11-027 seeded wrong-solution vector — 30 августа 2026

Target `main` (`96a0506`) расширил `pnpm runtime:vectors` отдельным
исполняемым неверным решением для released `node-26-commonjs`. Вектор проходит
через публичную Next boundary, получает `failed` с причиной
`public_event_loop_order_mismatch`, `baselineMatch=false`, очищает worker и не
меняет `masteryChanged`, `unlockChanged` или `accepted`. После него canonical
recovery также проходит. Поэтому `G11-027` закрыт для текущего released
runtime; package-mode и новые языки остаются отдельными гейтами.

Evidence: `fluent-interview-platform/docs/verification/greenfield/G6/runtime-vectors-live-2026-08-30.{json,md}`;
practice projection обновлена до `1/8` pass, state hash
`da2a4de17fe4c9a34b9ebbd3273da9eee612fc78a83e8d80e38a012d3e14b7e7`.

### Execution update — G11-016 path relevance — 30 августа 2026

Target evidence commit `6ab7ad4` повторно запустил
`pnpm content:path-relevance` и четыре validator-теста. Все `10/10` current
placements прошли: `4` native и `6` explicit generic; запрещённые language
semantic keys, runtime profiles и task-family keys не просачиваются в чужой
path. Это закрывает именно механический G11-016, но не продвигает pending
Brain/Vault records автоматически.

### Execution update — G11-020 production eligibility guard — 30 августа 2026

Target `main` (`80a8942`, evidence `0c40e6d`) добавил
`tools/content-compiler/production-eligibility-audit.mjs` и
`pnpm content:eligibility`. Guard не позволяет считать production path готовым
только по total card count: одновременно требуются score ≥ 0.90, все release
hard-gates и complete role matrix. На текущем seed invariant PASS (`0`
violations), но `0` из `3` production paths eligible и `11` role requirements
остаются открытыми. Негативные fixtures проверяют подделанное `eligible=true`
и отсутствие path declaration.

---

# G12 — Cutover rehearsal, release candidate и independent handoff

## Цель

Доказать новый продукт целиком, не удалить reference и передать независимому
ревьюеру проверяемый RC.

> Existing G12 RC/evidence был собран до G10S и остаётся полезным baseline, но
> не является финальным RC после смены content authority. После G10S и G11 PASS
> требуется новый RC SHA/tag и selective-plus-full requalification ниже.

### G12.1. Full clean-room verification

- [x] `G12-001` Создать brand-new clone из `origin/main` в disposable explicit path.
- [x] `G12-002` Проверить exact toolchain/bootstrap instructions.
- [x] `G12-003` Запустить только `pnpm dev`.
- [x] `G12-004` Проверить `doctor/status` до/во время/после startup.
- [x] `G12-005` Прокликать все routes/links/buttons/menus/dialogs/settings/deep links. Safe subset: 23/23 routes, 55/55 internal link destinations и 336/336 visible enabled controls; stateful mutations остаются в G12-009/G9. Evidence: `fluent-interview-platform/docs/verification/greenfield/G12/interactive-crawl-2026-08-30.json`.
- [x] `G12-006` Проверить every route RU/EN, light/dark/system, keyboard, required viewports. Evidence: `fluent-interview-platform/docs/verification/greenfield/G12/locale-theme-viewport-2026-08-30.json` — 552/552 cases, system theme проверен при обеих OS-схемах, 0 page/console/request errors.
- [x] `G12-007` Проверить all API endpoints against generated contract. Generated
  controller inventory covered 40/40 route handlers and 43/43 direct/negative
  cases; all response projections decoded through `@fluent/contracts`, all
  malformed branches returned the expected Nest error envelope, and the
  uncovered-route set was empty. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/api-contract-matrix-2026-08-30.json`.
- [x] `G12-008` Проверить question/content/placement/release counts/hashes.
  Target evidence `fluent-interview-platform/docs/verification/greenfield/G12/content-release-reconciliation-2026-08-30.json`: question/curriculum/route/placement/release-pointer joins and projection hashes reconcile; canonical question build is deterministic. Seed completeness remains an explicit limitation.
- [x] `G12-009` Проверить Run/Submit/Evidence/Progress/Revision/Projects/Navigator/Studio. На target `fc23423` отдельный Next-boundary journey прошёл Run/Submit/Evidence, server-stamped Progress/Revision, project defense/evidence, offline advisory Navigator с replay/history cleanup и PostgreSQL Studio restart/replay; isolated Compose cleanup оставил 0 containers/networks. Evidence: `fluent-interview-platform/docs/verification/greenfield/G12/learner-surface-journey-2026-08-30.json`.
- [x] `G12-010` Проверить all released language/runtime drills. Current
  release has only Node.js JavaScript; its released profile passed the full
  runtime vector/Submit/outage/recovery matrix. Preview languages remain
  explicitly unclaimed. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/runtime-conformance-2026-08-30.json`.
- [x] `G12-011` Проверить AI absent/offline/connected/stream/cancel/timeout states.
  Machine matrix `6/6` прошла через Next boundary на disposable local
  OpenAI-compatible provider: absent/offline `unavailable`, connected JSON
  `completed` с replay, timeout `provider_timeout`, SSE fail-closed и client
  cancel с bounded outcome. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/navigator-state-matrix-2026-08-30.json`.
- [x] `G12-012` Проверить observability off/on/outage/recovery и incident
  bundle: core остаётся ready без optional collector, collector восстанавливается
  после outage, incident capture redacts forbidden fields. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/observability-lifecycle-2026-08-30.json`.
- [x] `G12-013` Проверить stop/restart/backup/restore/data persistence.
  `stack:persistence` прошёл stop/start и scoped down/up, backup matrix для 14
  canonical ledgers, exact SHA-256 restore и проверку сохранности Studio
  PostgreSQL authority; baseline сохранился, post-backup sentinels удалены,
  cleanup оставил 0 containers/networks. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/persistence-journey-2026-08-30.json`.
- [x] `G12-014` Проверить clean shutdown и zero orphan resources.

### G12.2. Quality/security/supply chain

- [x] `G12-015` Full format/lint/type/unit/component/contract/integration/browser suite PASS.
- [x] `G12-016` Runtime adversarial/conformance matrix PASS for the released
  Node.js profile: unit/profile policy, 12 Run vectors, Submit replay and
  concurrency, runner/evaluator outage recovery, and W3C trace continuity.
  Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/runtime-conformance-2026-08-30.json`.
- [x] `G12-017` Hidden canary leak scan PASS для текущего post-RC target;
  evidence `c431bc3` сканирует declared и artifact-wide roots с 0 findings.
  Это не является независимым production sign-off.
- [x] `G12-018` Auth/session/CSRF/XSS/SSRF/path traversal/command injection/secrets checks PASS. Target `8a554de` добавил static/live `security:boundary`; перечисленные fail-closed vectors и cleanup прошли, а local-single-user/auth limitation явно записана в G12 evidence.
- [x] `G12-019` Dependency audit/CodeQL/SBOM/provenance/signature checks PASS. Target `17cef51` добавил build/audit/SBOM/pinned-CodeQL/provenance и Ed25519 verification; ограничения trusted registry/image attestation явно записаны в evidence.
- [x] `G12-020` Performance budgets PASS per route; released Node profile
  проверен на 13 routes и heavy-editor policy закрыта отсутствием `xterm`,
  `monaco-editor` и `codemirror` при bounded textarea editor. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/performance-budget-2026-08-30.json`.
- [x] `G12-021` Repeatable WCAG machine baseline PASS_WITH_LIMITATIONS: 23 curated routes, 739/739 named controls, landmarks/heading/alt/focus guards и 27/27 token contrast checks. Human VoiceOver/NVDA smoke и full browser/AT matrix остаются owner gates. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/accessibility-audit-2026-08-30.json`.
- [x] `G12-022` Machine visual contract PASS_WITH_LIMITATIONS: 12 surfaces × 3 desktop profiles × light/dark (`72/72`), zero page overflow/clipped visible controls/unexplained P0/P1 geometry defects, and `.app-scroll-region` owns vertical scroll in every case. D3 raster deltas are explicitly classified `INFORMATIONAL_BASELINE_DELTA`; exact pixel/owner sign-off remains open. Evidence: `fluent-interview-platform/docs/verification/greenfield/G12/visual-contract-2026-08-30.json`.
- [x] `G12-023` Local telemetry budget PASS_WITH_LIMITATIONS: recursive privacy/unknown-field guards, normalized dynamic routes, `10,000` synthetic events, `60/128` bounded dimension tuples, `2,700,793/4,194,304` batch bytes, 90-day retention purge and fail-closed `16 KiB` disk-pressure rehearsal. External collector, long-duration retention and multi-host drills remain open. Evidence: `fluent-interview-platform/docs/verification/greenfield/G12/telemetry-budget-2026-08-30.json`.
- [ ] `G12-024` Remote CI required checks green on exact RC SHA — still open because Actions dispatch is quota-bound. Local clean-archive CI-equivalent PASS_WITH_LIMITATIONS (`rc-2026.08.29.1`, `476aa01…`) is recorded in `fluent-interview-platform/docs/verification/greenfield/G12/exact-rc-ci-2026-08-30.json`; do not treat it as remote attestation.

### G12.3. Reconciliation and rollback

- [ ] `G12-025` Port Ledger entries all `ported|adapted|dropped(reason)`; planned/unresolved = 0.
- [x] `G12-026` Route reconciliation unresolved = 0.
- [x] `G12-027` Data/content/task/project/progress reconciliation has
  `unexplainedDeltaCount = 0` across released authorities and projections;
  two fixed-`asOf` clean rebuilds are byte-identical. Seed content shortfalls
  remain explicit (`20` open lessons, `70` role requirements, `212` questions
  and `56` activities) and are not fabricated as coverage. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/release-graph-reconciliation-2026-08-30.json`.
- [x] `G12-028` Target backup restored in disposable stack and reverified.
- [x] `G12-029` Target startup failure → recovery → scoped cleanup rehearsed in
  a disposable Compose project; port collision failed closed, the unchanged
  `pnpm dev` retry reached healthy services, and cleanup left zero containers/
  networks while preserving durable volumes. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/startup-recovery-2026-08-30.json`.
- [x] `G12-030` Reference learner routes remained reachable (`200` on `/`,
  `/program`, `/atlas`, `/practice`) while the target Compose project had zero
  containers; target then restarted with healthy services. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/reference-independence-2026-08-30.json`.
- [x] `G12-031` Target needs no reference service/path/symlink to run. Clean
  git archive from target `b409c68` installed offline and built Next/Nest
  successfully with no reference workspace, nested Git root, symlink or
  external Dockerfile copy source. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/target-independence-2026-08-30.json`.
- [x] `G12-032` No legacy repo is deleted/archived by this gate.

### G12.4. Handoff package

- [x] `G12-033` Создать RC manifest: repo URL, branch, HEAD SHA, image digests, schema/content/task releases.
- [x] `G12-034` Создать final gate index G0–G12 with hashes and links; после
      G10S расширить index отдельным G10S node и supersession links.
- [x] `G12-035` Список known limitations пуст либо каждое ограничение блокирует production claim.
- [x] `G12-036` Создать reviewer runbook с одной командой и expected outputs.

### Execution update — G12 startup recovery — 30 августа 2026

В отдельном stack `fluent-g12-startup-recovery-20260830` (web port `47462`)
порт был занят disposable holder-ом. Штатный `pnpm dev -- --detached` получил
ожидаемый `compose-up` `exitCode=1` (`address already in use`) без изменения
learner data. После освобождения holder-а та же команда вернула `ready`; API,
PostgreSQL, runtime-control, evaluator и web были healthy, `doctor`/`status`
вернули exit code 0. Scoped `pnpm down` оставил `0 containers`, `0 networks` и
сохранил 2 durable volumes. Это закрывает только `G12-029`; production,
multi-language, CI exact-RC и independent visual/security review остаются
открытыми. Машиночитаемый результат и воспроизведение находятся в
`fluent-interview-platform/docs/verification/greenfield/G12/`.
- [x] `G12-037` Создать owner visual/learning sign-off checklist.

### Gate G12

- [x] `G12-038` Commit: `release(g12): prepare Fluent Interview Platform release candidate`.
- [x] `G12-039` Push `main`; verify `origin/main == HEAD`.
- [x] `G12-040` Создать immutable **RC tag**, не final production tag.
- [x] `G12-041` `gate.json.status = AWAITING_INDEPENDENT_REVIEW`.
- [x] `G12-042` Передать владельцу/Codex exact repo path, remote, SHA, tag, start command и evidence index.

### G12.5. Mandatory requalification after G10S/G11

- [ ] `G12-R01` Выпустить новый RC на exact G10S+G11 HEAD; старый RC tag не перемещать и пометить superseded в release index.
- [ ] `G12-R02` Повторить fresh clone/archive, `pnpm dev`, doctor/status/down и zero-orphan lifecycle на новом RC.
- [ ] `G12-R03` Повторить full route/link/control crawl после новых content IDs и placement graph.
- [ ] `G12-R04` Повторить API contract matrix для authoring commands, bundle import/readback и serving catalog.
- [ ] `G12-R05` Повторить content/release reconciliation от Strata authority до active serving pointer; unexplained delta = 0.
- [ ] `G12-R06` Повторить Studio lifecycle, persistence, restart, backup/restore и rollback на one-database schema/roles.
- [ ] `G12-R07` Повторить forbidden DB privilege matrix из clean database и restored database.
- [ ] `G12-R08` Повторить paid/company/hidden/source-body leak scan по Git, bundles, images, logs, traces и browser payloads.
- [ ] `G12-R09` Повторить runtime conformance для всех реально released language profiles и exact TaskRevision joins.
- [ ] `G12-R10` Повторить Node/Java/Go/.NET/Kotlin/Python/Next path relevance и forbidden-set matrix.
- [ ] `G12-R11` Повторить Run/Submit/Evidence/Progress/Navigator journey минимум для C098 и по одному canary каждого production path.
- [ ] `G12-R12` Повторить RU/EN × light/dark/system × MacBook 13/16 × Studio Display state/visual matrix на current release.
- [ ] `G12-R13` Повторить accessibility, keyboard, focus, dialog/panel и reduced-motion checks на изменённых learner/Studio surfaces.
- [ ] `G12-R14` Повторить performance budgets и проверить, что authoring/content payload не попал в learner bundles.
- [ ] `G12-R15` Повторить security/supply-chain/SBOM/provenance gates с новыми content/tool projects.
- [ ] `G12-R16` Remote CI required checks проходят на exact new RC SHA либо остаются explicit release blocker; local equivalence не подменяет remote attestation.
- [ ] `G12-R17` Owner/Codex получают новый handoff с G10S/G11/G12 evidence graph и списком superseded artifacts.
- [ ] `G12-R18` G12 `AWAITING_INDEPENDENT_REVIEW` выставляется повторно только после R01…R17 PASS.

`G12-018..019`, `G12-021` и `G12-024` намеренно остаются без полного
production-утверждения там, где репетиция покрыла только автоматический
subset (например, route crawl без полной ручной визуальной вычитки, Navigator
без реальной LM Studio usefulness review/streaming contract, Node runtime без
multi-language conformance, exact-RC без remote Actions из-за quota).
`G12-023` и `G12-027` имеют локальные machine slices с явными
`PASS_WITH_LIMITATIONS`; внешние collector/retention и content completeness
по-прежнему являются отдельными promotion gates. Точные границы и ожидаемые
следующие доказательства перечислены в target `G12/known-limitations.md`.

### Execution update — G12 stateful learner surface journey — 30 августа 2026

На target `fc23423` исправлен устаревший smoke assertion в golden journey и
выполнен отдельный disposable stack `fluent-g12-surfaces-20260830`.
Route→Run→Submit→Evidence прошли с пятью output lines, восемью trace events,
strict malformed/forged/drift/oversized guards, idempotent replay и
concurrent same-key semantics. Отдельный learner profile записал lifecycle,
две evaluator-backed learning assessments, server-issued unseen transfer,
progress snapshot и revision plan; Navigator в offline режиме вернул
`advisoryOnly=true`, повтор стабилен, history удаляется, progress не меняется.
Project defense assessment стал persisted evidence и projected milestone
`completed`; Studio PostgreSQL candidate/review/publish/readback/restart
counts стабильны. Scoped `pnpm down` оставил ноль target containers/networks и
сохранил два durable volumes. Machine evidence:
`fluent-interview-platform/docs/verification/greenfield/G12/learner-surface-journey-2026-08-30.json`.
Это закрывает machine-only G12-009; content completeness и human
visual/learning sign-off остаются отдельными gates.

### Execution update — G12 Navigator state matrix — 30 августа 2026

Target commits `d5dcf9e` и `9015a30` добавили server-owned bounded provider
timeouts, request abort propagation до Nest/LM fetch и воспроизводимый
`pnpm navigator:states`. На disposable stack
`fluent-g12-ai-20260830` через публичную Next boundary прошли absent, offline,
connected JSON, timeout, SSE fail-closed и client cancel (`6/6`). Connected
turn и exact idempotent replay декодируются через contracts; SSE partial chunks
и `[DONE]` не попадают в public response; отменённый браузером запрос получает
`AbortError`, а provider outcome остаётся bounded. Прямой API unit test отдельно
подтверждает abort без append.

Проверка очистила временную историю (`6` записей удалены), `pnpm down` оставил
`0` target containers/networks и сохранил `2` durable volumes. Полный результат:
`fluent-interview-platform/docs/verification/greenfield/G12/navigator-state-matrix-2026-08-30.{json,md}`.
Это закрывает machine state-contract slice `G12-011`, но не утверждает
usefulness реальной LM Studio, human prompt review или поддержку SSE: текущий
`navigator-turn.v1` намеренно JSON-only и требует отдельного versioned
streaming contract.

### Execution update — G12 persistence journey — 30 августа 2026

Target `fluent-interview-platform` commits `004e7ec`, `ceb93c5` и `8f75036`
добавили воспроизводимый `pnpm stack:persistence` и metadata-only evidence
для `G12-013`. На disposable Compose project baseline-записи прошли через
публичную Next boundary в submit/progress/observability ledgers, а Studio
candidate → review → publish → readback записался в PostgreSQL authority.

`docker compose stop` → `start` и полный scoped `pnpm down` → неизменённый
`pnpm dev -- --detached` сохранили baseline. `data:backup --confirm` плюс
`stack:backup-matrix` проверили `data-backup.v1`, SHA-256 и полный canonical
набор из 14 ledger names. После добавления post-backup sentinels
`data:restore --confirm --input <backup-dir>` проверил integrity, очистил
allowlisted ledgers, восстановил snapshot и перезапустил application services.
После restore baseline и Studio release присутствуют, post-backup submit,
progress и observability отсутствуют; cleanup оставил `0` containers и `0`
networks, durable volumes сохранены.

Полный результат:
`fluent-interview-platform/docs/verification/greenfield/G12/persistence-journey-2026-08-30.{json,md}`.
Это закрывает local single-host machine slice `G12-013`; encrypted off-host
backup, retention/DSAR, key rotation, multi-host disaster recovery, load и
human sign-off остаются отдельными promotion gates.

### Что агенту запрещено писать после G12

Агент **не пишет** «всё готово», «production complete» или `DONE`. Допустимый
финальный текст:

> G0–G10, G10S и G11 имеют PASS. G12 release candidate собран на `<sha>`, clean-room suite
> прошёл `<passed>/<total>`, unresolved limitations `<n>`. Статус:
> `AWAITING_INDEPENDENT_REVIEW`. Reference Product не удалён.

---

## 3. Независимая финальная проверка, которую выполнит Codex после агента

Этот раздел не закрывает implementing agent.

- [ ] `R-001` Сверить `origin/main`, RC tag и clean tree.
- [ ] `R-002` Проверить G0–G10, G10S, G11 и G12 schemas, hashes, commands и отсутствие fabricated evidence.
- [ ] `R-003` Повторить fresh clone + `pnpm dev` без agent-local caches.
- [ ] `R-004` Повторить full route/link crawl и browser console/network audit.
- [ ] `R-005` Повторить RU/EN × light/dark × desktop/narrow visual review.
- [ ] `R-006` Повторить Run/Submit/hidden-canary/runtime-language matrix.
- [ ] `R-007` Повторить content/path/task/progress reconciliation.
- [ ] `R-008` Повторить backup/restore/rollback/orphan/cache/session tests.
- [ ] `R-009` Повторить observability/incident/privacy/cardinality tests.
- [ ] `R-010` Выполнить adversarial code/security review target diff/history.
- [ ] `R-011` Провести human learning session: answer, code, explanation, defense, reflection.
- [ ] `R-012` Провести реальный cold repeat через 48–72 часа без time travel.
- [ ] `R-013` Провести timed coding, system design, incident response и English defense mock.
- [ ] `R-014` Зафиксировать findings как P0–P3; P0/P1 должны быть исправлены и перепроверены.
- [ ] `R-015` Только после PASS создать final production tag и owner sign-off.
- [ ] `R-016` После production sign-off владелец отдельно утверждает exact G13 `decommission-manifest.json` hash; это разрешает только перечисленные local resources, но не remote-repository deletion.
- [ ] `R-017` Сверить source Strata baseline/tag/bundle с target provenance map; необъяснённые missing/changed files = 0.
- [ ] `R-018` Повторить source Strata `npm run check`, double `db:load`, `db:verify` и golden queries на archived baseline.
- [ ] `R-019` Повторить target authoring unit/corpus/link/fixture/property tests без доверия agent summary.
- [ ] `R-020` Подключиться каждым DB role и вручную повторить positive/negative privilege matrix, включая default privileges новых tables.
- [ ] `R-021` Просканировать API/web source, container env и built artifacts на Strata imports, raw SQL, authoring DSN и credentials.
- [ ] `R-022` Проверить DB concurrent preferred-prompt race и невозможность обойти uniqueness изменением `ord`.
- [ ] `R-023` Проверить ownership migration `durationMin → responseBudgetMin`, отсутствие question-level duplicate priority/patterns и корректные Curriculum/Activity owners.
- [ ] `R-024` Вручную просмотреть C098 prompt alternatives: same expected answer либо separate reviewed aspect; machine metadata не заменяет semantic review.
- [ ] `R-025` Дважды собрать C098 bundle и сравнить bytes/hash; затем изменить declared input и убедиться, что hash меняется.
- [ ] `R-026` Просмотреть `loss-ledger.json`: silent/unclassified losses = 0; v2 follow-ups обоснованы реальными source facts.
- [ ] `R-027` Импортировать bundle в disposable serving DB без доступа к `strata`; повторный import idempotent, corrupted/conflicting bundle rejected.
- [ ] `R-028` Пройти browser C098 author→review→release→question→Run→Submit→Evidence и сверить exact revision IDs во всех переходах.
- [ ] `R-029` Проверить, что Go/Java/другие paths не показывают Node-specific C098/task content без reviewed shared placement.
- [ ] `R-030` Независимо просканировать distributable Git/bundles/logs/traces/browser payload на paid Solvit/company-linked/unknown-rights/hidden bodies.
- [ ] `R-031` Проверить Studio на dual-write через crash/restart: authoring commit без bundle не меняет learner release; failed import не меняет active pointer.
- [ ] `R-032` Повторить backup/restore и pre-G10S→C098 rollback/forward recovery; authoring history и learner evidence сохраняются.
- [ ] `R-033` Проверить target fresh clone без standalone Strata/questions paths, symlinks, nested Git/lockfiles и second Compose project.
- [ ] `R-034` Проверить, что standalone Strata archive воспроизводим, а local repo не удалён без owner decision.
- [ ] `R-035` Сверить master-plan, G10S gate и Strata archived plan: параллельных противоречащих statuses = 0.
- [ ] `R-036` Провести adversarial review каждого G10S atomic commit; P0/P1 фиксируются новым commit, а не amendment/history rewrite.
- [ ] `R-037` Только после R-017…R-036 разрешить G10S-246 и переход к G11 breadth batches.

---

# G13 — Legacy decommission и controlled disk reclamation

## Цель

После принятого production RC освободить диск и завершить greenfield migration:
удалить только доказанно заменённые legacy entities, Compose resources и local
working trees, сохранив минимальный проверяемый provenance/rollback archive.
G13 не трогает active target и unrelated host projects.

> `docs/verification/G13-LEGACY-REMOVAL-2026-08-25.md` относится к прежней
> multi-repository архитектуре и не закрывает этот gate. Его нужно сохранить как
> `HISTORICAL_PRE_GREENFIELD` input; новый evidence живёт только в target
> `docs/verification/greenfield/G13/` и ссылается на current production SHA.

## Неподвижная последовательность

```text
accepted G12 RC
  → exact dependency/resource inventory
  → stop legacy writes and prove zero consumers
  → create + restore Git/DB archives
  → remove legacy containers/networks
  → remove exact legacy volumes/images/caches
  → remove local legacy working trees (umbrella — последним)
  → fresh-clone/product/disk verification
  → independent Codex review
  → DONE
```

| Волна | Диапазон | Destructive | Commit/evidence owner |
| --- | --- | --- | --- |
| Authorization/baseline | `001–018` | нет | implementing agent |
| Resource ledger | `019–040` | нет | implementing agent |
| Dependency/entity retirement | `041–068` | schema drop только в конце подфазы | implementing agent |
| Archives/restore | `069–088` | нет, кроме disposable restore cleanup | implementing agent |
| Docker cleanup | `089–112` | да, exact approved IDs | implementing agent |
| Files/repos/cache cleanup | `113–132` | да, exact approved paths | implementing agent |
| Machine verification/handoff | `133–143` | нет | implementing agent |
| Independent acceptance | `144–150` | нет | Codex/owner |

### G13.0. Authorization и immutable baseline

- [ ] `G13-001` Подтвердить G10S, G11, G12 и applicable independent review PASS на exact target HEAD/production tag.
- [ ] `G13-002` Подтвердить, что target fresh clone запускается без mounted/symlink/runtime access к legacy roots, databases или APIs.
- [ ] `G13-003` Создать `docs/verification/greenfield/G13/` и versioned schema `legacy-decommission.v1`.
- [ ] `G13-004` Снять `df -h`, `du` exact candidate roots, `docker system df -v`, Compose/projects/containers/networks/volumes/images/builders и open ports/processes.
- [ ] `G13-005` Сохранить current active target Compose project, container IDs, image digests, volume IDs, release IDs и database logical hashes в immutable denylist.
- [ ] `G13-006` Сохранить unrelated Docker resources по exact IDs/labels в immutable denylist; отсутствие Fluent owner proof означает `unknown/protected`.
- [ ] `G13-007` Проверить git status/branch/HEAD/remotes/tags/LFS/submodules каждого legacy repo и target; dirty/unknown останавливает его removal wave.
- [ ] `G13-008` Проверить current target `pnpm check`, full content/runtime gates, `pnpm dev`, doctor/status и selected learner journeys до cleanup.
- [ ] `G13-009` Создать target data backup и выполнить disposable restore до любого legacy stop/delete.
- [ ] `G13-010` Создать owner-approved `decommission-authorization.json`: target production SHA/tag, manifest hash, allowed resource classes, approved waves и expiry/review timestamp.
- [ ] `G13-011` Authorization не содержит wildcard/path prefix approval; каждая mutation требует exact path/resource ID.
- [ ] `G13-012` Создать cleanup tool с default dry-run и `--confirm <manifest-sha256>`; direct manual deletion не является нормальным workflow.
- [ ] `G13-013` Cleanup tool canonicalizes path, refuses symlinks, mount roots, filesystem roots, home/workspace roots, active target root и parent-directory removal.
- [ ] `G13-014` Cleanup tool re-inspects Docker IDs/labels/mounts/running state immediately before mutation; stale manifest fails closed.
- [ ] `G13-015` Cleanup tool logs metadata only: exact IDs/paths, before/after bytes, exit code, timestamps; secrets/source bodies не логируются.
- [ ] `G13-016` Добавить negative fixtures для broad path, glob, unresolved variable, symlink escape, active target, mounted volume, running unknown container и changed manifest hash.
- [ ] `G13-017` Перенести canonical master-plan, target-relevant ADR/context, Port Ledger, release/evidence index и decommission schema в target repo; сохранить source→target hash map.
- [ ] `G13-018` Commit target: `docs(g13): establish controlled legacy decommission gate`; old umbrella plan после этого становится frozen source snapshot.

Required lifecycle tool contract (точные script names создаёт G13-012):

```text
pnpm decommission:inventory --output <absolute-evidence-path>
pnpm decommission:validate --manifest <absolute-manifest-path>
pnpm decommission:dry-run --manifest <absolute-manifest-path>
pnpm decommission:apply --manifest <absolute-manifest-path> --confirm <sha256>
pnpm decommission:verify --manifest <absolute-manifest-path>
pnpm disk:budget --output <absolute-evidence-path>
```

`apply` обрабатывает только одну объявленную wave за запуск; команда без exact
wave ID, manifest hash или current denylist verification обязана завершаться до
первой mutation.

### G13.1. Exact resource/dependency ledger

- [ ] `G13-019` Инвентаризировать nested legacy repos в old umbrella: Lab, Vue, Question Brain, Task Runtime и Vault; для каждого записать role, remote, HEAD, size и replacement evidence.
- [ ] `G13-020` Инвентаризировать standalone `/Users/sergeyzhechko/developer/strata`; removal eligible только после G10S archive/parity PASS.
- [ ] `G13-021` Инвентаризировать `/Users/sergeyzhechko/developer/questions`; raw/quarantine records получают новый explicit data owner/path либо retained reason до source-root removal.
- [ ] `G13-022` Инвентаризировать old umbrella `/Users/sergeyzhechko/developer/fluent-interview`; removal eligible последним после target docs/archive verification.
- [ ] `G13-023` Historical sandbox roots (`developer/sandbox/*`) и любые repos вне explicit manifest пометить `out_of_scope/protected`.
- [ ] `G13-024` Known Trash candidate `fluent-engineering-lab-nx-2026-08-26` может войти только exact path entry; global Trash enumeration/removal запрещены.
- [ ] `G13-025` Для каждого repo записать tracked/untracked/ignored bytes, object database size, worktree outputs, `node_modules`, build artifacts, logs, caches и local-only data.
- [ ] `G13-026` Для каждого repo проверить remote branch/tag reachability; unpushed commits/branches получают push, bundle-only retention или explicit blocker.
- [ ] `G13-027` Для каждого repo проверить Git LFS objects/submodules; bundle без необходимых objects не считается archive.
- [ ] `G13-028` Инвентаризировать legacy Compose projects минимум `fluent-engineering-lab`, `fluent-question-brain`, `fluent-task-runtime`, `strata` и disposable old target RC projects.
- [ ] `G13-029` Active target Compose project `fluent-interview-platform-dev` (либо current exact name) пометить `active/protected`; name-only match недостаточен — сохранить labels/config paths.
- [ ] `G13-030` Инвентаризировать legacy containers/networks по Compose labels и inspect data; container name без provenance не даёт права удаления.
- [ ] `G13-031` Инвентаризировать volumes: ID/name, labels, mountpoint, current mounts, bytes, data class, backup artifact и restore command.
- [ ] `G13-032` Инвентаризировать images: digest/tags, image history/size, containers referencing digest, target release reference и rebuild source.
- [ ] `G13-033` Инвентаризировать build cache по builder; shared/default builder entries без ownership остаются `unknown/protected`.
- [ ] `G13-034` Инвентаризировать old host processes, ports, launch agents, cron/scheduled workflows и env files, которые запускают legacy repos/stacks.
- [ ] `G13-035` Инвентаризировать legacy DB schemas/tables/columns/indexes/sequences/functions/roles и row counts через system catalog, не через предположение из migrations.
- [ ] `G13-036` Инвентаризировать duplicate files/authorities: JSONL Studio ledger, static catalog releases, old projection caches, DB dumps, Playwright traces/videos и generated reports.
- [ ] `G13-037` Каждая ledger entry содержит `state`, `exactTarget`, `bytes`, `owner`, `replacementProof`, `archiveProof`, `restoreProof`, `deleteCommand`, `guard`, `retentionReason` и `status`.
- [ ] `G13-038` Allowed dispositions: `keep-active`, `keep-reference(reason)`, `archive-then-remove`, `remove-regenerable`, `out-of-scope`; blank/implicit disposition invalid.
- [ ] `G13-039` Machine audit запрещает duplicate exactTarget, parent/child double deletion, active denylist overlap, missing owner и deletion без replacement/archive proof.
- [ ] `G13-040` Commit target: `docs(g13): inventory legacy resources and disk ownership`; manifest remains dry-run-only.

### G13.2. Eliminate dependencies и retire legacy entities

- [ ] `G13-041` Port Ledger unresolved entries = 0; каждый legacy capability имеет target owner и current test/evidence.
- [ ] `G13-042` Static scan target source/config/docs/scripts/workflows на absolute legacy paths, sibling imports, old API URLs, old Compose names и old DB credentials.
- [ ] `G13-043` Built Next/Nest/Runtime artifacts scan на legacy host/path/URL/credential strings; findings = 0 либо reviewed non-runtime historical metadata.
- [ ] `G13-044` Network/trace audit target journeys показывает zero calls to legacy Lab/Brain/Runtime/Strata services.
- [ ] `G13-045` Stop legacy application containers без volumes; target full route/content/runtime journey остаётся green минимум в двух fresh starts.
- [ ] `G13-046` Disable legacy scheduled jobs/watchers/indexers and scheduled GitHub workflows before remote archive; target jobs remain active.
- [ ] `G13-047` Remove/replace old root launch/status/port scripts in target; target lifecycle does not shell into sibling repos.
- [ ] `G13-048` Remove old environment variables/secrets from active `.env` templates and secret stores after target replacement proof; values не попадают в evidence.
- [ ] `G13-049` Update current docs/runbooks/links to target paths; historical docs get explicit `HISTORICAL — DO NOT EXECUTE` banner or remain only in archive.
- [ ] `G13-050` Update target glossary with lifecycle terms `active`, `reference`, `retired`, `archived`, `removed-local` and avoid ambiguous «deleted» before proof.
- [ ] `G13-051` Generate legacy-entity ledger for old Studio PostgreSQL/JSONL authority, old question catalog/provenance projections, old graph/search cache and duplicate runtime metadata.
- [ ] `G13-052` For every entity prove canonical replacement, row/file reconciliation, writer list, reader list, last observed read/write and rollback source.
- [ ] `G13-053` Phase A migration revokes/stops legacy writes and adds fail-fast guard; no entity is dropped in same migration.
- [ ] `G13-054` Run instrumented canary/release journeys after Phase A; legacy read/write counters remain zero.
- [ ] `G13-055` Compare old entity snapshot with new authority/projection; unexplained rows/fields = 0, intentional losses have disposition/reviewer.
- [ ] `G13-056` Archive legacy entity data with schema/version/checksum before drop; sensitive/raw bodies use encrypted or access-controlled artifact storage outside Git.
- [ ] `G13-057` Restore archived entity into disposable DB/filesystem and run reconciliation queries.
- [ ] `G13-058` Phase B migration drops only exact approved tables/columns/indexes/sequences/functions/roles; broad schema drop requires every contained object listed.
- [ ] `G13-059` Migration refuses drop when dependency catalog, row reconciliation, archive checksum or restore proof is stale/missing.
- [ ] `G13-060` Remove compatibility adapters, dual-read comparators and dead feature flags only after Phase B target tests pass.
- [ ] `G13-061` Remove old JSONL/static catalog/projection files only after target release import/rebuild/readback passes from canonical authority.
- [ ] `G13-062` Preserve immutable release manifests/hashes needed for learner attempt/evidence provenance; remove bulky derived bodies when rebuildable.
- [ ] `G13-063` Remove legacy DB users/grants/secrets after no container/job uses them; negative connection test proves credentials rejected.
- [ ] `G13-064` Add boundary test that fails if future source/config reintroduces legacy path, Compose project, DB role/schema or endpoint.
- [ ] `G13-065` Repeat target backup/restore after entity drops; active release, authoring history, progress, evidence and projects reconcile.
- [ ] `G13-066` Commit target: `refactor(g13): retire legacy authorities and compatibility paths`.
- [ ] `G13-067` Commit target: `chore(g13): drop reconciled legacy entities` only after G13-051…065 PASS; never squash with Phase A.
- [ ] `G13-068` Update decommission manifest exact entity statuses and reclaimed DB/file bytes.

### G13.3. Git/data archives и restore proof

- [ ] `G13-069` Resolve one explicit archive root outside source repos and active target; store its absolute canonical path in authorization, not `$HOME`/`~`.
- [ ] `G13-070` Archive root has enough free space for temporary bundles/dumps and is excluded from cleanup denylist.
- [ ] `G13-071` For each Git repo create `git bundle --all`, refs/tags/remotes manifest, dirty patch, untracked/ignored disposition and SHA-256.
- [ ] `G13-072` Run `git bundle verify`, clone bundle to disposable exact path, `git fsck --full`, compare refs and run repository check/build appropriate to frozen SHA.
- [ ] `G13-073` Verify remote default branch and immutable migration/archive tag contain every retained commit; bundle remains fallback, not excuse for missing remote history.
- [ ] `G13-074` Capture LFS/submodule artifacts separately and prove disposable clone can materialize them without source working tree.
- [ ] `G13-075` Create compressed logical dumps for each legacy durable DB/volume before deletion; record engine/tool versions and restore commands.
- [ ] `G13-076` Restore each dump into disposable isolated stack and run schema/count/hash/domain invariants.
- [ ] `G13-077` Archive non-Git required assets only when not rebuildable/retrievable; generated caches/build outputs are excluded.
- [ ] `G13-078` Archive manifests contain no plaintext credentials, paid source bodies in Git, hidden tests in public artifacts or raw learner submissions.
- [ ] `G13-079` Generate one top-level `legacy-archive-index.json` linking repo bundles, data dumps, release manifests, checksums and replacement target SHA.
- [ ] `G13-080` Copy metadata-only archive index/checksums/restore runbook into target Git; large bundles/dumps remain external.
- [ ] `G13-081` Perform random sample restore of at least one repo per technology and every unique database format, not just file checksum verification.
- [ ] `G13-082` Restore old Reference Product in isolated disposable paths/ports from archives only; verify selected baseline routes/contracts without contacting active target.
- [ ] `G13-083` Delete disposable restore resources by exact IDs and prove active/unrelated before/after inventories unchanged.
- [ ] `G13-084` Classify retained archive bytes vs removal benefit; duplicate archives with identical hash collapse to one referenced copy.
- [ ] `G13-085` Ensure archive root is backed up or remotely recoverable according to owner policy before permanent local source removal.
- [ ] `G13-086` Commit target: `docs(g13): prove legacy source and data restoration`.
- [ ] `G13-087` Agent requests/records owner approval of exact destructive manifest hash after archive evidence review.
- [ ] `G13-088` Any post-approval source/DB/Docker delta invalidates approval and returns to G13-019 inventory.

### G13.4. Scoped Docker cleanup wave

- [ ] `G13-089` Stop old stacks through their canonical Compose files/project names while source paths still exist; normal first pass does not use `-v`.
- [ ] `G13-090` Verify target restart, C098 and one canary per production path with all legacy stacks stopped.
- [ ] `G13-091` Remove exact legacy containers and Compose networks only after inspect label/config/mount match approved manifest.
- [ ] `G13-092` Remove stale disposable RC/audit target projects one by one after evidence/log retention decision; active target project protected.
- [ ] `G13-093` Remove standalone `strata` container/network only after G10S target authoring flow and archive restore PASS.
- [ ] `G13-094` Remove old Lab/Brain/Runtime containers/networks only after target no-network-dependency proof.
- [ ] `G13-095` Re-inspect every candidate volume for mounts and labels immediately before delete; mounted/changed/unknown volume fails closed.
- [ ] `G13-096` For each durable legacy volume verify dump checksum and disposable restore, then remove exact volume ID/name individually.
- [ ] `G13-097` Volumes without labels require explicit origin proof plus owner approval; name prefix alone is insufficient.
- [ ] `G13-098` Preserve active target Postgres/data/telemetry volumes and any archive/quarantine volume declared retained.
- [ ] `G13-099` Map image digest to running/stopped containers and target releases; remove only exact unreferenced legacy digests/tags.
- [ ] `G13-100` Do not remove shared base image required by active/unrelated containers; deduplicated image layers are not counted twice as reclaimed.
- [ ] `G13-101` Create dedicated Fluent buildx builder/cache namespace for future builds and record retention/size budget.
- [ ] `G13-102` Prune only dedicated Fluent builder cache by explicit builder name and retention rule.
- [ ] `G13-103` Shared/default builder cleanup is optional separate owner-approved wave; no `--all` or global builder prune inside automatic G13.
- [ ] `G13-104` Remove exact legacy container log files only via Docker resource removal/approved Docker API, never by deleting Docker Desktop internals directly.
- [ ] `G13-105` `docker system prune`, `docker volume prune`, broad image prune and reset-to-factory remain prohibited.
- [ ] `G13-106` Compare before/after unrelated container/network/volume/image IDs and state; changed set = 0.
- [ ] `G13-107` Compare active target container/image/volume IDs or documented restart replacements and logical data hashes.
- [ ] `G13-108` Run `docker system df -v` after each wave; record actual reclaimed bytes, not nominal resource sizes.
- [ ] `G13-109` Run target `pnpm dev`, doctor/status, content/runtime canaries and `pnpm down` zero-orphan check after Docker cleanup.
- [ ] `G13-110` Recreate target from current Compose and restore target backup to prove deleted legacy images/volumes were not hidden dependencies.
- [ ] `G13-111` Commit target evidence: `chore(g13): remove verified legacy Docker resources`.
- [ ] `G13-112` Update manifest Docker statuses; any retained legacy resource has owner, size, reason and expiry/review trigger.

### G13.5. Local working trees, artifacts и cache cleanup wave

- [ ] `G13-113` После G13-087 archive GitHub legacy repos read-only, disable scheduled workflows и set replacement repo/tag in description/README до local source removal.
- [ ] `G13-114` Inside each exact allowlisted legacy repo first remove regenerable `node_modules`, build outputs, `.next`, `dist`, coverage, traces/videos, local logs и tool caches; parent workspace, user home, unrelated sandbox и archive root protected.
- [ ] `G13-115` Verify no running process has cwd/open files under candidate root and no Docker bind mount references it.
- [ ] `G13-116` Verify repo bundle/remote/dirty/untracked/LFS proofs immediately before source removal; changed HEAD/status invalidates manifest.
- [ ] `G13-117` Remove nested legacy repos Lab/Vue/Brain/Runtime/Vault one at a time; after each, run target fresh start and selected journey.
- [ ] `G13-118` Remove standalone Strata working tree only after G10S parity/archive and target authoring gates remain green without it.
- [ ] `G13-119` Remove questions research root only if every record has migrated/archived/rejected disposition and active quarantine has a new explicit owner/path; otherwise retain only necessary data, not tool/cache copies.
- [ ] `G13-120` Migrate any still-needed Obsidian/Vault source to approved target/external content source before Vault working tree removal.
- [ ] `G13-121` Remove old umbrella working tree last, after current plan/ADR/evidence manifests exist in target and umbrella bundle clone is verified.
- [ ] `G13-122` Exact known obsolete Trash candidate may be permanently removed only as its own manifest entry; global Trash empty prohibited.
- [ ] `G13-123` Cleanup tool removes only the approved canonical path and refuses if inode/device/path differs from manifest snapshot.
- [ ] `G13-124` Prefer recoverable move for uncertain content; to reclaim disk permanently, require completed archive proof and exact second confirmation for final deletion.
- [ ] `G13-125` Remove duplicate downloaded/generated reports only when target manifest/hash proves canonical copy; user attachments outside scope protected.
- [ ] `G13-126` Remove only dedicated Fluent package manager/Nx/test caches; shared pnpm store/npm cache remains unless separate owner-approved host maintenance.
- [ ] `G13-127` Run filesystem scan for surviving legacy source copies/symlinks/nested Git/lockfiles under declared Fluent roots; unresolved = 0.
- [ ] `G13-128` Run target source/built artifact scan again for deleted absolute paths and legacy endpoints; findings = 0.
- [ ] `G13-129` Verify archived GitHub repos remain reachable, immutable tags/refs match archive index and replacement pointers resolve after local working trees are absent.
- [ ] `G13-130` Do not delete remote repositories, issues/releases/tags/packages without a separate explicit owner request outside this plan.
- [ ] `G13-131` Commit target evidence: `chore(g13): remove archived legacy working trees and caches`.
- [ ] `G13-132` Update manifest exact reclaimed bytes and retained archive size after filesystem cleanup.

### Gate G13 — post-removal verification и handoff

- [ ] `G13-133` Manifest entries all terminal: `kept-active`, `kept-reference(reason)`, `removed`, `out-of-scope`; unresolved/pending = 0.
- [ ] `G13-134` Legacy local roots marked `removed` are absent; retained roots match exact approved path/hash/size budget.
- [ ] `G13-135` Legacy Compose project/container/network/volume/image IDs marked removed are absent; unrelated before/after set unchanged.
- [ ] `G13-136` Legacy DB entities/roles/files marked removed are absent; target migration chain fresh/upgrade/restore PASS.
- [ ] `G13-137` Fresh target clone in disposable explicit path installs, builds, checks and starts without source/archive/legacy Docker dependencies.
- [ ] `G13-138` Full route/link/API/content/runtime/security suite and C098 + one canary per production path PASS after physical removal.
- [ ] `G13-139` Backup→restore, target rollback and archive sample restore PASS after cleanup.
- [ ] `G13-140` Disk report records filesystem/Docker baseline, eligible bytes, retained archives, actual reclaimed bytes, residual protected/unrelated bytes and post-cleanup capacity.
- [ ] `G13-141` `eligibleUnreclaimedBytes = 0`; if host remains above 80% used, report top unrelated/protected consumers without deleting them.
- [ ] `G13-142` Final target commit: `docs(g13): record legacy decommission and disk reclamation evidence`.
- [ ] `G13-143` Implementing agent sets `AWAITING_INDEPENDENT_REVIEW` and hands off target SHA/tag, manifest hash, archive index, deleted IDs/paths and verification commands.
- [ ] `G13-144` Codex independently replays manifest schema/guard negative tests and verifies no broad/global cleanup command was used.
- [ ] `G13-145` Codex independently samples Git bundle clone, DB restore, target fresh clone and C098 learner journey.
- [ ] `G13-146` Codex compares active/unrelated Docker IDs and disk reports before/after; unexplained mutation = 0.
- [ ] `G13-147` Codex verifies target docs/CONTEXT/ADR no longer instruct execution from deleted roots and master-plan status is singular.
- [ ] `G13-148` P0/P1 findings fixed with new atomic commits and relevant cleanup/product checks repeated.
- [ ] `G13-149` Owner reviews reclaimed/retained summary and explicitly accepts archived remotes plus remaining protected resources.
- [ ] `G13-150` Only after G13-144…149 PASS set G13 and master-plan `DONE`; final tag/attestation references both product RC and decommission manifest.

---

## 4. Короткий prompt для implementing agent

```text
Выполни документ
/Users/sergeyzhechko/developer/fluent-interview/docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md
строго по порядку G0→…→G10→G10S→G11→G12→independent review→G13. Сначала сверяй уже закрытые пункты
по evidence; не переигрывай их без REVERIFY-причины. Текущий обязательный corrective
gate — G10S: перенеси Strata authoring authority в target monorepo, докажи один DB
с role isolation, устрани Studio dual-write, выпусти file-only bundle и проведи C098
до learner evidence. Только после независимого Codex review G10S переходи к G11
breadth. Не пропускай пункты и не ставь PASS без machine-readable evidence. Каждый
implementation slice закрывай заранее объявленным atomic commit, repo-required
check→commit chain и clean-tree проверкой; push только fast-forward и только когда
это разрешено текущей CI quota policy. До G13 Reference Product и standalone
Strata не удаляй, не используй как runtime fallback и не перезаписывай unknown
dirty files. В G13 удаляй их только после exact archive/restore/manifest gates.
Paid Solvit/company/unknown-rights bodies не копируй в distributable Git. При
STOP-условии фиксируй FAIL и exact blocker. После G10S, G12 и G13 не объявляй
DONE самостоятельно: передай SHA, migrations, bundle/release IDs, а для G13 —
exact decommission manifest, archive index, удалённые IDs/paths и disk report со
статусом AWAITING_INDEPENDENT_REVIEW. В G13 destructive commands разрешены только
после accepted production RC, проверенного restore и owner-approved exact manifest
hash; active target, unrelated Docker projects, shared caches и remote repositories
не удаляй. После G13-017 продолжай вести status только в проверенной target-копии
master-plan; source umbrella copy остаётся frozen и удаляется последней по G13-121.
```
