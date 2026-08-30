# Fluent Interview — программа перехода на Next.js и единый монорепозиторий

Дата фиксации: **28 августа 2026**
Статус: **утверждённое направление, реализация не начата**
Владелец продукта: Sergey
Целевой root: `fluent-interview`

> **Architecture decision hold — 28.08.2026.** После этого плана владелец
> предложил Option B: новый greenfield-репозиторий, immutable legacy reference и
> capability-by-capability port без импорта старых histories. Challenge-аудит
> рекомендует Option B. Поэтому W03–W08 этого документа остаются программой
> **Option A** и не должны исполняться, пока владелец явно не выберет стратегию.
> Domain, content, Runtime, Next parity, AI и production gates ниже остаются
> полезными для обеих опций. См.
> [`GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md`](GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md).

Связанные документы:

- [`reports/architecture-audit-2026-08-28.html`](reports/architecture-audit-2026-08-28.html) — baseline «как есть»;
- [`reports/next-monorepo-target-architecture-2026-08-28.html`](reports/next-monorepo-target-architecture-2026-08-28.html) — целевая архитектура «после»;
- [`WISHLIST.md`](WISHLIST.md) — решения владельца и продуктовые пожелания;
- [`CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md`](CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md) — отдельный ledger реального обучения.

## 0. Назначение плана

Этот документ предназначен агенту или группе агентов, которые должны довести
Fluent Interview до production-ready состояния без потери уже работающих
маршрутов, контента, Git-истории и детерминированных доказательств.

Он закрывает пять целей одновременно, но **не смешивает их в один commit**:

1. пять source-репозиториев становятся одним Nx/pnpm source-monorepo;
2. learner UI полностью переписывается с Vue на Next.js App Router;
3. Question Brain, Content Studio, Learning API и Task Runtime получают ясные
   границы владения и версионированные контракты;
4. inventory вопросов превращается в проверяемые учебные маршруты и практику;
5. Штурман развивается из чат-панели в typed Tutor Orchestrator, оставаясь
   advisory-only.

## 1. Неподвижные решения владельца

- [ ] Финальный learner UI использует **Next.js 16.3.3+**, React 19.2.8+ и App Router.
- [ ] Next работает как настоящий Node/server-rendered продукт, а не `output: 'export'`.
- [ ] Финальный source of truth — один Git-репозиторий `fluent-interview`.
- [ ] Vue сохраняется только как временный rollback до полного parity/sign-off.
- [ ] Learning API остаётся владельцем progress/attempt/evidence/mastery.
- [ ] Question Brain остаётся владельцем questions/revisions/taxonomy/graph releases.
- [ ] Task Runtime остаётся владельцем task families/revisions/execution verdicts.
- [ ] Payload остаётся редакторской поверхностью, но не канонической базой published content.
- [ ] Браузер и LLM никогда не создают `accepted`, mastery или unlock.
- [ ] Платный контент Solvit не копируется и не выгружается массово без лицензии.
- [ ] Устаревший `AGENTS.md`, запрещающий source-monorepo, обновляется в первой фазе.

## 2. Определение `DONE`

Работа не считается завершённой по числу файлов или зелёному build. Все пункты
ниже должны быть доказаны артефактами, а не устным утверждением.

- [ ] Один clone + одна документированная команда поднимают весь локальный продукт.
- [ ] В root один pnpm lockfile; вложенных `.git`, JS lockfiles и скрытых source repos нет.
- [ ] Истории всех пяти репозиториев доступны через `git log --follow`.
- [ ] Next заменил Vue на всех пользовательских маршрутах.
- [ ] RU/EN, light/dark, keyboard, accessibility и visual parity подписаны человеком.
- [ ] Все 149 accepted Brain bindings детерминированно классифицированы как
      `placed` или `library_only(reason)`; unresolved = 0.
- [ ] Content Studio публикует реальный документ через review/promotion/release/readback.
- [ ] `Run` и `Submit` имеют разные контракты и разную силу доказательства.
- [ ] Hidden-test canary не попадает в stdout/stderr/API/logs/artifacts.
- [ ] Released TaskRevision проходит canonical/starter/malformed/timeout/security vectors.
- [ ] Штурман использует свежий ContextRevision и точные citations, но не имеет authority.
- [ ] CI проверяет affected graph, boundaries, contracts, integration, runtime conformance,
      golden E2E, visual/a11y/performance и supply-chain provenance.
- [ ] Next→Vue rollback и backup→restore реально отрепетированы.
- [ ] Git tree чист после каждой check-команды.
- [ ] Отдельный M3 human learning session и cold repeat закрыты человеком; архитектурная
      миграция не подделывает этот статус.

## 3. Правила работы агента

### 3.1 Запреты

- [ ] Не выполнять big-bang merge + UI rewrite + major upgrades одним изменением.
- [ ] Не удалять child repo или remote до backup и доказанной history parity.
- [ ] Не использовать `git reset --hard`, `git checkout --` или рекурсивное удаление root.
- [ ] Не переносить shared DB/ORM между bounded contexts.
- [ ] Не добавлять прямые browser→Brain/Runtime вызовы.
- [ ] Не переносить business policy в `packages/contracts`.
- [ ] Не генерировать verdict на фронтенде или через LLM.
- [ ] Не считать raw QuestionCard готовым Lesson или runnable task.
- [ ] Не принимать fuzzy/title/embedding match автоматически.
- [ ] Не обновлять два major runtime одновременно в одной волне.
- [ ] Не хранить secrets, prompts, raw transcripts или hidden tests в CI artifacts/cache.
- [ ] Не писать verification-команды, которые модифицируют tracked evidence.

### 3.2 Commit discipline

Для каждой волны:

- [ ] один смысловой commit или короткая последовательность явно перечисленных commits;
- [ ] в commit message указан идентификатор волны;
- [ ] before/after evidence сохранён в `docs/verification/next-monorepo/<wave>/`;
- [ ] все проверки запущены из clean tree;
- [ ] после проверок `git status --short` пуст;
- [ ] rollback описан и, где возможно, отрепетирован;
- [ ] следующий этап начинается только после gate предыдущего.

### 3.3 Формат gate-файла

Каждая волна создаёт `gate.md` с полями:

- [ ] objective;
- [ ] input commits/releases;
- [ ] commands executed;
- [ ] exact pass/fail counts;
- [ ] produced artifacts and hashes;
- [ ] known limitations;
- [ ] rollback command/runbook;
- [ ] reviewer/sign-off;
- [ ] final decision `PASS | FAIL | PARTIAL`.

`PARTIAL` не разрешает переход к следующей destructive wave.

---

# Часть I. Безопасная консолидация source и CI

## W00 — заморозка baseline и устранение противоречий

### Задачи

- [ ] Зафиксировать текущие SHA root/Lab/Vue/Brain/Runtime/Vault.
- [ ] Сохранить `git status --short` каждого repo.
- [ ] Разобрать существующий dirty root: отделить свои docs от generated evidence.
- [ ] Не импортировать child repos, пока root не приведён в согласованное состояние.
- [ ] Создать ADR «Next learner UI».
- [ ] Создать ADR «source monorepo with bounded contexts».
- [ ] Создать ADR «provider-owned OpenAPI/JSON Schema contracts».
- [ ] Создать ADR «Run vs Submit and worker trust boundary».
- [ ] Обновить `AGENTS.md`: удалить запрет source-monorepo.
- [ ] Обновить `CONTEXT.md` только доменными терминами, без implementation details.
- [ ] Зафиксировать supported desktop browsers и необходимость WebKit/Safari smoke.
- [ ] Зафиксировать production Node policy: Node 24 LTS; Node 26 — learning/current lane.
- [ ] Зафиксировать remote owner и canonical Git URL root repo.

### Gate W00

- [ ] В документах нет противоречия «polyrepo required» vs «monorepo target».
- [ ] Четыре ADR приняты.
- [ ] Root имеет durable remote.
- [ ] Все repo SHA и dirty state записаны.
- [ ] Commit: `docs(w00): approve Next monorepo target architecture`.

## W01 — backup Git, файлов и данных

### Задачи

- [ ] Поставить immutable pre-import tag на root.
- [ ] Поставить immutable pre-import tag на Lab.
- [ ] Поставить immutable pre-import tag на Vue.
- [ ] Поставить immutable pre-import tag на Brain.
- [ ] Поставить immutable pre-import tag на Runtime.
- [ ] Поставить immutable pre-import tag на Vault.
- [ ] Создать `git bundle --all` для каждого repo.
- [ ] Проверить каждый bundle через `git bundle verify`.
- [ ] Для Vue создать durable remote до любых перемещений.
- [ ] Снять manifest tracked paths + SHA-256 каждого repo.
- [ ] Снять commit counts и выборочные `git log --follow` baselines.
- [ ] Сделать PostgreSQL logical backups Lab и Brain.
- [ ] Проверить восстановление backups в disposable volumes.
- [ ] Сохранить current release IDs, task image digests и content release hashes.
- [ ] Сохранить current screenshot/route/API/runtime matrices.

### Gate W01

- [ ] 6/6 tags доступны.
- [ ] 6/6 bundles валидны.
- [ ] 6/6 file manifests содержат ожидаемое число tracked files.
- [ ] 2/2 DB restore drills проходят.
- [ ] Vue remote существует и содержит pre-import tag.
- [ ] Commit: `chore(w01): record import and recovery baseline`.

## W02 — root Nx/pnpm skeleton без изменения поведения

### Задачи

- [ ] Обновить root до pnpm 11.24.x.
- [ ] Обновить root Nx до 23.1.2+.
- [ ] Создать единый `pnpm-workspace.yaml`.
- [ ] Создать root project graph и naming rules.
- [ ] Ввести tags: `scope`, `type`, `language`, `stability`, `owner`.
- [ ] Настроить `@nx/enforce-module-boundaries` для TS/JS.
- [ ] Добавить собственный Go dependency-boundary gate.
- [ ] Добавить policy gate против nested `.git` после завершения imports.
- [ ] Добавить policy gate против вложенных JS lockfiles.
- [ ] Добавить policy gate против forbidden direct DB imports.
- [ ] Добавить root `CODEOWNERS` по bounded contexts.
- [ ] Добавить root Renovate/Dependabot policy по runtime lanes.
- [ ] Добавить root CI bootstrap, пока child CI остаются authoritative.
- [ ] Убедиться, что текущий `pnpm up/status/down` продолжает работать.

### Gate W02

- [ ] `nx graph` строится без циклов root skeleton.
- [ ] Boundary test содержит намеренно запрещённый fixture и ловит его.
- [ ] Никакой пользовательский маршрут не изменился.
- [ ] Child CI продолжает работать.
- [ ] Commit: `build(w02): establish root Nx workspace and policy gates`.

## W03 — импорт Vault с историей

- [ ] Импортировать Vault через официальный history-preserving workflow.
- [ ] Целевая папка: `content/question-vault/`.
- [ ] Не включать Vault в runtime read path.
- [ ] Проверить file SHA manifest 100%.
- [ ] Проверить `git log --follow` минимум для 10 файлов.
- [ ] Проверить tags/author dates/merge commits.
- [ ] Добавить Nx project только для validate/index/import tooling.
- [ ] Обновить workspace paths без изменения продуктового поведения.
- [ ] Commit: `build(w03): import question vault history`.

## W04 — импорт Task Runtime с историей

- [ ] Импортировать Runtime в `services/task-runtime/`.
- [ ] Сохранить самостоятельный `go.mod`.
- [ ] Добавить Nx targets `fmt`, `vet`, `test`, `build`, `image`, `conformance`.
- [ ] Перенести CI semantics в root, не удаляя child workflow до parity.
- [ ] Проверить все 16 families / 20 revisions до и после.
- [ ] Проверить released 15/19 projection до и после.
- [ ] Проверить task image digest identity.
- [ ] Проверить историю ADR/manifest/server/sandbox файлов.
- [ ] Commit: `build(w04): import task runtime history`.

## W05 — импорт Question Brain и Content Studio с историей

- [ ] Импортировать Brain в `services/question-brain/`.
- [ ] Переместить Payload app в `apps/content-studio/` без смены поведения.
- [ ] Сохранить Brain `go.mod` отдельно.
- [ ] Подключить Content Studio к root pnpm без обновления major на этой волне.
- [ ] Удалить отдельный npm lock только после reproducible root install.
- [ ] Сохранить migrations, published releases, outbox и graph history.
- [ ] Проверить 1 591 published cards, 114 bound cards, 149 bindings.
- [ ] Проверить Payload 2 draft/version rows как baseline, не как readiness.
- [ ] Проверить реальный promote hook хотя бы read-only tracing test.
- [ ] Проверить историю contract/migration/handler файлов.
- [ ] Commit: `build(w05): import question brain and content studio history`.

## W06 — импорт Vue rollback target с историей

- [ ] Импортировать Vue в `apps/learner-web-vue-legacy/`.
- [ ] Сохранить remote tag и bundle до удаления nested `.git`.
- [ ] Подключить существующий Vite build к root Nx.
- [ ] Сохранить URL map, 43-route matrix и visual baselines.
- [ ] Сохранить RU/EN, light/dark и preferences semantics.
- [ ] Сохранить runtime/language picker behavior.
- [ ] Запретить новые product features в legacy app после freeze date.
- [ ] Разрешить только critical fixes, нужные для parity comparison.
- [ ] Commit: `build(w06): import Vue learner rollback target`.

## W07 — импорт Lab/Learning API с историей

- [ ] Импортировать Lab в `services/learning-api/` и соответствующие packages/tools.
- [ ] Не сохранять название `lab-contracts` как dumping ground.
- [ ] На этой волне не рефакторить 84 722 строк — только history-safe placement.
- [ ] Подключить существующие Nx projects к root graph.
- [ ] Зафиксировать 101 API endpoint baseline.
- [ ] Зафиксировать 45 controllers / 48 services / 14 modules baseline.
- [ ] Зафиксировать 257 gate scripts baseline и классификационный backlog.
- [ ] Проверить `pnpm dev` и current release verify после импорта.
- [ ] Commit: `build(w07): import learning platform history`.

## W08 — завершение консолидации и единый CI

- [ ] Убедиться, что nested `.git` отсутствуют.
- [ ] Убедиться, что root — единственный Git source of truth.
- [ ] Убедиться, что root — единственный JS lockfile.
- [ ] Ввести root `go.work` только как optional dev aggregator.
- [ ] Собрать один Compose project с profiles `core`, `authoring`, `runtime`, `observability`.
- [ ] Установить явные named-volume owners и retention policies.
- [ ] `down` по умолчанию не удаляет durable volumes.
- [ ] Каждый service health возвращает root release SHA и service build SHA.
- [ ] Добавить `policy-contracts` workflow.
- [ ] Добавить `affected-quality` workflow.
- [ ] Добавить integration workflow.
- [ ] Добавить runtime conformance workflow.
- [ ] Добавить browser golden workflow.
- [ ] Добавить release/SBOM/provenance workflow.
- [ ] Добавить nightly full matrix + restore/rollback workflow.
- [ ] Запретить caching для DB/E2E/secrets/non-deterministic targets.
- [ ] Сравнить root CI с каждым child CI по списку проверок.
- [ ] Архивировать child workflows только после 100% parity.

### Gate W08

- [ ] Один clone поднимает стек.
- [ ] 0 nested Git, 0 nested JS lockfiles.
- [ ] 0 forbidden project graph edges.
- [ ] 6 history/file-hash gates прошли.
- [ ] Root CI выполняет superset старых проверок.
- [ ] Child remotes пока read-only, но не удалены.
- [ ] Commit: `ci(w08): unify source graph, compose and release workflows`.

---

# Часть II. Контракты, домены и данные

## W09 — канонический contract pipeline

- [ ] Инвентаризировать все дубли DTO/schema/fixtures в root/Lab/Brain/Runtime.
- [ ] Выбрать provider для каждого HTTP contract.
- [ ] Выбрать provider для каждого event contract.
- [ ] Описать HTTP в OpenAPI 3.1.
- [ ] Описать event payloads в versioned JSON Schema.
- [ ] Генерировать TS types.
- [ ] Генерировать Zod decoders для TS boundaries.
- [ ] Генерировать Go structs/fixtures/clients.
- [ ] Пометить generated files и запретить ручные edits.
- [ ] Ввести compatibility rules: additive optional в v1; breaking только v2.
- [ ] Добавить consumer/provider tests Next↔Learning API.
- [ ] Добавить consumer/provider tests Learning API↔Brain.
- [ ] Добавить consumer/provider tests Learning API↔Runtime.
- [ ] Добавить generated-clean gate.
- [ ] Удалять старые ручные DTO только после call-site parity.

### Gate W09

- [ ] Один provider-owned source для каждого machine contract.
- [ ] N/N-1 compatibility green.
- [ ] Deliberate breaking fixture красит CI.
- [ ] Commit: `refactor(w09): establish generated cross-language contracts`.

## W10 — декомпозиция Learning API и `lab-contracts`

- [ ] Классифицировать каждый файл `lab-contracts` как contract/domain/content/policy/fixture/generated.
- [ ] Вынести curriculum content из contracts.
- [ ] Вынести runtime fixtures из contracts.
- [ ] Вынести business policies из contracts.
- [ ] Создать domains `curriculum`, `practice`, `progress`, `evidence`, `projects`, `navigator`.
- [ ] Для каждого domain описать inbound ports.
- [ ] Для каждого domain описать outbound ports.
- [ ] DTO mapping держать на adapter boundary.
- [ ] Разделить command/read paths (CQRS-lite), не вводя event sourcing без нужды.
- [ ] Сократить root AppModule до composition root.
- [ ] Запретить domain→domain import, если связь должна идти через application port.
- [ ] Установить file/project thresholds как CI guard, не как самоцель.
- [ ] Сохранить 101 endpoint behavior.
- [ ] Сохранить database ownership и migrations.
- [ ] Добавить architecture tests для browser→Learning API only.
- [ ] Добавить architecture tests для no direct Next→Brain/Runtime.

### Gate W10

- [ ] `packages/contracts` не содержит curriculum content/business rules.
- [ ] Composition root не владеет domain behavior.
- [ ] API contract diff additive/zero-breaking.
- [ ] Current release verification не регрессировал.
- [ ] Commit: `refactor(w10): split learning domains and contract boundaries`.

## W11 — capability placement contract и исправление главного join-дефекта

- [ ] Удалить hard-coded capability→station crosswalk из application code.
- [ ] Ввести `CurriculumPlacementRelease`.
- [ ] Ввести `CapabilityStationCrosswalkRelease` либо объединённый эквивалент.
- [ ] Зафиксировать release ID, schema version, source binding release и hash.
- [ ] Для всех 149 accepted bindings вычислить disposition.
- [ ] Disposition `placed` требует exact capability identity и target station.
- [ ] Disposition `library_only` требует versioned reason code.
- [ ] Запретить `unresolved`, `stale`, `foreign_native` в release.
- [ ] Добавить N/N-1 compatibility.
- [ ] Добавить rollback pointer на предыдущий placement release.
- [ ] Устранить namespace drift Node/.NET/PostgreSQL.
- [ ] Добавить negative tests: Node-only content не попадает в Go/Java.
- [ ] Добавить generic-placement tests: HTTP/SQL/security переиспользуются без копий.
- [ ] Показать UI отдельные цифры inventory/bound/placed/runnable.
- [ ] Запретить единый misleading coverage percentage.

### Gate W11

- [ ] `149 = placed + library_only`.
- [ ] unresolved = 0.
- [ ] hard-coded adapter удалён.
- [ ] rollback к N-1 воспроизведён.
- [ ] Commit: `fix(w11): publish versioned curriculum placement release`.

## W12 — полноценный Content Studio

- [ ] Переименовать Payload app в Content Studio во всех UI/docs/telemetry.
- [ ] Ввести роли `author`, `reviewer`, `release-manager`.
- [ ] Запретить author принимать собственный binding/release.
- [ ] Удалить unrestricted authenticated CRUD.
- [ ] Объединить import и manual CMS в один `AuthoringSubmission` workflow.
- [ ] Добавить `ContentSource`, `SourceSnapshot`, `SourceLicense`.
- [ ] Добавить provenance URL/access date/hash/license class.
- [ ] Добавить candidate normalization.
- [ ] Добавить exact duplicate detection.
- [ ] Добавить similarity review без auto-accept.
- [ ] Добавить locale completeness RU/EN.
- [ ] Добавить taxonomy relations вместо free-text path/domain/capability.
- [ ] Добавить editorial decision и rationale.
- [ ] Добавить binding proposal и независимое acceptance.
- [ ] Добавить lesson placement proposal.
- [ ] Заменить synchronous publish hook на idempotent promotion/outbox/reconcile flow.
- [ ] Добавить status/retry/dead-letter visibility.
- [ ] Добавить exact release diff preview.
- [ ] Добавить rollback pointer без удаления immutable history.
- [ ] Убрать cross-schema published SQL view после Brain admin API parity.
- [ ] Добавить реальный E2E: Payload draft→review→publish→Brain readback→release projection.
- [ ] Проверить autosave/version restore.
- [ ] Проверить unauthorized publish/delete.

### Gate W12

- [ ] Один реальный документ проходит весь workflow через UI/API/hooks.
- [ ] Author не может сам принять binding/release.
- [ ] Repeated publish idempotent.
- [ ] Brain остаётся canonical authority.
- [ ] Commit: `feat(w12): operationalize content studio editorial workflow`.

## W13 — semantic graph и curriculum DAG

- [ ] Развести `QuestionSemanticGraphRelease` и `CurriculumPrerequisiteRelease`.
- [ ] Не использовать semantic `related` для unlock.
- [ ] `prerequisite` curriculum DAG должен быть acyclic.
- [ ] Проверять stale/missing endpoints.
- [ ] Проверять rationale/provenance каждой accepted edge.
- [ ] Обработать текущие proposed/rejected edges редакторски.
- [ ] Не требовать edge у каждой карточки.
- [ ] Не принимать embeddings как authority.
- [ ] Добавить graph release diff и rollback.
- [ ] Добавить визуальное различие «связано» vs «обязательно до».

### Gate W13

- [ ] Semantic и prerequisite graphs имеют разные schemas/owners/releases.
- [ ] Curriculum DAG cycle count = 0.
- [ ] accepted edge без rationale = 0.
- [ ] Commit: `feat(w13): separate semantic and prerequisite graph releases`.

---

# Часть III. Task Runtime как production judge

## W14 — Run/Submit и authoritative verdict contract

- [ ] Ввести отдельную команду `Run`.
- [ ] Run использует public/sample tests.
- [ ] Run возвращает подробную диагностику.
- [ ] Run не создаёт mastery evidence.
- [ ] Ввести отдельную команду `Submit`.
- [ ] Submit pin-ит TaskFamily/TaskRevision/release/image/harness digests.
- [ ] Submit использует hidden/adversarial suite.
- [ ] Submit возвращает restricted diagnostics.
- [ ] Submit создаёт attempt/evidence только через Learning API orchestration.
- [ ] Ввести lifecycle `accepted→queued→running→completed|cancelled|expired`.
- [ ] Ввести idempotency key.
- [ ] Повторный Submit возвращает тот же attempt/result.
- [ ] Ввести polling и/или SSE contract.
- [ ] Добавить cancellation contract.
- [ ] Verdict содержит worker version/attestation и resource summary.
- [ ] Browser/LLM verdict fields отсутствуют во входном DTO.

### Gate W14

- [ ] Run никогда не unlock-ит.
- [ ] Submit exact identity присутствует во всех result/evidence.
- [ ] Idempotent repeat не создаёт второй run.
- [ ] Commit: `feat(w14): separate run feedback from submit authority`.

## W15 — worker trust boundary и sandbox security

- [ ] Убрать host Docker socket из production control plane.
- [ ] Ввести dedicated queue/admission control.
- [ ] Ввести dedicated sandbox worker pool.
- [ ] Оценить gVisor/runsc как минимальную production isolation.
- [ ] Оценить microVM/Firecracker lane для high-risk workloads.
- [ ] Добавить authn/authz между Learning API и Runtime.
- [ ] Добавить request body limit до JSON decode.
- [ ] Добавить rate limit и per-learner quotas.
- [ ] Добавить global/per-language concurrency limits.
- [ ] Добавить predictable overload result.
- [ ] Не монтировать hidden tests в learner-readable process namespace.
- [ ] Добавить уникальный hidden canary.
- [ ] Проверять canary absence в stdout/stderr/result/API/logs/artifacts.
- [ ] Сохранить network none, cap-drop, read-only, no-new-privileges, PID/CPU/memory limits.
- [ ] Проверить timeout cleanup и zero leaked containers/workers.
- [ ] Добавить audit trail для admission/worker/verdict.

### Gate W15

- [ ] Control plane не имеет production Docker socket.
- [ ] Hidden canary leak count = 0.
- [ ] Oversized body отклоняется до decode.
- [ ] Overload отклоняется детерминированно.
- [ ] Leaked workers/containers = 0.
- [ ] Commit: `security(w15): isolate runtime workers and hidden suites`.

## W16 — image supply chain и revision conformance

- [ ] Build task image из exact source revision.
- [ ] Создать SBOM.
- [ ] Создать provenance/attestation.
- [ ] Связать source SHA→image digest→TaskRevision.
- [ ] Проверить actual local/registry RepoDigest.
- [ ] Canonical solution должна проходить.
- [ ] Starter должна падать ожидаемо.
- [ ] Malformed compile/query классифицируется.
- [ ] Timeout классифицируется и очищается.
- [ ] Output overflow containment проверяется.
- [ ] File/path escape containment проверяется.
- [ ] Network denial проверяется.
- [ ] Hidden canary non-disclosure проверяется.
- [ ] Повторить каждый deterministic vector минимум 10 раз nightly.
- [ ] Не выпускать revision без conformance bundle.

### Gate W16

- [ ] 100% released revisions имеют SBOM/provenance/conformance.
- [ ] 0 unpinned image refs.
- [ ] 10-repeat flake rate = 0 для deterministic vectors.
- [ ] Commit: `security(w16): attest and certify runtime revisions`.

## W17 — multi-language portfolio

- [ ] Зафиксировать TaskFamily как language-neutral capability только там, где invariant одинаков.
- [ ] Зафиксировать TaskRevision как language/runtime-specific implementation contract.
- [ ] Ввести CompatibilitySet для portable families.
- [ ] Не выдавать Node event loop за generic task для Go/Java.
- [ ] SQL оставить отдельной execution model.
- [ ] Утвердить target 168 families / 456 revisions.
- [ ] Разбить backlog 153 families + 437 revisions на reviewable batches.
- [ ] Для каждой generic family создать shared behavior vectors.
- [ ] Для каждого языка добавить idiomatic rubric/starter/canonical solution.
- [ ] Добавить language release policy и supported toolchain matrix.
- [ ] Разделить platform runtime version и learner exercise profile version.
- [ ] Добавить exact package-mode drills по Node/TS/Go/Java/.NET/SQL.
- [ ] Не считать одну five-language rate-limiter family зрелостью всех путей.

### Gate W17

- [ ] Каждая advertised runnable language имеет не только picker, но released revision.
- [ ] Portable family проходит одинаковые vectors во всех revisions.
- [ ] Native family не появляется в чужом path.
- [ ] Portfolio progress считается families и revisions раздельно.
- [ ] Commit series: `content(w17.<batch>): release task portfolio batch ...`.

---

# Часть IV. Next.js learner product

## W18 — Next foundation и deployment model

- [ ] Создать `apps/learner-web` на Next 16.3.3 App Router.
- [ ] Использовать React 19.2.8.
- [ ] Использовать production Node 24 LTS lane.
- [ ] Добавить Node 26 Current compatibility/nightly lane.
- [ ] Настроить TypeScript 7.0.2.
- [ ] Сохранить TS6 side-by-side только там, где tooling programmatic API требует.
- [ ] Включить typed routes.
- [ ] Включить strict typecheck.
- [ ] Настроить global error, not-found, loading boundaries.
- [ ] Настроить CSP и server action authorization.
- [ ] Запретить `NEXT_PUBLIC_` для secrets/internal URLs.
- [ ] Настроить production-like `next build` + `next start` gate.
- [ ] Подключить root observability/instrumentation.
- [ ] Определить one public origin и reverse proxy.

### Architectural rules

- [ ] Server Components по умолчанию.
- [ ] Client Components только editor/terminal/atlas/canvas/AI/ephemeral interaction.
- [ ] Server Component читает Learning API напрямую, а не через собственный Route Handler.
- [ ] Route Handlers только session/token isolation, browser streaming/SSE, uploads/webhooks.
- [ ] Business logic не дублируется в Next.
- [ ] Next не читает Brain/Runtime DB.
- [ ] Next не вызывает Brain/Runtime напрямую.

### Gate W18

- [ ] Minimal shell работает server-rendered.
- [ ] Architecture tests ловят forbidden data paths.
- [ ] Build/start проходит в production mode.
- [ ] Commit: `feat(w18): establish production Next learner shell`.

## W19 — design system, tokens и component contract

- [ ] Перенести CSS custom properties 1:1 как исходный baseline.
- [ ] Разделить primitive/semantic/component/motion tokens.
- [ ] Создать `packages/design-system/tokens`.
- [ ] Создать `packages/design-system/react`.
- [ ] Создать `packages/design-system/icons`.
- [ ] shadcn использовать как source registry, не как магическую runtime dependency.
- [ ] Обернуть Radix primitives в свои Fluent component APIs.
- [ ] Ввести density/desktop viewport policy.
- [ ] Ввести RU/EN text expansion fixtures.
- [ ] Ввести light/dark/high-contrast fixtures.
- [ ] Ввести reduced-motion behavior.
- [ ] Ввести keyboard/focus contracts.
- [ ] Ввести loading/empty/error/disabled/locked/partial states.
- [ ] Создать Storybook 10 state catalog.
- [ ] Добавить interaction/a11y/theme/locale/visual story tests.
- [ ] Добавить token parity gate с legacy Vue.
- [ ] Не копировать Vue SFC-разметку механически.

### Gate W19

- [ ] Все system components имеют stories и accessible names.
- [ ] RU/EN не ломают layout на supported desktop widths.
- [ ] Light/dark parity подписана дизайнером/владельцем.
- [ ] Commit: `feat(w19): build Fluent React design system from approved tokens`.

## W20 — route contracts и strangler migration

### Подготовка

- [ ] Составить полный route registry Vue.
- [ ] Для каждого route записать data dependencies.
- [ ] Для каждого route записать interactive states.
- [ ] Для каждого route записать keyboard/a11y behavior.
- [ ] Для каждого route записать RU/EN copy keys.
- [ ] Для каждого route записать visual baselines.
- [ ] Для каждого route записать current defects, не воспроизводить их в Next.

### Порядок миграции

- [ ] Shell/navigation/settings/theme/locale.
- [ ] Program/path overview.
- [ ] Atlas/graph.
- [ ] Questions/library/detail.
- [ ] Practice/task catalogue.
- [ ] Code workspace/editor/terminal/runtime picker.
- [ ] Evidence/progress/journal.
- [ ] Projects.
- [ ] Recovery/Control Center.
- [ ] Studio links/authoring handoff.
- [ ] Navigator/AI panel.

### Gate на каждый маршрут

- [ ] URL и deep link сохранены либо имеют явный redirect.
- [ ] Server data contract совпадает.
- [ ] Loading/error/empty states существуют.
- [ ] RU/EN parity.
- [ ] Light/dark parity.
- [ ] Keyboard/a11y parity.
- [ ] Supported desktop viewport parity.
- [ ] Component/story/integration tests зелёные.
- [ ] Один golden E2E только если маршрут входит в critical journey.
- [ ] Human screenshot diff подписан.
- [ ] Route можно переключить feature flag Next↔Vue.
- [ ] Commit: `feat(w20.<route>): migrate <route> to Next with parity`.

## W21 — practice UX и language/runtime selection

- [ ] Развести Question, Activity, TaskFamily и TaskRevision в UI.
- [ ] Показывать runtime picker только для реально released revisions.
- [ ] Показывать язык, version, module/runtime profile и availability reason.
- [ ] Запретить phantom language option.
- [ ] Показать portable vs language-native task.
- [ ] Показать Run и Submit разными действиями.
- [ ] Показать Run diagnostics без mastery обещания.
- [ ] Показать Submit lifecycle и immutable identity.
- [ ] Показать restricted verdict без hidden test leakage.
- [ ] Связать question→capability→family→revision→attempt.
- [ ] Сохранить editor, xterm, canvas/WebGL как isolated client islands.
- [ ] Проверить resize, scrolling, MacBook 13/16 и Studio Display.
- [ ] Добавить offline/provider/runtime unavailable states.

### Gate W21

- [ ] Пользователь понимает, что можно читать, запускать и сдавать.
- [ ] Каждый видимый язык реально запускается.
- [ ] Абракадабра/compile error/timeout не роняют страницу.
- [ ] Runtime outage даёт recoverable state.
- [ ] Commit: `feat(w21): deliver explicit multi-language practice workflow`.

## W22 — Next cutover и удаление Vue

- [ ] 100% route registry переведён.
- [ ] 100% critical journeys переведены.
- [ ] Visual/a11y/RU/EN/light/dark sign-off завершён.
- [ ] Next production soak пройден.
- [ ] Next→Vue rollback отрепетирован до переключения.
- [ ] Blue/green switch переведён на Next.
- [ ] Наблюдать error/latency/navigation/runtime metrics release window.
- [ ] Исправить только Next-side defects, не развивать Vue.
- [ ] После sign-off удалить Vue app из active workspace.
- [ ] Сохранить Vue tag, bundle и read-only archival remote.
- [ ] Удалить Vue dependencies/tests только после coverage replacement proof.
- [ ] Обновить docs/AGENTS/runbooks на Next-only.

### Gate W22

- [ ] Vue не участвует в build/runtime.
- [ ] Next является единственным learner UI.
- [ ] Rollback artifact ещё доступен на agreed retention window.
- [ ] Commit: `refactor(w22): complete Next cutover and archive Vue`.

---

# Часть V. Контент, обучение и Штурман

## W23 — metric truth и curriculum manifests

- [ ] Dashboard показывает inventory = 1 591 отдельно.
- [ ] Dashboard показывает bound cards = 114 отдельно.
- [ ] Dashboard показывает bindings = 149 отдельно.
- [ ] Dashboard показывает station-bound = 6 baseline отдельно.
- [ ] Dashboard показывает runnable stations = 27/81 отдельно.
- [ ] Dashboard показывает families/revisions отдельно.
- [ ] Не смешивать raw cards, primary questions и supporting prompts.
- [ ] Создать accepted manifests Node/Java/Go/.NET/Vue/Algorithms/System Design/Behavioral.
- [ ] Generic content хранить один раз, размещать многократно.
- [ ] Native exclusion rules сделать executable gates.
- [ ] Различать planning targets и accepted releases.
- [ ] Для каждой path определить lessons/questions/activities/checkpoints SLA.
- [ ] Считать полноту из manifest, не из prose checklist.

### Gate W23

- [ ] Ни одна метрика не называется просто `ready` или `coverage` без denominator.
- [ ] Все path counters вычисляются из immutable releases.
- [ ] Commit: `feat(w23): publish honest curriculum readiness metrics`.

## W24 — editorial closure 1 477 theory-only cards

- [ ] Разбить backlog на waves ≤100.
- [ ] Для каждой карточки проверить provenance/license.
- [ ] Для каждой карточки проверить locale completeness.
- [ ] Для каждой карточки принять exact capability binding или library-only reason.
- [ ] Для accepted binding назначить semantic role.
- [ ] Для placement определить primary/supporting/contrast/recall.
- [ ] Для task-like material создать TaskCandidate disposition.
- [ ] TaskCandidate становится TaskFamily/Revision, typed non-code Activity или rejected.
- [ ] Не рекламировать prose/code snippet как runnable task.
- [ ] Independent reviewer обязателен.
- [ ] Similarity/fuzzy/embedding suggestions не принимаются автоматически.
- [ ] После каждой wave публиковать release diff и counters.
- [ ] Остановить wave при foreign-native или duplicate anomaly.

### Gate W24

- [ ] Все 1 591 cards имеют явный editorial disposition.
- [ ] theory-only означает осознанный library choice, а не «не обработано».
- [ ] Commit series: `content(w24.<batch>): review Brain placement batch ...`.

## W25 — external ingestion и Solvit boundary

- [ ] Ввести license classes `owned|public-domain|permissive-open|licensed|restricted-reference`.
- [ ] Для restricted reference не сохранять paid prompt/solution/body.
- [ ] Хранить только публичный gap signal/metadata/source URL/access date.
- [ ] Запретить authenticated scraping и автоматизированную массовую навигацию Solvit.
- [ ] Запросить письменную API/export/content licence для bulk reuse.
- [ ] Без лицензии авторить clean-room original tasks по официальным/open источникам.
- [ ] Добавить author attestation.
- [ ] Добавить similarity scan.
- [ ] Добавить independent reviewer.
- [ ] Добавить legal hold flag.
- [ ] Публичные Solvit counts не считать внутренней truth metric.
- [ ] Перенять только паттерны: Run/Submit, multi-language starters, SQL dataset UX, self-assessment.

### Gate W25

- [ ] 100% imported content имеет provenance/license/disposition.
- [ ] Restricted-reference source body count = 0.
- [ ] Paid corpus extraction automation отсутствует.
- [ ] Commit: `feat(w25): enforce licensed provenance-first content ingestion`.

## W26 — свежий ContextRevision Штурмана

- [ ] Устранить frozen conversation context.
- [ ] ContextRevision создаётся на каждый turn.
- [ ] Включить exact program/path/lesson IDs.
- [ ] Включить exact QuestionCardRevision, не hard-coded revision 1.
- [ ] Включить exact graph/placement/task releases.
- [ ] Включить exact Attempt/RuntimeRun/Trace/rubric IDs.
- [ ] Не принимать browser-supplied verdict/evidence/source authority.
- [ ] Устранить duplicate history в Ollama prompt.
- [ ] Выравнять LM Studio/Ollama prompt semantics.
- [ ] Выравнять provider/model defaults UI/backend.
- [ ] Добавить live provider model discovery.
- [ ] Добавить load/unload control plane.
- [ ] Удалить misleading ignored fields из public client contract.
- [ ] Добавить evidence citations вместо generic note.

### Gate W26

- [ ] Attempt/release change меняет context hash на следующем turn.
- [ ] Question revision provenance точна.
- [ ] Provider parity golden tests зелёные.
- [ ] Commit: `fix(w26): ground Navigator turns in fresh server context`.

## W27 — typed Tutor Orchestrator beyond chat

- [ ] Ввести `TutorSession`.
- [ ] Ввести `TutorTurn`.
- [ ] Ввести `ContextRevision`.
- [ ] Ввести `TutorAction` schema.
- [ ] Ввести `HintStep` 0..4.
- [ ] Ввести `MisconceptionHypothesis`.
- [ ] Ввести `GroundingCitation`.
- [ ] Ввести `AssistanceEvent`.
- [ ] Ввести `TutorEval`.
- [ ] Ввести `TranscriptRetentionPolicy`.
- [ ] Реализовать `explain_task` без выдачи решения.
- [ ] Реализовать `socratic_probe`.
- [ ] Реализовать explicit hint ladder H0–H4.
- [ ] Реализовать `interpret_trace` и `explain_mismatch` с citations.
- [ ] Реализовать misconception hypothesis + next probe без verdict.
- [ ] Route engine сначала выдаёт allowed candidates детерминированно.
- [ ] LLM только объясняет/ranks allowed route candidates.
- [ ] Spoken coach opt-in и human-calibrated.
- [ ] Authoring assistant создаёт proposal, не publish/release.
- [ ] Invalid structured output отклоняется с deterministic fallback.

### Gate W27

- [ ] LLM output schema-valid или fallback.
- [ ] LLM authority violations = 0.
- [ ] Citation указывает на доступный learner-safe evidence ID.
- [ ] Commit series: `feat(w27.<action>): add typed Navigator action ...`.

## W28 — LLM evals, privacy и observability

- [ ] Golden corpus по action×locale×provider×model×promptVersion.
- [ ] Добавить solution-leak grading.
- [ ] Добавить citation validity/groundedness.
- [ ] Добавить misconception precision/recall/F1 с human labels.
- [ ] Добавить route agreement с deterministic oracle.
- [ ] Добавить spoken rubric agreement.
- [ ] Добавить RU/EN parity.
- [ ] Добавить freshness after attempt/release change.
- [ ] Добавить LM Studio/Ollama parity.
- [ ] Добавить TTFT/cancel/outage metrics.
- [ ] Добавить prompt injection/adversarial retrieved content.
- [ ] Добавить hidden-test/source exfiltration probes.
- [ ] Добавить long history/conflicting instructions/typos.
- [ ] OTel spans metadata-only: action/model/hashes/latency/tokens/status.
- [ ] Не писать raw prompt/completion/question/transcript в spans.
- [ ] Raw transcript только opt-in.
- [ ] Добавить configurable TTL/delete/export.
- [ ] Audio off by default.
- [ ] Regex sanitizer оставить defense-in-depth, не policy engine.

### Gate W28

- [ ] Eval thresholds опубликованы и versioned.
- [ ] Raw transcript retention соответствует policy.
- [ ] Adversarial leakage = 0 для hard gate cases.
- [ ] Commit: `test(w28): certify Navigator quality, privacy and safety`.

---

# Часть VI. Тестовая пирамида и release

## W29 — миграция browser-heavy gates

- [ ] Инвентаризировать все 257 Lab gate scripts.
- [ ] Для каждого назначить KEEP/MIGRATE/DELETE.
- [ ] Для каждого назначить owner/source of truth/duration/flakiness.
- [ ] Pure transforms/policies перенести в unit tests.
- [ ] React UI states перенести в Vitest + Testing Library.
- [ ] Component state matrices перенести в Storybook tests.
- [ ] DTO/schema joins перенести в contract tests.
- [ ] DB/idempotency/migrations перенести в integration/Testcontainers.
- [ ] Sandbox vectors перенести в runtime conformance.
- [ ] Route reachability перенести в manifest/API smoke.
- [ ] Оставить 8–15 independent golden E2E journeys.
- [ ] Удалить loops из одного mega-test; параметризовать отдельные tests.
- [ ] Использовать role/label/text locators и web-first assertions.
- [ ] Удалить ручные `waitForTimeout` там, где есть observable condition.
- [ ] `trace: on-first-retry` в CI.
- [ ] Добавить WebKit smoke, если Safari поддерживается.
- [ ] Evidence загружать CI artifact, а не переписывать tracked files.
- [ ] Удалять старый gate только после replacement parity.

### Gate W29

- [ ] 100% gate scripts классифицированы.
- [ ] Каждое удаление имеет replacement или documented obsolescence.
- [ ] Golden E2E ≤15 и покрывают critical journeys.
- [ ] Check commands leave git clean.
- [ ] Commit series: `test(w29.<layer>): migrate legacy gate batch ...`.

## W30 — performance, accessibility, security and resilience

- [ ] Core Web Vitals collection через supported analytics hook.
- [ ] Bundle budgets и analyzer gate.
- [ ] Editor/xterm/canvas chunks lazy-loaded.
- [ ] Server/client boundary bundle audit.
- [ ] Lighthouse production-like desktop gate.
- [ ] axe component tests.
- [ ] axe critical E2E.
- [ ] Keyboard-only journey.
- [ ] Reduced-motion journey.
- [ ] RU/EN overflow visual matrix.
- [ ] Light/dark visual matrix.
- [ ] CSP/security headers scan.
- [ ] Dependency/license/SBOM scan.
- [ ] Queue overload/load test.
- [ ] Runtime worker chaos/cleanup test.
- [ ] Brain/Runtime outage/recovery tests.
- [ ] Backup/restore and migration rollback.

### Gate W30

- [ ] Agreed performance budgets green.
- [ ] Critical accessibility violations = 0.
- [ ] Security hard gates green.
- [ ] Recovery RTO/RPO measured.
- [ ] Commit: `test(w30): enforce production non-functional gates`.

## W31 — version upgrades по одному

- [ ] pnpm 11.24.x — отдельный commit/gate.
- [ ] Nx 23.1.2+ — отдельный commit/gate.
- [ ] Next 16.3.3 security patch — отдельный commit/gate.
- [ ] React 19.2.8 — отдельный commit/gate.
- [ ] TypeScript 7.0.2 + TS6 tooling lane — отдельный commit/gate.
- [ ] Nest 12.0.1 spike + soak — отдельный commit/gate.
- [ ] Go Brain 1.23→1.27 — отдельный commit/gate.
- [ ] Go Runtime 1.24→1.27 — отдельный commit/gate.
- [ ] PostgreSQL Lab 17→18.6 backup/restore/reindex — отдельная wave.
- [ ] Learner PostgreSQL profile versioning не смешивать с platform DB.
- [ ] Payload 3.88 compatibility с Next 16.3.3 проверить до bump.
- [ ] Observability major upgrades проводить отдельно с dashboard migration.
- [ ] Каждый upgrade имеет rollback и soak window.

### Gate W31

- [ ] Нет commit, обновляющего более одного risky major.
- [ ] Production runtime использует LTS policy или explicit signed exception.
- [ ] Service/toolchain/exercise version matrix опубликована.
- [ ] Commit series: `chore(w31.<runtime>): upgrade ...`.

## W32 — финальный production release

- [ ] Root release manifest содержит SHA всех apps/services/packages/content/releases/images.
- [ ] Каждый health endpoint возвращает этот release identity.
- [ ] 0 provenance drift между checkout и container image.
- [ ] Contract compatibility green.
- [ ] Curriculum placement green.
- [ ] Runtime conformance green.
- [ ] Content Studio publish/readback green.
- [ ] Next route/golden/visual/a11y green.
- [ ] Navigator eval/privacy green.
- [ ] Backup/restore green.
- [ ] Next→Vue rollback rehearsal green до Vue archival cutoff.
- [ ] Human product walkthrough завершён.
- [ ] Human M3 learning session отражён отдельно.
- [ ] Release notes различают architecture completion и learning mastery.
- [ ] Старые remotes переведены read-only/archive только сейчас.
- [ ] Final independent audit не находит P0/P1.

### Gate W32

- [ ] Все предыдущие gate files имеют `PASS`.
- [ ] Нет waived P0/P1.
- [ ] Production release подписан владельцем.
- [ ] Commit: `release(w32): publish Next monorepo production baseline`.

---

# Приложение A. Целевая структура

```text
fluent-interview/
├── apps/
│   ├── learner-web/                 # Next App Router
│   └── content-studio/              # Payload editorial UI
├── services/
│   ├── learning-api/                # Nest orchestration/progress/evidence
│   ├── question-brain/              # Go content/graph/release authority
│   └── task-runtime/                # Go control plane + worker boundary
├── packages/
│   ├── design-system/{tokens,react,icons}/
│   ├── domains/{curriculum,practice,progress,evidence,projects,navigator}/
│   ├── contracts/{learning-api,question-brain,task-runtime,events}/
│   ├── clients/{learning-api,question-brain,task-runtime}/
│   └── testing/{fixtures,contract,component,browser}/
├── content/question-vault/
├── tools/{orchestrator,content-import,release}/
├── infra/{compose,observability,deployment}/
└── docs/{adr,contracts,runbooks,verification}/
```

# Приложение B. Целевая authority chain

```text
Learner browser
      │
      ▼
Next learner-web ── session/SSE only ──┐
      │                                │
      ▼                                │
Learning API (attempt/evidence/mastery)│
      ├────────► Question Brain (released content/graph)
      └────────► Task Runtime control plane
                         │
                         ▼
                 isolated sandbox worker
                         │
                         ▼
              signed deterministic verdict

Runtime/human evidence ─► ContextRevision ─► Tutor Orchestrator
                                              │
                                              └─► advisory action only
```

# Приложение C. Минимальная финальная ручная проверка

- [ ] Fresh clone.
- [ ] One documented setup command.
- [ ] One `pnpm dev` starts required profiles.
- [ ] Open program, switch every supported path.
- [ ] Open question, lesson, task, project, evidence, settings, Navigator.
- [ ] Switch RU/EN and light/dark.
- [ ] Navigate only with keyboard.
- [ ] Run valid code.
- [ ] Run malformed code.
- [ ] Trigger timeout.
- [ ] Submit accepted solution.
- [ ] Verify exact evidence identity.
- [ ] Verify Go/Java/.NET/Node language visibility matches released revisions.
- [ ] Publish one Content Studio draft through independent review.
- [ ] Verify Brain release and learner projection update.
- [ ] Ask Navigator about task, failed run, trace and route.
- [ ] Verify Navigator citations and absence of authority language.
- [ ] Restart stack and confirm durable progress/content.
- [ ] Run scoped cleanup and confirm durable volumes survive.
- [ ] Execute restore and rollback runbooks.

Только после этой проверки продукт можно называть завершённой production baseline,
а не «проектом с зелёными тестами».
