# Fluent Interview — greenfield architecture challenge

Дата: **28 августа 2026**
Статус: **архитектурная рекомендация; новый репозиторий ещё не создан**
Назначение: проверить предыдущую target architecture вопросами «обязательно ли так?»
и спроектировать переход в новый чистый репозиторий без потери работающего продукта.

Связанные документы:

- [`reports/architecture-audit-2026-08-28.html`](reports/architecture-audit-2026-08-28.html) — baseline;
- [`reports/next-monorepo-target-architecture-2026-08-28.html`](reports/next-monorepo-target-architecture-2026-08-28.html) — предыдущая target architecture;
- [`reports/greenfield-architecture-challenge-2026-08-28.html`](reports/greenfield-architecture-challenge-2026-08-28.html) — визуальный follow-up;
- [`NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md`](NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md) — прежняя программа Option A;
- [`WISHLIST.md`](WISHLIST.md) — решения и открытые вопросы владельца.

## 1. Короткий ответ

**Да, новый репозиторий с нулевой историей — лучший вариант.** Но не в форме
«скопировать пять проектов в новые папки». Рекомендуется **hybrid greenfield**:

1. старый продукт замораживается как запускаемый immutable reference;
2. новый продукт создаётся в новом remote с одной новой Git-историей;
3. перенос выполняется capability-by-capability, а не repository-by-repository;
4. для каждой capability фиксируются source SHA, исходные пути, способ переноса,
   parity evidence и осознанные отличия;
5. старый продукт не является runtime dependency или fallback API нового;
6. cutover разрешён только после data reconciliation и rollback rehearsal.

Это чище импорта старых histories, но безопаснее «чистого листа без карты».

## 2. Что мы оспариваем в предыдущей архитектуре

### Вопрос: обязательно ли импортировать всю историю пяти репозиториев?

**Нет.** Суммарная `.git`-история велика прежде всего из-за Lab и generated
verification traces. Она переносит прежнюю топологию и structural debt вместе с
полезным кодом. История сохраняется отдельными tags, `git bundle --all`, SHA/file
manifests и read-only remotes. В новой истории каждый port commit ссылается на
точный источник через port ledger.

Цена решения: `git blame` нового файла не проходит автоматически в старый repo.
Компенсация: machine-readable source map + immutable bundles + ссылки в commit.

### Вопрос: обязаны ли Question Brain, Learning API и Runtime остаться тремя сервисами?

**Runtime — да; Question Brain — не обязательно.** Выполнение недоверенного кода
создаёт отдельную trust boundary, security policy, scaling profile и release
lifecycle. Question catalog пока не доказал необходимость отдельного deployable:
его можно перенести в Nest как изолированный модуль за `QuestionCatalogPort`.
Если позже появятся отдельная команда, independent SLA или измеренная нагрузка,
порт позволит вынести модуль без переписывания домена.

Рекомендуемое core-ядро v1:

1. `apps/web` — Next.js App Router: learner UI, BFF/session boundary, защищённый Studio route group;
2. `apps/api` — Nest modular monolith: curriculum, questions, attempts, progress, evidence, projects, Navigator, authoring;
3. `services/task-runtime` — Go control/worker trust zone и детерминированный verdict.

### Вопрос: нужен ли Payload с первого дня?

**Нет.** Текущая CMS почти не используется и не должна диктовать архитектуру.
Для v1 достаточно schema-validated content workflow и защищённой Studio-поверхности
в Next/Nest. Payload подключается отдельным ADR только когда нужны доказанные
multi-editor roles, scheduling, drafts/autosave или editorial concurrency.

### Вопрос: нужны ли Redis, Kafka и тяжёлый observability stack в core?

**Нет, но здесь важно не выкинуть операторский контроль вместе с тяжёлым
backend.** Redis и Kafka включаются только после измеренного use case. Для platform
events достаточно in-process domain events + PostgreSQL outbox. Всегда обязательны
typed lifecycle (`doctor/status/down`), OpenTelemetry contract и безопасная
корреляция. Persisted telemetry включается одним локальным profile, а не пятью
разрозненными продуктами.

## 3. Целевая структура нового репозитория

```text
fluent-interview-platform/
├─ apps/
│  ├─ web/                         # Next learner + protected Studio
│  └─ api/                         # Nest modular monolith
├─ services/
│  └─ task-runtime/                # Go control + isolated workers
├─ packages/
│  ├─ contracts/                   # OpenAPI/JSON Schema + generated TS/Zod/Go
│  ├─ clients/                     # provider-owned generated clients
│  ├─ domain/
│  │  ├─ curriculum/
│  │  ├─ questions/
│  │  ├─ practice/
│  │  ├─ progress/
│  │  ├─ evidence/
│  │  ├─ projects/
│  │  └─ navigator/
│  ├─ data/{postgres,search}/
│  ├─ ui/{tokens,primitives,learning,icons}/
│  ├─ observability/
│  └─ testkit/{contract,component,browser}/
├─ content/
│  ├─ schemas/
│  ├─ fixtures/
│  └─ release-manifests/
├─ infra/{compose,docker,otel,deployment}/
├─ tools/{dev,content-compiler,migrate-legacy,release}/
└─ docs/{adr,migration,verification}/
```

Правило: `Nx project ≠ microservice`. В workspace может быть много маленьких
domain/UI projects, но только три core deployables. Папки `shared`, `common`,
`utils` и umbrella barrels запрещены. Код продвигается в shared package только
после второго реального consumer или когда это стабильный cross-process contract.

## 4. Что переносить, переписывать и не переносить

| Объект | Решение | Причина | Parity proof |
| --- | --- | --- | --- |
| Design tokens, icons, сильные UI primitives | адаптировать | ценная система, framework-neutral часть переносима | token snapshot + light/dark/RU/EN stories |
| Vue/Angular page code | переписать в Next | нужна новая React/Next архитектура, не механическая конверсия | route + behavior + visual + a11y matrix |
| Domain glossary, policies, release schemas | перенести и уточнить | это знания продукта | schema/decision diff |
| Question content и provenance | нормализовать и импортировать | сохранить знания, убрать CMS/DB двоевластие | counts, hashes, source/license reconciliation |
| Brain Go service | не копировать автоматически | его independent boundary не доказана | QuestionCatalogPort contract + load evidence |
| Runtime security primitives | адаптировать | digest/resource/sanitization уже ценны | adversarial conformance suite |
| Runtime host Docker socket | удалить | недопустимая production trust boundary | zero-socket security gate |
| `lab-contracts` как mega-package | не переносить | 84k строк смешивают contract, policy и content | domain/contract ownership tests |
| 257 custom gate scripts | классифицировать KEEP/MIGRATE/DELETE | переносим доказанное поведение, не gate zoo | replacement-test manifest |
| Playwright traces/screenshots в Git | архивировать вне source | это главный источник Git bloat | artifact retention policy |
| Hard-coded crosswalk/fallback catalogs | удалить после migration | создают ложную curriculum authority | release join reconciliation |
| Payload deployable, Redis, Kafka | optional | только после measured need и ADR | explicit activation gate |

## 5. One-command development contract

### Команды

| Команда | Контракт |
| --- | --- |
| `pnpm dev` | doctor → `compose up --build --wait --remove-orphans` → health summary → Compose Watch |
| `pnpm dev:full` | core + optional `observability,labs,ai` profiles |
| `pnpm doctor` | Docker/Compose/toolchain/ports/env/resources, без mutations |
| `pnpm status` | только ресурсы текущего stack ID и readiness |
| `pnpm logs` | scoped logs с trace IDs |
| `pnpm down` | удаляет containers/networks/orphans, сохраняет durable volumes |
| `pnpm clean:ephemeral --dry-run` | показывает только allowlisted project-labeled cache/artifacts |
| `pnpm clean:ephemeral --apply` | удаляет только показанный scoped набор |
| `pnpm data:backup` / `data:restore` | versioned manifest + проверяемый restore |
| `pnpm data:reset --confirm` | backup, затем destructive reset только выбранного stack |

### Инварианты Docker

- один root `compose.yaml`, один Compose project на checkout;
- `FLUENT_STACK_ID` даёт уникальный project name для worktree/CI;
- нет `container_name` и глобальных explicit volume names;
- labels: owner, stack, kind=`durable|projection|cache`, TTL;
- core services без profiles; optional: `observability`, `labs`, `ai`, `debug`;
- `down` никогда не использует `-v`; cleanup никогда не вызывает global prune;
- web — единственный host port по умолчанию; API/DB внутренние;
- healthchecks + `service_healthy`, но приложения также умеют retry;
- worker containers получают stack/attempt/revision/TTL labels и reconciler;
- control plane не получает `/var/run/docker.sock`;
- non-root, read-only root, tmpfs scratch, dropped capabilities, pid/resource limits.

`pnpm dev` в greenfield означает reproducible all-container environment. Быстрый
host-mode допустим позже как opt-in, но не становится единственным проверенным путём.

## 6. Где хранить вопросы, ответы и задачи

### Ответ

Не нужен один storage для всего и не нужно архивировать Markdown внутри Git.
Текущий текстовый корпус порядка 20 MiB сам по себе безопасен; проблема Git сейчас
в generated traces, а не в вопросах. Но Git-only source of truth неудобен для
переводов, review, query, provenance и многопользовательского authoring.

Рекомендуется гибрид:

| Слой | Source of truth | Содержимое |
| --- | --- | --- |
| Source Git | Git | schemas, taxonomy, policies, migrations, release manifests, curated fixtures |
| Editorial/domain | PostgreSQL | semantic revisions, RU/EN translations, provenance, placements, drafts, reviews, outbox |
| Large/sealed | managed S3-compatible object storage | media, datasets, hidden suites, traces, recordings, release bundles, backups |
| Release | immutable deterministic bundle | manifest, sharded JSONL.zst, checksums, attestations |
| Local developer view | ignored materialized worktree | readable Markdown export/import through validated CLI |

Разработчик получает удобство файлов:

```bash
pnpm content:checkout --release <release-id>
# .content/worktree/<release-id>/*.md — ignored, readable, diffable
pnpm content:validate
pnpm content:propose
```

Локальный Markdown не становится вторым authority. Publish всегда создаёт новую
immutable revision через domain command/review. Для imported corpus используется
typed block AST с sanitized Markdown leaves, а не executable MDX.

### Release bundle

```text
manifest.jcs.json
questions/{locale}/{0-f}.jsonl.zst
tasks/{runtime}/{0-f}.jsonl.zst
placements/*.jsonl.zst
assets/sha256/<prefix>/<digest>
provenance/*.jsonl.zst
checksums.sha256
attestation.json
```

Stable sort, UTF-8 NFC, canonical JSON, pinned compiler/compressor, никаких
absolute paths или uncontrolled timestamps. Один logical release строится дважды
и обязан дать одинаковые logical hashes.

### Почему не Git LFS и не ZIP Markdown

LFS решает размер бинарников, но не editorial workflow, query и provenance. ZIP/TAR
ломает нормальные diff/review/blame. Plain text fixtures остаются в Git; большие
immutable bundles и media уходят в artifact/object storage. Community MinIO не
фиксируется production default: его официальный repository архивирован; система
зависит от S3 API, а не от конкретного локального продукта.

## 7. Observability: повторный аудит 28 августа 2026

### 7.1. Что уже реально работает

Текущий продукт нельзя описывать как «без observability». Live-проверка показала:

- Grafana, Prometheus, Loki и Jaeger отвечают `200`;
- Prometheus имеет **4/4 healthy targets**: package Learning API, Question Brain,
  Task Runtime и сам Prometheus;
- Jaeger видит `learning-api`, `question-brain-api`, `fluent-task-runtime` и
  собственный service;
- W16 source gate проходит **23/23** статических проверок;
- сохранён один реальный сквозной trace `route → Learning API → Runtime`, а
  synthetic profile не изменил прогресс Сергея;
- существующий observability contract уже запрещает source, answers, prompts,
  hidden tests, secrets и user/profile authority, ограничивает cardinality и
  отделяет learner failure от platform error.

Это сильный reusable asset. Переносить нужно **семантический contract, redaction,
correlation и доказанные journeys**, но не текущую раскладку контейнеров.

### 7.2. Что в текущей реализации неправильно

| Наблюдение | Факт на 28.08.2026 | Решение для greenfield |
| --- | --- | --- |
| Раздробленный stack | Grafana + Loki + Prometheus + Promtail живут в Lab, Jaeger — в Brain; всего 5 telemetry products в 3 Compose projects | один project-scoped observability profile |
| Promtail | `3.3.2`; официальный EOL наступил 02.03.2026 | удалить; при необходимости file/container collection использовать Alloy |
| Старые версии | Prometheus `3.1.0` против `3.14.0` latest / `3.13.2` LTS; Grafana `11.5.1` при ветке `13.2`; Loki `3.3.2` против `3.7.6` | не делать цепочку in-place upgrades; заменить topology в новом repo и pin image digests |
| Два operational режима | `pnpm status` одновременно сообщает dev web/API `offline` и package app/API `200` | один `StackSession` и один machine-readable status contract |
| Lifecycle leakage | найден exited `fel-recovery-audit-postgres` и volume `fel-recovery-audit-20260816` без project labels | doctor/reconciler блокирует promotion при orphan/stale resources |
| Backend names в domain contract | health vocabulary содержит `prometheus`, `loki`, `jaeger` | dependency roles `telemetry-gateway`, `trace-store`, `metric-store`, `log-store`; vendor mapping остаётся adapter config |
| Source-only gate | W16 отмечен `mode: source`, а `liveChecks` пуст | live OTLP/metric/log/trace journey становится обязательным profile gate |

Текущий Compose держит 7-дневные metrics/logs, Jaeger использует memory store с
ограничением 5000 traces, а `json-file` ограничен 10 MiB × 3 файла. Это уже лучше
unbounded storage, но не образует одну понятную историю запусков и инцидентов.

### 7.3. Три authority plane — не один «observability» мешок

```text
┌──────────────────────────────┐
│ 1. Stack Control Plane       │  что ожидалось запустить и что реально живо
│ doctor/status/session/clean  │  контейнеры, health, schema, cache, orphan, exit
└──────────────┬───────────────┘
               │ release/stack/session identity
┌──────────────▼───────────────┐
│ 2. Technical Telemetry       │  почему запрос был медленным или упал
│ traces + metrics + logs      │  OTLP, bounded labels, redaction, incident bundle
└──────────────┬───────────────┘
               │ safe aggregates only
┌──────────────▼───────────────┐
│ 3. Learning Evidence         │  чему действительно научился пользователь
│ attempts/mastery/revisions   │  PostgreSQL authority, cold repeat, defense
└──────────────────────────────┘
```

Prometheus/Grafana не имеют права подтверждать mastery. PostgreSQL progress не
имеет права подменять healthcheck. Docker labels не являются историей обучения.
Каждый слой отвечает только на один класс вопросов и связывается через bounded IDs.

### 7.4. Рекомендованный бесплатный local stack

Для single-user local product рекомендуется profile `observability` с **одним
`grafana/otel-lgtm` container**. Официальный image объединяет OpenTelemetry
Collector, Grafana, Loki, Mimir и Tempo и прямо предназначен для development,
demo и testing. Volume монтируется в `/data`; наружу по умолчанию публикуются
только Grafana и, при необходимости, loopback OTLP.

Почему это лучше текущего набора:

- один lifecycle и один version/digest вместо пяти независимых images/configs;
- одна UI для metrics/logs/traces и trace-to-log navigation;
- OTLP остаётся provider-neutral boundary;
- backend можно полностью выключить: обучение не ломается;
- later extraction в отдельные upstream services остаётся возможной без
  изменения application instrumentation.

Это **не production backend для публичного SaaS** — сам Grafana позиционирует
image для development/demo/testing. Для локального персонального продукта это
как раз нужная граница. SigNoz self-host бесплатен и unified, но его актуальный
Docker install требует минимум 4 GiB и ClickHouse/Foundry lifecycle: он тяжелее,
чем оправдано здесь. Aspire standalone удобен для краткой диагностики и agent
queries, но хранит telemetry в памяти и теряет её при restart, поэтому не может
быть canonical incident history. Jaeger v2 `2.20.0` актуален, однако отдельный
Jaeger дублирует Tempo в выбранном LGTM image.

Grafana Alloy не включается вторым collector «на всякий случай»: `otel-lgtm`
уже содержит Collector. Alloy допускается только после отдельного ADR для
container/file log collection. Это правильная замена Promtail, но не обязательный
второй hop.

### 7.5. Instrumentation по языкам

| Runtime | Greenfield default | Почему |
| --- | --- | --- |
| Next.js | `instrumentation.ts`, Node runtime import, `onRequestError`, server OTLP; browser RUM только для измеренных UX-вопросов | официальный Next lifecycle; не отправлять code/answers из browser |
| Nest/Node | Node OTel SDK + stable traces/metrics; Pino JSON с trace/span IDs | JS logs SDK имеет status Development, stdout остаётся надёжным fallback |
| Go Runtime | Go OTel SDK для stable traces/metrics; `slog` JSON; OTLP logs только за adapter flag | Go logs всё ещё Beta; verdict не зависит от exporter |
| Kotlin/JVM | OTel Java agent / zero-code autoconfigure + SLF4J/Logback correlation | Java traces/metrics/logs Stable; native Kotlin SDK — Development по всем signals |
| Worker sandbox | только bounded lifecycle spans/metrics с control plane; learner source/hidden suite никогда не экспортируются | sandbox telemetry не должна стать каналом утечки |

Для JVM/Kotlin мы не строим production instrumentation на experimental Kotlin
SDK. Kotlin service остаётся обычным JVM application и использует зрелый Java
agent/autoconfigure; ручные spans добавляются Java API только для domain seams.

### 7.6. Логи и история инцидентов без ложных обещаний

В первом greenfield release:

1. все services пишут structured JSON в stdout;
2. Docker `local`/bounded logging driver обеспечивает базовый local fallback;
3. traces и metrics идут OTLP в `otel-lgtm`;
4. `pnpm incident:capture --session <id>` создаёт redacted immutable bundle:
   stack manifest, health timeline, bounded Compose logs, trace links, image
   digests, migrations, cache/orphan report и checksums;
5. unified OTLP logs включаются только после outage/loss/redaction test; незрелый
   language logs SDK не становится release dependency;
6. Alloy добавляется лишь если доказана потребность постоянно собирать stdout,
   причём без unrestricted Docker socket.

`StackSession` пишется append-only вне telemetry backend, потому что preflight
может упасть до запуска Collector или PostgreSQL. Минимальные поля: `sessionId`,
stack/release/source revision, toolchain, expected/observed services, health
timestamps, migration state, cache/volume summary, exit reason и cleanup result.

### 7.7. `doctor`, `status` и cleanup как продуктовая capability

- `pnpm doctor --json` — read-only проверка Docker/Compose/toolchain/ports/env,
  expected-service manifest, schema/release/image digest consistency;
- `pnpm status --json` — только один текущий `FLUENT_STACK_ID`, без смешения
  dev/package aliases;
- startup создаёт `StackSession`, `compose up --wait --remove-orphans` и health
  timeline; shutdown завершает session;
- promotion блокируется при orphan containers/volumes/networks, missing labels,
  duplicate stack IDs, expired workers, unbounded cache или schema drift;
- `clean:ephemeral` работает только по previewed allowlist текущего stack;
- никаких global prune, wildcard delete и скрытого удаления durable data;
- Control Center в UI показывает expected/observed graph, последнюю сессию,
  degraded dependency, incident bundle и безопасные ссылки в Grafana.

### 7.8. Retention и дисковый бюджет

| Сигнал | Начальная политика | Authority |
| --- | --- | --- |
| Stack sessions | 90 дней / 100 MiB | append-only local state |
| Metrics | 30 дней / 1 GiB | LGTM profile |
| Redacted traces | 7 дней / 2 GiB | LGTM profile |
| Aggregated logs | 7 дней / 2 GiB | LGTM profile, когда log pipeline promoted |
| Incident bundles | 30 дней / 1 GiB | project-scoped artifact storage |
| Profiles | выключены; 3 дня / 1 GiB только после ADR | optional profile |
| Learning evidence | по product/data policy, не по telemetry TTL | PostgreSQL + backup |

Общий telemetry/artifact budget — **6–8 GiB**, измеряемый `doctor`. Это target
policy и будущий gate, а не утверждение, что текущий `otel-lgtm` уже настроен так.

### 7.9. Может ли продукт сделать из новичка сильного архитектора

Observability улучшает обратную связь, но сама по себе не доказывает обучение.
Продукт уже силён в детерминированном Runtime, evidence boundary, глубоких темах,
multi-language направлении, provenance и contextual AI. Но обещание «готов к
любому Big Tech интервью» допустимо только после отдельного benchmark suite.

Нужны пять честных readiness states:

1. **Operational:** stack и releases воспроизводимо запускаются.
2. **Curriculum published:** путь полон, релевантен роли и не содержит чужих тем.
3. **Practice executable:** задачи имеют Run/Submit, hidden suites и вариации.
4. **Mastery proven:** accepted explanation + cold repeat + unseen transfer.
5. **Interview benchmarked:** timed coding, system design, incident response,
   English defense и внешний human mock подтверждены rubric-оценкой.

Learning loop должен адаптироваться от worked example к faded hints, независимому
решению, self-explanation, interleaved retrieval и позднему repeat. Research
поддерживает repeated retrieval, spacing/interleaving, self-explanation и fading,
но production claim требует наших собственных longitudinal данных: retention
через 7/30 дней, unseen variant success, hint dependence, time-to-solve, system
design rubric, incident diagnosis и human mock outcome.

В каждой deep lab техническая telemetry становится учебной поверхностью:
`Predict → Run → Observe trace/log/metric → Explain → Defend → Repeat`. При этом
Navigator может объяснять evidence и давать Socratic hints, но не выдаёт verdict,
не открывает mastery и не подменяет human benchmark.

## 8. Вертикальная программа переноса

| Gate | Capability slice | Обязательное доказательство |
| --- | --- | --- |
| G0 | Reference safety | 6/6 tags, bundles, SHA manifests, DB restore, old app launches |
| G1 | Greenfield bootstrap | новый remote, одна `.git`, lockfile, exact toolchain, forbidden-edge test |
| G2 | Dev contract | fresh clone → `pnpm dev`; scoped lifecycle/cleanup; warm ≤90s target |
| G3 | Shell/settings | Next shell, tokens, RU/EN, light/dark, auth/session boundary |
| G4 | Program/path/Atlas | route registry, curriculum projection, graph semantics and parity |
| G5 | Question/lesson | content release, citations, placements, answer layers |
| G6 | Run | public feedback, exact runtime profile/revision, no mastery |
| G7 | Submit/evidence | hidden suite, verdict, evidence, progress, no disclosure |
| G8 | Projects/progress | project milestones, mastery and revision chain |
| G9 | Navigator | fresh ContextRevision, typed advisory actions, eval corpus |
| G10 | Authoring/import | provenance/license/dedupe/review/release/readback |
| G11 | Remaining paths | Java/Go/.NET/Python/JS/generic relevance and portfolio closure |
| G12 | Cutover | data counts/hashes, human sign-off, rollback both directions |

Каждый slice включает Next, Nest, data migration, Runtime при необходимости,
telemetry, tests, reference screenshot/API fixtures и rollback. Он закрывается
отдельным commit/gate; новый repo не импортирует старую связанность целыми папками.

## 9. Port ledger

Для каждой capability обязательна запись:

```yaml
id: question-lesson
source:
  repo: fluent-engineering-lab
  sha: <immutable-sha>
  paths: [<old-paths>]
target:
  paths: [apps/web/..., apps/api/..., packages/domain/questions/...]
disposition: rewrite # rewrite | adapt | copy | drop
contracts: [question-release-v1, lesson-projection-v1]
parity:
  api: <artifact>
  visual: <artifact>
  behavior: <artifact>
  data: <artifact>
deliberate_deltas: []
status: planned
```

Legacy — oracle для сравнения, а не зависимость. Никаких nested `.git`, symlinks
на старый source, production fallback calls или silent copy/paste без SHA.

## 10. CI/CD и supply chain

На PR: frozen lock, Go verify, generated drift, Nx affected, module boundaries,
unit/component/contract/integration, Runtime conformance, небольшой golden E2E,
content schema/provenance/license/dedupe, CodeQL и dependency review.

На main/release/nightly: multi-arch digest-pinned images, SBOM, provenance,
signature verification, staging smoke, DB migration/restore, full multi-language
Runtime matrix. Deploy credentials — OIDC. Actions pinned to full commit SHA;
workflow permissions минимальны. Secrets, DB, hidden tests и nondeterministic E2E
не попадают в cache.

## 11. Главные риски greenfield

1. **Second-system effect:** красивый skeleton без feature parity. Лечение — один
   golden vertical slice до массового scaffolding.
2. **Маскировка rewrite под copy:** старые boundaries возвращаются новыми именами.
   Лечение — capability port ledger и architecture tests.
3. **Два источника истины:** legacy и greenfield начинают жить параллельно.
   Лечение — immutable legacy, read-only fixtures и явный release cutover.
4. **CMS-first overengineering:** editor определяет domain. Лечение — domain publish
   command и optional CMS adapter.
5. **Shared-свалка:** reusable превращается в скрытый coupling. Лечение — second
   consumer rule и domain tags.
6. **All-container DX слишком медленный:** измерять cold/warm target, Compose Watch,
   cache labels; host mode только opt-in.
7. **Hidden-test leakage:** отдельный hard security gate до первой accepted attempt.

## 12. Что меняется относительно прежнего плана

Прежний план остаётся полезным для domain, content, Runtime, Next parity, AI и
production gates. Но его W03–W08 «import histories into current root» становится
**Option A и не выполняется**, пока владелец не выберет стратегию.

Рекомендуемая Option B:

- новый active repo и новая история;
- old workspace получает immutable release/tag/bundles;
- три core deployables вместо автоматического переноса всех сервисов;
- перенос vertical capabilities;
- Question Brain/Payload/Redis/Kafka не являются default deployables;
- cutover только после G0–G12.

## 13. Решения, которые должен подтвердить владелец

1. Принять hybrid greenfield и отменить import-all-histories программу.
2. Имя/владелец нового remote; рабочее имя — `fluent-interview-platform`.
3. Принять три core deployables или сохранить Question Brain отдельным сервисом.
4. Принять all-container `pnpm dev` как канонический local contract.
5. Выбрать production S3 provider позднее, сохранив provider-neutral API.
6. Подтвердить, что Payload, Redis, Kafka и heavy observability — optional until proven.

До этих решений нельзя создавать новый remote, архивировать старые repositories или
переписывать master implementation plan как будто greenfield уже утверждён.

## 14. Рекомендованный следующий шаг

После подтверждения Option B создать отдельный **greenfield implementation plan**,
начинающийся с G0 Reference Safety и G1 Bootstrap. Первый продуктовый результат —
не UI shell, а один сквозной Node route:

`path → lesson → question → Run → Submit → verdict → evidence → progress`

с RU/EN, light/dark, keyboard/a11y, trace propagation и rollback к reference. Только
после этого масштабировать структуру на остальные пути и content corpus.
