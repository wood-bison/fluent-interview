# Fluent Interview — глубокий аудит и план доведения платформы до production truth

**Дата снимка:** 2026-08-26

**Workspace:** `/Users/sergeyzhechko/developer/fluent-interview`

**Live learner:** `http://localhost:47350/`

**Режим аудита:** baseline read-only завершён; Waves 1–4 remediation
выполняются в working tree 2026-08-27; release-only blockers перечислены
отдельно ниже.
**Цель документа:** дать следующему агенту исполнимый, fail-closed план, а не список пожеланий.

> Важно: этот документ сохраняет исходные наблюдения 2026-08-26 как baseline.
> Фактические изменения и проверки после baseline записаны в журнале ниже,
> чтобы старые claims не выдавались за текущий статус.

---

## 1. Итог одним абзацем

Платформа **работает как локальный интегрированный прототип**: обязательные API отвечают, Question Brain публикует 1 591 карточку, Runtime публикует 15 валидных families / 19 runnable revisions, Node Event Loop lab исполняется, Vue проходит typecheck/lint/tests/build, а три Compose-проекта разделены по владельцам. Однако текущий статус нельзя считать воспроизводимым production release. Vue-репозиторий local-only и грязный, umbrella не закрепляет revisions дочерних Git roots, Lab CI обращается к удалённому Angular/Nx и старым task-image путям, production manifest не фиксирует Vue source, запущенные контейнеры расходятся с текущими tags, task images не pinned по digest, а формальные curriculum gates не ловят смысловые ошибки taxonomy, потерю выбранной runtime revision и жёстко прошитые переходы из любой карточки в Node Event Loop. Сначала нужно закрыть truth/reproducibility, затем semantic routing/runtime UX, и только после этого — визуальную полировку.

## 2. Что проверено

### Репозитории и история

Проверены шесть независимых Git roots:

1. umbrella `fluent-interview`;
2. `fluent-engineering-lab` — learning API, packaging, curriculum projection;
3. `fluent-engineering-vue` — единственный learner/operator UI;
4. `fluent-question-brain` — source of truth вопросов;
5. `fluent-task-runtime` — execution authority;
6. `fluent-question-vault` — историческое зеркало карточек.

### Исполнение и данные

- root `layout:check`, ports registry и workspace-contract;
- Vue: typecheck, ESLint, Vitest, production build;
- Lab: curriculum drift, lint/test/build, release boundary и hardening;
- Question Brain: Go checks, migration/load, backup/restore, failure injection;
- Task Runtime: Go tests в официальном Go container и release-join smoke;
- live HTTP projections: Program, Practice, Learner Map, questions, task families, labs;
- Docker Compose projects, containers, images, labels, ports, volumes и cleanup scripts;
- desktop UI в light/dark, DOM/a11y structure, canonical routes и deep links;
- вопросный корпус: placements, paths, lanes, topics, duplicate prompts и learning readiness.

### Важные положительные результаты

- ровно три активных Compose projects: Brain, Runtime, Lab;
- основные health/readiness endpoints отвечают `200`;
- 1 591 карточка опубликована, bilingual layers присутствуют, 0 unmapped по текущему structural gate;
- 34 question↔runtime bindings имеют корректные question revision/content hashes; defect находится в projection/selection contract, а не в identity самих bindings;
- все 1 591 released cards имеют accepted curriculum mapping, но только 6 явно station-bound; остальные 1 585 остаются searchable/unbound by design;
- released question graph содержит 817 nodes / 1 112 edges и проходит structural validation; learner route-map отдельно содержит 81 station / 17 переходов, 5 open и 76 locked;
- Runtime inventory содержит 16 families / 20 revisions raw, но learner-valid release — 15 families / 19 runnable revisions; двадцатая revision capability-only и не должна входить в runnable count;
- полный browser-crawl обнаружил 194 уникальные внутренние ссылки: 194/194 разрешились в Vue route/state, но часть опубликованных Workspace routes завершилась честным `API contract validation failed`, а не рабочей лабораторией;
- sandbox запускается с `network none`, memory/CPU/PID limits, `cap-drop ALL`, `no-new-privileges`, read-only root, noexec tmpfs и read-only hidden tests;
- цвета UI централизованы: 82 `--fel-*` tokens, hard-coded hex/rgb вне token-файла не найдено;
- desktop shell имеет skip link, landmarks, доступные навигационные названия, реальный light/dark mode;
- Vue production routes lazy-loaded.

## 3. Состояние Git на момент аудита

| Repo | Branch | Remote | Состояние |
|---|---|---|---|
| umbrella | `main` | `origin` | ahead 4, dirty |
| Lab | `main` | `origin` | ahead 4, clean |
| Vue | `main` | **нет remote** | 26 modified + 4 untracked |
| Question Brain | `main` | `origin` | clean |
| Task Runtime | `main` | `origin` | clean |
| Vault | review branch | `origin` | clean |

Это не cosmetic issue: packaged artifact собирает Vue, но release manifest сообщает только чистоту Lab. Существующий package нельзя восстановить по Git revisions.

## 4. Оценка готовности

Шкала: `0` отсутствует, `1` прототип, `2` частично, `3` рабочий с gaps, `4` production-grade.

| Область | Балл | Почему |
|---|---:|---|
| Архитектурные ownership boundaries | 3/4 | Владельцы определены, shared DB/code не обнаружены; revisions workspace не pinned |
| Build / CI / release truth | 1/4 | Локальные checks зелёные, активные CI workflow архитектурно устарели |
| Docker lifecycle / provenance | 2/4 | Compose разделён и sandbox hardened; live drift, unknown revision, mutable task tags |
| Curriculum / semantic graph | 2/4 | Все карточки структурно mapped; смысловые lane/topic ошибки и почти отсутствующие edges |
| Learner routing / runtime selection | 2/4 | TaskFamily picker существует; discovery и content→task binding не каноничны |
| UI implementation integrity | 3/4 | Токены и компоненты есть; много page-local CSS, mixed vocabulary, false affordances |
| Accessibility | 3/4 | Skip link, dialogs и focus return работают; остаются nested main, active-state и отдельные semantic gaps |
| Theming / Liquid Glass honesty | 3/4 | Light/dark последовательны; glass в основном функциональный, но нужна state matrix |
| Performance | 3/4 | Lazy routes и bounded scrollers работают; xterm ~331 KB и большие списки требуют route budgets/virtualization |
| Observability / operations | 2/4 | Prometheus/Loki/Jaeger доступны; Grafana advertised, но live port отсутствует |
| Content learning readiness | 2/4 | 989/1591 learning-ready; 602 карточки неполны, UI не формирует очередь улучшения |

**Суммарно: 26/44.** Это сильный integrated prototype, но не production-ready learning system. Отдельная browser/UI оценка по пяти техническим критериям — **15/20**: theme и desktop shell сильные, implementation integrity ограничивают broken published labs и route semantics.

## 4A. Журнал remediation — 2026-08-27

После read-only baseline выполнены следующие изменения. Они уже находятся в
working tree, но ещё не являются опубликованным release, пока каждый child Git
root не будет отдельно проверен и закоммичен владельцем.

| Волна | Фактический результат | Доказательство |
|---|---|---|
| W1 · revision truth | Workspace/run envelope передаёт `revision` и `taskFamilyKey`; Runtime выбирает точную revision и отклоняет несовпадающую family; Vue сохраняет selection в query/cache identity | Lab targeted tests 46/46; Vue typecheck/tests/build |
| W1 · taxonomy | Lane classifier обрабатывает `.NET` и Java async до общего backend/node fallback; Angular относится к frontend; coverage matrix больше не теряет Angular | `API_URL=http://127.0.0.1:47000 pnpm g12:coverage:matrix:check`: classified 1591/1591, unclassified 0 |
| W1 · action safety | Path projection не предлагает locked/unpublished workspace как runnable; selected unreleased revision не рекламируется как готовая | Vue route/state smoke; blocked actions имеют explicit reason |
| W1 · progressive UX | Atlas, Practice и Studio показывают navigation/orientation до hydrate, без пустого белого viewport; loading/error остаются объявленными | Vue `pnpm check`; manual DOM smoke на `/practice`, `/studio/content`, `/paths/nodejs-typescript` |
| W2 · CI | Lab workflows больше не ссылаются на удалённый Angular/Nx `web`, старые task-image пути и отсутствующий `practice:journeys`; запускаются актуальные Lab gates | `.github/workflows/ci.yml`, `quality.yml` |
| W2 · Docker provenance | Compose images закреплены digest; task descriptors/profile manifest используют локальные immutable `image@sha256` references; добавлен fail-closed image manifest checker | `pnpm runtime:images:check` и `docker compose ... config --quiet` |
| W2 · lifecycle | `down` больше не скрывает ошибки Lab Compose; `prune --build-cache` никогда не чистит global/default builder и пропускается без dedicated builder | `scripts/down.sh`, `scripts/prune.sh` |
| W2 · concurrency | Playwright default ограничен двумя worker'ами для общего локального API/Runtime stack | `pnpm e2e`: 58/58 |
| W3 · executed-image truth | Runtime перед каждым run инспектирует точный `image@sha256` через Docker и fail-closed при mutable/mismatched/missing image; release family hashes пересчитаны после pinning | Runtime Go tests; Docker-backed readiness + image gate |
| W4 · semantic placement | Добавлен read-only semantic placement gate: stable question ids, topic presence, lane enum и явные topic-prefix invariants; Angular/RxJS/Algorithms/Oracle taxonomy нормализованы в Lab | `API_URL=http://127.0.0.1:47000 pnpm semantic:placement:check`: 1591/1591, 0 violations, 3 alias warnings |

### Подтверждённые проверки после remediation

- Vue `pnpm check`: typecheck, ESLint (0 errors), Vitest 10/10, Vite build — PASS.
- Lab `pnpm check`: curriculum drift 0, Nx lint/test/build, API/contract suites — PASS.
- Vue browser smoke: `pnpm e2e` — **58 passed**, MacBook light + Studio dark.
- `pnpm practice:health:gate` и `pnpm g13:boundary:audit:check` — PASS.
- G12 coverage — PASS только при запущенном API с явным `API_URL`; без API
  команда правильно завершается ошибкой, а не использует скрытый fallback.
- `pnpm layout:check` — пять независимых Git roots обнаружены.
- `git diff --check` для затронутых roots — PASS.

### Что всё ещё не закрыто и не должно называться production-ready

1. Vue остаётся `local-only` без remote-backed revision; umbrella не pin'ит
   child commit SHAs. Это P0 provenance, не косметика.
2. `g12` и `g14` в production-профиле требуют package API на 49301; текущий
   dev stack на 47000 — отдельный режим. Последний `g14` также показал
   package readiness/trace/SLO gaps, поэтому release gate не объявлен зелёным.
3. Task image digests сейчас зафиксированы для локально собранного namespace;
   для переносимого CI/registry release нужны registry-published digests,
   source labels и свежий runtime release manifest, а не только локальный
   Docker ID.
4. Grafana/Prometheus/Loki/Jaeger operational closeout, backup/restore,
   fresh-clone и aggregate release gates остаются следующей инфраструктурной
   очередью. Их наличие в compose не доказывает operational readiness.
5. Семантическая route parity, полная content→capability binding для всех
   1 591 карточек и UI/i18n cleanup ещё требуют отдельной W3–W5 волны.

---

## 5. Реестр дефектов

### P0 — release blockers

#### P0-01. Workspace нельзя клонировать и воспроизвести одной декларацией

`workspace.yaml` объявляет Vue как `remote: local-only`; дочерние repos игнорируются umbrella и не являются submodules. `layout-check` проверяет только наличие `.git`, но не remote, revision, branch, dirty state и compatibility bundle.

**Риск:** новый Mac/CI не может восстановить продукт; package зависит от неизвестного локального Vue snapshot.

#### P0-02. Активные Lab GitHub Actions не соответствуют новой архитектуре — **частично закрыт W2**

- `ci.yml` строит отсутствующий `internals/tasks/images/node` как `fel-task-node:1`;
- `quality.yml` пытается lint/test/build Nx project `web`, которого в Lab больше нет;
- workflow вызывает отсутствующий `practice:journeys`;
- `check:release` вызывает сборку `../fluent-engineering-vue`, которой нет в standalone checkout Lab;
- Vue, umbrella и Task Runtime не имеют полноценного CI.

**Риск:** main не защищён; локальная зелень не равна merge/release green.

Ссылки на удалённый `web`, старые task-image пути и отсутствующий journey
убраны из текущих Lab workflows. Отдельный CI для Vue/umbrella/Runtime и
агрегированный terminal release gate ещё не добавлены.

#### P0-03. Production package не фиксирует полный source provenance — **закрыт W7**

Ранее packaging проверял clean/revision только Lab, затем собирал sibling Vue.
В W7 `sourceProvenance()` получил явный реестр пяти shipped Git roots
(Lab, Vue, Task Runtime, Question Brain и Question Vault). Install manifest,
state и last-known-good boundary теперь записывают для каждого root revision,
dirty flag и Git tree digest; top-level `sourceClean` остаётся true только при
чистом состоянии всех компонентов. Upgrade/rollback ownership сверяет этот
набор как единый tuple.

**Результат:** два package с одинаковым Lab revision больше не могут скрыть
разный UI/runtime/content snapshot; package остаётся fail-closed при dirty
любого shipped root.

#### P0-04. Hardening не входит в единый terminal release gate

`production:check` проверяет historical plan, diff и browser bundle. `check:release` не включает `g14:hardening:check`. При параллельной нагрузке G14 уже падал по Question Brain search p95, а отдельный повтор прошёл.

**Риск:** `RELEASED` может печататься при незапущенном или нестабильном operational gate.

### P1 — функциональная и смысловая корректность

#### P1-01. Любой вопрос ведёт в Node Event Loop lab — **исправлен W1**

`QuestionDetailView.vue:193-198` всегда показывает `/lab/node-event-loop-001`, независимо от capability, runtime и task-family reference.

#### P1-02. Любой конспект ведёт в Node Event Loop lab — **исправлен W1**

`LessonView.vue:176-178` содержит тот же hard-coded route. Конспекты CPU, streams, memory, rate limiter и будущих Go/Java/.NET тем получают неверную практику.

#### P1-03. Structural mapping выдаётся за semantic correctness — **частично исправлен W1**

Current quality endpoint сообщает 1 591 mapped / 0 unmapped, но live corpus содержит:

- 27 `Java / Concurrency & Async` карточек с lane `node`;
- 12 `.NET / Async & Concurrency` карточек с lane `node`;
- RxJS topics в lane `backend`;
- frontend caching placement без явной причины;
- topic aliases, отличающиеся регистром/разделителем;
- два exact normalized duplicate prompt groups.

Gate проверяет наличие координаты, но не допустимость `path × lane × runtime × topic × capability`.

Classifier-order bug для `.NET`, Java async, Angular, RxJS, Algorithms и
Oracle исправлен. Новый semantic placement gate даёт 0 hard violations;
три регистронно/разделительных alias остаются editorial warning до отдельной
Question Brain migration.

#### P1-04. 602 карточки не learning-ready, но релизная сводка маскирует это

Из 1 591 карточки только 989 имеют complete learning layers. Все 1 591 при этом имеют `learningMode=puzzle`; guided/controlled-lab/workspace counts равны нулю в question summary.

#### P1-05. Граф слабее заявленной модели обучения

81 node имеют только 17 edges. UI говорит о prerequisites, neighbors и unlocks, но большая часть программы — упорядоченный список, а не содержательный dependency graph.

#### P1-06. Locked/release-pending stations визуально предлагают `Открыть` — **исправлен W1**

На Program/Atlas у pending Node stations есть активные ссылки в `/lab/...`; downstream честно показывает preview/blocked state, но primary affordance выглядит runnable. Это false affordance и лишний переход.

#### P1-07. Runtime picker существует не в канонической точке discovery

`FelRuntimePicker` используется только в Path projection. Полный language choice доступен через TaskFamily route, но:

- Question detail не строит переход из `taskFamilyReferences`;
- Practice direct-link для single revision скрывает family context;
- Path показывает counts и picker, но question→family→revision→workspace не является единым flow;
- learner не понимает, почему у Rate Limiter есть языки, а у соседней задачи нет.

#### P1-08. Live containers расходятся с current image tags

Running image IDs Brain API/CMS/indexer и Runtime не совпадают с текущими `latest` tags. OCI label `org.opencontainers.image.revision=unknown`.

#### P1-09. Task sandbox release не immutable — **частично исправлен W2**

Descriptors и catalogue теперь используют immutable `image@sha256` references,
а `image-manifest-check.sh` сверяет их с profile manifest и локальным daemon.
Registry-published digest, image provenance в release manifest и source labels
для переносимого CI остаются открытыми.

#### P1-10. UI и API имеют несколько канонических дублей маршрутов — **исправлен W1**

`/questions` и `/practice/questions`, `/lab/:id` и `/practice/lab/:id`,
`/learning-map` и `/paths` теперь сходятся через redirect/canonical policy с
сохранением query/hash. Остальные deep-link analytics и browser-history
матрицы остаются под acceptance coverage.

#### P1-11. Current session может противоречить выбранному path/domain

Главная страница говорит `Node.js runtime`, но текущий resume target — `Cache-aside that survives a stampede`. Технически это сохранённая сессия, однако UI не объясняет cross-domain resume и создаёт впечатление загрязнения Node path.

#### P1-12. Выбранная language/runtime revision теряется перед Workspace и Run

`TaskFamilyView` добавляет `revision` в URL, но Lab workspace controller принимает только `labId`; runtime workspace client и run-flow затем выбирают latest revision. Пользователь может осознанно выбрать Go/Java/C#/TS revision, а получить другую реализацию без предупреждения.

**Риск:** результат выполнения и evidence не соответствуют выбору learner-а. Workspace и Run обязаны принимать, проверять и возвращать exact `{familyKey, taskId, revision, language, profile, runtime}`.

#### P1-13. Path UI не различает native и shared curriculum

Shared areas допустимы архитектурно, но projection показывает их как часть выбранного языка без объяснения:

- Node path включает станции .NET, Go, Java и PostgreSQL;
- Java/.NET/Go показывают shared Node auth, PostgreSQL и idempotency stations;
- Python показывает Node/PostgreSQL tasks, хотя Python runtime ещё не опубликован;
- Frontend показывает Node runtime stations.

Это не raw placement corruption, но текущая визуализация создаёт именно такое впечатление. Каждая станция должна иметь server-owned visibility reason: `native | shared | prerequisite | future`.

#### P1-14. Published runtime counters завышены

`PathProjectionView` показывает `16 released` / `20 runnable`. Правильные learner-facing значения — `15 released` / `19 runnable`: `project-book-boundary-001` capability-only и не runnable. UI не должен считать raw inventory как released inventory.

#### P1-15. Опубликованные Workspace routes не исполняются

Полный crawler прошёл 194/194 внутренних href, но advertised lab families `ordering-*`, `broker-decision-010`, `k8s-ops-011`, `pg-wallet-009` и `resilience-circuit-breaker` открывают generic `Workspace task`, затем завершаются `API contract validation failed`. Это не broken router, а broken published action: ссылка обещает runnable lab, которого release contract не поддерживает.

#### P1-16. Runtime manifest и catalogue расходятся

`/api/curriculum/drift` сообщает missing manifest entries для `csharp-rate-limiter-001`, `node-event-loop-001`, `project-book-boundary-001` и `ts-rate-limiter-001`. Structural graph остаётся valid, но runtime manifest нельзя считать полным release authority.

### P2 — operations, UX, maintainability

#### P2-01. Grafana container running, но host port недоступен

Compose объявляет `127.0.0.1:49304:3000`, live container показывает `3000/tcp` без published binding; status печатает offline и всё равно exit 0.

#### P2-02. Dev и packaged Lab запущены одновременно

Оба web/API profiles отвечают. Status не показывает `both/conflict`; mode lock отсутствует.

#### P2-03. Lifecycle не fail-closed

- status не проверяет оба Lab API;
- обязательный offline endpoint не меняет exit code;
- down подавляет Compose errors через `|| true`;
- ports проверяет registry duplicates, но не live owner collision.

#### P2-04. Cleanup может затронуть чужой BuildKit cache

Opt-in `docker builder prune --filter until=168h` работает на default/global builder. Workspace ownership filter отсутствует.

#### P2-05. Docker inventory содержит две полные серии task images

`fel-task-*` и `fluent-runtime-task-*` дублируют около 4.3 GB каждая; также остались historical check/i3/i4 images. Нельзя удалять вслепую: нужен manifest-driven ownership/retention policy.

#### P2-06. Lab repository перегружен историческим evidence

Около 465 MB tracked content; 60 Playwright trace zip и тысячи production evidence files раздули `.git` примерно до 545 MB. Evidence важен, но binary traces не должны жить бессрочно в обычной Git history.

#### P2-07. Vue имеет централизованные цвета, но layout system остаётся page-local

34 из 35 SFC имеют scoped styles. Tailwind установлен, но почти не используется. Reka UI подключён, однако primitives покрывают только малую часть shell/dialog/form/navigation patterns. Результат — повторяющиеся grids, spacing и breakpoints.

#### P2-08. Mixed RU/EN vocabulary и неполная route title localization

`Released projection`, `Current session`, `TaskFamily`, `Code Workspace`, `Konspekt`, `Learning-ready`, `Read-only projection` смешиваются с русским UI. Не все route meta titles входят в localization map.

#### P2-09. Accessibility и route-state gaps

Подтверждены/требуют regression tests:

- shell уже содержит `main#main-content`, но Lesson и несколько Project views добавляют вложенный `<main>`;
- Atlas rail не получает `aria-current` на `/paths` и `/paths/:pathKey`;
- heading order на отдельных views;
- roving tabindex/focus drift у route graph;
- интерактивные trace/list rows без нативной button semantics;
- `aria-controls` на условно удаляемую панель;
- часть controls меньше целевого 44×44 enhanced target;
- keyboard/focus state после смены route/filter/dialog.

#### P2-10. Bundle budget не отражает feature ownership

xterm chunk около 331 KB — крупнейший вкладчик. Terminal не нужен на Program/Questions/Atlas; он должен загружаться только на runnable workspace route. Нужен per-route budget, а не только общий initial budget.

#### P2-11. Topic labels не нормализованы

Найдены пары:

- `Distributed Systems & Resilience` / `Distributed Systems / Resilience`;
- `Go / Channels & select` / `Go / Channels & Select`;
- `Go / Sync & Patterns` / `Go / Sync Patterns`.

#### P2-12. UI detector не нашёл массовых hard-coded style violations, но это не visual proof

Единственная detector advisory касалась blueprint background в route graph и является false positive. Visual correctness всё равно должна проверяться screenshot diff на целевых desktop viewports и state matrix.

#### P2-13. `/studio/recovery` показывает Studio Overview

Canonical `/studio/system/recovery` работает, но зарегистрированный `/studio/recovery` сохраняет URL и рендерит Overview с активной вкладкой «Обзор». Alias должен redirect в canonical route либо быть удалён.

#### P2-14. Переключение EN не локализует ключевые surfaces — **закрыт W5**

В W5 global locale contract распространён на `/learning-map`, `/practice`,
`/questions`, TaskFamily, Projects, Studio, onboarding, progress/journal,
failure states, question detail, project readers и recovery, включая shared
dialog labels и accessible navigation. Server-authored titles, prompts и
answer bodies остаются владельцами released projections и не маскируются
локальным словарём. Сквозной EN smoke на двух целевых desktop-профилях
подтверждает route-owned chrome без смешения RU/EN; дальнейшая работа — только
регрессия новых labels и отдельный перевод server-owned content.

#### P2-15. Answer readiness нельзя честно вывести из текущей list projection

В EN short answer заполнен у 1 100/1 591, mechanism у 1 198/1 591; в RU — 989/1 591 и 644/1 591 соответственно. List projection не публикует полноту traps/follow-ups/terms/practice, хотя часть данных есть в full payload. Нужен server-owned completeness projection, а не вывод готовности по наличию одной строки.

---

## 6. Целевая архитектура truth

```text
Question Vault (history only)
        │ reviewed import
        ▼
Question Brain ── immutable question/card/capability/placement release
        │ versioned HTTP + release id
        ▼
Learning API ── program/practice/progress projections + binding resolver
        │                         │
        │                         └── Task Runtime ── family/revision/image digest/run/evidence
        ▼
Vue learner UI ── renders truth; never invents route, readiness, count or verdict
```

### Единственная допустимая цепочка перехода

```text
QuestionCard
  → explicit capability/placement
  → optional TaskFamily reference
  → selected released TaskRevision
  → Workspace route
  → immutable runtime image digest
  → Run result + trace + evidence
  → explanation
  → cold repeat
```

Если любое ребро отсутствует, UI показывает `Нет опубликованной практики`, а не подставляет Event Loop.

---

## 7. План исполнения по волнам

Нельзя выполнять более позднюю волну, пока acceptance предыдущей не зелёная. Каждый PR/commit должен принадлежать одному repo owner и одной волне.

### Wave 0 — freeze, baseline и защита данных

**Цель:** зафиксировать правду до изменений.

1. Сохранить `git status`, HEAD, remotes и dirty state всех шести repos в machine-readable manifest.
2. Снять `docker compose ls`, container image IDs/digests/labels, ports, volumes и release IDs.
3. Экспортировать только metadata Question Brain backup; проверить restore в изолированный project/volume.
4. Создать route × locale × theme × viewport baseline screenshots.
5. Не чистить images/volumes/cache до утверждения ownership manifest.

**Gate W0:** baseline воспроизводится одной командой; backup restore доказан; ни один product source не менялся.

### Wave 1 — воспроизводимый workspace

**Цель:** fresh clone превращается в тот же workspace.

1. Создать remote для Vue и push текущей истории после отдельного review.
2. Выбрать один механизм pinning дочерних repos:
   - рекомендуемый: umbrella manifest с `url + revision SHA + expected branch + compatibility bundle digest` и bootstrap script;
   - допустимый альтернативный: Git submodules, если команда принимает их UX.
3. Убрать `local-only` из workspace contract.
4. Расширить `layout-check`:
   - remote URL exact match;
   - branch policy;
   - clean/dirty policy;
   - exact SHA or allowed compatibility range;
   - vault review-branch exception explicit и expiring.
5. Добавить `pnpm bootstrap --frozen` и `pnpm verify` в umbrella.

**Gate W1:** на чистой директории bootstrap клонирует все repos, checkout exact SHAs, install frozen locks и проходит `pnpm verify` без ручных путей.

### Wave 2 — CI и единый release gate

**Цель:** main нельзя сделать зелёным ложным образом.

1. Удалить stale Lab CI steps (`internals/tasks/images`, Nx `web`, missing scripts).
2. Разделить CI по owner repos:
   - Brain: Go tests, migrations, schema, import/quality/backup smoke;
   - Runtime: Go tests, image builds, sandbox smoke, digest checks;
   - Lab: API contracts, curriculum compiler, package manifest;
   - Vue: typecheck, lint with zero warnings budget, unit, route E2E, build budgets;
   - umbrella: compatibility/release join and fresh-clone smoke.
3. Создать один `release:verify` aggregate, включающий G12, G13, G14, semantic graph, browser route matrix и package provenance.
4. Historical progress document не должен сам создавать статус `RELEASED`.
5. CI matrix обязана использовать одинаковые Node/pnpm/Go versions с workspace manifest.

**Gate W2:** deliberate failure каждого child gate делает aggregate красным; ни один workflow не зависит от sibling directory, не checkout’нутой явно.

### Wave 3 — OCI provenance и Docker lifecycle

**Цель:** один release исполняет одни и те же bytes.

1. Pin base, Compose и task images по digest.
2. Добавить в TaskRevision: `imageRef`, `imageDigest`, `sourceRevision`, `harnessDigest`, `sbomRef`, `provenanceRef`.
3. Executor проверяет local inspected digest перед `docker run` и fail-closed при mismatch.
4. Root launcher передаёт source revisions; `unknown` запрещён readiness gate.
5. Detect/recreate live image drift; status показывает configured vs running digest.
6. Ввести profile lock `dev | package`; `both` — error, если не explicit diagnostic mode.
7. Grafana: force-recreate и health smoke либо честно объявить optional; advertised URL не может быть offline при green status.
8. Cleanup:
   - dedicated workspace builder;
   - `prune --plan` показывает точные resources и bytes;
   - удаление только по labels + manifest + retention age;
   - durable volumes никогда не удаляются без отдельного explicit command/confirmation.

**Gate W3:** два clean rebuild дают одинаковые release inputs/digests; restart не меняет executed image; unrelated Docker resources не попадают в prune plan.

### Wave 4 — ontology и semantic graph validation

**Цель:** `mapped` означает «помещено правильно», а не «поле непустое».

1. Ввести canonical registries:
   - `Path`, `Domain`, `Runtime`, `Lane`, `Topic`, `Capability`, `QuestionType`, `PracticeMode`;
   - stable IDs отдельно от localized labels;
   - aliases/alt labels отдельно от canonical label.
2. Описать allowed shapes/invariants:
   - Java topic не может иметь Node lane/runtime без explicit cross-runtime reason;
   - .NET topic не может иметь Node lane;
   - question path membership выводится только из accepted placement;
   - topic canonical ID уникален после Unicode/case/separator normalization;
   - duplicate prompt требует explicit `duplicate|variant|supersedes` relation;
   - task-family reference capability-compatible.
3. Добавить semantic audit report с P0/P1 violations, а не только counts.
4. Нормализовать найденные aliases и lane errors через versioned migration, не destructive rewrite.
5. Увеличить graph relations: prerequisites/related/contrast/follow-up/variant должны быть editorially reviewed.
6. Заимствовать принципы SKOS (`prefLabel`, `altLabel`, `broader`, `narrower`, stable URI) и SHACL-style validation reports, не обязательно внедряя RDF storage.

**Gate W4:** corpus проходит shape rules; 0 unexplained cross-runtime placements; 0 unreviewed aliases; 0 duplicate prompts без relation; report содержит focus node, violated rule и remediation hint.

### Wave 5 — learning readiness и content completeness

**Цель:** 602 неполные карточки становятся управляемой editorial queue.

1. Определить required layers по QuestionType/level, а не единый boolean.
2. Показать в Studio readiness funnel: published → placed → localized → answer-complete → relation-reviewed → practice-bound → learner-ready.
3. Создать bounded batches по topic/capability; запретить массовый LLM auto-publish.
4. Каждой incomplete карточке дать explicit missing layers и owner.
5. Разделить theory puzzle, controlled lab, workspace и external project brief.
6. Добавить quality samples и human review evidence.

**Gate W5:** цифры summary не смешивают published и learning-ready; UI явно показывает denominator; ни одна incomplete карточка не называется complete.

### Wave 6 — canonical binding и маршрутизация

**Цель:** убрать все придуманные ссылки.

1. Создать server-owned `LearningActionProjection`:
   - theory route;
   - task-family route;
   - selected revision route;
   - preview route;
   - progress/repeat route;
   - reason when unavailable.
2. Удалить hard-coded Event Loop CTA из QuestionDetail и Lesson.
3. Question relations endpoint публикует task-family binding только если accepted/released.
4. Canonicalize aliases через redirect; выбрать единственные `/questions`, `/practice/lab/:id`, `/learning-map` либо иной договор.
5. Исправить `/studio/recovery` → canonical `/studio/system/recovery`; Atlas rail обязан иметь active state на `/paths*`.
6. Published action crawler обязан различать `runnable`, `preview`, `locked`, `unavailable`; `API contract validation failed` запрещён для action с label `Открыть лабораторию`.
7. Deep-link tests для каждого route, locale и state.
8. Current-session cross-domain resume должен иметь label `Продолжить незавершённое из <domain>` и действие `Вернуться к текущему path`.

**Gate W6:** crawler проходит все server-projected href; 0 404/recovery для published action; 0 unrelated task CTA; aliases дают canonical redirect.

### Wave 7 — TaskFamily → language → workspace UX

**Цель:** выбор языка виден там, где он имеет смысл.

1. На Question/Lesson/Practice показывать:
   - family title;
   - released language revisions;
   - runtime/toolchain;
   - runnable/pending reason;
   - selected revision persisted in URL.
2. Единственная revision открывается прямо, но UI всё равно сообщает язык/runtime и ссылку `Другие реализации`, если family расширится.
3. Multi-revision family всегда проходит TaskFamily selector.
4. Path stations обязаны показывать `native/shared/prerequisite/future` и причину появления в выбранном path; Python не обещает runnable runtime до реального Python profile.
5. Counts берутся из released/runnable projection: 15/19 на текущем snapshot, а не из raw 16/20 inventory.
6. Workspace editor mode/file extensions соответствуют JS/TS/Go/Java/C#/SQL.
7. Workspace controller принимает exact selected revision; никакого silent latest fallback.
8. Run request включает family/revision/hash/profile/runtime; API отклоняет несовместимую подмену query params и возвращает ту же identity.
9. Evidence сохраняет exact revision + image digest.

**Gate W7:** Rate Limiter проходит JS/TS/Go/Java/C# отдельно; PostgreSQL family не смешивается с code family; Node-only task не обещает другие языки.

### Wave 8 — UI system, i18n и accessibility

**Цель:** polish следует за truth, а не маскирует его.

1. Оставить design tokens единственным источником цвета/spacing/type/elevation/motion.
2. Сформировать reusable primitives поверх Reka UI: app rail, topbar, command palette, docked inspector, state card, metric strip, filter bar, data list, runtime picker, canonical dialog/popover.
3. Решить Tailwind policy:
   - либо использовать Tailwind только как token-aware layout utilities и запретить arbitrary colors;
   - либо удалить его как неиспользуемую зависимость;
   - не держать «установлен, но архитектурно не используется».
4. Полный RU/EN dictionary; никаких raw enum/English labels в RU без осознанного термина.
5. Liquid Glass применять только к functional/navigation layer; content cards — stable standard material.
6. State matrix: light/dark/system, increased contrast, reduced transparency, reduced motion, 200% zoom.
7. Accessibility:
   - ровно один top-level `<main>` и один h1, последовательные headings;
   - native button/link semantics;
   - focus visible/not obscured;
   - correct tab/roving tabindex;
   - `aria-current` для Atlas на `/learning-map`, `/paths` и path projections;
   - ≥24×24 WCAG AA minimum, целевой 44×44 для частых controls;
   - dialog focus trap/return;
   - keyboard route graph alternative list.
8. Visual targets: MacBook Pro 16 `1728×1117` и Studio Display `2560×1440`; mobile — отдельный declared scope, не случайный полурабочий режим.

**Gate W8:** axe + keyboard journeys + screenshot diff проходят для всех routes/states; RU/EN не меняет geometry критически; no overlap/clip/horizontal body overflow.

### Wave 9 — performance и repository hygiene

**Цель:** продукт остаётся быстрым и поддерживаемым.

1. Lazy-load CodeMirror/xterm только на workspace; подтвердить network trace.
2. Virtualize question/path lists, когда DOM nodes превышают установленный threshold.
3. Ввести budgets: initial JS/CSS, per-route chunks, interaction latency, list render time.
4. Удалить unused dependencies после bundle analysis.
5. Перенести bulky traces/zips в bounded artifact storage или Git LFS; в Git оставить manifest, checksum, summary и необходимые screenshots.
6. Retention: latest baseline + failure artifacts + explicitly promoted evidence; остальное expires.
7. Nx/ESLint deprecation и NO_COLOR/FORCE_COLOR warning исправить отдельным maintenance commit.

**Gate W9:** fresh clone существенно меньше; CI artifacts сохраняются ограниченно; initial route не загружает xterm; performance budgets fail build при регрессии.

### Wave 10 — observability и learner analytics

**Цель:** понимать не только uptime, но и где обучение ломается.

1. Единые OpenTelemetry resource attributes: service name, version, instance, deployment environment, source revision, release IDs.
2. Correlation chain: route → question → family → revision → attempt → AI conversation, без записи private answer/hidden tests.
3. Metrics:
   - route/API errors;
   - unavailable/false CTA count;
   - question reveal/help frequency;
   - failed-run reasons;
   - time-to-first-run/explanation;
   - learning readiness funnel;
   - AI latency/cancel/error and model/provider;
   - semantic gate violations.
4. Grafana dashboard и trace explorer должны открываться из Studio diagnostics с honest availability.
5. Synthetic journey выполняется под test profile и не загрязняет Sergey progress.

**Gate W10:** один journey виден end-to-end по correlation ID; PII/private code отсутствуют в telemetry; offline observability dependency не выдаётся за online.

### Wave 11 — full product closure

1. Fresh clone/bootstrap на чистой машине.
2. Clean dev start, exclusive package start, restart, rollback, down, prune plan.
3. Route matrix всех published links.
4. Golden journeys:
   - theory question without task;
   - Node Event Loop controlled lab;
   - Rate Limiter multi-language family;
   - PostgreSQL workspace;
   - locked preview;
   - explanation + cold repeat;
   - AI help/cancel/retry;
   - failure recovery;
   - project book checkpoint.
5. Light/dark/RU/EN/desktop matrix.
6. Backup/restore and release rollback.
7. Independent reviewer returns PASS with 0 P0/P1.

**Gate W11:** только после этого status может называться `RELEASED`.

---

## 8. Обязательные guards для агента

1. **Не удалять данные ради зелёного gate.** Никаких `docker system prune`, `volume prune`, `git reset --hard`.
2. **Не ослаблять tests/acceptance.** Исправляется продукт или явно пересматривается контракт отдельным ADR.
3. **Один owner — один commit.** Cross-repo change = серия согласованных commits + compatibility manifest update.
4. **Не коммитить поверх неизвестного dirty state.** Перед каждой волной зафиксировать user-owned changes и scope diff.
5. **Никаких UI fallbacks, выдумывающих truth.** Отсутствующий binding = explicit unavailable state.
6. **Никаких mutable runtime inputs.** Release references только immutable SHA/digest.
7. **No hidden tests/private answer in browser, logs, traces или AI prompt.**
8. **Каждый migration reversible.** Dry-run, count before/after, backup reference, rollback command.
9. **Каждый новый label локализован.** Stable key + RU/EN, no label-as-ID.
10. **Каждый route имеет owner и canonical URL.** Alias только redirect.
11. **Visual change требует evidence.** До/после на обоих desktop viewports, light/dark, RU/EN.
12. **Cleanup только owned resources.** Label + manifest + preview + bounded retention.
13. **Не пушить automatically без явного запроса пользователя.** Подготовить commits и отчёт.

## 9. Минимальный root verify contract

Следующий агент должен реализовать эквивалент:

```bash
pnpm bootstrap --frozen
pnpm layout:check --strict
pnpm verify:git
pnpm verify:contracts
pnpm verify:brain
pnpm verify:runtime
pnpm verify:lab
pnpm verify:vue
pnpm verify:semantic-graph
pnpm verify:docker-provenance
pnpm verify:routes
pnpm verify:accessibility
pnpm verify:visual
pnpm verify:hardening
pnpm release:verify
```

Каждая команда обязана:

- завершаться non-zero при дефекте;
- печатать machine-readable artifact;
- содержать source/release revisions;
- не мутировать learner data в `--check` режиме;
- иметь bounded timeout;
- отделять warning от release-blocking failure.

## 10. Route test matrix

### Фактически пройденный browser baseline

- В router зарегистрирован 31 route record, включая catch-all.
- Собрано 194 уникальных внутренних href; 194/194 достигли Vue route или осознанного error/loading state.
- 193/194 после короткого ожидания имели h1 либо валидный async state; один question route оставался во временном loading state.
- Проверены 1728×1117 light/dark и 1280×800 narrow desktop.
- Проверены shell navigation, RU/EN, theme, Program selection, Search, AI settings, Navigator dock, Escape/close и focus return.
- Console после route batches: 0 persistent errors / 0 warnings.
- Run/submit/reveal не запускались в read-only аудите; их покрывает обязательный acceptance gate W11.
- Advertised Workspace failures перечислены в P1-15 и считаются product defects, даже если error state отрисован корректно.

Для каждого canonical route проверить `direct`, `reload`, `back/forward`, rail active state, `⌘K`, `⌘J`, theme/locale persistence, scroll restoration, error/retry и keyboard focus.

| Surface | Обязательные состояния |
|---|---|
| Program | loading, ready, cross-domain resume, API unavailable |
| Atlas | all paths, selected node, locked, empty search, keyboard alternative |
| Path | Node, Go, Java, .NET, Frontend, System Design; correct questions/tasks only |
| Practice | mode/capability filters, runnable, preview, repeat, empty |
| Questions | 1 591 pagination/search/filter, incomplete, relation graph, no task binding |
| Question | reference closed/open, RU/EN, related links, task family/no task |
| Lesson | published/partial/unpublished, correct practice/no practice |
| TaskFamily | one language, five languages, pending revision, invalid family |
| Workspace | JS, TS, Go, Java, C#, SQL; pass/fail/error/retry/history |
| Event Loop | six challenges, invalid prediction, run, trace, explanation |
| Progress/Journal | empty, attempt, explanation, repeat due |
| Projects | preview, reader, checkpoint run, defense, missing book |
| Studio | content/graph/review/system/observability/recovery permissions |
| AI companion | provider offline/loading/stream/cancel/error/history/context |

## 11. Definition of done

Платформа считается готовой к прохождению, только если одновременно истинно:

- clean clone полностью воспроизводит workspace;
- все repos remote-backed и exact revisions закреплены;
- aggregate CI зелёный и включает hardening;
- running containers совпадают с pinned digests и source revisions;
- semantic gate находит ноль unexplained placement violations;
- 0 broken/false published actions;
- question/lesson task CTA строятся только по accepted binding;
- multi-language family действительно выбирает и исполняет каждую released revision;
- published, learning-ready, runnable и mastered не смешиваются;
- Grafana/trace links честно отражают availability;
- 0 P0/P1 a11y/UX findings на target desktop matrix;
- backup/restore/rollback доказаны;
- independent closure review подтверждает evidence, а не только галочки плана.

## 12. Источники и принципы

- Apple HIG Materials: Liquid Glass — отдельный functional layer; content layer не должен превращаться в стекло: https://developer.apple.com/design/human-interface-guidelines/materials
- Apple WWDC26 Design guide: consistency, readability, accessibility и adaptation across devices: https://developer.apple.com/wwdc26/guides/design/
- Vue Performance: route lazy loading, bundle measurement, virtualization больших списков: https://vuejs.org/guide/best-practices/performance.html
- Vue Accessibility: semantic structure и последовательные headings: https://vuejs.org/guide/best-practices/accessibility.html
- W3C WCAG 2.2: focus not obscured, focus appearance, dragging alternatives, target size: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Docker Compose trust model: mutable tags должны заменяться digest pins: https://docs.docker.com/compose/trust-model/
- Docker production Compose guidance: production-specific configuration и controlled recreation: https://docs.docker.com/compose/how-tos/production/
- W3C SKOS: stable concept IDs, preferred/alternate labels, broader/narrower relations: https://www.w3.org/TR/skos-reference/
- W3C SHACL: graph validation через reusable shapes и machine-readable validation reports: https://www.w3.org/TR/shacl/
- OpenTelemetry service semantic conventions: service identity/version/instance attributes: https://opentelemetry.io/docs/specs/semconv/resource/service/

---

## 13. Рекомендуемый первый PR sequence

1. `umbrella: make workspace cloneable and revision-pinned`
2. `vue: publish repository and establish CI baseline`
3. `lab: replace stale CI and aggregate real release gates`
4. `runtime: pin task images and verify executed digests`
5. `workspace: enforce source/image provenance and exclusive profiles`
6. `brain: add semantic placement shapes and taxonomy migration`
7. `lab: publish canonical learning-action bindings`
8. `vue: remove hard-coded routes and unify family/runtime flow`
9. `vue: consolidate primitives, i18n, a11y and visual matrix`
10. `workspace: close observability, performance, retention and fresh-clone gates`

Первые четыре PR — release integrity. Начинать с визуальных правок до их закрытия запрещено: иначе получится ещё один красивый, но невоспроизводимый snapshot.

---

## 14. Wave 5 — непрерывная проверка learner-поверхности (2026-08-27)

Эта запись дополняет baseline выше. Она фиксирует фактический working-tree
результат после перевода browser surface на Vue и подключения published
ordering-сценария; старые baseline-цифры намеренно не переписываются задним
числом.

Активными инструкциями считаются umbrella README, `fluent-engineering-lab/README.md`,
этот документ и `docs/production/MASTER-PLAN.md`; исторические evidence-файлы
сохраняют исходные Angular-команды как audit trail и не являются текущим
запуском приложения.

### Что исправлено в этой волне

- `scripts/accessibility-smoke.mjs` больше не ждёт удалённые Angular-классы и
  не считает `html { overflow: hidden }` поломкой. Проверяется реальный
  `main.fel-main` как единственный scroll owner, актуальные Vue surfaces,
  heading, labels и отсутствие горизонтального overflow.
- `scripts/desktop-regression-guard.mjs` анализирует Vue Vite artifact
  (`../fluent-engineering-vue/dist/apps/web`), фиксирует `index-*.js/css` как
  initial payload и находит реальные `route-graph__station`, `map-node` и
  `progress-view` markers. Старый путь `dist/apps/web/browser` удалён из
  acceptance logic.
- `scripts/desktop-visual-baseline.mjs` использует семантические Vue rows,
  измеряет реальные text selectors для Program/Map/Progress, проверяет 12
  состояний (MacBook Pro 16 и Studio Display × light/dark) и сохраняет свежий
  `G5-02.06-desktop-matrix.json`.
- Карта получила минимальный размер readable metadata 12px (`.map-node small`)
  без уменьшения основного контента; visual gate больше не путает eyebrow с
  пользовательским текстом.
- Возвращён отсутствовавший read-only `scripts/question-card-parser.mjs`.
  `question-inventory:smoke` снова проходит; parser читает только authored
  preamble, сохраняет source hash и не выводит inferred values в источник.
- G5 operational command list исправлен с несуществующего
  `question:coverage:smoke` на канонический `question-inventory:smoke`.
- G9 Vue deviation gate синхронизирован с локализованным shell label
  (`:aria-label="shellCopy.navigation"` + stable workspace nav landmark).
- Runtime `verifyImageDigest` исправлен: четыре error-ветки теперь возвращают
  типизированный `error`, а не `string`; это устранило Go compile blocker.

### Evidence после волны

Полный журнал команд и ссылок на воспроизводимые артефакты сохранён в
[`G5-02.06-wave-2026-08-27.md`](../fluent-engineering-lab/docs/production/evidence/G5-02.06-wave-2026-08-27.md).

| Проверка | Результат |
|---|---|
| Vue E2E | **72/72 passed**, 2 workers, MacBook light + Studio dark; includes stale deep-links, path-scoped questions, locale switching, canonical ordering aliases, and global-English core/secondary learner/project surfaces |
| Vue `pnpm check` | typecheck PASS; ESLint **0 errors / 0 warnings** after template formatting cleanup; Vitest **11/11**; Vite build PASS (TypeScript 6 compatibility notice from `@typescript-eslint` remains non-fatal) |
| Vue production build | 37 browser JS chunks; xterm 331 KB; build завершён успешно |
| Lab `pnpm check` | curriculum drift valid; 247 suites / 1,255 tests; learning-api 167 passed + 1 intentional skip / 727 passed; observability 7 suites / 39 tests; builds PASS |
| Accessibility smoke | 10 canonical routes, `main/auto`, 0 horizontal overflow, 0 unlabeled controls — PASS |
| Desktop visual baseline | 12 states, 0 diagnostics, 0 overflow, Map 81/81 rows, readable floor ≥12px — PASS |
| Desktop regression performance guard | initial 257,023 bytes; largest lazy 331,270 bytes; 37 chunks; route markers present — PASS |
| Semantic placement | 1,591 unique cards; 0 violations; 3 alias warnings — PASS |
| G12 coverage | 1,591 classified; 0 unclassified questions/topics; 19 runnable revisions — PASS |
| G12 practice disposition | 15 domains; 8 runnable, 3 recall-only, 3 brief-only, 1 deferred; 0 hidden runnable domains — PASS |
| G13 boundary | 17 checks — PASS |
| G9 Vue deviations | 12 checks — PASS |
| Practice health | valid; 4 negative cases — PASS |
| Curriculum smoke | 81 manifest labs — PASS |
| Question inventory smoke | duplicate-ID and missing-field fixture — PASS |
| G5 operational finish | 12 desktop states, 24 canonical modules, 37 browser chunks — PASS |
| Runtime Go verification | `go test ./...` и `go vet ./...` в read-only `golang:1.24` container — PASS |
| Vue locale/a11y slice | Core + secondary route-owned chrome (Projects, Studio, onboarding, progress/journal, failure states, question detail, project readers, recovery) follows global RU/EN preference; server-authored content remains projection-owned; English route smoke — PASS |
| Package provenance/G14 | component provenance is now recorded for Lab/Vue/Runtime/Question Brain/Question Vault; package/G14 intentionally **not green** because `package:local` fail-closes on dirty source (`package.dirty-source`) and still needs a clean reviewed boundary |

### Текущий честный статус

Learner dev-профиль теперь проверен end-to-end: published Program/Atlas/Practice,
Question Brain projections, Event Loop, multi-file Workspace, Ordering Lab,
systems scenario, AI outage/retry, themes and scroll all имеют working browser
evidence. Published Docker ordering has a server-issued public source, a
Konspekt and a strict `ordering.v1` submission path; draft ordering routes fail
closed with a scoped unavailable state. Systems scenarios now satisfy the total
public `LabSchema` with an explicit `plaintext` language.

Это закрывает P0-03 (полный component provenance), но не P0-01/P0-02/P0-04 и
не production-package promotion. В working tree остаются изменения в нескольких
child Git roots, Vue всё ещё не имеет remote, а production package требует clean
reviewed revision. Поэтому `G14` нельзя
пометить зелёным на основании dev API; для его закрытия нужна отдельная
зафиксированная release boundary и package run на портах 49300/49301.

### Следующий автономный порядок

1. Зафиксировать текущие child-root изменения в отдельных review commits только
   после явного запроса на commit/push; до этого не переписывать user-owned
   history.
2. Поднять clean package boundary на чистой ревизии и повторить G14, включая
   Prometheus targets, Jaeger continuity, SLO и recovery evidence.
3. Добавить Vue remote/revision pins в umbrella и fresh-clone check; component
   provenance уже является fail-closed на runtime boundary, но не заменяет
   удалённый immutable release pin.
4. Затем продолжить content editorial queue: 3 alias warnings, 602 неполных
   learning layers и 1,572 theory-only cards — это очередь качества контента,
   а не повод объявлять их runnable.
5. Сохранять EN/RU smoke для каждой surface-группы при добавлении новых routes;
   отдельно планировать перевод server-owned content, не смешивая его с
   локальным UI-контрактом.

## 15. Wave 6 — release-aware deep-link hardening (2026-08-27)

Эта волна закрывает дефекты, найденные только полным рекурсивным обходом
живого приложения, а не коротким smoke-набором. Изменения остаются в dirty
working tree и не являются commit/push или production promotion.

### Исправлено

- Убрана ложная готовность `lessonReady` для концептов без опубликованного
  материала. Concept теперь считается lesson-ready только при `hasTheory` или
  непустом `contentIds`; эти правила одинаковы в Lab contracts, Program,
  Progress, Topic Workspace и readiness diagnostics.
- `LessonView` сначала сверяет released Program map. Для концептов без
  `hasTheory` он показывает явный `Конспект недоступен`/`Lesson unavailable` и
  не делает ожидаемый 404-запрос в content endpoint.
- `QuestionDetailView` сначала выполняет безопасный поиск в released Question
  Brain projection, резолвит legacy `Q1062` в `question.q1062`, а для
  неопубликованных IDs показывает `Карточка ещё не опубликована` без каскада
  404. Error/pending состояния содержат настоящий `h1` и recovery action.
- SQL lab projection теперь передаёт полный runtime/profile/language contract;
  опубликованный ordering source сообщает `published`, поэтому draft не
  открывается как сломанный workspace.
- G9 deviation guard больше не зависит от старых статических русских ARIA
  строк: он проверяет динамический RU/EN shell и graph bindings, включая обе
  локализованные source values.
- E2E assertion для вопросной библиотеки зафиксирован на явной EN locale, а не
  на случайном persisted default.
- Runtime picker получает locale-aware labels для pending/empty options, а
  Question detail показывает локализованное название связанной TaskFamily
  вместо принудительного RU fallback.

### Доказательства

- Lab `pnpm check`: **247 suites / 1,255 tests passed** (1 intentional skip),
  learning-api 167 suites / 727 passed, observability 7 / 39; drift, lint и
  builds PASS.
- Vue `pnpm check`: typecheck, lint 0 errors, 11 Vitest, Vite build PASS.
- Vue E2E: **72/72 passed** на MacBook Pro 16 Light и Studio Display Dark;
  добавлены stale lesson/question, path-scoped library, language-switch и
  canonical-ordering assertions.
- Полный Playwright crawl: **466/466 same-origin routes в каждом профиле**
  (932 route visits), очередь 0, HTTP 200, meaningful heading,
  console/request errors и horizontal overflow — везде 0. Полный отчёт:
  `fluent-engineering-lab/docs/production/evidence/G5-02.06-full-crawl-2026-08-27.md`.
- Live gates: route audit 81/81, a11y 10 routes, desktop visual 12 states,
  performance guard 37 chunks / 257,023 initial bytes, semantic placement 0
  violations, G9/G13 PASS; Go test и vet PASS.

### Остаточная граница

`pnpm package:local` по-прежнему обязан завершаться `package.dirty-source`,
пока child repositories не прошли отдельный reviewed commit. Поэтому G14,
packaged readiness, Prometheus/Jaeger continuity и production SLO не объявлены
зелёными на основании dev-профиля. Контентная очередь (3 alias warnings,
602 incomplete layers, 1,572 theory-only cards) также остаётся editorial work,
а не скрыто runnable.

## 16. Wave 7 — multi-repository package provenance (2026-08-27)

Production packaging больше не считает Lab единственным источником истины. Перед
`package:local` и `package:local:plan` читается единый provenance tuple пяти
shipped Git roots:

| Component | Что фиксируется |
|---|---|
| Lab | commit revision, clean/dirty, Git tree digest |
| Vue learner | commit revision, clean/dirty, Git tree digest |
| Task Runtime | commit revision, clean/dirty, Git tree digest |
| Question Brain | commit revision, clean/dirty, Git tree digest |
| Question Vault | commit revision, clean/dirty, Git tree digest |

`install-manifest.json`, `state.json` и `last-known-good.json` сохраняют этот
набор без абсолютных путей или секретов. `sourceClean` теперь true только при
чистом состоянии всех пяти roots; ownership и rollback отвергают boundary с
изменённым Vue/runtime/content tree. Это закрывает риск, при котором два
package с одинаковым Lab SHA могли содержать разный learner UI.

Проверки W7: package contract/lifecycle tests, полный Vue E2E **72/72**, Lab
**247 suites / 1,255 tests**, route/a11y/visual/performance/G9/G12/G13 и
двухпрофильный crawl **932/932 routes** — PASS. Production package всё ещё
fail-closed на текущем dirty handoff; следующий шаг — reviewed commits и
immutable remote pins, после чего повторить G14.

## 17. Wave 8 — executable workspace release verification (2026-08-27)

Чтобы план не оставался только списком команд, umbrella получил два явных
режима проверки:

| Command | Назначение | Promotion |
|---|---|---|
| `pnpm verify:git:dev` | read-only Git/topology snapshot; local-only, dirty tree и vault review branch видны как warnings | нет |
| `pnpm release:verify:dev` | live readiness + Lab/Vue checks + route/semantic/G12/G13/G9/a11y/visual/regression + 2-profile E2E | нет |
| `pnpm release:verify` | тот же fail-closed contract с clean five-repository pins; packaged readiness и G14 запускаются только после успешного package plan | да, если все шаги PASS |

Восьмая волна закрывает предыдущий разрыв, когда документация уже ссылалась
на `release:verify`, но команды не существовало. В `--dev` режиме получен
реальный результат **PASS**: workspace contract, topology, immutable task
image manifest, 5 diff checks, Brain/Runtime/Lab readiness, Lab route audit,
G12 coverage/disposition, semantic placement, G13/G9, accessibility, desktop
visual/regression, Lab quality и Vue E2E. Vue E2E — **72/72**, route audit —
**81/81**, desktop baseline — 12 states, полнота deep-link crawl сохраняется
на уровне **466/466 в каждом профиле**.

Строгий режим специально остаётся красным на текущем snapshot: `package:local`
видит dirty/unpinned source, а Vue не имеет remote. Это теперь один явный
machine-readable blocker (`workspace-git-audit.v1` + `release-verify.v1`), а не
скрытая ручная предпосылка. Сгенерированный dev-отчёт:
`docs/verification/release-verify-dev-2026-08-27.json`.

В owner-CI добавлены независимые workflows для Vue и Task Runtime: Vue
проверяет frozen install, typecheck/lint/unit/build на Node 26 + pnpm 11;
Runtime проверяет gofmt/test/vet, immutable task-image manifest и Compose
config. Они не зависят от sibling-путей umbrella. Полный агрегированный
production workflow всё ещё не может стать зелёным до появления remote для
Vue и immutable pins всех пяти roots — это остаётся P0-01/P0-02 boundary.

Отдельная maintenance-волна 2026-08-27 устранила весь накопленный Vue
template-lint шум механическим форматированием (ESLint **0 warnings**) и
обновила совместимый toolchain: `typescript-eslint 8.68.0`, ESLint `10.9.1`,
`@eslint/js 10.0.1`, `eslint-plugin-vue 10.10.0`,
`vue-eslint-parser 10.4.1`, `@vitejs/plugin-vue 6.0.8`. `pnpm peers check`
теперь не сообщает peer-конфликтов; typecheck/unit/build и 72 E2E повторены
после обновления.

Строгий gate повторён после этой волны: [`release-verify-strict-2026-08-27.md`](verification/release-verify-strict-2026-08-27.md).
Он остановился fail-closed на `workspace-git` и `package-provenance-plan`,
после чего всё равно подтвердил Lab/Vue quality. Packaged readiness и G14
намеренно не запускались, пока child roots не будут отдельно reviewed и
зафиксированы.
