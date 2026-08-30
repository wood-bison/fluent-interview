# Fluent Interview — лист хотелок владельца

Живой файл. Сюда складываются **решения владельца** (`owner decision`) и
**пожелания** (`wish`), даже если технически они не обязательны. Дополняется по
ходу; ничего отсюда не выкидывается молча.

Формат строки: `#N · статус · тип · что · почему это здесь`

Статусы: `open` (не начато) · `planned` (есть фаза в плане) · `done` · `dropped`
(с явным решением владельца).

`planned` означает наличие утверждённого направления и сценария реализации.
Для необратимых операций всё равно обязательны backup, rollback и release gate.
Более позднее явное решение владельца имеет приоритет над устаревшими
инструкциями репозитория; такие инструкции обновляются первой фазой работы.

Связанные документы:

- baseline «как есть»: [architecture-audit-2026-08-28.html](reports/architecture-audit-2026-08-28.html);
- утверждённая целевая архитектура: [next-monorepo-target-architecture-2026-08-28.html](reports/next-monorepo-target-architecture-2026-08-28.html);
- программа перехода: [NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md](NEXT-MONOREPO-PRODUCT-REFACTORING-PLAN-2026-08-28.md).
- challenge-аудит greenfield-варианта: [greenfield-architecture-challenge-2026-08-28.html](reports/greenfield-architecture-challenge-2026-08-28.html);
- технический memo greenfield-варианта: [GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md](GREENFIELD-ARCHITECTURE-CHALLENGE-2026-08-28.md).

---

## Зафиксировано 2026-08-28

| # | Статус | Тип | Что | Обоснование |
| --- | --- | --- | --- | --- |
| 1 | planned | owner decision | **Переписать learner UI с Vue 3 на Next.js последней версии (16.3.3)** | Явная воля владельца: «принципиально прошу переписать его на Next.js даже если это типа не надо, но это я хочу». Технической необходимости в миграции нет — Vue-стек здоров (strict TS, 116 токенов, gate'ы зелёные). Решение принято владельцем, а не выведено из аудита. |
| 2 | planned | wish | Design-система (`tokens.css`, стили, темы) переносится в Next **1:1, без потерь** | «у нас есть \[design studio\] токенов, стили, всё нужно скопировать с Vue.js правильно». Токены — чистый CSS custom properties, переносятся без изменений; гейт `pnpm design:tokens:check` должен остаться зелёным после переноса. |
| 3 | planned | owner decision | **Свести пять отдельных Git-репозиториев в один монорепозиторий** с внутренними зависимостями (Nx) | «лучше всё в одном репозитории хранить… чтобы проще было склонировать». Прямо противоречит текущему инварианту `AGENTS.md` («not a source monorepo»). Владелец — хозяин инварианта; условие: границы владения сохраняются механизмом Nx tags + `@nx/enforce-module-boundaries` вместо отдельных remote'ов. |
| 4 | planned | owner decision | `fluent-interview` становится **корневым репозиторием продукта**, а модули живут внутри workspace как отдельные сервисы | «главная папка была в репозитории, а все были как микросервисы и лежали внутри воркспейсов». |
| 5 | planned | wish | Обновить **всё**, что можно обновить, во всех языках (TS, Node, Go, инструменты) | «как минимум нужно обновить всё, что есть». |
| 6 | planned | wish | Перейти на **TypeScript последней версии (7.x)** | «нужно использовать TypeScript последней версии». Проверено эмпирически: работает, включая `emitDecoratorMetadata` для Nest DI. |
| 7 | planned | wish | Проверить, есть ли версия Nest.js, живущая с TypeScript 7 | «там у нас Nest.js и там, скорее всего, нет версии, но возможно уже есть». Ответ: Nest 12.0.1 + TS 7.0.2 работают; см. раздел «TypeScript 7» в HTML-отчёте. |
| 8 | planned | wish | Нарисовать граф связей приложения «до» и «после» | «во-первых нарисовать граф, как наше приложение связано». |
| 9 | planned | wish | Рефакторинг против сильной связанности: coupling/cohesion, SOLID, clean code | «подумать, как его рефакторить, чтобы избавиться от сильной связанности». |
| 10 | planned | scope | Пока рассматриваем только **CRUD-поверхность**, без новой продуктовой функциональности | «пока это всё только CRUD-Only». Принято как ограничение области рефакторинга. |
| 11 | done | wish | Отчёт — **HTML на русском языке**, визуальный, с «до/после» | «подготовить HTML на русском языке, где дословно, визуально всё нарисовать, показать, какие есть до, после». |
| 12 | open | wish | Держать этот лист хотелок и дополнять его | «Ты делай на лист того, что я хочу», «Возможно что-то ещё захочу». |

### Коллизии, разрешённые владельцем 2026-08-28

| Записи | Было | Принятое решение |
| --- | --- | --- |
| #1, #2 | Production UI сейчас Vue-native | Финальный learner UI — Next.js; Vue сохраняется только как временный rollback до parity/sign-off |
| #3, #4 | `AGENTS.md` описывает пять независимых source-репозиториев | Финальный source of truth — корневой `fluent-interview`; сервисные границы сохраняются контрактами, Nx tags и владельцами данных |

## Открытые вопросы, требующие вашего решения (появились из аудита 28.08.2026)

| # | Статус | Тип | Что | Почему нужно решение |
| --- | --- | --- | --- | --- |
| 13 | planned | architecture | **Next как настоящий server-rendered App Router**, а не статический export | Цель владельца — получить релевантный опыт Next: Server Components, streaming, caching, Server Actions/Route Handlers и production runtime. Статический export не достигает этой цели. |
| 14 | open | decision | **Владелец объединённого репозитория**: организация `wood-bison` или личный аккаунт | Сейчас три репозитория в `wood-bison`, `fluent-question-vault` — на личном `szhechko`, у Vue remote нет. Блокирует Ф6. |
| 15 | open | decision | **C++ в продукте**: убрать `@codemirror/lang-cpp` из бандла или добавить шестую песочницу исполнения | Редактор подсвечивает 6 языков, песочниц 5 — C++ подсветить можно, исполнить нельзя. 0 задач на C++ в дескрипторах. |
| 16 | open | decision | **Выравнивание PostgreSQL на один мажор** (Lab на pg17, Brain на pg18, песочница задач на 17) | Не «bump тега»: `pg_upgrade` или dump/restore для durable-томов + совместимость `pgvector`. Нужно ваше «да» на отдельную задачу с бэкапом. |
| 17 | open | wish? | Обновить образы наблюдаемости (Grafana 11.5 → 13.2 — два мажора, Prometheus v3.1 → v3.14, Loki 3.3 → 3.7) | Дашборды Grafana между 11 и 13 могут потребовать правок. Подтвердить, что это в области работ. |
| 18 | planned | architecture | **Vitest + Testing Library** для TS unit/component; Playwright только для E2E | Убирает два конкурирующих test runner и возвращает Playwright на его правильный слой. Async Server Components проверяются route integration/E2E. |

## Дополнено 2026-08-28 (после разбора solvit.space и доуточнения архитектуры)

| # | Статус | Тип | Что | Почему это здесь |
| --- | --- | --- | --- | --- |
| 19 | planned | wish | Разобрать конкурента solvit.space и забрать сильные решения | Повторный разбор — раздел 16 отчёта. Перенимаем паттерны и публично наблюдаемые контракты, не платный контент и не предположения об их закрытом backend. |
| 20 | open | wish | **`acceptance_rate` / `tried` / `solved` на карточке задачи** с версионированной формулой | Попытки уже пишутся в три репозитория. Сначала определить denominator и окно: публичные примеры Solvit доказывают, что `acceptance_rate` не равен простому `users_solved/users_tried`. |
| 21 | open | wish | **Компания как справочник, а не текст.** Нормализовать `content.question.company`, схлопнуть дубли регистра, вывести фильтром | В проверенном DB-снимке было заполнено 222 из 1 596, с `Avito`(72) и `avito`(1); текущий W22 release содержит 1 591 карточку. Числа должны храниться с `releaseId`, а не как вечная константа. |
| 22 | open | wish | **Тип задачи `sql_runner`**: переиспользуемая учебная БД + структурные `table_relationships` + превью строк таблицы | Дорого и ценно. Даёт авто-ER-диаграмму и подсказки по связям как производные от данных, а не как картинку в условии. |
| 23 | open | decision | **Сигнал спроса рынка** (аналог их аналитики вакансий с hh.ru) — брать или нет, и из какого источника | Место для входа уже спроектировано: `content.capability_coverage_target` + `pnpm coverage:backlog` приоритизируют по редакторскому мнению, а не по спросу. Требует решения по источнику данных и легальности сбора. |
| 24 | open | wish | **Крауд-вклад в контент**: «предложить компанию-источник», «предложить изменение» → в существующую очередь ревью | `import_review_stage`, `placement_decision`, `question_source_url` уже есть; вклада сообщества нет. |
| 25 | open | wish | **Решения сообщества и «Мои решения»** на странице задачи | Попытки с кодом уже хранятся — это витрина, не новая подсистема. |
| 26 | open | scope | **Объём контента**: W22 содержит 15 TaskFamily / 19 TaskRevision; публичный Solvit-каталог показывает «Все 166», а фильтры сложности суммируются в 170 | Не архитектурная задача. Нужен контентный план и единая единица учёта; сравнивать family, revision и строку каталога как «задачу» нельзя. |
| 27 | planned | wish | **Декомпозиция второго уровня**: разобрать `libs/lab-contracts` (84 722 строки, 63 534 в плоском корне, учебный контент внутри) | «посмотри как её можно улучшить, сделать ещё больше декомпозицию». Раздел 17: порты/адаптеры внутри домена, CQRS-lite, 5 числовых порогов для CI. |
| 28 | open | decision | **Числовые пороги декомпозиции как гейт CI**: ≥20 проектов Nx, ≤12 импортов в AppModule, ≤6 000 строк на библиотеку, ≤25 файлов в каталоге, 0 рёбер домен→домен | Подтвердить пороги — без числа декомпозиция останавливается на середине. |
| 29 | planned | wish | **Как фронтенд узнаёт об изменениях**: ETag → указатель релиза → SSE-канал | Раздел 18. Producer-сторона готова: outbox на 10 841 событие. Не хватает транспорта: ETag не используется ни разу, SSE есть только для стриминга ИИ. |
| 30 | planned | architecture | **Provider-owned OpenAPI 3.1 + versioned JSON Schema** → generated TS/Go clients; Zod — исполняемый TS decoder на границе | Zod не является нейтральной схемой для Go. Один межъязыковой источник истины должен быть language-neutral; generated files не редактируются вручную. |
| 31 | open | wish | Заполнить граф вопросов: текущий W07 release содержит **0 рёбер**, а 2 001 `related` proposal ждёт editorial review | Публичная поверхность Solvit не показывает semantic graph, но не доказывает его отсутствие. Наш подтверждённый факт — безопасный пустой production release и незакрытый review backlog. |

## Дополнено 2026-08-28 (валидация знаний и границы заимствования)

| # | Статус | Тип | Что | Почему это здесь |
| --- | --- | --- | --- | --- |
| 32 | planned | architecture | **AssessmentPolicy для каждого ActivityKind**: `mode`, `authority`, `requiredEvidence`, `mayUnlock`, `retentionPolicy`, версии rubric/evaluator | Theory, code, SQL, interview и project нельзя честно проверять одним boolean `passed`. Это центральный вывод повторного аудита Solvit и нашего кода. |
| 33 | open | defect | **Развести self-confidence и mastery.** `POST /recall/grade` принимает learner-authored `solid/partial/missed` и term counts без текста ответа | Текущий контракт годится для SRS, но не доказывает recall. Он не должен сам открывать capability или смешиваться с server-verified evidence. |
| 34 | planned | quality | **Adversarial corpus для explanation rubrics**: keyword stuffing, отрицания, бессвязный текст, верная мысль без ожидаемого слова, RU/EN | Event Loop assessor использует regex и минимум 12 слов. Детерминизм полезен, но без такого корпуса неизбежны false pass/false miss. |
| 35 | planned | product | **Run и Submit — разные команды и разные доказательства** | Run даёт feedback и trace; только Submit против pinned TaskRevision/hidden checks может создать accepted run evidence. Паттерн хорошо виден у Solvit и совместим с нашим Runtime. |
| 36 | planned | architecture | **Server-owned verdict остаётся инвариантом**: браузер, AI и self-grade не могут прислать `accepted`, unlock или mastery | Runtime уже скрывает tests/starter, запускает digest-pinned sandbox без сети и sanitizes output. Рефакторинг DTO/UI не должен ослабить эту границу. |
| 37 | open | wish | **Typed SQL dataset**: schema/columns/relationships/preview как данные, отдельный reusable dataset release | Заимствуем публично наблюдаемый UX-паттерн Solvit; точный их comparator неизвестен, поэтому свой validator проектируется через explicit expected semantics и несколько hidden datasets. |
| 38 | open | quality | **Data dictionary для task metrics**: `attempt`, `run`, `submit`, `accepted`, `uniqueSolver`, `acceptanceRate`, окно и release | Без формул метрики становятся декоративными и противоречат друг другу, как публичные 166/170 и rate vs solved/tried у Solvit. |
| 39 | planned | content | **Закрыть projection gap**: 1 591 Brain cards → сейчас только 6 station-bound cards; 27 runnable stations | Главная проблема не размер банка, а доказанная связь `route → station → question → capability → task family → revision → attempt`. |
| 40 | planned | compliance | **Не копировать платный корпус Solvit.** Только продуктовый анализ, собственные формулировки, открытые/лицензированные источники и provenance на каждой imported card | Их условия ограничивают передачу материалов без прав и автоматизированную навигацию. Подписка не превращает базу в источник для массового переноса. |
| 41 | done | owner decision | **Стратегия UI и topology подтверждена:** Next.js + source monorepo | Повторно и недвусмысленно подтверждено владельцем 2026-08-28. Блокирующего decision gate больше нет. |

## Дополнено 2026-08-28 (утверждённая target architecture)

| # | Статус | Тип | Что | Почему это здесь |
| --- | --- | --- | --- | --- |
| 42 | planned | architecture | Разделить переход на два независимых cutover: **repo/CI consolidation**, затем **Vue → Next route parity** | Не смешивать перенос Git history, смену UI и обновление всех runtime в один недиагностируемый big-bang. |
| 43 | planned | architecture | Один Git не означает shared DB/ORM: Learning API, Question Brain и Task Runtime остаются bounded contexts | Монорепо упрощает разработку, но не отменяет ownership и сетевые контракты. |
| 44 | planned | safety | Перед импортом сделать tag + `git bundle` + file/SHA manifest каждого child repo; старые remotes архивировать только после release sign-off | Vue сейчас не имеет remote и несёт самый высокий риск потери истории. |
| 45 | planned | product | Исправить projection defect: versioned capability→station placement release вместо hard-coded crosswalk | Brain имеет 149 accepted bindings, а Lab использует только 31 и показывает 6 station-bound cards. |
| 46 | planned | product | Довести Content Studio до реального author→review→publish→release→reconcile workflow с RBAC и two-person rule | Payload существует, но содержит 2 документа против 6 012 canonical questions; smoke обходит реальный hook. |
| 47 | planned | security | Task Runtime получает отдельные `Run` и `Submit`, async lifecycle, dedicated sandbox workers и hidden-test non-disclosure gate | Текущий единственный `/v1/runs` и readable hidden mount недостаточны для adversarial production judge. |
| 48 | planned | quality | Заменить browser-heavy gate zoo тестовой пирамидой: unit/component/story/contract/integration/runtime-conformance + 8–15 golden E2E | В Lab 257 gate scripts, а Vue имеет 53 Playwright tests и один Vitest spec; это дорого и плохо локализует дефекты. |
| 49 | planned | product | Штурман становится contextual action engine: Socratic hint ladder, misconception detection, trace explainer, route planner, spoken coach и authoring copilot | Он остаётся advisory-only и никогда не создаёт verdict/mastery/unlock; нужен eval corpus и versioned prompt telemetry. |
| 50 | planned | compliance | Внешний контент попадает только через provenance/license/dedupe/review pipeline | Подписка Solvit разрешает изучать продуктовые паттерны, но не массово копировать платный корпус. |

## Дополнено 2026-08-28 (greenfield challenge, решение ещё не принято)

| # | Статус | Тип | Что | Почему это здесь |
| --- | --- | --- | --- | --- |
| 51 | open | owner proposal | **Создать новый чистый Git-репозиторий и переносить capability-by-capability; текущий workspace сохранить immutable Reference Product** | Владелец предложил начинать с нуля, чтобы старый продукт оставался запускаемым эталоном и точкой сравнения. Challenge-аудит поддерживает hybrid greenfield, но remote ещё не создаётся без финального подтверждения. |
| 52 | open | architecture | Не импортировать пять Git histories; сохранить tags, bundles, SHA manifests и machine-readable Port Ledger | Старая история несёт generated evidence и старую topology. Provenance сохраняется явно, а не через nested repositories или silent copy/paste. |
| 53 | open | architecture | Рассмотреть **три core deployables**: Next web, Nest platform API с Question Catalog module, отдельный Go Task Runtime | Runtime имеет реальную trust boundary. Независимая deployable-boundary Question Brain пока не доказана и может остаться портом для будущего extraction. |
| 54 | open | devex | Канонический `pnpm dev` поднимает один project-scoped Compose stack с Watch; cleanup удаляет только allowlisted ephemeral resources текущего stack | Убирает три Compose projects, orphan containers, глобальные имена и недетерминированный lifecycle. Durable data переживает обычный `down`. |
| 55 | open | content architecture | Git хранит schemas/manifests/fixtures; PostgreSQL — редакторские revisions/placements/provenance; S3-compatible storage — большие и sealed artifacts; разработчик видит materialized ignored Markdown worktree | Архивирование Markdown в Git ухудшает review. Текущий текстовый corpus не является причиной Git bloat; важнее revision/provenance/query consistency. |
| 56 | open | architecture | Payload, Redis, Kafka и тяжёлый observability backend не входят в core без measured need и отдельного ADR | Greenfield не должен автоматически переносить каждый существующий deployable. OTel instrumentation/Collector обязательны, backend и учебные брокеры — profiles. |
| 57 | open | migration | Первый port — один полный Node vertical slice `path → lesson → question → Run → Submit → verdict → evidence → progress` | Это защищает от second-system effect: production capability появляется до массового scaffolding и доказывает Next/Nest/Runtime/data/telemetry/rollback вместе. |
| 58 | open | observability architecture | Разделить **Stack Control Plane**, **Technical Telemetry** и **Learning Evidence**; запретить каждому слою становиться authority другого | Grafana не подтверждает mastery, PostgreSQL progress не заменяет readiness, Docker labels не являются историей обучения. |
| 59 | open | observability backend | Заменить пять разрозненных telemetry products одним project-scoped `grafana/otel-lgtm` profile; сохранить OTLP provider boundary | Для локального single-user development/testing один persisted image проще текущих Grafana + Loki + Prometheus + Promtail + Jaeger. |
| 60 | planned | dependency lifecycle | Удалить Promtail: он достиг EOL 02.03.2026; Alloy разрешён только как обоснованный log-collection adapter, а не второй collector по умолчанию | Текущий `grafana/promtail:3.3.2` больше не поддерживается. `otel-lgtm` уже содержит Collector. |
| 61 | planned | instrumentation | Next использует `instrumentation.ts`; Nest/Node и Go — stable traces/metrics + structured stdout; Kotlin/JVM — OTel Java agent/autoconfigure, не native Kotlin SDK | На 28.08.2026 JS logs — Development, Go logs — Beta, Kotlin SDK — Development, Java signals — Stable. Exporter outage не блокирует verdict/readiness. |
| 62 | planned | devex | Ввести append-only `StackSession`, expected-service manifest, `doctor/status --json`, orphan/cache/schema/image drift detection и scoped cleanup | Текущий status смешивает dev/package mode; найдены оставшиеся unlabeled recovery container и volume. История startup должна существовать даже при падении до Postgres/Collector. |
| 63 | planned | product data | Попытки, помощь, mastery, revision и cold repeat хранятся как canonical Learning Evidence в PostgreSQL; telemetry получает только redacted aggregates | Это сохраняет учебную историю независимо от TTL/restart observability backend и исключает ложные unlocks по метрикам. |
| 64 | open | retention | Зафиксировать project-scoped disk budget 6–8 GiB, 90 дней StackSession, 30 дней metrics, 7 дней traces/logs, 30 дней incident bundles; проверить реальную конфигурацию отдельным gate | Политика должна быть измеримой и не использовать global prune. Цифры остаются target до load/recovery validation. |
| 65 | planned | learning quality | Ввести пятиступенчатую readiness model и benchmark suite: operational → curriculum → executable practice → proven mastery → interview benchmarked | Обещание «готов к Big Tech/архитекторскому интервью» требует unseen transfer, retention 7/30 дней, timed coding, system design, incident response, English defense и human mock. |

## Как дополнять

Новая строка — в конец таблицы, номер +1, дата в заголовке блока, если пожелание
пришло позже. Если пожелание отменяется — статус `dropped` и одна строка почему,
без удаления записи.
