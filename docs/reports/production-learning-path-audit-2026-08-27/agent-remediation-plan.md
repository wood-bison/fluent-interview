# Fluent Interview — production learning-path remediation plan

Дата: 2026-08-27  
Статус: **исполняемый план, не выполненная работа**  
Основание: `production-learning-path-audit-2026-08-27/report.html`

## 0. Цель и non-negotiable правила

Цель — довести Brain → Runtime → Lab → Vue до состояния, в котором Node.js,
Java, Go, .NET, Frontend/Vue и shared paths показывают только объяснимый
контент, честно различают theory/practice/runtime/mastery и воспроизводимо
проходят production release gate.

- [ ] `R-001` Работать только в umbrella `/Users/sergeyzhechko/developer/fluent-interview` и его зарегистрированных child repositories.
- [ ] `R-002` Перед изменениями полностью прочитать root и child `AGENTS.md`, затем актуальные `CONTEXT.md`/ADR.
- [ ] `R-003` Не делать reset/checkout/clean поверх существующих user changes; сначала зафиксировать dirty-state ledger.
- [ ] `R-003a` Не замораживать разработку: immutable baseline означает только запрет использовать текущий тестовый graph/release как learner source; новые cards, tasks и revisions продолжают проходить через новые reviewed releases.
- [ ] `R-004` Не переносить ownership: Brain владеет QuestionCard/Capability, Runtime — TaskFamily/TaskRevision/execution, Lab — curriculum/progress/projection, Vue — learner UI.
- [ ] `R-005` Не копировать shared QuestionCard в каждый language path.
- [ ] `R-006` Не создавать TaskFamily только ради счётчика; требуется deterministic oracle или честный другой evidence mode.
- [ ] `R-007` Не называть `published`, `content-ready`, `graph-ready`, `runtime-ready`, `attempted`, `mastered` одним словом «готово».
- [ ] `R-008` Не закрывать checkbox без команды, machine-readable proof и ссылки на evidence.
- [ ] `R-009` После каждой волны запускать failure injection, доказывающий, что новый guard действительно краснеет.
- [ ] `R-010` Коммитить одну смысловую волну за раз; root pointer updates — отдельным commit после child commits.

## 1. Baseline и воспроизводимость

Owner: umbrella + все сервисы. Exit: clean reproducible baseline, без изменения продукта.

- [ ] `B-001` Записать root/child branch, HEAD, upstream, ahead/behind и dirty files в `verification/path-release/B00/repo-state.json`.
- [ ] `B-002` Записать `docker compose ls`, контейнеры, images, volumes и networks только workspace-owned stack.
- [ ] `B-003` Выполнить canonical `pnpm status`; сохранить Brain/Runtime release IDs и четыре service SHAs.
- [ ] `B-004` Снять `/health`, Brain `/v1/quality`, Runtime `/v1/task-families`, Lab `/api/program/map` и Vue build metadata.
- [ ] `B-005` Выполнить `pnpm question:catalog:integrity:check` и сохранить JSON.
- [ ] `B-006` Выполнить `pnpm learning:modules:gate:check` и сохранить JSON.
- [ ] `B-007` Выполнить `pnpm track:views:gate:check` и сохранить JSON.
- [ ] `B-008` Выполнить `pnpm activity:gate:check` и сохранить JSON.
- [ ] `B-009` Выполнить Runtime bindings/release-join/validation matrix checks.
- [ ] `B-010` Выполнить Vue `pnpm check` и `pnpm e2e`; сохранить полный итог, не промежуточный progress.
- [ ] `B-011` Зафиксировать baseline counters: 1591 total, 1100 content-ready, 491 incomplete, 48 structured, 85 editorial queue, 19 runtime-bound.
- [ ] `B-012` Зафиксировать path counters и effective areas для всех 9 paths.
- [ ] `B-013` Зафиксировать Runtime revisions по profiles: Node 12, PostgreSQL 3, .NET 2, Java 1, Go 1.
- [ ] `B-014` Создать `baseline-review.md` с явным `PASS/BLOCKED`, не продолжать при неизвестном release drift.

## 2. Починить сами verification gates

Owner: Lab + umbrella. Exit: одна команда одинаково работает в dev/CI/release.

- [ ] `G-001` Найти все hard-coded `49301` и классифицировать packaged-only vs accidental default.
- [ ] `G-002` Ввести единый environment-aware API resolver с явными dev/packaged/CI profiles.
- [ ] `G-003` Удалить silent fallback на произвольный localhost port.
- [ ] `G-004` Исправить `semantic-placement --check`, чтобы canonical dev stack работал без ручного `--base-url`.
- [ ] `G-005` Исправить `g12:practice:disposition:check` тем же контрактом.
- [ ] `G-006` Создать canonical committed evidence для question curriculum shape.
- [ ] `G-007` Создать canonical committed evidence для route action destinations.
- [ ] `G-008` Гарантировать deterministic sort/hash и idempotent regeneration обоих evidence files.
- [ ] `G-009` Добавить stale-release detection: evidence с другим Brain/Runtime release обязан падать.
- [ ] `G-010` Добавить source-SHA detection: evidence с другим generator SHA обязан падать.
- [ ] `G-011` Исправить `activity:gate`: вычислять `runnableReleasedCount` из authoritative Runtime join, не константой `0`.
- [ ] `G-012` Добавить timeout/typed error для недоступного Brain/Runtime вместо misleading zero counts.
- [ ] `G-013` Собрать `pnpm verify:path-release`, агрегирующий все semantic gates.
- [ ] `G-014` Failure injection: изменить порт/Brain release/evidence hash и доказать non-zero exit.
- [ ] `G-015` Failure injection: выключить Runtime и доказать typed `DEPENDENCY_UNAVAILABLE`, а не `0 runnable`.
- [ ] `G-016` Exit proof: fresh dev и clean CI profile выдают одинаковые semantic counts.

## 3. Canonical path composition contract

Owner: Brain registry + Lab curriculum compiler. Exit: каждый path — versioned view над native/shared modules.

- [ ] `P-001` Утвердить сущности `TrackView`, `LearningModule`, `TrackViewModule`, `QuestionPlacement` и их owners.
- [ ] `P-002` Зафиксировать stable keys, revision IDs, release IDs, provenance и reviewer для каждой связи.
- [ ] `P-003` Разделить module kind: `language-native`, `shared-core`, `overlay`, `preview`.
- [ ] `P-004` Определить explicit include/exclude rules для всех 9 paths, не только 2 isolated paths.
- [ ] `P-005` Node allow-list: Node runtime/native + утверждённые shared modules; убрать Java/Go/.NET native modules.
- [ ] `P-006` Java allow-list: Java/Spring native + утверждённые shared modules; убрать `other-runtimes` без reviewed rationale.
- [ ] `P-007` Go allow-list: Go native + shared core; не наследовать Node/Java-specific topics.
- [ ] `P-008` .NET allow-list: .NET native + shared core; не наследовать JVM/Node-specific implementation questions.
- [ ] `P-009` Frontend allow-list: Vue/TypeScript native + Web Core + selected shared modules.
- [ ] `P-010` Python оставить `preview`, пока нет owner-approved minimum native corpus/runtime disposition.
- [ ] `P-011` Algorithms и Behavioral оформить как explicit overlays или обязательные shared modules по owner decision.
- [ ] `P-012` System Design перестать использовать как catch-all storage path; сохранить cards, изменить membership semantics.
- [ ] `P-013` Для каждого module описать prerequisites, sequence rationale, evidence modes и locale coverage.
- [ ] `P-014` Компилятор path release обязан отклонять module cycle и duplicate effective placement.
- [ ] `P-015` Компилятор обязан выдавать effective cards/topics/stations/task families для выбранного path.
- [ ] `P-016` Добавить JSON schema и contract tests для path release.
- [ ] `P-017` Добавить deterministic manifest diff в PR/review output.
- [ ] `P-018` Failure injection: включить `module.java-runtime` в Node и получить gate failure.
- [ ] `P-019` Failure injection: создать shared/native duplicate placement и получить gate failure.
- [ ] `P-020` Exit proof: 9/9 paths имеют isolation/composition policy и reviewer PASS.

## 4. Station → Runtime compatibility

Owner: Lab + Runtime contracts. Exit: чужая runtime revision физически не может попасть в path release.

- [ ] `T-001` Определить compatibility tuple: path, station, capability, family, revision, language, profile, runtime status.
- [ ] `T-002` TaskFamily оставить language-neutral; TaskRevision остаётся владельцем language/profile.
- [ ] `T-003` Station публикует allowed revision/profile rules, а не UI guess по названию.
- [ ] `T-004` Runtime relation join проверяет exact immutable revision и Brain release.
- [ ] `T-005` Добавить gate, запрещающий Node/JavaScript-only revision в Java-native station.
- [ ] `T-006` Разрешить multi-language family только при отдельной compatible revision.
- [ ] `T-007` Исправить Java shared HTTP: убрать `node-auth-015` или добавить настоящую Java revision и reviewed capability fit.
- [ ] `T-008` Проверить все 81 Node stations и 50 Java stations тем же compatibility join.
- [ ] `T-009` Проверить Go/.NET/PostgreSQL/Frontend paths, даже если UI не рекламирует Run.
- [ ] `T-010` API возвращает `runtimeReleaseStatus`, `graphBindingStatus`, `activityAvailability` отдельными полями.
- [ ] `T-011` UI language selector строится только по compatible released revisions family.
- [ ] `T-012` Ноль compatible revisions показывает theory/brief disposition, не disabled fake Run.
- [ ] `T-013` Failure injection: подменить Java binding на Node revision — compiler должен отказать release.
- [ ] `T-014` Failure injection: пометить revision deferred — UI не должен рекламировать Run.
- [ ] `T-015` Exit proof: `node-auth-015` отсутствует в Java или имеет verified Java revision.

## 5. Questions library как часть выбранного path

Owner: Lab projection + Vue. Exit: путь, библиотека и фильтры описывают один effective curriculum.

- [ ] `Q-001` Определить path question union: native placements + approved shared placements + optional overlays.
- [ ] `Q-002` Не копировать QuestionCard; хранить membership/release link.
- [ ] `Q-003` Добавить placement role: primary, prerequisite, recall, contrast, follow-up, project-evidence.
- [ ] `Q-004` Добавить deterministic order: module sequence → capability depth → role → stable key.
- [ ] `Q-005` `/questions?pathKey=path.java-spring` должен включать reviewed shared cards, не только 191 native.
- [ ] `Q-006` Аналогично проверить Node, Go, .NET, Frontend и System Design.
- [ ] `Q-007` Topic facets вычислять только из effective path result set.
- [ ] `Q-008` Language, level, group, readiness facets вычислять из того же release snapshot.
- [ ] `Q-009` Global library оставляет global facets только без path context.
- [ ] `Q-010` Breadcrumb/back/refresh сохраняют path context и filter state.
- [ ] `Q-011` UI объясняет native/shared/overlay badge без внутренней Studio-терминологии.
- [ ] `Q-012` Counter рядом с path объясняет denominator: native, shared, total effective.
- [ ] `Q-013` Исправить RU readiness 989 vs funnel 1100: либо общая формула, либо явные разные определения.
- [ ] `Q-014` Запретить silent locale fallback для core primary cards.
- [ ] `Q-015` Добавить zero-result и unavailable dependency states.
- [ ] `Q-016` Failure injection: Java facet API возвращает Go topic — gate должен упасть.
- [ ] `Q-017` Failure injection: удалить shared placement — count/hash drift должен упасть.
- [ ] `Q-018` Exit proof: sampled 20 cards/path объясняют membership до конкретного module/capability.

## 6. Content readiness и editorial normalization

Owner: Question Brain/Studio. Exit: 1 591 карточек имеют честный disposition и проверяемую роль.

- [ ] `C-001` Сохранить current release immutable; enrichment выпускается новой revision/release.
- [ ] `C-002` Для 491 incomplete cards создать deterministic editorial queue.
- [ ] `C-003` Для каждой карточки хранить `ready|partial|quarantined` и cause code.
- [ ] `C-004` Для каждой карточки хранить path/module/capability placement role.
- [ ] `C-005` Для 978 generic language metadata применить reviewed language-neutral policy, не blind inference.
- [ ] `C-006` Разобрать 116 warnings внутри language-native paths.
- [ ] `C-007` Нормализовать 3 topic alias families и сохранить redirects.
- [ ] `C-008` Проверить 0 prompt-as-answer отдельно для RU и EN.
- [ ] `C-009` Проверить short answer, mechanism, traps, follow-ups, terms и practice layers.
- [ ] `C-010` Проверить provenance/reviewer для core primary cards.
- [ ] `C-011` Запретить mass auto-bind по title/topic/embedding.
- [ ] `C-012` Embedding/LLM создаёт proposal, human accept/reject и audit trail.
- [ ] `C-013` Bulk action допустим только после preview одинакового решения.
- [ ] `C-014` Добавить undo до release и idempotent replay.
- [ ] `C-015` Сэмпл-review: минимум 20 cards × 9 paths + все placement roles.
- [ ] `C-016` Expert-review больших System Design/PostgreSQL/distributed clusters.
- [ ] `C-017` Failure injection: silent RU fallback и prompt-as-answer должны блокировать release.
- [ ] `C-018` Exit proof: 1591/1591 dispositions, 0 unexplained gaps, reviewer PASS.

## 7. Practice taxonomy и глубина задач

Owner: Brain editorial + Lab activities + Runtime. Exit: каждая capability имеет честный evidence mode; pilot paths имеют достаточную глубину.

- [ ] `A-001` Triage 85 task-like unstructured cards по evidence modes.
- [ ] `A-002` Режимы: recall, predict, code, debug, design, incident, spoken defense, project checkpoint, external repo.
- [ ] `A-003` Не считать recall/brief/deferred «missing» без capability-specific policy.
- [ ] `A-004` Определить practice SLA для pilot Node, PostgreSQL и rate limiter/System Design.
- [ ] `A-005` Определить отдельный SLA для Java path; один rate limiter недостаточен для production path claim.
- [ ] `A-006` Для Node проверить coverage event loop, streams, memory, concurrency, module systems, diagnostics, HTTP/auth.
- [ ] `A-007` Для Java проверить JVM/memory, concurrency, collections, Spring DI/AOP, transactions, security, data access.
- [ ] `A-008` Для Go проверить goroutines/channels/select, cancellation, interfaces, memory/escape, net/http, pprof/testing.
- [ ] `A-009` Для .NET проверить async/cancellation, DI, middleware, EF/transactions, memory/GC, diagnostics.
- [ ] `A-010` PostgreSQL сохранить минимум locks/isolation, SKIP LOCKED queue, query plan before/after.
- [ ] `A-011` Семь practice gaps получить owner disposition и backlog.
- [ ] `A-012` Browser/Vue activity не рекламировать executable до реального browser profile или typed external brief.
- [ ] `A-013` Каждая TaskFamily публикует capability assessment plan и deliberate-failure scenario.
- [ ] `A-014` Каждая runnable revision имеет pinned digest, network none, hidden checks и bounded resources.
- [ ] `A-015` Добавить fail/pass/timeout/runtime_error/runtime_not_ready acceptance.
- [ ] `A-016` Выполнить 20 последовательных runs без leaked containers/volumes/processes.
- [ ] `A-017` Failure injection: task без oracle/pinned image должен блокировать release.
- [ ] `A-018` Exit proof: per-path task depth report различает families, revisions и bound capabilities.

### 7.1 Research → новая задача → executable release

Эта подпоследовательность разблокирует найденные пробелы. Она не требует
покупки платного контента и не изменяет baseline молча: каждый новый материал
получает provenance, reviewer и новую immutable revision.

- [ ] `A-019` Для каждого из семи practice gaps сформировать список capability outcomes и edge cases до поиска примеров.
- [ ] `A-020` Провести web research по официальным спецификациям/документации и сильным open-source учебным примерам; сохранить URL, дату и license note.
- [ ] `A-021` Не копировать защищённый текст/решения; переписать задачу своими словами и сохранить только короткие ссылки на источники.
- [ ] `A-022` Для каждой новой задачи написать learner prompt, constraints, expected evidence, hints и rubric до starter code.
- [ ] `A-023` Определить, является ли задача `code`, `debug`, `design`, `incident`, `spoken` или `external-repo`; не выдавать sandbox там, где нет oracle.
- [ ] `A-024` Для runnable задач создать TaskFamily и минимум одну language-appropriate TaskRevision с pinned image/digest.
- [ ] `A-025` Для Node/Java/Go/.NET variants сохранить общую capability contract, но отдельные compile/runtime semantics.
- [ ] `A-026` Написать visible examples и hidden tests для happy path, boundary, malformed input, timeout и deliberate failure.
- [ ] `A-027` Проверить deterministic output минимум 3 раза на clean sandbox.
- [ ] `A-028` Добавить QuestionPlacement в approved module/path и проверить отсутствие foreign-language leakage.
- [ ] `A-029` Добавить task release join и только после него включить Run в learner UI.
- [ ] `A-030` Обновить practice-depth report: family count, revision count, capability coverage, difficulty and missing edge cases.
- [ ] `A-031` Failure injection: удалить source URL/license note или hidden test и заблокировать content release.
- [ ] `A-032` Failure injection: привязать новую Java-задачу к Node profile и заблокировать path release.
- [ ] `A-033` Exit proof: каждая новая задача имеет source/provenance, owner, review, tests, release IDs и learner-facing explanation.

## 8. Learner API и UI vocabulary

Owner: Lab + Vue. Exit: пользователь понимает, что доступно и почему.

- [ ] `U-001` Ввести отдельные labels: Card published, Content-ready, Graph-connected, Runtime available, Attempted, Evidence complete, Mastered.
- [ ] `U-002` Удалить «ожидает релиза» для уже released Runtime revisions.
- [ ] `U-003` Если graph binding отсутствует, писать «задача выпущена, станция ещё не включена в маршрут».
- [ ] `U-004` Path header показывает native/shared/total counters с tooltip/definition.
- [ ] `U-005` Practice header показывает released families/revisions и path-compatible subset.
- [ ] `U-006` Capability dossier показывает cards, activities, next missing evidence и route membership.
- [ ] `U-007` Questions filter свернуть до path-relevant progressive disclosure.
- [ ] `U-008` Большой Practice hero не должен выталкивать первый action за fold на 1728×1117.
- [ ] `U-009` Сохранить current glass/token system; не проводить новый редизайн.
- [ ] `U-010` Устранить detector warning: тяжёлый accent border проверить на semantic necessity.
- [ ] `U-011` Width transition заменить transform/opacity либо доказать отсутствие layout thrash.
- [ ] `U-012` Decorative grid пометить/реализовать как bounded visual, не основной background костыль.
- [ ] `U-013` RU/EN 40% expansion и long technical identifiers не пересекаются.
- [ ] `U-014` Light/Dark/Auto сохраняются без wrong-theme flash.
- [ ] `U-015` Keyboard loop: Program → Path → Question → Task → Evidence → back.
- [ ] `U-016` Map/canvas имеет ordered textual alternative.
- [ ] `U-017` 1728×1117 и 2560×1440 при 100%/200% без page overflow.
- [ ] `U-018` axe 0 critical/serious; focus recovery после async result/dialog.
- [ ] `U-019` Не брать mobile в production sign-off, пока workspace contract не изменён.
- [ ] `U-020` Exit proof: Impeccable ≥18/20, A11y/Theming/Integrity 4/4, zero P0/P1.

## 9. Vue syllabus и Plan 2026

Owner: curriculum + docs. Exit: roadmap описывает текущий продукт и evidence model.

- [ ] `D-001` Обновить MOC counts на 1591/1100/491/48/19 и exact release IDs.
- [ ] `D-002` Заменить Angular primary frontend area на Vue 3 + TypeScript; Angular оставить historical/contrast при необходимости.
- [ ] `D-003` Создать Vue-native capabilities: reactivity/ref/reactive/computed/watch, components/props/events/slots, composables, Pinia, Router, forms/validation, Suspense/async, SSR boundaries, a11y, performance/testing.
- [ ] `D-004` Зафиксировать Vue activities и evidence modes; не обещать browser runtime до реализации.
- [ ] `D-005` Обновить current action из Event Loop на фактический resume action или owner-approved reset.
- [ ] `D-006` Удалить/исправить ссылку на legacy `CLAUDE.md`; source of truth = AGENTS/CONTEXT/active plan.
- [ ] `D-007` Переписать правило «каждая capability executable» на typed evidence contract.
- [ ] `D-008` Объяснить preview Project Books отдельно от unlocked executable Tier 2.
- [ ] `D-009` Синхронизировать 12 acceptance areas с текущей Vue архитектурой и practice disposition.
- [ ] `D-010` Добавить таблицу path composition и shared modules в Plan 2026.
- [ ] `D-011` Добавить status vocabulary без общего слова «готово».
- [ ] `D-012` Пометить superseded plans, оставить один active production plan.
- [ ] `D-013` Docs link checker и stale-number checker должны падать на старых literals.
- [ ] `D-014` Exit proof: новый инженер из docs объясняет owners, start command, current gate и next work.

## 10. Production release closure

Owner: umbrella + independent reviewer. Exit: pilot-ready, но не ложное learner mastery.

- [ ] `X-001` На clean checkout выполнить `pnpm down` и только workspace-owned cleanup.
- [ ] `X-002` Выполнить canonical `pnpm dev`; никаких ручных сервисов.
- [ ] `X-003` Выполнить `pnpm status` и новый `pnpm verify`.
- [ ] `X-004` Проверить exact release joins Brain↔Lab↔Runtime↔Vue.
- [ ] `X-005` Full crawl RU+EN всех 9 paths, domains, capabilities, questions и advertised tasks.
- [ ] `X-006` Проверить, что 100% advertised Run URLs имеют compatible released revision.
- [ ] `X-007` Проверить, что theory/brief/deferred не рекламируют Run.
- [ ] `X-008` Проверить path-scoped facets и counters на всех paths.
- [ ] `X-009` Проверить Node не содержит Java/Go/.NET native content.
- [ ] `X-010` Проверить Java не содержит Node-only runtime task.
- [ ] `X-011` Проверить Java/Node libraries включают approved shared cards.
- [ ] `X-012` Выполнить fail/pass Java, Node, .NET, Go и PostgreSQL tasks.
- [ ] `X-013` Выполнить dependency-offline matrix Brain/Runtime/AI/Jaeger.
- [ ] `X-014` Выполнить double-submit/retry/idempotency сценарии.
- [ ] `X-015` Выполнить long-session 10 capabilities/10 revisions/10 runs.
- [ ] `X-016` Сравнить Docker containers/volumes/networks до/после.
- [ ] `X-017` Проверить persistent progress после restart.
- [ ] `X-018` Собрать release manifest: root/child SHA, release IDs, schemas, contracts, evidence hashes.
- [ ] `X-019` Independent semantic reviewer подтверждает path composition и sample content.
- [ ] `X-020` Independent runtime/security reviewer подтверждает sandbox/release join.
- [ ] `X-021` Independent design/a11y reviewer подтверждает desktop matrix.
- [ ] `X-022` Zero P0/P1; P2 имеют owner/date или закрыты.
- [ ] `X-023` Root и children clean, `main == origin/main`, только после явной user команды commit/push.
- [ ] `X-024` Финальный статус — `Pilot-ready` или `Blocked`; никогда не `Mastered` по implementation tests.

## 11. Обязательная таблица закрытия

Каждая волна добавляет строку:

| Wave | Owner | Input release | Commit(s) | Commands | Failure injection | Evidence | Reviewer | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline | root | Brain/Runtime IDs | — | `pnpm status` | n/a | `B00/` | — | TODO |

Статус `DONE` разрешён только если все checkboxes волны закрыты, failure
injection был красным до исправления, canonical positive path зелёный после
исправления, evidence привязан к exact SHA/release и reviewer написал `PASS`.
