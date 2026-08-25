# Fluent Interview — полный production-аудит и обязательный план исправлений

**Статус:** `AUTHORITATIVE / EXECUTION REQUIRED`  
**Дата доказательной базы:** 2026-08-25  
**Рабочая область:** `/Users/sergeyzhechko/developer/fluent-interview`  
**Продукт:** Fluent Engineering Lab + Fluent Question Brain + Fluent Task Runtime  
**Цель:** довести локальную desktop-платформу до честной, наблюдаемой и воспроизводимой production-версии без скрытых fallback, ложных счётчиков, разъезжающейся локализации и Docker-мусора.

---

## 0. Как пользоваться этим документом

Этот файл — единая точка выполнения и проверки. Он не является ещё одним обзорным отчётом.

Обязательные правила:

1. Гейты выполняются только по порядку: `G0 → G14`.
2. К следующему гейту нельзя переходить, пока не выполнены все его acceptance criteria.
3. Нельзя заменять реальную интеграцию mock, fallback, архивным snapshot или «временным» локальным JSON.
4. Любой счётчик в UI обязан иметь точное имя, источник и проверяемую формулу.
5. Ошибка локализации не должна маскироваться английским fallback без явного статуса.
6. Не удалять пользовательские Docker volumes или глобальный Docker cache. Очистка допускается только по project label/allowlist.
7. Каждый гейт завершается отдельным коммитом в соответствующем репозитории и push в `main` после зелёной проверки.
8. Если проверка красная, агент фиксирует причину в журнале этого файла и остаётся в текущем гейте.

Старые планы не должны исполняться параллельно. Их решения включаются сюда или переводятся в историю на `G12`.

---

## 1. Итог аудита: текущая версия ещё не production-ready

### Что уже хорошо работает

- Root workspace запускает три продукта и предоставляет `pnpm dev`, `pnpm status`, `pnpm down`.
- Package Lab доступен на `http://localhost:49300`.
- Question Brain readiness доступен на `http://localhost:48127/health/ready`.
- Task Runtime readiness доступен на `http://localhost:48227/health/ready`.
- Опубликовано 1 591 Question Brain card; все карточки имеют path/domain placement.
- В QuestionCard `question.q315` существует реальная связь с `task-family.rate-limiter`.
- У rate limiter есть шесть исполняемых revisions: Go, C#, Java, TypeScript, JavaScript и SQL.
- Все шесть revisions реально запускаются в sandbox; task containers после run не протекают.
- Go-редактор использует CodeMirror и показывает синтаксические токены.
- Девять learner paths открываются без locked-переходов: Node.js + TypeScript, Java + Spring, .NET + C#, Go, Frontend, System Design, Algorithms, Behavioral, Python.
- На проверенных desktop-маршрутах нет horizontal overflow, duplicate IDs и очевидно неподписанных видимых controls.
- Browser-аудит не обнаружил console errors/warnings.

### Что блокирует production-релиз

| Severity | Находка | Доказательство | Почему критично |
|---|---|---|---|
| P0 | Основной Lab check красный | 2 suites failed, 698/700 passed | `main` не подтверждает собственный контракт |
| P0 | Runtime `go test ./...` красный | старые release fixtures не знают C#/TS rate limiter revisions | release contract расходится с runtime catalog |
| P0 | RU/EN переключатель не переключает Question Brain content | клиент не передаёт locale; controller не принимает locale | пользователь видит русский chrome и английский урок |
| P0 | Locale coverage ложноположительный | у всех 1 591 body JSON RU идентичен EN; 602 RU short answers пусты | «RU есть» сейчас значит только наличие locale-row |
| P0 | Path readiness вводит в заблуждение | Java preview показывает 40 Run-ready stations при 20 revisions всего | нельзя доверять маршруту и готовности практики |
| P0 | Три trace-island | Lab Tempo, Brain Jaeger v2, Runtime Jaeger v1 | один user journey нельзя увидеть end-to-end |
| P1 | 1 585 из 1 591 cards не имеют explicit station mapping | только path/domain placement полный | карта из 81 station не объясняет 1 591 карточку |
| P1 | Topic IDs не каноничны | три duplicate normalized topic IDs | enrichment и placement станут недетерминированными |
| P1 | Labels revisions неверны | TS и JS отображаются как `node`, SQL как `postgres` | пользователь выбирает profile, а не язык решения |
| P1 | Missing answer скрывается prompt fallback | `short_answer || prompt` | вопрос может выглядеть как готовый ответ |
| P1 | Docker storage не управляется одним lifecycle | 9.639 GB reclaimable volumes system-wide; duplicated project volume names | ручная очистка опасна и непредсказуема |
| P1 | Документация противоречива | несколько authoritative plans, stale ADR, duplicate ADR-0031 | следующий агент может реализовать старую архитектуру |
| P2 | Theme discontinuity в workspace | global Dark + editor `Follow OS · Cameo Light` | интерфейс воспринимается как две разные системы |
| P2 | Studio частично не локализован | RU shell + `System diagnostics`, `Runtime ready` | RU/EN контракт не распространяется на operator UI |
| P2 | Build budgets превышены | initial +27.07 kB, `lab.route.scss` +18.45 kB | рост UI уже не контролируется |

**Релизный вердикт:** запуск и основной execution flow существуют, но версия не может называться production, пока P0 не закрыты и все проверки `G14` не зелёные.

---

## 2. Что на самом деле означают числа продукта

Нельзя снова смешивать сущности в одном меню.

```text
Program (1)
└── Backend Engineer
    ├── Paths (9)
    │   ├── Node.js + TypeScript
    │   ├── Java + Spring
    │   ├── .NET + C#
    │   ├── Go
    │   ├── Frontend
    │   ├── System Design
    │   ├── Algorithms
    │   ├── Behavioral
    │   └── Python
    ├── Areas (15)          — крупные общие области capability graph
    ├── Stations (81)       — учебные узлы графа
    ├── Question Cards (1591)
    │   └── Topic entries (135; после G4 IDs должны быть уникальны)
    ├── Task Families (15)
    └── Task Revisions (20) — язык/версия исполняемой задачи
```

Текущая проблема не в том, что «путей только 9». Path — это маршрут, а не вопрос. Проблема в другом: UI не показывает честную связь `Path → Capability → Station → QuestionCard → TaskBrief → TaskRevision`, поэтому 1 591 карточка визуально превращается в 81 station и несколько сомнительных counters.

Целевая формула для каждого пути:

```text
Path
  → capabilities included by reviewed taxonomy
  → stations covering those capabilities
  → question cards mapped to those capabilities/stations
  → task families linked to those capabilities/questions
  → runnable revisions in the selected language
  → learner evidence and history
```

---

## 3. Целевая архитектура без fallback

```text
Question Brain (source of truth)
  QuestionCard + localized revisions + taxonomy + graph placement
       │                           │
       │ QuestionCard→TaskBrief    │ released graph
       ▼                           ▼
Task Runtime                  Fluent Lab
  TaskFamily                  learner paths / map / progress
  TaskRevision[]                   │
  sandbox profiles                 │ Run
       └───────────────────────────┘
                    │
                    ▼
                  Evidence

TypeScript Aspire AppHost (development orchestrator)
  ├── starts all services and dependencies
  ├── readiness/dependency dashboard
  └── OpenTelemetry resource naming

One OpenTelemetry Collector
  ├── Jaeger v2 (persistent traces + primary trace UI)
  ├── Prometheus (metrics)
  ├── Loki (logs)
  └── Grafana (metrics/logs dashboards, not trace replacement)
```

Владение данными:

- **Question Brain:** формулировки, ответы, локализации, taxonomy, graph placement, связи с task families.
- **Task Runtime:** executable brief revisions, fixtures, public/hidden tests, sandbox profiles, run result contract.
- **Fluent Lab:** learner UI, выбранный path, progress, evidence, orchestration user journey.
- **Root workspace:** versions/addresses, one-command lifecycle, AppHost, shared observability, scoped cleanup.

---

## 4. Обязательные продуктовые инварианты

### 4.1 Локализация

- `locale=ru|en` идёт от UI до Question Brain API в каждом запросе content/query.
- Ответ обязан возвращать `requestedLocale`, `resolvedLocale`, `fallbackUsed` и coverage по слоям.
- `fallbackUsed=true` визуально помечается и блокирует production quality gate для published core path.
- Наличие RU row не считается переводом.
- Для каждого типа карточки определены required layers.
- `prompt` никогда не используется как `shortAnswer`.
- Технические identifiers/code snippets могут быть language-neutral, но объясняющий текст обязан иметь author-reviewed locale.

### 4.2 Path и readiness

- Все paths доступны в free explore независимо от прогресса.
- Recommended mode рекомендует порядок, но не закрывает просмотр.
- `Run-ready` вычисляется только exact join: released capability + linked task family + compatible revision + healthy runtime profile.
- Global runtime counters не отображаются как counters конкретного path.
- Любая карточка счётчика раскрывает формулу и ведёт на отфильтрованный список.

### 4.3 Tasks

- `QuestionCard → TaskBrief` — semantic связь, а не копия карточки.
- Один TaskBrief может иметь несколько TaskRevision.
- Каждая revision имеет `language`, `runtimeProfile`, `editableFiles`, `fixtureFiles`, `publicTests`, `hiddenTests`, `rubric`.
- UI показывает язык (`TypeScript`), а не внутренний profile (`node`).
- Read-only fixture нельзя случайно отправить как editable source.

### 4.4 Observability

- Один trace ID проходит через Lab → Brain и/или Runtime.
- Ни один сервис не поднимает собственный Jaeger/Tempo после migration parity.
- Logs содержат trace/span/request IDs, но не raw prompts, answers, secrets или learner code.
- Jaeger хранит traces персистентно в принятом retention window.

### 4.5 Docker

- Один project name и labels для всего workspace.
- Persistent volumes имеют явный allowlist.
- `down` не удаляет данные по умолчанию.
- `reset-runtime-cache` удаляет только rebuildable workspace cache.
- `reset-all-data` требует явного подтверждения и перечисляет targets.
- Запрещены `docker system prune --volumes` и глобальное удаление чужих ресурсов.

---

# 5. План реализации по закрываемым гейтам

## G0 — зафиксировать recovery point и правду baseline

**Цель:** агент начинает с воспроизводимого состояния и не перезаписывает чужую работу.

### Действия

1. В корне и трёх репозиториях выполнить:

```bash
git status --short --branch
git log -1 --oneline
git remote -v
```

2. Записать SHAs в журнал выполнения в конце этого файла.
3. Сохранить вывод:

```bash
pnpm status
docker compose ls
docker system df -v
```

4. Не чистить, не checkout и не reset существующие изменения.
5. Если дерево не чистое — классифицировать изменения и согласовать пересечения до редактирования.

### Acceptance criteria

- Известны SHAs root, Lab, Brain и Runtime.
- Известны активные compose projects/containers/volumes.
- Есть до/после disk baseline.
- Нет удалённых пользовательских данных.

### Commit

Коммит не требуется, если изменён только локальный журнал доказательств.

---

## G1 — вернуть зелёную правду тестов

**Цель:** ни один последующий UI fix не строится поверх расходящихся fixtures.

### Lab

Исправить ожидания в:

- `apps/learning-api/src/app/domains/code-workspace/code-workspace.catalogue.spec.ts`
- `apps/learning-api/src/app/learner-route-context/learner-route-context.http.spec.ts`

Тесты должны отражать:

- C# и TypeScript rate limiter tasks существуют;
- free explore открыт;
- preview path не означает release-pending lock.

### Runtime

Обновить release fixtures в:

- `internal/engine/catalogue_test.go`
- `internal/httpapi/server_test.go`
- связанных fixtures старых releases `2026-08-24`, `g3`, `g8`.

Не ослаблять assertions. Fixtures должны явно проверять текущий release manifest и все ожидаемые task IDs.

### Проверка

```bash
cd fluent-engineering-lab && pnpm check
cd ../fluent-question-brain && make check
cd ../fluent-task-runtime && go test ./...
```

Если локального Go нет:

```bash
docker run --rm \
  -v "$PWD":/src:ro \
  -w /src \
  golang:1.24-bookworm \
  sh -lc 'PATH=/usr/local/go/bin:$PATH go test ./...'
```

### Acceptance criteria

- Lab: 100% suites pass.
- Brain: contract/build/tests pass.
- Runtime: `go test ./...` pass на чистом container image.
- Нет skipped test, добавленного ради обхода ошибки.

### Commit boundary

- Lab: `test: align catalogue and free-explore contracts`
- Runtime: `test: align release fixtures with current task catalogue`

---

## G2 — сделать RU/EN настоящим end-to-end контрактом

**Цель:** переключение языка меняет shell, question prompt и все answer layers.

### Изменения Lab API

1. В `question-brain-learner.controller.ts` добавить обязательный валидируемый `@Query('locale')`.
2. В `QuestionBrainLibrary.learnerContent` принимать locale и запрашивать именно его, а не `item.locale` из snapshot.
3. То же правило применить к detail/query endpoints, где текст зависит от locale.
4. Ответ content расширить полями:

```ts
requestedLocale: 'ru' | 'en';
resolvedLocale: 'ru' | 'en';
fallbackUsed: boolean;
layerCoverage: Record<AnswerLayer, 'translated' | 'language-neutral' | 'missing'>;
```

5. Удалить `short_answer || prompt`. Missing answer должен быть `null/missing`, а UI показывает честный empty state.

### Изменения Lab Web

1. В `question-library.component.ts` передавать текущий locale:

```text
/api/questions/{id}/content?locale=ru|en
```

2. При переключении языка инвалидировать `loadedContentId`/content cache и загрузить content заново.
3. Применить то же к path cards, related questions, prerequisites и task theory panel.
4. Устранить смешанный текст `MUST-SAY TERMS · 0 ИЗ 5`.
5. Развести два controls в task workspace:
   - `Язык интерфейса / Interface language`;
   - `Язык материала / Content language`.
6. Studio перевести тем же словарём; технические IDs оставить English monospace.

### Контрактные тесты

- RU и EN одного stable key возвращают разные author text там, где слой language-dependent.
- Переключение RU→EN после раскрытия ответа перезагружает answer.
- Missing RU layer не возвращает EN как будто RU.
- fallback отображается явно и телеметрируется без raw content.

### Acceptance criteria

- В Browser на `question.q315` RU и EN меняют prompt, short answer и explanatory layers.
- Network requests содержат locale.
- API сообщает resolved locale.
- Нет смешанных chrome-labels на проверяемых learner и Studio routes.
- `prompt-as-answer` отсутствует в code search и тестах.

### Commit boundary

Lab: `fix(i18n): make question locale explicit end to end`

---

## G3 — исправить содержательную полноту локализаций Question Brain

**Цель:** quality gate измеряет качество материала, а не наличие пары rows.

### Действия

1. Определить schema required layers по card type, например:

| Card type | Required layers |
|---|---|
| interview question | prompt, short answer, mechanism/explanation |
| system design | prompt, short answer, trade-offs, failure modes |
| behavioral | prompt, answer frame, evidence prompts |
| concept | title/prompt, explanation, examples |
| task-linked | prompt, theory bridge, TaskBrief relation |

2. Добавить section-level localization provenance:

- `translated`;
- `language_neutral`;
- `missing`;
- `source_locale`;
- `reviewed_at/reviewed_by`.

3. Создать deterministic audit, который считает:

- missing required layers по locale/type/path;
- RU/EN exact-equality для language-dependent text;
- prompt copied into answer;
- empty short answers;
- orphan localized rows;
- stale translations относительно source revision.

4. Исправить/перевести контент author-reviewed способом. Не считать автоматический перенос EN body в RU переводом.
5. Published release запрещён, если core path содержит missing required layer.

### Зафиксированный baseline, который должен исчезнуть

- identical RU/EN full body: `1591/1591`;
- empty RU short answers: `602`;
- empty EN short answers: `491`;
- identical RU/EN short answers: `404`.

Числа могут измениться после корректной типизации, но каждый остаток обязан иметь явное `language_neutral` или documented exception.

### Acceptance criteria

- Quality API публикует section-level coverage, а не только locale count.
- Нет published card с prompt-as-answer.
- Нет silent EN fallback в RU.
- Отчёт можно фильтровать по path/card type/layer.
- Все exceptions машинно читаемы и reviewable.

### Commit boundary

Question Brain: `feat(i18n): enforce reviewed layer-level locale coverage`

---

## G4 — канонизировать taxonomy и station placement

**Цель:** 1 591 карточка имеет однозначное место, а enrichment не создаёт новые дубли.

### Действия

1. Исправить duplicate normalized topic IDs:

- `distributed-systems-resilience`;
- `go-channels-select`;
- `go-sync-patterns`.

2. Ввести unique constraint на canonical topic ID и alias table для legacy spelling/case.
3. Разделить:

- path placement — к какому маршруту относится card;
- capability placement — что проверяет;
- station placement — где card появляется в учебном графе;
- topic tags — поисковые фасеты, не граф.

4. Для 1 585 cards без explicit station placement:

- сгенерировать proposals hybrid search/enrichment;
- review batch в Studio;
- принять или пометить `library-only` с причиной;
- не фабриковать station автоматически только ради 100%.

5. Добавить idempotent enrichment: повторный импорт не создаёт topic/station duplicate.

### Acceptance criteria

- Canonical topic IDs уникальны.
- Каждая published card имеет reviewed capability placement.
- Каждая card либо station-mapped, либо имеет явный `library-only` reason.
- Coverage показывает explicit station mapped и library-only отдельно.
- Повторный enrichment даёт нулевой diff.

### Commit boundary

Question Brain: `fix(taxonomy): canonicalize topics and station placement`

---

## G5 — пересобрать честные Paths и readiness projection

**Цель:** маршрут показывает то, что действительно доступно конкретному стеку.

### Действия

1. Удалить вычисление path readiness через простую фильтрацию общих area IDs.
2. Реализовать exact join:

```text
path
→ included capability
→ station
→ question card
→ task family relation
→ task revision language
→ runtime profile ready
```

3. Для каждого path показывать пять раздельных чисел:

- Cards;
- Stations;
- Task families;
- Runnable revisions для языка path;
- Evidence captured.

4. `Preview` означает «маршрут можно исследовать, но curated order ещё reviewable», а не locked.
5. Recommended mode предлагает следующую station; free explore открывает всё.
6. На каждой метрике сделать drill-down.
7. Program navigation переименовать из двусмысленного `Программа 1` в `Backend Engineer · 9 путей` или эквивалентный локализованный label.

### Обязательный regression test

Java path не может показывать больше Run-ready task families/revisions, чем существует Java revisions после exact join. Аналогично .NET, Go, Node/TS.

### Acceptance criteria

- Никаких locked paths в free explore.
- Все counters воспроизводимы API query.
- Global runtime count явно подписан global и не используется в path card.
- ADR-0035 выполняется: preview path не получает fabricated station/task readiness.

### Commit boundary

Lab: `fix(paths): derive readiness from exact capability task joins`

---

## G6 — довести QuestionCard → TaskBrief → Revision UX

**Цель:** теория и практика связаны понятно, без технического шума.

### Действия

1. Relation panel показывает:

```text
QuestionCard: «Спроектируй rate limiter»
├── теория и короткий ответ
├── system-design разбор
└── TaskBrief: «Реализовать token bucket»
    ├── Go revision
    ├── Java revision
    ├── C# revision
    ├── TypeScript revision
    ├── JavaScript revision
    └── SQL/Postgres revision
```

2. Label брать из `revision.language`, а profile показывать вторично: `TypeScript · Node 24`.
3. Устранить текущие `node/node/postgres/dotnet` как primary labels.
4. Markdown answer layers рендерить безопасно и одинаково; пользователь не должен видеть `**literal markers**`.
5. Показать, что TaskBrief один, а revisions — альтернативные способы доказать capability.
6. При возврате из task сохранить question/path context и progress.

### Acceptance criteria

- Rate limiter question показывает ровно шесть корректно подписанных revisions.
- Каждая кнопка ведёт к правильному task ID.
- Back возвращает на исходную карточку/фильтр.
- Markdown и code blocks отрендерены, sanitized и доступны с клавиатуры.

### Commit boundary

Lab: `fix(practice): clarify task families and language revisions`

---

## G7 — укрепить Runtime contract и все шесть execution flows

**Цель:** UI, Lab API и Runtime одинаково понимают editable/fixture files и результаты.

### Действия

1. В TaskRevision contract явно разделить:

```json
{
  "editableFiles": ["solution.sql"],
  "fixtureFiles": ["schema.sql"],
  "visibleFiles": ["solution.sql", "schema.sql"]
}
```

2. Добавить contract test: round-trip workspace → edit editable files → run.
3. Зафиксировать, что read-only `schema.sql` не отправляется как submitted source.
4. Для Go, C#, Java, TypeScript, JavaScript, SQL проверить:

- starter load;
- syntax language;
- one intentional failing run;
- solved passing run;
- public/hidden test split;
- evidence record;
- no leaked task container.

5. Добавить per-profile time/memory/pids/network limits и tests этих limits.

### Acceptance criteria

- 6/6 revisions проходят end-to-end test.
- Invalid fixture submission возвращает typed error, а UI объясняет проблему.
- После 20 последовательных runs нет orphan containers.
- Run log не содержит secret/raw hidden test body.

### Commit boundary

- Runtime: `feat(contract): separate editable sources from fixtures`
- Lab: `test(runtime): verify six language revisions end to end`

---

## G8 — внедрить один AppHost и один Jaeger-контур

**Цель:** `pnpm dev` запускает предсказуемую систему, а один trace объясняет любой сбой.

Полная инфраструктурная спецификация уже находится в:

`docs/ASPIRE-JAEGER-DOCKER-PRODUCTION-PLAN-2026-08-25.md`

Она является вложенной спецификацией этого гейта, а не параллельным планом.

### Обязательные решения

- TypeScript Aspire AppHost как development orchestrator.
- Один central OpenTelemetry Collector.
- Jaeger v2 persistent как trace backend/UI.
- Prometheus + Loki + Grafana для metrics/logs.
- Tempo удаляется после доказанного parity.
- Brain/Runtime repo-local Jaeger удаляются после parity.
- Stable resource names:
  - `fluent-lab-web`;
  - `fluent-learning-api`;
  - `fluent-question-brain-api`;
  - `fluent-question-brain-cms`;
  - `fluent-task-runtime`.

### Acceptance criteria

- `pnpm dev` запускает AppHost без дополнительных флагов.
- Dashboard показывает dependency/readiness каждого ресурса.
- Один trace содержит Lab → Brain и Lab → Runtime spans.
- Jaeger UI переживает restart.
- В compose/list нет второго Jaeger и Tempo.
- `pnpm status` использует ту же модель readiness, а не дублирующие несовместимые scripts.

### Commit boundary

Root: `feat(observability): unify apphost telemetry and jaeger`

---

## G9 — сделать Docker lifecycle безопасным и ограниченным workspace

**Цель:** проект не накапливает клоны, но никогда не удаляет чужие данные.

### Действия

1. Установить единый `COMPOSE_PROJECT_NAME=fluent-interview` через workspace config.
2. Все resources пометить labels:

- `com.fluent.workspace=fluent-interview`;
- `com.fluent.role=runtime|data|observability|cache`;
- `com.fluent.retention=persistent|rebuildable|ephemeral`.

3. Создать команды:

```text
pnpm dev                 # start/reconcile
pnpm status              # health + URLs + disk summary
pnpm down                # stop, preserve persistent data
pnpm clean:runtime       # only ephemeral/rebuildable labelled resources
pnpm clean:build-cache   # BuildKit cache generated by this workspace if attributable
pnpm reset:data          # explicit confirmation + exact allowlisted volumes
```

4. Мигрировать duplicated legacy volumes только после dump/restore/hash verification.
5. Добавить preflight disk thresholds и actionable warning, но не auto-delete persistent data.
6. Не делать `up --build` на каждый start, если inputs не изменились; AppHost/build graph решает rebuild.

### Acceptance criteria

- Два последовательных `pnpm dev` не создают новые duplicate containers/volumes.
- `pnpm down && pnpm dev` сохраняет progress/Brain/trace data.
- `pnpm clean:runtime` показывает exact targets и не трогает unrelated projects.
- Disk report до/после приложен.
- Нет глобального prune ни в scripts, ни в docs.

### Commit boundary

Root: `fix(docker): enforce scoped lifecycle and retention labels`

---

## G10 — дизайн-аудит и единая визуальная система

**Цель:** сохранить Cameo/Executable Trace Atlas, исправив системные расхождения без случайного редизайна.

### Дизайн-источник

- `PRODUCT.md` — product truth.
- `DESIGN.md` — visual truth после очистки stale технических утверждений.
- Skill `impeccable` — обязательный audit tool, не источник новых случайных цветов.

### Действия

1. Добавить недостающие parser dependencies для полного Impeccable scan либо документировать воспроизводимый tool container.
2. Централизовать semantic tokens и устранить бесконтрольные inline colors/radii в Studio.
3. Проверить token drift в:

- `studio-graph-surface.component.ts`;
- `studio-system.component.ts`;
- `studio-recovery.scss`;
- `studio-review.scss`;
- `studio-shell.scss`;
- task workspace/lab route styles.

4. Определить editor theme policy:

- `Follow app` — default;
- `Follow OS` — explicit choice;
- `Cameo Light`;
- `Cameo Dark`.

При global Dark редактор не должен случайно оставаться light без понятного выбранного режима.
5. Убрать thick side-tab border/декоративные приёмы, которые конфликтуют с системой, только после screenshot comparison.
6. Не ухудшить readable density на MacBook Pro 16 и Studio Display.

### Visual QA matrix

Снять одинаковые screenshots для Light/Dark:

- `/learning-map`;
- четыре primary path routes;
- `/practice/questions/question.q315`;
- rate limiter task workspace;
- `/progress`;
- `/studio/content`;
- `/studio/graph`;
- `/studio/system`.

### Acceptance criteria

- Нет clipping/overlap/horizontal overflow на desktop target sizes.
- RU и EN длинные labels помещаются.
- Focus, hover, selected, disabled и error states различимы.
- Contrast соответствует WCAG AA для текста/controls.
- Before/after screenshots приложены.
- Impeccable scan не содержит unexplained high-severity findings.

### Commit boundary

Lab: `refactor(ui): unify cameo tokens themes and studio surfaces`

---

## G11 — accessibility, performance и idle-resource hardening

**Цель:** wow-интерфейс не покупается ценой доступности и постоянной нагрузки.

### Accessibility

- Исправить heading order task workspace: один `h1`, затем последовательные уровни.
- Проверить весь core flow клавиатурой, не только DOM invariants.
- Controls RU/EN/theme/editor mode получить accessible names.
- Canvas/graph имеет list/table alternative и keyboard navigation.
- `prefers-reduced-motion` отключает декоративное движение.

### Performance

- Вернуть Angular budgets в зелёную зону без простого повышения limits:
  - initial bundle сейчас +27.07 kB;
  - `lab.route.scss` сейчас +18.45 kB.
- Lazy-load editor/xterm/task-only code.
- Не держать terminal/editor workers после ухода с task route.
- Polling/observability UI останавливать в hidden/idle state.
- Проверить heap/CPU после 30 минут idle и после 20 task runs.

### Acceptance criteria

- axe/semantic audit core routes без critical/serious violations.
- Полный learner flow доступен клавиатурой.
- Build budgets green.
- Нет живых editor workers/terminal processes после route dispose.
- Idle CPU/memory baseline и after values приложены.

### Commit boundary

Lab: `perf(a11y): harden desktop flows and idle lifecycle`

---

## G12 — убрать документационный шум и противоречащие ADR

**Цель:** новый агент не может выбрать устаревшую архитектуру.

### Принцип

ADR не удаляется как будто решения не существовало. Он получает `Superseded by ...`, а generated reports/archive можно удалить после проверки ссылок и provenance.

### Обязательные исправления ADR

| Артефакт | Действие |
|---|---|
| ADR README link для ADR-0034 | исправить ссылку с `0032-...` на `0034-task-runtime-boundary.md` |
| два ADR-0031 | оставить canonical 0031; второй перенумеровать, обновить ссылки |
| ADR-0008 Question Registry/fallback | пометить Superseded by Question Brain boundary |
| ADR-0007 runner-service | пометить Superseded by ADR-0034 |
| ADR-0004 old in-process/LM Studio startup | supersede новым AppHost/local-first ADR |
| ADR-0010 tracing opt-in | supersede central OTel/Jaeger ADR |
| ADR-0029 migration archive adapter | закрыть/supersede после подтверждения no-fallback |
| ADR-0035 preview paths | оставить активным и привести implementation в соответствие |
| Runtime README `g8` | обновить на текущий manifest/release mechanism, не hard-code stale release |
| `G13-LEGACY-REMOVAL` | закрыть доказательствами или перечислить реальные остатки |

### Старые планы и отчёты

После завершения гейтов:

1. Этот файл остаётся единственным active umbrella plan до `G14`.
2. `ASPIRE-JAEGER-...` остаётся вложенной infra-spec и получает ссылку сюда.
3. Остальные выполненные/заменённые планы перемещаются в `docs/history/plans/` с front matter `superseded_by`.
4. HTML reports без ссылок и уникальных evidence перемещаются в `docs/history/reports/` или удаляются как generated duplicates после SHA/content comparison.
5. `docs/reports/architecture-audit-2026-08-24.html` сначала проверить: на него есть ссылки.
6. `architecture-audit-2026-08-25.html`, `disk-audit-2026-08-25.html` и question-bank report variants не хранить активными без index/reference.
7. Создать `docs/README.md`: Active decisions, Active plan, Runbook, Historical evidence.

### Acceptance criteria

- Нет duplicate ADR numbers.
- Нет Accepted ADR, предписывающего fallback/archive/old runner/LM Studio default.
- Все относительные links проходят link checker.
- `rg -n "authoritative|source of truth" docs` не показывает конкурирующие active plans.
- `AGENTS.md`, PRODUCT, DESIGN, README и runbook согласованы.

### Commit boundary

- Root: `docs: consolidate production plan and archive superseded reports`
- Lab/Brain/Runtime: отдельные `docs:` коммиты только для принадлежащих им ADR/runbooks.

---

## G13 — полный Browser E2E-аудит

**Цель:** проверить реальный продукт, а не только API/tests.

Использовать in-app Browser через Accessibility snapshots. Не заменять браузерный аудит curl.

### Матрица маршрутов

| Surface | Routes |
|---|---|
| Entry/navigation | `/`, `/learning-map`, `/progress`, `/projects` |
| Paths | все 9 `/learning-map/path/*` |
| Questions | `/practice/questions`, минимум 2 cards каждого primary path, `question.q315` |
| Tasks | task family rate limiter + все 6 revision routes |
| Studio | `/studio/content`, `/studio/graph`, `/studio/system` |

Для каждого релевантного route:

- RU и EN;
- Light и Dark; Auto smoke;
- recommended и free explore;
- refresh/direct deep link/back-forward;
- keyboard path;
- console/network errors;
- no overflow at MacBook Pro 16 viewport и large Studio Display viewport.

### Обязательные learner journeys

1. Выбрать Go path → открыть card → раскрыть RU answer → перейти к Go task → run → Evidence → вернуться.
2. То же для Java.
3. То же для .NET/C#.
4. Node.js + TypeScript: выбрать именно TS revision, не JS profile label.
5. SQL revision: изменить только `solution.sql`, fixture остаётся read-only.
6. Переключить RU→EN в середине открытого ответа и убедиться, что весь content перезагрузился.

### Acceptance criteria

- Нет locked paths в free explore.
- Нет странных внутренних labels/release IDs в learner copy.
- Нет console error/unhandled request.
- Progress/history сохраняются после restart.
- Jaeger показывает traces для journeys.
- Все screenshots/network/trace IDs внесены в release evidence.

### Commit

Только fixes, обнаруженные аудитом. Каждый fix получает regression test.

---

## G14 — release gate, commit, push и handoff

**Цель:** передать проверяемый production candidate, а не обещание.

### Финальная последовательность

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm down
pnpm dev
pnpm status

cd fluent-engineering-lab && pnpm check
cd ../fluent-question-brain && make check
cd ../fluent-task-runtime && go test ./...
```

Затем повторить Browser E2E `G13` на freshly started stack.

### Release evidence manifest

Создать machine-readable manifest:

```json
{
  "rootSha": "...",
  "labSha": "...",
  "brainSha": "...",
  "runtimeSha": "...",
  "questionRelease": "...",
  "taskRelease": "...",
  "checks": {
    "lab": "pass",
    "brain": "pass",
    "runtime": "pass",
    "browser": "pass",
    "i18n": "pass",
    "observability": "pass",
    "dockerLifecycle": "pass"
  }
}
```

### Acceptance criteria

- Все P0/P1 закрыты или release остановлен.
- Все repos clean, branch `main`, commits pushed.
- Local `main` совпадает с `origin/main` во всех repos.
- Нет лишних branches, но удалять чужие branches без проверки нельзя.
- `pnpm dev` — единственная нормальная команда запуска разработчиком.
- URLs и stop/reset commands напечатаны после запуска.
- Финальный отчёт содержит только факты и ссылки на evidence.

### Final commits

- Root: `chore(release): record production readiness evidence`
- При необходимости version/release commits в каждом продукте.

---

## 6. Команды автоматизированной проверки, которые должны появиться

Root package должен предоставлять один агрегированный pipeline:

```text
pnpm verify
├── verify:contracts
├── verify:tests
├── verify:i18n
├── verify:taxonomy
├── verify:paths
├── verify:tasks
├── verify:docker
├── verify:observability
├── verify:docs
└── verify:browser
```

`pnpm verify` обязан завершаться non-zero при любом P0/P1 нарушении.

Минимальные blocking assertions:

- release IDs совместимы;
- zero unmapped capability placement;
- zero duplicate canonical topic IDs;
- zero prompt-as-answer published cards;
- zero silent locale fallback на core paths;
- all task revision references resolve;
- path counters equal exact query results;
- exactly one trace backend;
- no duplicate workspace resources after restart;
- docs links and ADR numbers valid.

---

## 7. Инструкция агенту-исполнителю

Перед началом агент должен прочитать:

1. root `AGENTS.md`;
2. `PRODUCT.md`;
3. `DESIGN.md`;
4. этот файл полностью;
5. `ASPIRE-JAEGER-DOCKER-PRODUCTION-PLAN-2026-08-25.md` перед `G8`;
6. `AGENTS.md` изменяемого репозитория.

На каждом гейте агент обязан:

1. написать короткую запись «что меняется и какой инвариант восстанавливается»;
2. внести минимально достаточное изменение без fallback;
3. добавить regression/contract test;
4. выполнить все проверки гейта;
5. сохранить evidence;
6. сделать commit и push в `main`;
7. отметить гейт закрытым только при зелёных criteria.

Запрещено:

- повышать budgets вместо оптимизации без отдельного обоснования;
- скрывать отсутствующий перевод английским текстом;
- считать path ready по global count;
- копировать task definition в Question Brain;
- возвращать legacy local registry;
- добавлять второй observability backend;
- чистить Docker глобально;
- удалять ADR без supersession trail;
- закрывать гейт по screenshot без API/test evidence.

---

## 8. Журнал выполнения

Агент дополняет таблицу, не переписывая критерии выше.

| Gate | Status | Commits | Evidence | Blocker |
|---|---|---|---|---|
| G0 | pending | — | — | — |
| G1 | pending | — | — | — |
| G2 | pending | — | — | — |
| G3 | pending | — | — | — |
| G4 | pending | — | — | — |
| G5 | pending | — | — | — |
| G6 | pending | — | — | — |
| G7 | pending | — | — | — |
| G8 | pending | — | — | — |
| G9 | pending | — | — | — |
| G10 | pending | — | — | — |
| G11 | pending | — | — | — |
| G12 | pending | — | — | — |
| G13 | pending | — | — | — |
| G14 | pending | — | — | — |

---

## 9. Definition of Done

Проект считается завершённым только когда одновременно верно:

- пользователь одной командой `pnpm dev` получает весь healthy workspace;
- все paths доступны в любом порядке;
- recommended path остаётся рекомендацией, не замком;
- 1 591+ cards честно распределены и объяснимы через taxonomy/graph;
- RU/EN переключает весь пользовательский и operator content;
- missing translation/answer не маскируется;
- вопросы и задачи связаны через capabilities/TaskBrief, а не дублируются;
- шесть rate limiter revisions запускаются и создают Evidence;
- один Jaeger trace объясняет путь Lab → Brain/Runtime;
- Docker lifecycle не плодит ресурсы и не трогает чужие данные;
- интерфейс выдерживает Light/Dark, русский/английский и desktop target sizes;
- tests, browser matrix, accessibility, performance, docs и links зелёные;
- все четыре `main` чистые и pushed.

До выполнения всех условий продукт остаётся production candidate, а не production release.
