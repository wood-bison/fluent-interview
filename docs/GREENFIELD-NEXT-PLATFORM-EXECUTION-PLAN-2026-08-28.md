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

### G10S.0. Preflight, baselines и decision intake

- [x] `G10S-001` Проверить exact roots через `git rev-parse --show-toplevel` для umbrella, target, Strata и questions; сохранить paths, branches, HEAD и remotes. Evidence: target `40122ae`, `G10S/preflight.json`.
- [x] `G10S-002` Проверить `git status --short --branch` во всех четырёх roots; неизвестные изменения остановят migration до provenance решения. Evidence records `questions` as known external-unversioned (no Git root), with no unknown working-tree changes.
- [x] `G10S-003` Подтвердить Strata baseline `ec3b680` либо записать reviewed SHA delta и повторить весь source baseline. Evidence: `G10S/source-manifest.json`.
- [x] `G10S-004` В Strata выполнить `npm run check`; сохранить 32 test results, 12 ADR links, 9 corpus gates или актуальные exact counts. Evidence: `G10S/preflight.json` and `commands.ndjson`.
- [x] `G10S-005` Выполнить `npm run db:up && npm run db:load && npm run db:load && npm run db:verify`; второй load обязан быть idempotent, invariants = 12 или reviewed delta. Evidence: 12 invariants and two successful loads.
- [x] `G10S-006` Выполнить representative queries из `schema/queries.sql`; сохранить metadata/results без paid prompt/answer bodies. Evidence: `G10S/preflight.json`.
- [x] `G10S-007` В target выполнить `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, `pnpm content:gates`; любой baseline FAIL исправляется отдельным pre-migration commit. Evidence: target check and boundary/toolchain runs are green.
- [ ] `G10S-008` Запустить target `pnpm dev` в scoped Compose project и проверить current Studio author→review→publish→readback baseline.
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
- [ ] `G10S-154` Release scanner ищет known paid/company canaries, forbidden source IDs и raw hashes во всех generated bundles/artifacts.
- [ ] `G10S-155` Logs/traces/evidence scanner запрещает prompt/answer/source bodies; сохраняет только IDs/hashes/counts.
- [ ] `G10S-156` Quarantine export/import roundtrip не меняет disposition и не делает content доступным serving role.
- [ ] `G10S-157` Human review sample policy задаёт minimum sample per source/batch/risk и escalation при defect.
- [ ] `G10S-158` Corpus quality report публикует total/mapped/reviewed/public/quarantine/rejected/unknown counts отдельно.
- [ ] `G10S-159` Coverage report не считает quarantine, supporting prompt или duplicate alias primary question.
- [ ] `G10S-160` Migration допускает сначала только 6 golden cards + C098; breadth corpus ждёт adapter gate.
- [ ] `G10S-161` Commit: `feat(g10s): migrate governed corpus metadata and quarantine policy`.

### G10S.7. Deterministic v1 adapter и release import

- [ ] `G10S-162` Создать explicit mapping spec Strata Question/Layer/Task/Provenance → `question-catalog.v1` fields.
- [ ] `G10S-163` Mapping spec перечисляет семь v1 answer layers: `concise`, `understanding`, `mechanism`, `traps`, `followUps`, `evidence`, `sources`.
- [ ] `G10S-164` Для каждого v1 field указать source layer kind, lang/depth selection, ordering, requiredness и loss behavior.
- [ ] `G10S-165` `prompt` берётся только из preferred prompt нужного locale/depth; ambiguous preferred state делает export FAIL.
- [ ] `G10S-166` v1 exact RU+EN policy не заставляет authoring хранить фиктивные переводы: missing locale создаёт release blocker, не fabricated text.
- [ ] `G10S-167` Curriculum enriches projection placements/priority/prerequisites; Strata не становится владельцем route order.
- [ ] `G10S-168` Assessed activities соединяются по stable TaskFamily/Revision IDs; conceptual question может честно не иметь runnable task.
- [ ] `G10S-169` Graph edges export только reviewed exact target revision; orphan/stale target блокирует bundle.
- [ ] `G10S-170` Review/release ID minted deterministically/transactionally и не зависит от current clock без declared build input.
- [ ] `G10S-171` Provenance projection содержит только безопасные public facts; private paid/source body не копируется.
- [ ] `G10S-172` Adapter создаёт `loss-ledger.json`: source field, target field/null, loss class, reason, severity и follow-up v2 requirement.
- [ ] `G10S-173` Silent drop запрещён: каждый source layer/fact либо mapped, intentionally_not_released(reason), либо loss entry.
- [ ] `G10S-174` Double build одного authoring release + curriculum revision даёт byte-identical canonical bundle/hash.
- [ ] `G10S-175` Different source revision или curriculum revision меняет declared release inputs/hash.
- [ ] `G10S-176` Bundle имеет schema version, authoring release, curriculum revision, created-by tool version, counts, hashes и signature/checksum.
- [ ] `G10S-177` Bundle не содержит DB credentials, raw quarantine, hidden tests/reference solutions, internal review comments или private source text.
- [ ] `G10S-178` Release importer принимает только file/stream bundle и никогда не подключается к `strata` schema.
- [ ] `G10S-179` Import сначала полностью validates schema/hash/signature/rights/references, затем выполняет одну serving transaction.
- [ ] `G10S-180` Re-import same bundle idempotent; same release ID с другим hash rejected.
- [ ] `G10S-181` Import writes serving cards/revisions/translations/placements/graph/activity joins/outbox и active pointer по allowlist.
- [ ] `G10S-182` Failed import сохраняет previous pointer и не оставляет partial rows visible learner-у.
- [ ] `G10S-183` Projection rebuild из bundle после truncate/disposable DB даёт exact logical hashes.
- [ ] `G10S-184` Readback сверяет every ID/count/hash и выпускает metadata-only reconciliation report.
- [ ] `G10S-185` На основании C098 loss ledger написать draft требований `question-catalog.v2`; v2 implementation остаётся отдельным approved gate.
- [ ] `G10S-186` Commit: `feat(g10s): export and import deterministic question release bundles`.

### G10S.8. C098 Node Event Loop vertical slice

- [ ] `G10S-187` Подтвердить stable identity C098, KC/aspect/stack, roles, locales, provenance, grants и current serving references.
- [ ] `G10S-188` Собрать preferred EN/RU prompts и seven-layer answers только из reviewed/public authoring data.
- [ ] `G10S-189` Alternative prompts C098 пройти human same-expected-answer review; semantic variants выделить в отдельные aspects/questions.
- [ ] `G10S-190` Перенести минимум одну prediction Activity из prompt space в assessed Activity/Task.
- [ ] `G10S-191` Связать Event Loop task family с exact released Node runtime revision и public/hidden evaluator split.
- [ ] `G10S-192` Сохранить/создать scenario progression: baseline order, nested `nextTick`/Promise, timer vs immediate I/O boundary, starvation/edge и explanation defense.
- [ ] `G10S-193` Каждый scenario имеет explicit objective, prerequisites, public statement, expected evidence и failure feedback; hidden solution не доступен browser.
- [ ] `G10S-194` Curriculum placement принадлежит Node path и shared JS runtime там, где семантически верно; Go/Java paths не получают Node-specific content.
- [ ] `G10S-195` Author в Studio меняет C098 layer → review → publish candidate без serving mutation до import.
- [ ] `G10S-196` Export C098 bundle проходит rights/locale/layer/task/graph gates и создаёт loss ledger.
- [ ] `G10S-197` Import C098 bundle создаёт exact serving revision, placement и active release atomically.
- [ ] `G10S-198` Learner route открывает C098 question и все expected layers без broken/dead links.
- [ ] `G10S-199` Language/runtime selector показывает только реально compatible released Node profile; preview languages не активны.
- [ ] `G10S-200` Run выполняет public experiment и не создаёт mastery/verdict.
- [ ] `G10S-201` Submit выполняет hidden evaluation по exact TaskRevision и создаёт deterministic verdict/evidence.
- [ ] `G10S-202` Wrong order, malformed input, stale revision, forged verdict и duplicate idempotency vectors fail correctly.
- [ ] `G10S-203` Observe/Explain показывают trace/evidence без hidden answer leakage; Navigator получает exact context IDs и advisory-only boundary.
- [ ] `G10S-204` Restart сохраняет active release, attempts, evidence и Studio history; backup/restore воспроизводит slice.
- [ ] `G10S-205` RU/EN × light/dark × MacBook 13/16 × Studio Display browser matrix не имеет overflow, clipped text или unreachable controls.
- [ ] `G10S-206` Keyboard/screen-reader baseline: headings, labels, focus order, dialog/panel behavior и code/runtime controls имеют accessible names.
- [ ] `G10S-207` Performance budget проверяет initial route, editor/task chunks и no duplicate content payload.
- [ ] `G10S-208` Full route→question→activity→Run→Submit→Evidence machine journey и human spoken explanation сохранены отдельными evidence.
- [ ] `G10S-209` Commit: `feat(g10s): prove C098 authoring-to-learning vertical slice`.

### G10S.9. Breadth readiness и standalone retirement

- [ ] `G10S-210` Сравнить source Strata и target counts/hashes/invariants; every difference имеет mapping/disposition.
- [ ] `G10S-211` Повторить Strata golden fixtures против target CLI и сравнить normalized outputs.
- [ ] `G10S-212` Повторить source `npm run check` и target `pnpm check`; оба должны быть green до retirement decision.
- [ ] `G10S-213` Проверить, что target docs/CLI полностью описывают authoring, review, export, import, rollback и recovery без source repo.
- [ ] `G10S-214` Выполнить clean archive/fresh clone target без `/Users/sergeyzhechko/developer/strata`; C098 build/import/journey проходит.
- [ ] `G10S-215` Выполнить rollback target release pointer на pre-G10S bundle и затем forward restore C098.
- [ ] `G10S-216` Выполнить DB restore pre-G10S backup в disposable stack; reference product остаётся запускаемым.
- [ ] `G10S-217` Создать immutable Strata archive tag/bundle/hash manifest и проверить clone + source checks.
- [ ] `G10S-218` Пометить standalone Strata README/docs/plan как migrated/reference-only с target path/SHA; status checkbox authority удалить либо явно заморозить.
- [ ] `G10S-219` Не удалять local source repo внутри G10S; final local removal выполняет только G13 после production acceptance, exact owner-approved manifest и archive/restore proof.
- [ ] `G10S-220` Проверить отсутствие nested `.git`, `package-lock.json`, second Compose project, external symlink и runtime fallback в target.
- [ ] `G10S-221` Проверить one root startup: `pnpm dev` поднимает platform, migrations и serving без самостоятельного Strata service.
- [ ] `G10S-222` Проверить `pnpm down` оставляет zero orphan containers/networks и сохраняет declared durable volumes.
- [ ] `G10S-223` Обновить G11 input inventory/authoring queue на Strata authority и C098 release schema.
- [ ] `G10S-224` Все mass-import packs G11 ссылаются на source grant/quarantine/adapter gates; direct catalog JSON edits запрещены.
- [ ] `G10S-225` Commit: `chore(g10s): retire standalone Strata as an active authority` — выполнять только после G10S-210…224 PASS.

### Gate G10S — machine evidence, commits и handoff

- [ ] `G10S-226` Создать `docs/verification/greenfield/G10S/` по общему evidence schema; historical G10/G11/G12 artifacts не переписывать.
- [ ] `G10S-227` Evidence inputs фиксируют Strata `ec3b680` (или reviewed successor), target parent SHA, questions manifest hash и reports 13/14 hashes.
- [ ] `G10S-228` `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, `pnpm content:gates` PASS.
- [ ] `G10S-229` Новые `pnpm content:authoring:check`, `content:db:verify`, `content:bundle:verify` или утверждённые эквиваленты PASS и задокументированы.
- [ ] `G10S-230` Fresh/upgrade DB, role/grant negative matrix, canonical prompt race и backup/restore PASS.
- [ ] `G10S-231` Studio author/review/publish, deterministic export, file-only import, readback и rollback PASS.
- [ ] `G10S-232` Corpus rights/quarantine/leak scans PASS; forbidden distributable findings = 0.
- [ ] `G10S-233` C098 full learner/runtime/evidence journey PASS на exact release/revision IDs.
- [ ] `G10S-234` C098 RU/EN, light/dark, required desktop viewports, keyboard/a11y и performance matrix PASS.
- [ ] `G10S-235` Static dependency/SQL/credential scan подтверждает no API→Strata access и no dual authority.
- [ ] `G10S-236` Reconciliation: authoring→bundle→serving unexplained delta = 0; все intentional losses находятся в loss ledger.
- [ ] `G10S-237` Clean archive target проходит install/build/check/dev/C098 без source repositories и agent-local caches.
- [ ] `G10S-238` Каждый implementation commit содержит только объявленный slice; recommended sequence: docs → workspace → DB → domain → Studio → corpus → adapter → C098 → retirement.
- [ ] `G10S-239` После каждого commit повторены slice checks и `git status --short` clean; SHAs внесены в gate.md.
- [ ] `G10S-240` Push только fast-forward после local PASS и с учётом текущей CI quota policy; если push запрещён владельцем, локальные SHAs сохраняются, статус remote attestation остаётся open.
- [ ] `G10S-241` Existing G10 `PASS_WITH_LIMITATIONS` пересмотрен: retained limitations либо закрыты, либо перенесены в G11/G12 с owner и exact trigger.
- [ ] `G10S-242` Все затронутые G11/G12 items отмечены `REVERIFY_AFTER_G10S` в evidence index, не в виде скрытого assumption.
- [ ] `G10S-243` Implementing agent не ставит product `DONE`; gate получает `AWAITING_INDEPENDENT_REVIEW` и exact handoff package.
- [ ] `G10S-244` Handoff содержит repo path, branch, HEAD, commits, start command, DB migration range, bundle/release IDs, C098 route и evidence index.
- [ ] `G10S-245` Независимый Codex review из раздела 3 завершён; все P0/P1 исправлены отдельными commits и повторно проверены.
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
