# Fluent Interview — план доведения от банка вопросов до настоящего mastery

**Статус:** `AUTHORITATIVE / READY FOR EXECUTION`  
**Редакция:** `v2` — учтён аудит плана от 2026-08-25
**Дата baseline:** 2026-08-25  
**Рабочая область:** `/Users/sergeyzhechko/developer/fluent-interview`  
**Текущий гейт:** `M3`
**Текущий результат:** `NOT RELEASED`  
**Основание:** [`pre-release-product-audit-2026-08-25/report.html`](reports/pre-release-product-audit-2026-08-25/report.html)

Этот документ — единая активная очередь работ по превращению текущего Fluent
Interview в продукт исходного Plan 2026:

```text
Recall → Predict → Build → Run → Break → Observe
→ Explain → Evidence → Journal → Cold repeat → Mastery
```

На время выполнения этого плана старые `RELEASED`-статусы, фазовые планы и
датированные отчёты считаются исторической evidence, а не доказательством
готовности. Они не исполняются параллельно. Полезные требования из них уже
включены ниже.

### Что исправлено после аудита плана

- `16 active canonical capabilities / 19 bindings` теперь разделены явно;
- Runtime manifest назначен источником истины для `15 total / 14 released /
  20 revisions / 19 runnable`, а старые Lab `14/24` требуют stale/reissue
  disposition;
- `PlanArea` определён как acceptance view, а `CoverageManifest` обязан
  раскрывать mapping с 24 модулями, 15 доменами и canonical capabilities;
- operational cleanup, fresh-image/rebuild и profile-aware API endpoints
  перенесены в M0;
- Review Workbench возвращён в M6 как обязательный human-review seam;
- Aspire/AppHost, Collector, shared Jaeger и Docker lifecycle явно включены в
  M10, а `56686` зафиксирован как один shared Trace Explorer;
- digest pinning и threat model обязательны для Runtime, а gVisor, FSRS,
  Open Badges и xAPI оставлены отдельными upgrade/export paths.

---

## Handoff агенту — можно копировать целиком

> Работай в `/Users/sergeyzhechko/developer/fluent-interview` и исполняй
> `docs/CAPABILITY-MASTERY-PRODUCTION-CLOSURE-PLAN-2026-08-25.md` строго по
> гейтам `M0 → M13`. Нельзя начинать реализацию следующего гейта, пока текущий
> не прошёл автоматические проверки, реальную Browser-проверку, независимый
> review и не получил доказательства, указанные в таблице прогресса.
>
> Сначала прочитай root и три repository `AGENTS.md`, затем сделай recovery
> snapshot и выполни M0. Не создавай новые QuestionCard. Разрешены исправление,
> перевод, enrichment, binding и классификация существующих 1 591 карточек.
> Новые TaskFamily разрешены только как минимальное исполняемое доказательство
> capability из 12 acceptance-областей; эти области берутся из
> `CoverageManifest` и не становятся новой Brain taxonomy.
>
> Не создавай fallback, shadow catalogue, локальную копию вопросов, browser-side
> verdict, fake pass или автоматически выданный mastery. Question Brain,
> Task Runtime и Fluent Lab остаются независимыми владельцами данных. Root —
> оркестратор, а не четвёртый source of truth.
>
> Коммить небольшими проверенными изменениями в `main` соответствующего
> репозитория и push после зелёного gate proof. Cross-repository release bundle
> фиксируй последним root-коммитом. Нельзя закрывать гейт скриншотом, обещанием,
> skipped test, увеличением performance budget или тестовыми evidence в профиле
> Sergey.
>
> Если реальный cold repeat требует 48–72 часа, не перематывай время профиля
> Sergey. Заверши техническую часть, поставь статус `WAITING_HUMAN`, сохрани
> due time и продолжи после настоящего человеческого повторения. Тестовые часы
> разрешены только изолированному E2E-профилю.

---

## 1. Решение в одном абзаце

Не нужно переписывать продукт и не нужно добавлять ещё вопросы. Уже построены
правильные владельцы: Question Brain хранит знания, Task Runtime исполняет
задачи, Fluent Lab ведёт обучение. Нужно заменить разрозненные «готово»,
`locked`, `Run-ready` и исторические evidence одним строгим контрактом
`CapabilityDossier`, пройти одну capability rate limiter от закрытого ответа до
реального холодного повтора, а затем масштабировать доказанный шаблон на
существующий корпус и 12 acceptance-областей (это reporting view, а не новая
таксономическая сущность). Визуальная система Cameo /
Executable Trace Atlas сохраняется; переделываются информационная архитектура,
честность действий и полнота learner loop, а не художественное направление.

---

## 2. Почему текущую версию нельзя считать реализацией исходной идеи

Baseline на 25 августа 2026:

| Факт | Значение | Что он доказывает |
| --- | ---: | --- |
| Published QuestionCard | 1 591 | большой поисковый корпус, не mastery |
| Ready-to-learn по текущему UI | 989 | исторический UI counter; не является server-owned метрикой до M4 |
| Paths | 9 | именованные views, а не количество тем |
| Areas / stations | 15 / 81 | learner projection, а не число вопросов; Plan areas — отдельная acceptance view |
| Brain capabilities / bindings | 16 active canonical / 19 bindings | 11 deprecated aliases сохраняются только для истории; 19 — не число capabilities |
| Lab capabilities / placements | 68 / 81 | learner projection, не второй registry capabilities |
| Task families / revisions | 15 operator families / 14 learner-visible families; 20 Runtime descriptors / 19 learner-visible revisions | canonical source — Runtime `task-family-release-2026-08-25`; capability-only `project-book-boundary-001` stays out of Practice until runnable |
| Runtime revisions runnable | 19 | одна release-запись противоречива |
| Server-owned runnable stations | 1 | реальная readiness намного ниже UI promises |
| Обещанные executable routes | 66 | список для обязательного crawl |
| Working / no Run / broken | 25 / 2 / 39 | P0 truth gap |
| Explanations / mastered | 0 / 0 | learner loop не замкнут |
| Plan areas с пятью proofs | 0 из 12 | исходная цель ещё не достигнута |

`0 из 12` не означает отсутствие материалов. Это означает, что ни одна
acceptance-область (агрегация существующих capabilities, а не новая taxonomy)
не
ещё не имеет одновременно:

1. полного learning content;
2. deterministic practice;
3. принятого объяснения 60–90 секунд;
4. закрытой reflection/error-journal записи;
5. реального холодного повтора через 2–3 дня.

---

## 3. Каноническая модель — термины больше нельзя смешивать

### 3.1 Две независимые плоскости

```text
PRODUCT READINESS
Есть ли у продукта полный и исправный способ изучить capability?

LEARNER MASTERY
Прошёл ли конкретный человек этот способ и удержал ли навык?
```

Запрещено выводить один общий процент из количества карточек, станций, задач и
попыток.

### 3.2 Сущности и владельцы

| Термин | Точное значение | Владелец |
| --- | --- | --- |
| `Program` | целевая профессия, сейчас `Backend Engineer` | Lab |
| `Path` | рекомендуемая проекция программы: Node.js + TS, Java + Spring и т. д. | Lab |
| `SharedDomain` | Runtime, HTTP/API, Data/PostgreSQL, Distributed Systems и т. д. | Brain taxonomy |
| `PlanArea` | acceptance/reporting-группа capabilities для проверки полноты Plan 2026; не learner taxonomy | Lab projection / root manifest |
| `Capability` | маленький наблюдаемый навык, который можно доказать | Brain registry |
| `Station` | learner-facing placement capability внутри released path | Lab |
| `QuestionCardRevision` | immutable локализованная редакция вопроса | Brain |
| `QuestionCapabilityBinding` | reviewed связь карточки с capability и её ролью | Brain |
| `TaskFamily` | языконезависимая цель практики | Runtime |
| `TaskRevision` | immutable исполняемая версия для одного language/profile | Runtime |
| `CapabilityAssessmentPlan` | какие task/rubric criteria доказывают capability | Runtime contract |
| `CapabilityDossier` | Lab-композиция content + practice + evidence + readiness | Lab projection |
| `LearningSession` | одна человеческая попытка полного цикла | Lab |
| `Run` | один sandbox-запуск точной TaskRevision | Runtime |
| `EvidenceBundle` | append-only факты человеческой сессии | Lab |
| `SessionReflection` | expected/actual, ошибка, помощь, исправление, следующий шаг | Lab |
| `ColdRepeatAssignment` | отложенный changed-context repeat | Lab scheduler |
| `MasteryClaim` | вычисляемый сервером результат; никогда не browser boolean | Lab evaluator |
| `WeeklyRetro` | агрегация failure ledger и одно изменение следующей недели | Lab |
| `CapabilityRegistryRelease` | immutable active/deprecated registry snapshot | Brain |
| `TaskCatalogRelease` | immutable task-family/revision snapshot; единственный runtime count source | Runtime |
| `OperationalResource` | shared Trace Explorer, Collector, Compose/AppHost resource с owner и lifecycle | workspace |

`Station` не владеет вопросом или capability. `TaskBrief` не становится вторым
источником задачи: это learner-facing проекция released `TaskFamily` и
`TaskRevision`.

Короткая машинно-читаемая версия этого glossary и ownership-матрица живут в
[`docs/contracts/fluent-interview-glossary.v1.md`](contracts/fluent-interview-glossary.v1.md)
и [`docs/contracts/source-of-truth-matrix.v1.md`](contracts/source-of-truth-matrix.v1.md).
Они не вводят новые доменные сущности; это стабильная ссылка для агентов и
ревьюеров.

### 3.4 Source-of-truth matrix и reporting views

В M0 агент обязан сохранить машинно-читаемую матрицу источников истины:

| Что считаем | Канонический источник | Допустимый consumer projection |
| --- | --- | --- |
| active canonical capabilities, aliases | Brain `CapabilityRegistryRelease` | Lab inventory и stations |
| question bindings и их роли | Brain `QuestionCapabilityBindingRelease` | Lab dossier |
| task families, revisions, availability | Runtime `TaskCatalogRelease` | Lab practice catalog |
| learner stations и paths | Lab released projection | Web/UI |
| 12 Plan areas | root/Lab `CoverageManifest` mapping capabilities → acceptance area | отчёты и counters |
| shared traces и service health | workspace operational contract | Lab Studio / Control Center |

`24 modules`, `15 current domains`, `12 Plan areas`, `9 paths` и `81 stations`
не могут независимо объявлять один и тот же навык. `PlanArea` не получает
собственный ID в Brain и не становится причиной новой карточки; это проверяемая
группировка для coverage и release acceptance.

### 3.3 QuestionCard roles

Не все 1 591 карточки должны превращаться в одинаковые длинные уроки. Binding
получает одну роль:

| Role | Обязательные слои |
| --- | --- |
| `primary` | prompt, short answer, mechanism, RU understanding, traps, terms, follow-ups с ответами, practice handoff, provenance |
| `prerequisite` | prompt, answer, mechanism, prerequisite capability |
| `recall` | prompt, reference answer, must-say terms |
| `contrast` | сравнение, границы и traps |
| `follow_up` | вопрос, ответ и связь с primary |
| `reference` | reviewed comparison, retrieval proof и placement без fake lab |

Наличие locale-row не означает перевод. Prompt никогда не подставляется вместо
отсутствующего short answer.

---

## 4. Три state machine вместо одного слова «готово»

### 4.1 Product readiness: `CapabilityDossier`

```text
unmodeled
  → content-ready
  → assessment-ready
  → route-released
  → practice-ready

любой этап → stale | quarantined | unavailable
```

`practice-ready` разрешён только если одновременно:

- capability active в current registry release;
- есть минимум одна полная `primary` карточка;
- locale quality core pack полная;
- card/binding revision hashes актуальны;
- assessment plan покрыт released TaskFamily;
- существует runnable TaskRevision для выбранного Path/profile;
- repeat variant/context объявлен;
- точный learner URL открывается;
- Runtime принимает точную revision;
- cross-service release join не противоречив.

`lesson-ready` не означает `practice-ready`; `brief_only` не означает runnable.

### 4.2 Human `LearningSession`

```text
not-started
  → recall-submitted
  → reference-revealed
  → task-selected
  → prediction-recorded
  → run-in-progress
  → run-failed ↺
  → run-passed
  → break-observed
  → explanation-submitted
  → explanation-rejected ↺
  → explanation-accepted
  → reflection-closed
  → repeat-scheduled
  → session-closed
```

Инварианты:

- recall раньше reveal;
- prediction раньше первого Run;
- hint/solution доступны только после наблюдаемой попытки;
- explanation относится к той же session и immutable revision;
- reflection обязательна до scheduling;
- AI советует только после попытки и не меняет verdict;
- повторная команда идемпотентна и не создаёт второе evidence.

### 4.3 Learner mastery

```text
not-started
  → in-progress
  → initial-evidence-complete
  → repeat-scheduled
  → repeat-due
  → mastered
  → stale

repeat-due → repeat-failed → remediation-required → in-progress
mastered → retained-7-10d → retained-21d
```

По исходному Tier 1 первое `mastered` возникает после cold repeat через 48–72
часа. Ступени 7–10 и 21+ дней показывают retention и не переписывают исходный
gate задним числом.

### 4.4 Learner-visible copy

| Server truth | RU | EN |
| --- | --- | --- |
| `content-ready`, activity missing | Теория доступна | Theory available |
| `practice-ready` | Можно практиковать | Ready to practise |
| session exists | Начато | In progress |
| run passed, explanation missing | Нужно объяснить | Explanation needed |
| explanation accepted | Повтор запланирован | Repeat scheduled |
| repeat due | Пора повторить | Repeat due |
| mastered | Освоено | Mastered |
| Recommended prerequisite missing | Рекомендуется позже | Recommended later |
| dependency failure | Временно недоступно | Temporarily unavailable |
| unreleased | скрыто; только Studio | hidden; Studio only |

На learner surface запрещены `graph-release`, `accepted placement`,
`route-resolved`, raw `runnable`, release IDs и operator health.

---

## 5. Что считается полным EvidenceBundle

### 5.1 RecallEvidence

- закрытый ответ до reveal;
- сравнение must-say terms;
- `provenance=human`;
- self-grade остаётся диагностикой и сам по себе не даёт mastery.

### 5.2 PredictionEvidence

- требования и invariants;
- ожидаемый механизм;
- 2–3 ожидаемые проверки;
- записано до первого Run.

### 5.3 RunEvidence

- точные TaskRevision ID/hash/release/profile;
- deterministic verdict;
- capability rubric criteria;
- safe trace/result reference;
- hidden tests и solution не покидают Runtime.

### 5.4 ObservationEvidence

- deliberate или обнаруженный failure;
- симптом и гипотеза;
- минимальное исправление;
- regression check.

### 5.5 ExplanationEvidence

- запись вслух 60–90 секунд;
- learner material скрыт во время защиты;
- структура `context → mechanism/decision → trade-off/failure → verification`;
- must-say terms;
- один неожиданный follow-up;
- audio reference и transcript metadata;
- AI feedback advisory; authority — явная rubric/human policy.

### 5.6 SessionReflection / Error Journal

- expected vs actual;
- последний самостоятельно правильный шаг;
- уровень помощи;
- при ошибке или сильной помощи один класс `K/R/P/F/D/E/S`;
- smallest remediation;
- ровно одно следующее действие;
- при clean first attempt сохраняется `clean=true`, ошибка не выдумывается.

### 5.7 ColdRepeatEvidence

- eligible не раньше 48 часов;
- target 48–72 часа;
- новый source/variant/context;
- без reveal, hint, solution и AI;
- deterministic pass;
- origin attempt сохранён;
- failure снимает mastery и открывает remediation.

---

## 6. Как агент обязан работать

### 6.1 Жёсткий frontier

Допустимые статусы:

- `READY` — можно активировать после предыдущего gate;
- `ACTIVE` — единственный текущий gate;
- `BLOCKED` — текущий gate ждёт внешнего решения;
- `WAITING_HUMAN` — техническая часть закрыта, требуется честное человеческое действие;
- `DONE` — все proofs существуют и independent reviewer дал `PASS`;
- `TODO` — позже текущего frontier.

Нельзя иметь `DONE` после `TODO`, два `ACTIVE` или переходить к продуктовой
реализации следующего gate при `BLOCKED`.

### 6.2 Обязательные слои каждого gate

1. **Truth/contract** — владельцы, входы, выходы, ошибки, версии и инварианты.
2. **Implementation** — UI/API/persistence/runtime seam без placeholder/fallback.
3. **Automated proof** — unit, contract, integration, failure и regression tests.
4. **Real journey** — Browser/runtime/database proof на настоящем stack.
5. **Operational finish** — a11y, i18n, performance, recovery, telemetry, cleanup.
6. **Independent closure** — отдельный reviewer сверяет exit criteria и выдаёт `PASS`.

### 6.3 Commit protocol

Для каждого gate:

1. Изменения делаются только в owning repo.
2. Contract producer меняется раньше consumer.
3. Каждый repo проходит собственные checks и `git diff --check`.
4. Repo коммитится и push в `main`.
5. Root обновляет `workspace.yaml`/release bundle после child commits.
6. Root запускает cross-repo join checks.
7. Root коммит и push закрывают gate.

Запрещены long-lived feature branches, force push, dirty handoff и удаление
чужих изменений.

### 6.4 Что можно распараллелить

После фиксации contract gate:

- Brain: карточки, locale и taxonomy;
- Runtime: profiles, task revisions и sandbox smoke;
- Lab: evidence ledger и UI на frozen DTO;
- root: CI harness и observability wiring;
- independent reviewer: read-only audit готового slice.

Нельзя параллелить:

- изменение одного schema/DTO несколькими агентами;
- readiness compiler до stable Brain/Runtime release;
- final crawl во время публикации новых releases;
- Docker cleanup во время runtime smoke;
- visual polish до устранения false actions;
- несколько агентов в одном файле;
- publication и migration без единственного coordinator.

---

## 7. Gate map

| Gate | Результат | Статус |
| --- | --- | --- |
| M0 | recovery baseline, один glossary и один active plan | `DONE` — independent review PASS |
| M1 | зелёные проверки и versioned cross-repo contracts | `DONE` — independent review PASS |
| M2 | `capability-mastery.v2`, ledger и миграции | `DONE — independent review PASS` |
| M3 | rate limiter проходит полный human golden slice | `ACTIVE` |
| M4 | один readiness compiler и честные routes/counters | `TODO` |
| M5 | Program → Path → Domain → Capability UX | `TODO` |
| M6 | все 1 591 карточка классифицированы и локализованы честно | `TODO` |
| M7 | текущий Runtime hardened; task gaps закрываются осмысленно | `TODO` |
| M8 | 12 acceptance areas product-ready | `TODO` |
| M9 | i18n, design, a11y и performance production gates | `TODO` |
| M10 | recovery, observability и Docker lifecycle | `TODO` |
| M11 | единый `pnpm verify`, docs и repo hygiene | `TODO` |
| M12 | full Browser/release crawl — 100% | `TODO` |
| M13 | internal pilot, human cold repeat и честный release status | `TODO` |

---

## M0 — Recovery baseline, vocabulary и authority

### Цель

Агент начинает с воспроизводимого состояния и не доверяет историческому
`RELEASED` без live proof.

### Работа

1. Прочитать четыре `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, текущие contracts и
   этот файл.
2. Зафиксировать SHA/root release четырёх репозиториев.
3. Зафиксировать Brain/Runtime release IDs и schema versions.
4. Зафиксировать dirty trees без reset/checkout.
5. Снять inventory, learner map, relations, quality и runtime summary.
6. Снять `docker compose ls`, project labels, volumes и `docker system df -v`.
7. Сгенерировать route manifest из server-owned projection и повторить baseline
   crawl: 66 advertised, 25 working, 2 no-run, 39 broken — либо записать новые
   фактические значения.
8. Пометить Lab `MASTER-PLAN.md: RELEASED` и старые authoritative plans как
   superseded/history; уникальную evidence не удалять.
9. Зафиксировать канонический hierarchy и glossary из разделов 3–4.
10. Исправить `PRODUCT.md`: workspace — polyrepo umbrella, не source monorepo.
11. Исправить baseline и записать `SourceOfTruthMatrix`: Brain = 16 active
    canonical capabilities / 19 bindings; Runtime = 15 total families, 14
    released, 20 revisions, 19 runnable; Lab counters не становятся
    источником истины. Старые `14/24` G12 counters пометить stale или
    переиздать с явной семантикой.
12. Создать `CoverageManifest` с явным mapping:
    `12 Plan areas ↔ 24 Tier-1 modules ↔ 15 current domains ↔ capabilities`.
    `PlanArea` остаётся acceptance/reporting view и не добавляется в Brain
    taxonomy.
13. Зафиксировать операционную семантику `56686`: это один shared Trace
    Explorer/Jaeger, а не два UI-порта. Поле `task-runtime.ui` переименовать
    в `observability.traceExplorerUrl` или эквивалентный neutral field; второй
    Jaeger не поднимать.
14. Выбрать профиль проверки (`dev` или `packaged`) и подставлять его API
    bases из `workspace.yaml`/environment. Команды M0 не должны молча бить в
    `49301`, если запущен `pnpm dev` на `47000`.
15. Перед baseline crawl пересобрать/recreate только принадлежащие Fluent
    Interview образы из текущих SHAs. Составить preview orphan inventory,
    остановить только подтверждённые owned smoke/sandbox resources и записать
    before/after в `baseline.json`; learner volumes и чужие resources не
    трогать.
16. Зафиксировать решение по операционному плану: принять Aspire/AppHost +
    central Collector + shared Jaeger как M10 implementation, оставив shell
    scripts recovery primitives; либо записать `rejected-with-cause` в M10.

### Команды

```bash
cd /Users/sergeyzhechko/developer/fluent-interview

for repo in . fluent-engineering-lab fluent-question-brain fluent-task-runtime; do
  git -C "$repo" status --short --branch
  git -C "$repo" rev-parse HEAD
  git -C "$repo" rev-parse origin/main
done

pnpm status
docker compose ls
docker system df -v

LAB_API_BASE="${FLUENT_LAB_API_BASE:-http://127.0.0.1:49301}"
BRAIN_API_BASE="${QUESTION_BRAIN_API_BASE:-http://127.0.0.1:48127}"
RUNTIME_API_BASE="${TASK_RUNTIME_API_BASE:-http://127.0.0.1:48227}"

curl -fsS "$LAB_API_BASE/api/program/inventory" | jq .
curl -fsS "$LAB_API_BASE/api/program/learner-map" | jq .
curl -fsS "$LAB_API_BASE/api/runtime/relations" | jq .
curl -fsS "$BRAIN_API_BASE/v1/quality?workspace=fluent-interview" | jq .
curl -fsS "$RUNTIME_API_BASE/v1/tasks/summary" | jq .
```

Для dev-профиля перед проверкой использовать
`FLUENT_LAB_API_BASE=http://127.0.0.1:47000`; для packaged-профиля — значение
`49301`. Значения должны также приходить из machine-readable workspace contract,
а не дублироваться в нескольких shell-скриптах.

### Exit criteria

- один active plan и один glossary;
- SHA/release/schema baseline сохранён;
- известны все dirty changes и Docker owners;
- `SourceOfTruthMatrix` и taxonomy mapping опубликованы;
- counters разделяют total/released/runnable и имеют владельца;
- route manifest воспроизводим из API;
- текущие Fluent images соответствуют зафиксированным SHAs, owned orphan
  resources классифицированы;
- shared Trace Explorer не выглядит как отдельный Runtime UI;
- dev/package API profile выбран и команды M0 воспроизводимы;
- historic `RELEASED` больше не используется automation или агентами;
- нет удалённых learner data или чужих Docker resources;
- independent reviewer: `PASS`.

### Proof

```text
docs/verification/capability-closure/M0/baseline.json
docs/verification/capability-closure/M0/review.md
```

Commit только compact JSON/Markdown. Raw screenshots и full logs остаются
bounded CI artifacts.

---

## M1 — Green truth и cross-repository contracts

### Цель

Нельзя строить learner loop поверх тестов, которые зелёные без Go или
сравнивают release с самим собой.

### Работа

1. Исправить Lab/Runtime fixtures под текущие 20 revisions без hard-coded `18`.
2. Brain `make check` обязан fail, если Go tests не выполнялись.
3. Добавить один golden cross-repo fixture rate limiter.
4. Принять additive contracts:
   - `capability-dossier.v1`;
   - `capability-assessment-plan.v1`;
   - `learning-session.v1`;
   - `capability-evidence.v2`;
   - `capability-mastery.v2`;
   - `session-reflection.v1`.
5. Развести пять измерений:

```text
access             open
contentReadiness   ready | partial | quarantined
activityKind       recall_only | brief_only | runnable | deferred
releaseReadiness   released | pending | incompatible
learnerState       unseen | attempted | explained | repeat_due | mastered
```

6. Неподдерживаемая версия контракта возвращает typed error и fail closed.
7. Existing `completion.v1` читает историю, но не создаёт новое v2 mastery.

### Обязательные contract tests

- reject stale QuestionCard hash;
- reject stale TaskRevision hash;
- reject family без assessment plan;
- reject inactive capability registry identity;
- reject incomplete role-specific primary card;
- reject non-human mastery provenance;
- reject wrong profile для stack-specific capability;
- reject contradictory `released/unreleased/runnable`;
- fixture одинаково валиден в Brain, Runtime и Lab.

### Проверка

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm check

cd ../fluent-question-brain
make check

cd ../fluent-task-runtime
go test ./...
```

Если локального Go нет, root предоставляет fail-closed container target,
который выполняет `go test ./...` по version из каждого `go.mod`. Пропуск теста
не является зелёной проверкой.

### Exit criteria

- все три repository checks зелёные без skip;
- один versioned contract bundle опубликован;
- stale/contradictory fixture отклоняется во всех consumers;
- нет hard-coded task/card totals как release truth;
- independent reviewer: `PASS`.

---

## M2 — Evidence ledger, LearningSession и `capability-mastery.v2`

### Цель

Сделать технически невозможным mastery из visit, reveal, E2E run или одного
старого `completion.v1`.

### Работа Lab

Добавить append-only storage:

```text
learning_session
recall_evidence
prediction_evidence
run_evidence_ref
observation_evidence
explanation_evidence
session_reflection
cold_repeat_assignment
cold_repeat_evidence
capability_mastery_projection (derived)
```

Каждая запись содержит:

- `profileId`;
- `provenance: human | e2e | fixture | migration | promotion`;
- capability/card/task/revision/release IDs;
- contract versions;
- source attempt/origin IDs;
- server timestamps;
- redacted trace reference.

### Миграция

- существующую evidence не удалять;
- audit/E2E/promotion rows классифицировать и исключить из Sergey projection;
- неизвестную provenance поместить в quarantine;
- existing `completion.v1` импортировать как `legacy-incomplete`;
- не создавать автоматические `mastered` rows;
- card recall ladder `1/3/7/21/60` отделить от capability repeat `2–3 days`.

### Property/state tests

- reveal невозможен без recall record;
- prediction невозможна после первого Run как будто была до него;
- explanation невозможна до accepted run;
- reflection невозможна до explanation verdict;
- repeat невозможен раньше due;
- изменение порядка событий не усиливает state;
- duplicate command идемпотентна;
- failed repeat снимает mastery;
- browser/LLM не может записать `mastered=true`;
- E2E clock не действует на human profile.

### Exit criteria

- новый human profile пуст;
- старые audit runs не видны в Sergey Progress;
- state machines воспроизводятся после restart;
- contradictions fail closed;
- learner data backup/restore проходит;
- independent reviewer: `PASS`.

### Реализация M2 — 2026-08-25

Append-only ledger и серверная projection реализованы в
`fluent-engineering-lab@00460fa`. Реализация включает общую контрактную state
machine `capability-mastery-ledger.v2`, named evidence tables, транзакционную
Postgres persistence с capability-scoped advisory lock и идемпотентными
duplicate-командами, replayable in-memory/Postgres adapters и перевод текущего
Progress/readiness на server-owned human projection. Legacy `completion.v1`
импортируется только явным operator-only сервисом в `legacy-incomplete` либо
quarantine; backup/restore проверяет все 28 learner surfaces, сверяет source →
artifact → restored row counts и использует disposable schema. Capability
identity (card/task/revision/release) теперь является частью stream scope:
конфликтующие human revisions отклоняются на append, а replay fail-closes.
Полная проверка Lab (`pnpm check`), live backup/restore, контрактные и Postgres
integration tests зелёные. Независимый reviewer подтвердил все exit criteria:
`M2` закрыт со статусом `PASS`, а следующим активным гейтом становится `M3`.
Полный machine-readable proof:
[`M2/baseline.json`](verification/capability-closure/M2/baseline.json). В этой
редакции `eventId` защищён глобальной advisory/idempotency-проверкой до
capability-scoped записи (конфликт между профилями возвращается typed
`conflicting_duplicate`), а backup/restore gate имеет bounded synthetic fixture:
непустые строки во всех 13 M2 surfaces проходят `source → artifact → restored`
по count, identity references и sha256 digest, после чего fixture и disposable
schema удаляются. Решение ревью зафиксировано в
[`M2/review.md`](verification/capability-closure/M2/review.md).

---

## M3 — Golden capability: rate limiter от q315 до cold repeat

### Цель

Не масштабировать архитектуру, пока один реальный slice не прошёл всё.

### Canonical capability

```text
capability.distributed-systems.rate-limiter
domains:
  - domain.http-api
  - domain.distributed-systems
```

Она не доказывает автоматически Redis failover, gateway configuration или
global distributed enforcement.

### Composition

```text
question.q315       primary
question.c024       prerequisite / recall
question.q444       contrast / follow_up
        │
        ▼
task-family.rate-limiter
        │
        ├─ TypeScript
        ├─ JavaScript
        ├─ Go
        ├─ Java
        ├─ C#
        └─ SQL / PostgreSQL
```

TaskFamily показывается один раз. UI подписывает revisions языками, а не
`node`/`postgres` profile IDs. Для базового language-neutral mastery достаточно
одной revision при `assessmentPlan.anyOf`. Cross-stack transfer — отдельное
явное требование, а не скрытая обязанность пройти шесть языков.

### Технический M3 slice — 2026-08-25

Серверная граница golden capability реализована в
`fluent-engineering-lab@e3dcf50`, а learner UI-связка опубликована в
`fluent-engineering-lab@7f4c9b6` в `main`. Она ещё не закрывает
весь M3: это проверенный технический срез, а не выданное mastery.

- `POST /api/capability-sessions` принимает только released
  `task-family.rate-limiter` revision и связывает три immutable release pins:
  Runtime, Question Brain и TaskFamily;
- QuestionCard `question.q315` проверяется по `release_id`, `revision_id` и
  `content_hash`; capability key должен совпасть в Brain binding, Runtime task и
  TaskFamily;
- start и каждое evidence-командное событие требуют `Idempotency-Key`, получают
  deterministic ID и серверное время; повтор возвращает тот же результат, а
  конфликт identity закрывается typed error;
- HTTP DTO allow-list не пропускает raw answer, hidden tests, solution, verdict
  или browser-owned `mastered`;
- append-only ledger и projection остаются единственным владельцем переходов;
  профиль берётся из server-owned write context, а не из тела запроса.
- golden learner UI стартует серверную сессию, показывает `nextGate`, ведёт
  recall → reveal → prediction → observation и только после серверного `run`
  разблокирует запуск; browser state не является источником mastery.
- после принятого deterministic explanation UI записывает reflection, а после
  reflection просит сервер назначить cold repeat; `assignmentId`, `dueAt` (+48
  часов от серверного времени) и changed context принадлежат API, а не браузеру;
  просроченный изменённый контекст записывается как отдельное repeat evidence.

Техническое доказательство: 4 целевых `learning-api` tests (release pinning,
idempotent start/event, fail-closed degraded/mismatch), focused ledger suite
`3 passed / 1 skipped` (Postgres integration opt-in), полный `pnpm check` Lab:
`learning-api 165 suites / 711 passed / 1 skipped`, `lab-contracts 247 / 1254`,
web `79 / 380`, observability `7 / 39`; production builds и browser boundary
guard зелёные. Нефатальные
lint/performance budget warnings перечислены в M11, они не замалчиваются.

Остаётся до M3 PASS: первичная human-сессия Сергея, запись spoken
explanation/reflection, настоящее
ожидание 48–72 часов и changed-context cold repeat. До этого статус гейта
остаётся `ACTIVE`, а human acceptance — `WAITING_HUMAN`; никакой synthetic или
E2E evidence не может закрыть его за человека.

### Подготовка M4 — 2026-08-25

В Lab `7f4c9b6` вынесен единый `product-inventory` compiler и подключён к
learner rail: Program/Map, Question Brain corpus, Runtime relation audit и profile progress теперь
собираются в один server-owned counter projection; rail и Practice task catalogue
показывают release-owned counts; path count больше не
зашит литералом `9`, неизвестные station keys не считаются bound, старый
отдельный Question Brain summary больше не используется rail, а invalid Runtime
bindings делают inventory недействительным. Это техническая основа,
но не закрытие M4: consumer surfaces и полная counter/drill-down сверка
остаются в очереди. Гейт M4 не активируется, пока M3 не получит человеческое
acceptance.

В Lab `7635423` projection получил additive `routeManifest`: 81 route строится
из тех же released stations и readiness-фактов, а не из второго UI-каталога.
Независимый HTTP-аудит `pnpm m4:route-audit` теперь также сверяет learner
каталог с Runtime release summary и проходит все 19 learner workspaces; live
slice дал `pass` (81/81 routes, 1/1 executable station, 19/19 catalogue
workspaces, zero unreleased catalogue tasks). Это закрывает только
техническое доказательство route/catalogue rail, но не переводит M4 в PASS:
consumer surfaces и counters drill-down остаются частью следующего
acceptance-пакета. Capability-only `project-book-boundary-001` намеренно
остаётся в operator release, но не выдаётся ученику.

Live evidence этого среза зафиксировано в
[`M4/baseline.json`](verification/capability-closure/M4/baseline.json) и
[`M4/technical-slice.md`](verification/capability-closure/M4/technical-slice.md).

### Полная human session

1. Закрытый recall q315.
2. Reveal и сверка must-say terms.
3. Выбор TypeScript revision.
4. Запись invariants: capacity, refill, burst, key isolation, deterministic clock.
5. Prediction до Run.
6. Deliberate failing implementation.
7. Исправление token bucket и deterministic PASS.
8. Отдельная проверка key isolation или refill boundary.
9. Evidence с exact revision и trace.
10. English spoken defense 60–90 секунд без открытого ответа.
11. Один неожиданный follow-up.
12. SessionReflection/Error Journal.
13. Scheduling на +48–72 часа.
14. Reload/restart сохраняет session.
15. Changed-context repeat без подсказок.
16. Только после PASS — mastery.

### Runtime verification

Для всех шести revisions:

- intentional fail;
- deterministic pass;
- timeout;
- cancel/retry;
- double Run создаёт один Run;
- no network;
- CPU/RAM/PID/wall-clock limits;
- sandbox container удалён;
- hidden tests/solution не попали в Browser/result/logs.

### Browser verification

- q315 stable через refresh/back/filter;
- RU ↔ EN сохраняет question ID, revision, draft, evidence и semantic selection;
- отдельный draft на каждый язык;
- CodeMirror syntax/theme соответствует language;
- xterm/Evidence доступны с клавиатуры;
- explanation rejection возвращает на исправление;
- failed repeat открывает remediation;
- E2E profile не влияет на Sergey.

### Exit criteria

- automated E2E проходит с test clock в isolated profile;
- реальный Sergey initial session пройден;
- до настоящих 48 часов gate получает `WAITING_HUMAN`, не `DONE`;
- реальный cold repeat пройден без hint/AI/time travel;
- dossier объясняет каждое proof;
- independent reviewer: `PASS`.

---

## M4 — Один readiness compiler и ноль ложных маршрутов

### Цель

Program, Map, Practice, Progress и counters читают одну compiled projection.

### Exact join

```text
Path
→ Capability
→ Station
→ exact QuestionCard revision
→ TaskFamily
→ exact runnable TaskRevision
→ workspace ready
→ runtime profile ready
```

### Правила

- Explorer открывает чтение всех released capabilities;
- Recommended влияет на «что дальше», но не прячет библиотеку;
- theory-only ведёт в lesson/recall и не рекламирует Run;
- `project-book-boundary-001` скрыт из executable до runnable release;
- каждый task достижим из capability dossier;
- каждый counter имеет формулу и drill-down;
- `ready-to-learn` компилируется server-side как
  `primary card structurally complete ∧ binding role assigned ∧ required
  locales complete`; исторический UI counter `989` больше не используется;
- `PlanArea` counters считаются только через опубликованный
  `CoverageManifest`, а не через названия экранов или ручные числа;
- `reconciliation.valid` проверяет реальные cross-service joins, а не значения
  с ними же;
- 39 broken и 2 no-run либо реализованы, либо честно downgraded в
  `recall_only`, `brief_only` или `deferred`.

### Автоматические gates

- advertised runnable count = успешные executable URLs;
- 0 broken advertised routes;
- 0 executable routes без Run controls;
- 0 `released + availability=unreleased` contradictions;
- 0 unreleased tasks в learner catalog;
- 0 orphan runnable revisions;
- 0 manual browser counters.
- 0 counters без owner, formula, release ID и drill-down collection.

### Exit criteria

- один compiler package/service и одна версия projection;
- все consumers используют её;
- route manifest генерируется из неё;
- every status dereferences to a filtered collection;
- independent reviewer: `PASS`.

---

## M5 — Learner IA: Program → Path → Domain → Capability

### Цель

Ученик понимает, где находится, что доступно, почему рекомендован следующий
шаг и какое доказательство отсутствует.

### Canonical routes

```text
/program
/paths/:pathKey
/paths/:pathKey/domains/:domainKey
/capabilities/:capabilityKey
/questions/:stableQuestionKey
/practice/task-family/:familyKey
/practice/lab/:taskRevisionKey
```

Не обязателен мгновенный destructive URL migration, но должен быть один
canonical owner, redirect tests и срок удаления aliases.

### Program

```text
Backend Engineer
├─ Node.js + TypeScript
├─ Java + Spring
├─ .NET + C#
├─ Go
├─ Frontend
├─ System Design
├─ Algorithms
├─ Behavioral
└─ Python
```

Shared domains:

```text
Runtime
HTTP / API
Data / PostgreSQL
Distributed Systems
OS / Networking
Testing
Delivery / Observability
```

### Capability dossier UI

Каждая capability показывает:

- зачем она нужна и prerequisites;
- primary/recall/contrast/follow-up cards;
- доступные TaskFamily/revisions;
- current session phase;
- evidence facets;
- следующий отсутствующий proof;
- route/path membership;
- human-readable availability/recovery.

### Explorer

- читает любой released content;
- запускает только истинно runnable activity;
- не создаёт readiness/mastery;
- сохраняет mode, selection, scroll и path context.

### Recommended

- один next action;
- объяснение «почему сейчас»;
- prerequisite влияет на рекомендацию, не на видимость;
- Explorer доступен одним явным действием.

### Exit criteria

- path показывает domains, не flat wall карточек;
- capability — единый learner workspace;
- breadcrumbs и back/forward сохраняют context;
- theory-only не выглядит locked;
- нет raw Studio vocabulary;
- learner отвечает: «где я, куда иду, почему, что доказал, чего не хватает»;
- independent reviewer: `PASS`.

---

## M6 — Нормализовать существующие 1 591 QuestionCard

### Цель

До окончания gate новые вопросы запрещены. Корпус получает объяснимую роль,
locale quality и placement без массового превращения в монстров.

### Для каждой карточки

Зафиксировать:

- stable question/revision/hash;
- `ready | partial | quarantined`;
- binding role;
- canonical capability/domain/path placement;
- `curriculum-bound | library-only | needs-capability | rejected-with-cause`;
- RU/EN required-layer completeness;
- provenance и reviewer;
- duplicate/alias decision;
- task relation или честное отсутствие;
- release disposition.

### Правила

- не auto-bind по title/topic/embedding;
- embeddings предлагают, человек принимает;
- active Brain canonical capabilities и Lab placements сходятся через один
  stable namespace; binding count не называется capability count;
- Angular aliases и мелкие near-duplicate topics нормализуются;
- повторный enrichment идемпотентен;
- historical revisions сохраняются;
- silent locale fallback запрещён;
- code/identifiers могут быть language-neutral; объясняющий prose — reviewed locale.

### Review Workbench — обязательная поверхность M6

Для 1 591 карточки нужен не ручной обход по одной записи, а отдельный
editorial workbench в Question Brain/Studio. Он обязан поддерживать:

- batch-очередь по `needs-capability`, locale-gap, duplicate и
  `rejected-with-cause`;
- embedding-assisted cluster proposals с обязательным human accept/reject;
- просмотр карточки, revision/hash, proposed capability, role, provenance и
  соседних candidates в одном контексте;
- bulk-операции только для одинакового проверенного решения, с preview;
- append-only reviewer/audit trail, undo до release и idempotent re-run;
- фильтры по всем Paths, SharedDomains, roles и PlanArea mapping;
- экспорт deterministic ledger, из которого M6 coverage gates реально
  воспроизводятся.

Workbench не публикует binding автоматически и не является learner UI. Если
Workbench не готов, M6 остаётся `BLOCKED`, а агент не компенсирует его ручным
SQL или массовым auto-accept.

### Coverage gates

- 1 591 из 1 591 имеют disposition;
- 0 prompt-as-answer;
- 0 unexplained placement gaps;
- 0 duplicate normalized topic IDs;
- 0 core primary cards с silent locale fallback;
- sample review включает все девять Paths и все binding roles;
- current search/embedding quality не ухудшилась.

### Если обнаружена настоящая content-дыра

Не создавать QuestionCard в этом gate. Записать:

```text
capability_key
почему существующие cards не подходят
какой exact learning role отсутствует
почему enrichment/merge недостаточен
```

Такой gap требует отдельного owner decision после M6; он не скрывается fake
mapping.

### Exit criteria

- полный deterministic ledger;
- quality API раскрывает каждую категорию;
- re-release идемпотентен;
- Lab читает только released projection;
- independent editorial reviewer: `PASS`.

---

## M7 — Harden Task Runtime и закрыть task gaps

### Цель

Все текущие tasks честно работают; новые tasks появляются только как proof
конкретной capability.

### Runtime invariants

- `status`, `availability`, `runnable` непротиворечивы;
- expectations строятся из manifest, не числа `18/20`;
- TaskFamily language-neutral;
- TaskRevision владеет language/profile;
- editable files, fixtures и hidden tests разделены;
- pinned OCI image/harness (`name:tag@sha256:digest`, не только mutable tag);
- no network, read-only input, bounded CPU/RAM/PID/time;
- deterministic result envelope;
- sandbox cleanup даже после timeout/cancel;
- Docker socket остаётся local-dev boundary;
- UI видит `TypeScript`, а не `node`.

### Threat model и границы sandbox

M7 фиксирует threat model для текущего local-dev boundary: Docker daemon/socket,
host-mounted workspace и выбранные OCI images считаются доверенными только для
локального пользователя. Digest pinning, минимальные capabilities и
`--network none` обязательны для воспроизводимости и снижения риска, но не
превращают Docker Desktop в multi-tenant isolation.

gVisor/`runsc` не является обязательным acceptance checkbox для MacBook/Apple
Studio-профиля: он требует Linux runtime и отдельной проверки совместимости и
производительности. Возможный Linux production profile записывается как
отдельный upgrade path с собственным threat-model review.

### CapabilityAssessmentPlan

Каждая family публикует:

- `allOf/anyOf` criteria;
- capability keys;
- допустимые profiles;
- rubric version;
- deliberate-failure scenario;
- repeat variant policy;
- release/hash pins.

### Обязательные smoke

- Node.js/TypeScript;
- .NET/C#;
- PostgreSQL;
- Go;
- Java;
- fail/pass/timeout/runtime_error/runtime_not_ready;
- 20 последовательных runs без остаточных task containers/volumes/processes.

### Exit criteria

- все 20 current revisions имеют honest status;
- 19 runnable реально принимаются Runtime;
- non-runnable не рекламируется executable;
- release join smoke строится из manifest;
- все image references проверяются policy на digest;
- task/result/source leakage tests зелёные;
- независимый security/runtime reviewer: `PASS`.

---

## M8 — Сделать 12 acceptance-областей Plan 2026 product-ready

### Цель

Платформа технически умеет собрать полный mastery по каждой обязательной
области. Это не означает автоматически, что Sergey уже их mastered.

### CoverageManifest

`CoverageManifest` — это acceptance/reporting artifact, не новый Brain registry.
Он обязан содержать явный mapping и provenance версии:

```yaml
taxonomyMapping:
  planAreaToTier1Modules: {}
  tier1ModuleToSharedDomains: {}
  sharedDomainToCapabilityKeys: {}
  capabilityToPaths: {}
sourceReleases:
  brainRegistryReleaseId: "..."
  brainBindingReleaseId: "..."
  runtimeTaskCatalogReleaseId: "..."
```

Для каждой области:

```yaml
areaKey:
  requiredCapabilityKeys: []
  requiredScenarioTags: []
  minimumIndependentTaskFamilies: 0
  contentCoverageRule: capability-dossier.v1
  routeHealthRule: 100%
  repeatPolicy: capability-repeat-2-3d.v1
```

Порядок областей определяется prerequisite graph и pilot value. Coverage-score
может влиять на планирование работ, но сам по себе не меняет learner sequence.
Каждая область должна иметь recorded rationale для своего места в маршруте.

### Минимальное executable coverage

| Область | Minimum independent families/scenarios |
| --- | --- |
| Docker / images | layers/build cache; service networking; image/container/volume boundary |
| Kubernetes | probes; requests/limits; ConfigMap/Secret; scale/rollout/pod diagnosis |
| Concurrency | bounded pool/backpressure; race; deadlock/cancellation; load observation |
| Brokers | Outbox failure window; idempotent consumer; DLQ/replay |
| Cache / Redis | cache-aside/invalidation; stampede/hot key; structures/atomicity |
| Auth / security | password/login; CORS; IDOR/cross-tenant |
| Network / TCP / HTTP | TCP/UDP observation; retry/idempotency; proxy/WebSocket/TLS boundary |
| PostgreSQL | locks/isolation; queue/SKIP LOCKED; query plan before/after |
| Observability | failure injection; retry amplification; timed incident/runbook |
| System Design | 5 timed cases с requirements, diagram, rubric, trade-offs, spoken defense |
| Algorithms | hash/array; graph/tree; sliding-window/two-pointer; DP/greedy |
| Angular / frontend | change detection/signals; RxJS; forms/a11y; rerender/performance |

Новые TaskFamily разрешены здесь только если CoverageManifest показывает
отсутствующий proof. Не каждая task обязана иметь TS/Java/C#/Go/SQL variants:
revision создаётся только там, где язык сохраняет смысл проверки.

### Area product-ready

- все required capabilities имеют `practice-ready` dossier;
- одна family может доказать несколько capabilities только раздельными rubric
  criteria;
- all core locales complete;
- все routes 100% healthy;
- deliberate failure и observable evidence существуют;
- repeat variant существует;
- area coverage report dereferenceable.

### Area mastered by Sergey

Отдельная метрика. Она требует current human MasteryClaim по всем required
capabilities и не является exit criteria реализации платформы.

### Последовательность

1. Concurrency — ближе всего к закрытию.
2. Docker.
3. Kubernetes.
4. Brokers.
5. Cache.
6. Auth.
7. Networks.
8. PostgreSQL.
9. Observability.
10. System Design.
11. Algorithms.
12. Angular/frontend.

Каждая область закрывается независимо и получает отдельный review. Нельзя
пометить M8 `DONE`, пока coverage = `12/12 product-ready`.

---

## M9 — I18n, design, accessibility и performance

### Решение по дизайну

Сохраняем Cameo и Executable Trace Atlas. Это не redesign. Работа заключается
в truthful progressive disclosure, coherent states, long-session quality и
production integrity.

### RU/EN acceptance

Из q315 с выбранными card/search/filter/task/revision/draft/evidence:

1. RU → EN.
2. Stable IDs и selection сохраняются.
3. Locale-dependent query переводится или явно очищается без потери entity.
4. Task revision, draft, evidence и scroll сохраняются.
5. EN → RU.
6. Refresh и back/forward сохраняют состояние.

Дополнительно:

- long RU strings и 40% text expansion;
- plurals/numbers через formatter;
- zero-result search;
- missing localized section;
- технические terms, которые нельзя переводить;
- никакой automatic prompt/EN prose как silent RU answer.

### Themes

Auto, Light, Dark:

- preference persists;
- Auto следует OS;
- нет wrong-theme flash;
- CodeMirror меняет syntax theme;
- terminal остаётся осмысленно тёмным;
- focus/error/success имеют одинаковое значение;
- contrast WCAG AA.

### Desktop/a11y

Required viewports:

- `1728×1117` MacBook Pro 16;
- `2560×1440` Apple Studio Display;
- оба при 100% и 200% zoom.

Обязательно:

- axe: 0 critical/serious;
- один `main`, один page `h1`;
- keyboard-only whole loop;
- нет trap в map, CodeMirror, xterm, modal, revision selector;
- focus recovery после async result/dialog;
- SVG/canvas имеет ordered list/table alternative;
- trace имеет textual timeline;
- reduced motion сохраняет causality;
- page-level horizontal scroll отсутствует;
- editor/terminal могут иметь собственный scroll;
- VoiceOver sample Program → q315 → Run → Evidence → Progress.

### Performance

Текущие budgets не повышать:

- initial bundle ≤ 520 KB;
- lab route stylesheet ≤ 44 KB;
- CodeMirror/xterm lazy и отсутствуют в read-only initial route.

Production three-run median:

- LCP < 2.5 s;
- INP < 200 ms;
- CLS < 0.1;
- route feedback < 100 ms;
- 1 591-card search < 100 ms p95;
- no unbounded topic/list rendering.

Long-session test: 10 capabilities, 10 revisions, 10 runs, возврат в Program.
Heap/listeners должны стабилизироваться; >15% retained growth требует анализа.

### Impeccable bounded pass

1. Один baseline audit.
2. Functional fixes M4–M9.
3. Одна combined polish inspection.
4. Один batch исправлений.
5. Одна confirmation pass.
6. Stop cosmetic iteration.

Target: ≥18/20; A11y, Theming, Implementation Integrity = 4/4; остальные ≥3.

### Exit criteria

- RU/EN и theme matrix зелёные;
- zero P0/P1 UX defects;
- budgets и Core Web Vitals зелёные;
- no overlap/overflow на двух desktop targets;
- independent design/a11y reviewer: `PASS`.

---

## M10 — Recovery, observability и безопасный Docker lifecycle

### Operational architecture decision

Исторический [ASPIRE-JAEGER-DOCKER-PRODUCTION-PLAN-2026-08-25.md](ASPIRE-JAEGER-DOCKER-PRODUCTION-PLAN-2026-08-25.md)
не остаётся второй активной очередью. Его принятые operational requirements
поглощаются этим гейтом:

- TypeScript Aspire AppHost становится dev/local-product orchestrator;
- `pnpm dev` и `pnpm dev:production` делегируют AppHost соответствующему
  profile, а shell scripts остаются recovery/status primitives;
- три domain repositories и их data ownership сохраняются независимыми;
- один central OpenTelemetry Collector и один Jaeger v2 Trace Explorer;
- Prometheus, Loki и Grafana сохраняются для metrics/logs/alerts;
- Tempo и repo-local Jaeger удаляются только после trace-parity evidence;
- resource names, ports, durable volumes и cleanup policy приходят из одного
  workspace contract;
- `task-runtime.ui` не создаёт второго UI: shared `observability.traceExplorerUrl`
  используется всеми consumers.

Если AppHost/AppCollector migration не принимается для текущего release, агент
обязан записать `rejected-with-cause` и отдельный owner/date. Нельзя молча
считать старый operational plan закрытым. В любом варианте обязательны shared
trace contract, scoped cleanup, fresh-image check и failure matrix ниже.

### Failure matrix

| Failure | Learner outcome |
| --- | --- |
| Brain unavailable | typed content error + retry; no local/stale card |
| Runtime unavailable | theory readable; practice временно недоступна |
| PostgreSQL unavailable | no fake save/pass; drafts recoverable |
| Learning API unavailable | stable recovery + preserved local drafts |
| Local AI unavailable | deterministic flow полностью работает |
| Jaeger unavailable | Run работает; trace inspection degraded |
| Release mismatch | «материал обновляется», не другая revision |
| Unknown route | recovery к owning capability/search, не blank 404 |

Retry не создаёт duplicate Run/Evidence.

### Trace contract

```text
Browser → Learning API → Brain / Runtime → persistence
```

Один trace/correlation ID. Service names:

```text
fluent-learning-api
fluent-question-brain-api
fluent-task-runtime
```

Один shared Jaeger. Raw prompts, answers, source, hidden tests, secrets и
learner code не попадают в telemetry. IDs — bounded trace attributes/structured
logs, не high-cardinality metric labels.

### Docker

- три независимых Compose projects сохраняются;
- root lifecycle координирует их;
- durable volumes — explicit allowlist;
- `down` сохраняет learner data;
- cleanup только по workspace labels;
- global `docker system prune --volumes` запрещён;
- два запуска не создают clones;
- 20 task runs не оставляют sandbox containers/volumes;
- unrelated sentinel container переживает cleanup;
- disk budget и retention проверяются автоматически.

### Required operational sub-gates

1. **M10-A — AppHost/resource graph:** один запуск, один resource graph,
   deterministic dev/package profiles, no duplicate project names.
2. **M10-B — telemetry parity:** Browser → Learning API → Brain/Runtime trace
   в одном Jaeger, Collector accepted/exported/dropped counters reconciled.
3. **M10-C — storage and retention:** Jaeger/Prometheus/Loki/BuildKit budgets,
   named-volume allowlist, restart persistence и bounded retention.
4. **M10-D — cleanup and recovery:** orphan preview, owned-only cleanup,
   unrelated sentinel survives, 20 sandbox runs leave no ephemeral resources.

### Exit criteria

- Brain read и Runtime run видны как connected traces;
- каждая failure path протестирована;
- data/draft preservation доказана restart test;
- Docker before/after объясним и bounded;
- independent operations/security reviewer: `PASS`.

---

## M11 — Один `pnpm verify`, documentation и repo hygiene

### Командная поверхность, которую нужно создать

```bash
pnpm verify
pnpm verify:contracts
pnpm verify:release-join
pnpm verify:source-of-truth
pnpm verify:taxonomy-mapping
pnpm verify:routes
pnpm verify:tasks
pnpm verify:evidence
pnpm verify:i18n
pnpm verify:observability
pnpm verify:docker
pnpm verify:docker-hygiene
pnpm verify:browser
pnpm verify:docs
```

Каждая команда fail non-zero при drift. `pnpm verify` запускает всё на clean
checkout и не зависит от локально установленного Go.

### Hygiene

- консолидировать 374 Lab scripts в небольшой набор truth-driven targets;
- убрать duplicated phase wrappers;
- raw screenshots/traces/videos хранить как CI artifacts с retention;
- не коммитить ещё сотни MB generated evidence;
- уникальную historical evidence сохранить, старые планы пометить superseded;
- broken links/stale SHA/count literals запрещены;
- `CLAUDE.md` и provider-specific instructions отсутствуют;
- AGENTS/architecture/current contract согласованы;
- `PRODUCT.md` не называет polyrepo source monorepo;
- один active production plan — этот файл до closure.

### Exit criteria

- clean clone → `pnpm dev` → `pnpm verify` зелёный;
- Go tests действительно выполняются;
- docs link checker зелёный;
- no bundle/lint warnings budget;
- root и children clean/pushed;
- independent maintainability reviewer: `PASS`.

---

## M12 — Полный Browser/release acceptance

### Preparation

1. `pnpm down`.
2. Только workspace-owned safe cleanup.
3. `pnpm dev` — canonical launcher.
4. `pnpm status`.
5. `pnpm verify`.
6. Создать `release-e2e-<run>` profile.
7. Сгенерировать route list из server-owned release.

### Functional crawl

Проверить RU и EN на MacBook viewport:

- все 9 Paths;
- every Path → Domain → Capability;
- every published Question destination;
- every advertised executable URL;
- every TaskFamily revision selector;
- Program, Map, Practice, Progress, Journal, Recall, Projects preview;
- unknown/recovery routes.

Expected:

- 100% published learner routes resolve;
- 0 false Run;
- 0 executable 404/unavailable;
- every runnable exact revision accepted by Runtime;
- theory-only не рекламирует Run;
- unreleased не показывается;
- 0 raw operator labels;
- 0 uncaught console errors;
- 0 required failed requests;
- E2E evidence отсутствует в Sergey.

### Browser acceptance scenarios

| ID | Сценарий | Required result |
| --- | --- | --- |
| UX-01 | Fresh Program | Backend Engineer + 9 Paths, без непонятных 15/79 |
| UX-02 | Explorer | любой released content читается |
| UX-03 | Recommended | один reasoned next action, библиотека не locked |
| UX-04 | Breadcrumb/back | Program/Path/Domain/Capability state сохранён |
| UX-05 | Theory-only | «Теория доступна», нет fake Run |
| UX-06 | q315 | selection сохраняется через refresh/filter/back |
| UX-07 | Rate limiter revisions | JS/TS/Go/Java/C#/SQL как variants одной family |
| UX-08 | Drafts | отдельный draft на revision |
| UX-09 | Fail/pass | terminal/evidence совпадают с Runtime |
| UX-10 | Explain/journal/repeat | mastery только после всех proofs |
| UX-11 | RU↔EN | entity, revision, draft, evidence сохранены |
| UX-12 | Auto/Light/Dark | persistent, contrast-safe, editor synced |
| UX-13 | Keyboard | no trap, async result announced |
| UX-14 | 200% zoom | no page overflow/covered controls |
| UX-15 | Runtime offline | theory usable; Run safely unavailable |
| UX-16 | Brain offline | typed retry; no fallback content |
| UX-17 | AI/Jaeger offline | deterministic loop unaffected |
| UX-18 | Retry/double submit | one Run/Evidence |
| UX-19 | Full crawl | 100% routes match advertised truth |
| UX-20 | Audit actor | zero Sergey pollution |
| UX-21 | In-app Chromium | feature detection passes; no UA fiction |
| UX-22 | Long session | stable memory/listeners/editors |

### Visual matrix

Pairwise, не тысячи screenshots:

- Program;
- Path;
- Capability dossier;
- Question;
- editable task;
- success Evidence;
- validation failure;
- dependency recovery;
- Progress.

Покрыть viewports, RU/EN, light/dark. Raw media — bounded artifacts; commit —
только summary, hashes и failed/passed matrix.

### Exit criteria

- `pnpm verify` green;
- Browser crawl 100%;
- Impeccable ≥18/20;
- zero P0/P1;
- one connected Jaeger trace;
- restart persistence passed;
- Docker leak comparison passed;
- release bundle содержит 4 SHA + Brain/Runtime releases + contract versions;
- independent verifier: `PASS`.

---

## M13 — Internal pilot и честный release status

### Release vocabulary

Разрешены только точные статусы:

- `Card published`;
- `Capability content-ready`;
- `Capability practice-ready`;
- `Learner attempted`;
- `Initial evidence complete`;
- `Repeat due`;
- `Capability mastered`;
- `Area product-ready`;
- `Area mastered by Sergey`;
- `Pilot-ready`;
- `Plan-2026-ready`.

Общее «готово» без объекта запрещено.

### `Pilot-ready`

Требуется:

- M0–M7 и M9–M12 `DONE`;
- q315 full human loop;
- Node.js + TypeScript, PostgreSQL и rate-limiter/System Design pilot paths;
- real weekly loop;
- English explanation;
- Failure Journal + Weekly Retro;
- CV/interview calibration не подменена card progress;
- audit actor изолирован.

### `Plan-2026-ready`

Дополнительно:

- M8 = 12/12 `Area product-ready`;
- все core routes/content локали complete;
- Tier 1 может собирать five-proof mastery для каждой области.

### `Learner mastered`

Никогда не выдаётся implementation tests. Это результат реальных human
sessions и repeats. Нормально выпустить product-ready платформу с `0 mastered`
до начала обучения.

### Tier 2

Пять Project Books остаются `preview` до `Plan-2026-ready`. Их выполнение не
начинается ради красивого прогресса. После Tier 1 первый project выпускается
как отдельный verified system increment:

```text
read → implement → run → break → measure → explain → defend
```

### Final closure

- все gates имеют compact proof и independent `PASS`;
- root и children `main == origin/main`;
- все trees clean;
- release manifest подписывает exact commits/contracts;
- rollback/recovery documented and exercised;
- пользователь получает одну команду: `pnpm dev`;
- финальный status не превышает фактический evidence.

---

## 8. Запрещённые shortcuts

- Не добавлять QuestionCard во время M0–M13.
- Не создавать fallback JSON, shadow catalogue, second vector DB или local task
  runner.
- Не читать чужие database tables напрямую между сервисами.
- Не использовать `locked` для отсутствующей реализации.
- Не объявлять runnable по route name или глобальному count.
- Не хранить E2E/fixture evidence в human profile.
- Не перематывать время Sergey ради mastery.
- Не позволять LLM принимать deterministic или mastery verdict.
- Не считать repeat доказательством explanation.
- Не использовать silent locale fallback.
- Не поднимать performance budgets вместо исправления.
- Не закрывать gate скриншотом или generated report без functional proof.
- Не разрешать green CI при skipped Go tests.
- Не использовать global Docker prune.
- Не объединять три domain repositories или Compose projects.
- Не создавать отдельный Brain `PlanArea` registry: 12 областей живут только
  в versioned `CoverageManifest` и mapping к canonical capabilities.
- Не считать shared Jaeger URL вторым Task Runtime UI или поднимать второй
  Jaeger только из-за названия поля в `workspace.yaml`.
- Не менять learner sequence только по coverage-score; prerequisite graph и
  recorded pedagogical rationale обязательны.
- Не объявлять gVisor/`runsc` поддержанным на desktop Mac без отдельного Linux
  compatibility/performance proof.
- Не делать FSRS, Open Badges или xAPI внутренними источниками истины; они
  остаются scheduler/export adapters после evidence baseline.
- Не начинать Tier 2 execution до Plan-2026-ready.
- Не менять Cameo/Executable Trace Atlas до integrity closure.
- Не добавлять VHS, glass, gradients или animation ради «wow» до zero P0/P1.
- Не строить mobile release.
- Не продолжать cosmetic polishing после bounded confirmation pass.
- Не закрывать gate с dirty/unpushed trees.
- Не писать `RELEASED`, пока M12 independent crawl не `PASS`.

---

## 9. Автоматические запреты на преждевременный MasteryClaim

`MasteryClaim` возвращает `unknown` или `incomplete`, если хотя бы одно верно:

- Dossier не `practice-ready`;
- нет полной primary card;
- locale fallback используется в core material;
- binding/revision hash stale;
- нет AssessmentPlan;
- deterministic Run не PASS;
- Run не current release;
- provenance не `human`;
- recall записан после reveal;
- prediction отсутствует;
- deliberate observation отсутствует там, где required;
- explanation отсутствует, текстовая вместо required spoken, rejected или
  относится к другому attempt;
- reflection отсутствует;
- assisted/failed attempt не имеет class/remediation;
- repeat раньше due;
- repeat использует тот же source/context;
- во время repeat были hint/solution/AI;
- repeat failed;
- факты противоречат друг другу;
- browser прислал `mastered=true`;
- LLM предложила verdict;
- единственное proof — visit, reveal, self-grade, card count, percentage, E2E,
  fixture или screenshot.

---

## 10. Progress ledger — обновляется агентом

| Gate | Status | Owner | Started | Commit(s) | Proof | Reviewer |
| --- | --- | --- | --- | --- | --- | --- |
| M0 | `DONE` | root | 2026-08-25 | `49406ef`, `53f623c`, `7999f19`, `7d26d38`, `37bcaa9` | [`M0/baseline.json`](verification/capability-closure/M0/baseline.json), [`M0/review.md`](verification/capability-closure/M0/review.md) | independent review PASS |
| M1 | `DONE` | all/contracts | 2026-08-25 | Brain `e698fc2`, Runtime `45c4519`, Lab `401ee9f`, root `4cb6ce7` | [`M1/baseline.json`](verification/capability-closure/M1/baseline.json), [`M1/review.md`](verification/capability-closure/M1/review.md) | independent review PASS |
| M2 | `DONE` | Lab | 2026-08-25 | Lab `00460fa`, root close proof | [`M2/baseline.json`](verification/capability-closure/M2/baseline.json), [`M2/review.md`](verification/capability-closure/M2/review.md) | independent review PASS |
| M3 | `ACTIVE` | all/golden slice | 2026-08-25 | Lab `e3dcf50` + `4e895cf` + `4443bc8` + `2f19db4` + `98177b4` + `2e2a54b` + `7f4c9b6` | [`M3/baseline.json`](verification/capability-closure/M3/baseline.json), [`M3/technical-slice.md`](verification/capability-closure/M3/technical-slice.md) | technical slice PASS; human acceptance WAITING |
| M4 | `TODO` | Lab/compiler | — | — | — | — |
| M5 | `TODO` | Lab/UI | — | — | — | — |
| M6 | `TODO` | Brain/editorial | — | — | — | — |
| M7 | `TODO` | Runtime | — | — | — | — |
| M8 | `TODO` | all/coverage | — | — | — | — |
| M9 | `TODO` | Lab/design | — | — | — | — |
| M10 | `TODO` | root/operations | — | — | — | — |
| M11 | `TODO` | root/CI/docs | — | — | — | — |
| M12 | `TODO` | independent verifier | — | — | — | — |
| M13 | `TODO` | root + human | — | — | — | — |

Правило обновления:

1. `READY → ACTIVE` только для первого незакрытого gate.
2. `ACTIVE → DONE` только вместе с proof и reviewer `PASS`.
3. Следующий gate становится `ACTIVE` в том же commit, который законно закрыл
   предыдущий.
4. `WAITING_HUMAN` не разрешает выдать mastery или Tier 1 release.
5. Любой новый P0/P1 возвращает owning gate в `ACTIVE`.

---

## 11. Что считать идеальным результатом этого плана

После закрытия плана пользователь может:

1. Запустить всё одной командой `pnpm dev`.
2. Выбрать любой Path и читать любой released content в Explorer.
3. Понять Recommended sequence и причину следующего действия.
4. Открыть CapabilityDossier, а не потеряться среди 1 591 карточки.
5. Ответить до reveal, выбрать задачу и язык, написать код с подсветкой.
6. Получить настоящий Runtime verdict, terminal output и trace.
7. Намеренно сломать boundary и объяснить observed behavior.
8. Записать English defense, Reflection и error-journal rule.
9. Вернуться через 2–3 дня на изменённый repeat без подсказок.
10. Получить inspectable MasteryClaim только после всех proofs.
11. Переключить RU/EN и тему, не потеряв состояние.
12. Увидеть честное различие между theory-ready, practice-ready и mastered.
13. Пройти тот же цикл в каждой из 12 acceptance-областей, раскрытых через
    `CoverageManifest`, без появления отдельной параллельной taxonomy.
14. После Tier 1 открыть большой Project Book и использовать накопленные
    capabilities как строительные блоки реальной архитектуры.

Это и есть исходная идея Fluent Interview: не курс и не архив ответов, а
исполняемый интерактивный учебник, который превращает знания в проверяемую
инженерную способность.
