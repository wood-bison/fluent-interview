# Fluent Interview Platform — greenfield Next.js execution plan

## Progress reporting

После каждого локального коммита запускай `pnpm plan:progress`. Команда только
читает этот план и печатает `checked / remaining / total`, процент выполнения и
разбивку по разделам; она не ставит галочки автоматически и не превращает
чекбоксы в заявление о production readiness. Последний зафиксированный снимок:
[`plan-progress-2026-08-30.md`](verification/greenfield/plan-progress-2026-08-30.md).

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
текущем `main`. `G12-018` в части auth/session/CSRF/XSS/SSRF, signed
attestation/provenance, `G12-024` для исходного RC SHA, visual/accessibility,
content/runtime-language и independent owner review остаются открытыми.

---

## 0. Как агент обязан использовать этот план

### 0.1. Неподвижный порядок

- [ ] `P-001` Выполнять только `G0 → G1 → … → G12`.
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

Каждый gate запускает релевантное подмножество, а G12 — всё:

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

---

## 2. Итоговое определение `DONE`

Ниже нет «желательных» пунктов. Все обязательны либо имеют approved
`not_applicable` с owner/reviewer и отдельным решением.

- [ ] `D-001` Новый private/public remote выбран владельцем, `origin/main` содержит всю target историю.
- [ ] `D-002` Fresh clone на пустой директории поднимается `pnpm dev`.
- [ ] `D-003` `pnpm dev` запускает один scoped Compose stack и выводит один непротиворечивый status.
- [ ] `D-004` `pnpm down` сохраняет durable data и удаляет scoped orphan resources.
- [ ] `D-005` `doctor/status/clean/data backup/restore/incident capture` имеют typed JSON output.
- [ ] `D-006` Reference Product всё ещё запускается из frozen snapshot.
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
- [ ] `D-029` G0–G12 имеют PASS evidence и clean commits.
- [ ] `D-030` Agent выставил `AWAITING_INDEPENDENT_REVIEW`, а не `DONE`.
- [ ] `D-031` Независимый Codex-аудит повторил проверки и владелец подписал human visual/learning flows.
- [ ] `D-032` Только после D-031 release получает `DONE` и immutable tag.

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
- [ ] `G10-026` `gate.json.status = PASS`.

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

### G11.0. Coverage policy

- [ ] `G11-001` Для technical core capability использовать role SLA: diagnostic, mechanism-basic, mechanism-advanced, predict/trace, edge, debug, trade-off, apply/design, evidence, defense.
- [ ] `G11-002` Для algorithms использовать concept, baseline, easy, medium, hard, proof, complexity, edge-test.
- [ ] `G11-003` 70 карточек на атомарную тему запрещены; quota относится к module/path coverage.
- [ ] `G11-004` Hard gates: mandatory roles, depth, locale, provenance, placement, practice, no quarantine.
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
- [ ] `G11-016` Language-native content проходит forbidden-set tests.
- [x] `G11-017` Missing-role ledger генерируется по stable IDs.
- [ ] `G11-018` Research/authoring packs закрывают gaps официальными sources и original explanations.
- [ ] `G11-019` Expert sample review по capability cluster обязателен.
- [ ] `G11-020` No production release по total count без role matrix.

### G11.3. Executable practice portfolio

- [ ] `G11-021` Big-Tech target: 168 TaskFamily и 456 runnable revisions подтверждён или versioned-adjusted после exact inventory.
- [ ] `G11-022` Shared algorithms/backend/SQL/infra families имеют compatible revisions, не копии family.
- [ ] `G11-023` Backend path: 12 algorithms + 12 shared backend + 16 native + 16 data + 8 infra + 6 project = 70 Activities.
- [ ] `G11-024` React/Next path: 12 algorithms + 20 React/Next/browser + 8 Web/API/security + 4 performance/a11y + 6 project = 50.
- [ ] `G11-025` System Design: 32 defense cases + 12 infra labs + 6 projects = 50.
- [ ] `G11-026` Critical capability имеет ≥2 independent scenarios; остальные core — ≥1 assessed Activity.
- [ ] `G11-027` Seeded wrong solutions проверяют tests, а не только happy path.
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

---

# G12 — Cutover rehearsal, release candidate и independent handoff

## Цель

Доказать новый продукт целиком, не удалить reference и передать независимому
ревьюеру проверяемый RC.

### G12.1. Full clean-room verification

- [x] `G12-001` Создать brand-new clone из `origin/main` в disposable explicit path.
- [x] `G12-002` Проверить exact toolchain/bootstrap instructions.
- [x] `G12-003` Запустить только `pnpm dev`.
- [x] `G12-004` Проверить `doctor/status` до/во время/после startup.
- [ ] `G12-005` Прокликать все routes/links/buttons/menus/dialogs/settings/deep links.
- [ ] `G12-006` Проверить every route RU/EN, light/dark/system, keyboard, required viewports.
- [ ] `G12-007` Проверить all API endpoints against generated contract.
- [ ] `G12-008` Проверить question/content/placement/release counts/hashes.
- [ ] `G12-009` Проверить Run/Submit/Evidence/Progress/Revision/Projects/Navigator/Studio.
- [x] `G12-010` Проверить all released language/runtime drills. Current
  release has only Node.js JavaScript; its released profile passed the full
  runtime vector/Submit/outage/recovery matrix. Preview languages remain
  explicitly unclaimed. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/runtime-conformance-2026-08-30.json`.
- [ ] `G12-011` Проверить AI absent/offline/connected/stream/cancel/timeout states.
- [ ] `G12-012` Проверить observability off/on/outage и incident bundle.
- [ ] `G12-013` Проверить stop/restart/backup/restore/data persistence.
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
- [ ] `G12-018` Auth/session/CSRF/XSS/SSRF/path traversal/command injection/secrets checks PASS.
- [ ] `G12-019` Dependency audit/CodeQL/SBOM/provenance/signature checks PASS.
- [x] `G12-020` Performance budgets PASS per route; released Node profile
  проверен на 13 routes и heavy-editor policy закрыта отсутствием `xterm`,
  `monaco-editor` и `codemirror` при bounded textarea editor. Evidence:
  `fluent-interview-platform/docs/verification/greenfield/G12/performance-budget-2026-08-30.json`.
- [ ] `G12-021` Accessibility WCAG checks plus keyboard/screen-reader human smoke PASS.
- [ ] `G12-022` Visual diff has zero unexplained P0/P1; intentional deltas documented.
- [ ] `G12-023` Telemetry cardinality/privacy/retention/load/disk-pressure tests PASS.
- [ ] `G12-024` CI required checks green on exact RC SHA.

### G12.3. Reconciliation and rollback

- [ ] `G12-025` Port Ledger entries all `ported|adapted|dropped(reason)`; planned/unresolved = 0.
- [x] `G12-026` Route reconciliation unresolved = 0.
- [ ] `G12-027` Data/content/task/project/progress reconciliation unexplained delta = 0.
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
- [x] `G12-034` Создать final gate index G0–G12 with hashes and links.
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

`G12-005..013`, `G12-018..019` и `G12-021..024` намеренно остаются без галочек там, где
репетиция покрыла только автоматический subset (например, route crawl без
полной ручной визуальной вычитки, offline Navigator без connected streaming,
Node runtime без multi-language conformance). Точные границы и ожидаемые
следующие доказательства перечислены в target `G12/known-limitations.md`.

### Что агенту запрещено писать после G12

Агент **не пишет** «всё готово», «production complete» или `DONE`. Допустимый
финальный текст:

> G0–G11 имеют PASS. G12 release candidate собран на `<sha>`, clean-room suite
> прошёл `<passed>/<total>`, unresolved limitations `<n>`. Статус:
> `AWAITING_INDEPENDENT_REVIEW`. Reference Product не удалён.

---

## 3. Независимая финальная проверка, которую выполнит Codex после агента

Этот раздел не закрывает implementing agent.

- [ ] `R-001` Сверить `origin/main`, RC tag и clean tree.
- [ ] `R-002` Проверить G0–G12 schemas, hashes, commands и отсутствие fabricated evidence.
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
- [ ] `R-016` Решение об archive/delete старых repos принимается отдельным запросом владельца.

---

## 4. Короткий prompt для implementing agent

```text
Выполни документ
/Users/sergeyzhechko/developer/fluent-interview/docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md
строго по порядку G0→G12. Не пропускай пункты и не ставь PASS без machine-readable
evidence. Каждый gate закрывай atomic commit(s), clean-tree проверкой и fast-forward
push в main после PASS. Reference Product не удаляй, не используй как runtime
fallback и не перезаписывай unknown dirty files. При STOP-условии фиксируй FAIL и
точный blocker. После G12 не объявляй DONE: передай RC SHA/tag/evidence со статусом
AWAITING_INDEPENDENT_REVIEW для отдельной проверки Codex и владельца.
```
