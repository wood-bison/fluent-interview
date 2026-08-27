# Fluent Interview — план доведения учебной платформы до production

Дата: 2026-08-27  
Статус: **исполняемый план; работа ещё не выполнена**  
Основание: `report.html` из этой же папки  
Модель выполнения: 21 сериализованная release-promotion волна; внутри разрешены
восемь параллельных bounded path packs. Каждая единица имеет отдельный commit и
закрывается только доказательствами.

Параметры, которые исполнитель обязан заполнить до W00:

- `target_tier=big-tech-complete` — конечная цель этого плана;
- `publish_authorized=false|true` — без `true` агент создаёт signed release candidate, но не push;
- `max_content_batch=100` cards;
- `max_runtime_batch=6` TaskFamily;
- `required_reviewers=semantic,runtime-security,ux-a11y`;
- `allowed_repositories=root,brain,runtime,lab,vue,vault`;
- `source_reference_date=2026-08-27`.

## 0. Неподвижные правила

- [ ] `R-001` Не замораживать разработку. Immutable означает только неизменность уже опубликованного release manifest.
- [ ] `R-002` Каждый пробел превращать в owned backlog item: research → authoring → review → tests → новый release.
- [ ] `R-003` Не редактировать опубликованные QuestionCard/TaskRevision задним числом; выпускать новую revision.
- [ ] `R-004` Не копировать shared-карточки и shared-задачи в каждый language path.
- [ ] `R-005` Не выводить runtime/language из title, topic или свободного поля `lang`; источник совместимости — TaskRevision.
- [ ] `R-006` Не считать `published`, `content-ready`, `graph-connected`, `runtime-available`, `attempted`, `evidence-complete` и `mastered` одним статусом.
- [ ] `R-007` Не создавать filler ради количества. Каждая карточка обязана закрывать конкретную роль CapabilityBundle.
- [ ] `R-008` Не создавать sandbox там, где корректнее spoken defense, design rubric, incident, project checkpoint или external repository.
- [ ] `R-009` Paid/no-license материалы использовать только как указатель темы; prompt, starter, tests и решение писать самостоятельно.
- [ ] `R-010` Один TaskFamily переиспользовать между языками только при одинаковых outcome, invariants, rubric и failure taxonomy.
- [ ] `R-011` Для разных runtime-механизмов создавать отдельные native TaskFamily.
- [ ] `R-012` Любая кнопка Run обязана разрешаться в точную released compatible TaskRevision.
- [ ] `R-013` Каждый checkbox закрывать evidence с exact SHA, release IDs, командой и reviewer.
- [ ] `R-014` После каждой волны выполнять хотя бы одну deliberate failure injection.
- [ ] `R-015` Не сбрасывать и не затирать существующие user changes; сначала dirty-state ledger.
- [ ] `R-016` Child commit предшествует обновлению root pointer; commit каждой волны отдельный.

## 1. Canonical domain model

Агент обязан использовать следующие термины одинаково в Brain, Runtime, Lab, Vue и документации:

| Сущность | Владелец | Значение |
| --- | --- | --- |
| `Program` | Lab | Продуктовая программа обучения |
| `TrackView` | Lab release | Путь Node/Java/Go/.NET/Vue и т. п., собранный из модулей |
| `LearningModule` | Lab | Versioned native/shared/overlay curriculum module |
| `Capability` | Brain | Наблюдаемый навык с prerequisites и evidence policy |
| `QuestionCard` | Brain | Один вопрос определённой роли внутри capability |
| `QuestionPlacement` | Brain | Reviewed relation card → capability + presentation role |
| `Lesson` | Lab | Самодостаточная learner-visible композиция; не raw card |
| `PrimaryQuestion` | Brain placement | Основной вопрос, видимый в ordered path |
| `SupportingPrompt` | Brain placement | Follow-up/edge/contrast/recall внутри Lesson; не отдельный шаг пути |
| `TaskCandidate` | Brain editorial queue | Task-like материал до решения `runtime|typed activity|reject` |
| `Activity` | Lab | Learner proof unit и требуемый EvidenceMode для capability |
| `TaskFamily` | Runtime | Языково-независимый outcome/invariants/rubric |
| `TaskRevision` | Runtime | Immutable language/profile-specific implementation |
| `Station` | Lab | Learner-facing проекция capability + activity |
| `Attempt/Evidence` | Lab | Факт выполнения и проверяемый результат |
| `ReleaseTuple` | umbrella | Exact Brain + Runtime + Lab + Vue versions |

### 1.1 Что реально проходит learner

`QuestionCard` — единица хранения и переиспользования в Brain, но не единица
маршрута. Learner проходит последовательность:

`TrackView → LearningModule → Lesson → PrimaryQuestion → SupportingPrompt(s) → Activity → Evidence → cold repeat`.

- [ ] `DM-001` Ни один экран не показывает raw Brain cards как неструктурированный список пути.
- [ ] `DM-002` Каждый learner-visible вопрос имеет ровно одну primary placement в пределах Lesson.
- [ ] `DM-003` Shared QuestionCard может иметь placements в нескольких TrackView без копирования содержания.
- [ ] `DM-004` SupportingPrompt раскрывается внутри Lesson и не увеличивает advertised primary-question count.
- [ ] `DM-005` Каждая задача Brain получает disposition `runtime|design|incident|spoken|project|brief|reject`.
- [ ] `DM-006` Только disposition `runtime` с released compatible TaskRevision получает кнопку Run.
- [ ] `DM-007` Один Lesson может ссылаться на несколько cards и activities; одна card может поддерживать несколько Lessons через reviewed placements.
- [ ] `DM-008` UI показывает отдельно: основные вопросы, практические активности, supporting prompts и проекты.
- [ ] `DM-009` Progress denominator считается по learner-visible contract, а не по raw card count.
- [ ] `DM-010` API возвращает provenance и stable IDs для Lesson/Question/Activity, чтобы release можно было воспроизвести.

## 2. Production coverage contract

### 2.1 Question SLA

Для каждой technical core capability целевой bundle содержит 10 placements:

1. diagnostic;
2. mechanism-basic;
3. mechanism-advanced;
4. predict/trace;
5. boundary/edge;
6. failure/debug;
7. compare/trade-off;
8. apply/design;
9. evidence/application link (project, incident, code или design по capability kind);
10. spoken defense/follow-up.

Алгоритмическая capability использует 8 ролей: concept, baseline, easy, medium,
hard, proof, complexity, edge-test. Большой модуль из 7 capabilities естественно
получает около 70 карточек; **70 карточек на один атомарный topic запрещены**.

Сначала применяются hard gates: mandatory roles по `CapabilityKindPolicy`, core
locales, reviewed placement, provenance, evidence policy и отсутствие
quarantine. Любой провал запрещает production независимо от score.

Coverage score используется только для приоритизации:

- 30% — обязательные question roles;
- 20% — распределение depth;
- 20% — полнота learning layers;
- 15% — reviewed placement/provenance;
- 15% — practice/evidence.

Core capability публикуется при всех hard gates PASS и score ≥ 0.90. Роли,
неприменимые к capability kind, получают reviewed `not_applicable` rationale;
их нельзя заполнять filler-карточкой ради арифметики.

### 2.2 Стартовая нормативная матрица

| Направление | Capabilities | Core cards | Сейчас raw/ready | Минимум новых | Нормализовать incomplete |
| --- | ---: | ---: | ---: | ---: | ---: |
| Node.js + NestJS | 32 | 320 | 294 / 173 | 26 | 121 |
| Java + Spring | 32 | 320 | 191 / 126 | 129 | 65 |
| Go | 28 | 280 | 130 / 65 | 150 | 65 |
| .NET + C# | 28 | 280 | 75 / 73 | 205 | 2 |
| Frontend + Vue | 36 | 360 | 161 / 153 | 199 | 8 |
| Algorithms | 15 families | 120 | 52 / 37 | 68 | 15 |
| System Design/shared core | 50 | 500 | 568 / 435 | 0 | минимум 65 core; 68 supplemental классифицировать |
| Behavioral | 12 | 120 | 103 / 26 | 17 | 77 |

Итоговый минимум: 2 300 ready core placements. Текущие lane assignments дают
486 non-ready records: 418 уже относятся к обязательной core-нормализации, а
68 System Design records сначала требуют reviewed disposition
`core|supplemental|quarantined|replacement`. Поэтому `794 new` и `2 368 ready`
остаются **provisional upper planning figures** до W04 unique-card/placement
manifest; массовое authoring запрещено до пересчёта exact IDs.
Python остаётся visible preview и получает отдельный manifest до production claim.

### 2.3 Practice SLA

- Production-usable checkpoint: 48 released TaskFamily, ≥92 runnable revisions, ≥24 compatible practices на primary path.
- Big-Tech complete target: **168 executable TaskFamily и 456 runnable revisions**: 60 algorithm families × 5 languages, 12 shared backend families × 5, 80 native families и 16 PostgreSQL families.
- Чистый provisional gap от 15/19: +153 families и +437 revisions; W04/W12 обязаны подтвердить exact existing/superseded IDs.
- Backend path target: 70 activities = 12 selected algorithms + 12 shared backend + 16 native + 16 PostgreSQL/shared data + 8 infrastructure scenarios + 6 project milestones.
- Vue target: 50 activities = 12 shared algorithms + 20 Vue/browser + 8 Web/API/security + 4 performance/a11y investigations + 6 project milestones.
- System Design target: 50 activities = 32 defense cases + 12 infra labs + 6 project milestones.
- Critical capability получает минимум 2 независимых scenarios; остальные core capabilities — минимум 1 assessed activity подходящего evidence mode.

### 2.4 Learner-visible production contract по путям

Число `Core cards` из §2.2 — внутренний coverage inventory. Ниже — то, что
обещается learner. Primary questions являются самостоятельными вопросами для
обучения и интервью; supporting prompts — углубления внутри Lesson.

| Путь | Modules / Lessons | Primary questions | Supporting prompts | Activities | Projects / checkpoints |
| --- | ---: | ---: | ---: | ---: | ---: |
| Node.js + NestJS | 6 / 32 | 224 | 96 | 70 | 6 / 7 |
| Java + Spring | 6 / 32 | 224 | 96 | 70 | 6 / 7 |
| Go | 5 / 28 | 196 | 84 | 70 | 6 / 6 |
| .NET + C# | 5 / 28 | 196 | 84 | 70 | 6 / 6 |
| Vue + Web | 6 / 36 | 252 | 108 | 50 | 6 / 7 |
| Algorithms overlay | 5 / 15 | 75 problem questions | 45 proof/edge prompts | 60 runnable problems | 4 / 6 |
| System Design overlay | 6 / 50 | 350 design questions | 150 follow-up/defense prompts | 50 | 6 / 7 |
| Behavioral overlay | 4 / 12 | 84 interview questions | 36 probes/contrasts | 24 spoken drills | 6 / 5 |

Итого learner-visible core: **233 Lessons, 1 601 Primary Questions, 699
Supporting Prompts и 51 module/final checkpoint**. Это те же 2 300 core cards,
но теперь denominator объясняет реальный пользовательский опыт.

- [ ] `PC-001` Counts публикуются в versioned `PathCompletionManifest`, а не в README prose.
- [ ] `PC-002` Для каждой строки manifest перечисляет exact stable IDs; сумма IDs равна target.
- [ ] `PC-003` PrimaryQuestion count не включает supporting placements и локали.
- [ ] `PC-004` RU/EN revisions одной карточки считаются одним learner item.
- [ ] `PC-005` Activity count дедуплицируется по stable Activity ID в пределах TrackView.
- [ ] `PC-006` Shared activity считается в каждом совместимом path, но TaskFamily inventory — один раз.
- [ ] `PC-007` Project milestone считается Activity только при rubric и persisted Evidence.
- [ ] `PC-008` Изменение target требует versioned policy decision и migration note.
- [ ] `PC-009` Production release запрещён при недоборе любого mandatory path target.
- [ ] `PC-010` Дополнительный supplemental материал разрешён, но не заменяет обязательный role set.

### 2.5 Agent factory и границы ответственности

На каждом path pack координатор создаёт ограниченные параллельные workstreams;
они не редактируют один manifest одновременно.

| Роль агента | Выход | Не имеет права |
| --- | --- | --- |
| `Track Lead` | capability/module manifest, order, acceptance ledger | самостоятельно approve собственный pack |
| `Inventory Agent` | exact reuse/gap/duplicate report по Brain | создавать filler по title similarity |
| `Research Agent` | official-source brief, provenance, edge cases | копировать paid/no-license wording |
| `Question Author` | primary/supporting drafts и locale revisions | публиковать без editorial review |
| `Task Architect` | Family/Revision или typed Activity contract | объявлять prose runnable |
| `Runtime Implementer` | starter, hidden tests, sandbox profile, exemplar | менять learning outcome ради удобного теста |
| `Adversarial Reviewer` | seeded-wrong failures, semantic leakage report | исправлять проверяемый pack в том же review pass |
| `Release Integrator` | immutable releases, joins, root pointer | собирать release при красном gate |
| `Browser QA` | RU/EN/theme/viewport/keyboard evidence | заменять semantic/runtime review визуальным smoke |

- [ ] `AF-001` Один агент не может одновременно быть Author и final Reviewer одного item.
- [ ] `AF-002` Каждый workstream получает bounded IDs и отдельный worktree/branch.
- [ ] `AF-003` Track Lead принимает только commit с machine-readable evidence manifest.
- [ ] `AF-004` Merge order фиксирован: schema → content → runtime → releases → Lab API → Vue → docs.
- [ ] `AF-005` Conflict resolution возвращается владельцу source of truth; integrator не угадывает semantics.
- [ ] `AF-006` Агент, нашедший новый gap, добавляет typed backlog item и продолжает независимую работу.
- [ ] `AF-007` P0 semantic/runtime defect ставит stop-the-line только затронутому pack, не всему продукту.
- [ ] `AF-008` После исправления stop-the-line pack повторяет весь close protocol, а не только упавший тест.
- [ ] `AF-009` Каждая законченная фаза имеет отдельный conventional commit и не смешивает unrelated user changes.
- [ ] `AF-010` Root pointer обновляется отдельным integration commit после green child commits.

## 3. Универсальный close protocol каждой волны

### 3.1 Stop-the-line rules

Исполнитель сохраняет evidence и останавливает только затронутый pack, если:

- [ ] `STOP-001` unexplained loss/hash drift хотя бы одной card/placement/task/release;
- [ ] `STOP-002` migration/restore count отличается хотя бы на 1 без approved disposition;
- [ ] `STOP-003` secret, private answer или hidden test попал в browser/log/trace;
- [ ] `STOP-004` license/provenance неоднозначны;
- [ ] `STOP-005` previous release не запускается либо rollback не восстанавливает exact counts;
- [ ] `STOP-006` foreign native card/task попал в TrackView;
- [ ] `STOP-007` тест стал зелёным после удаления/ослабления guard или за счёт retry;
- [ ] `STOP-008` unknown dirty/user-owned file пересекается с изменяемым scope;
- [ ] `STOP-009` remote creation, push или destructive cleanup не имеют authority;
- [ ] `STOP-010` обнаружен unowned Docker resource, который пришлось бы удалять;
- [ ] `STOP-011` нарушена schema N/N-1 compatibility;
- [ ] `STOP-012` high-risk item author и final reviewer — один actor;
- [ ] `STOP-013` P0/P1 найден в уже закрытой волне — её статус возвращается в FAILED;
- [ ] `STOP-014` batch duplicate rate >2% либо semantic rejection rate >10%; следующий batch не начинается;
- [ ] `STOP-015` advertised Run не разрешается в exact compatible immutable revision.

### 3.2 Transaction template — выполняется заново для каждой W00–W20

Каждая волна создаёт `verification/production-closure/Wxx/wave-contract.json`.
Нельзя сослаться на один общий checklist для нескольких волн.

- [ ] `T-01` Записать owner, независимых reviewers и affected repositories.
- [ ] `T-02` Записать dependencies и разрешённые parallel batches.
- [ ] `T-03` Записать input SourceProvenanceTuple и RuntimeReleaseTuple.
- [ ] `T-04` Снять dirty/backup ledger и rollback anchor.
- [ ] `T-05` Записать exact expected counters и stable IDs до изменения.
- [ ] `T-06` Перечислить output artifacts, schemas, migrations и release IDs.
- [ ] `T-07` Добавить failing positive contract test.
- [ ] `T-08` Добавить defect-specific negative/foreign/invalid-state test.
- [ ] `T-09` Выполнить implementation batches в пределах max batch size.
- [ ] `T-10` Запустить targeted и full owner tests.
- [ ] `T-11` Запустить cross-service join/compatibility tests.
- [ ] `T-12` Выполнить deterministic semantic crawl или browser matrix по типу изменения.
- [ ] `T-13` Выполнить deliberate failure injection и сохранить non-zero proof.
- [ ] `T-14` Выполнить rollback, проверить exact before hash и повторный forward promotion.
- [ ] `T-15` Создать отдельные child commits и проверить `git show --check`.
- [ ] `T-16` Выпустить immutable child releases и отдельный root-pointer commit.
- [ ] `T-17` Записать output tuples, SHAs, commands, evidence paths и residual risks.
- [ ] `T-18` Получить independent PASS и сверить exact exit counters.

### 3.3 Batch template для W06, W10, W13–W17

- [ ] `BT-01` Сгенерировать deterministic batch manifest с ≤100 cards или ≤6 families.
- [ ] `BT-02` Первый batch является canary и должен успешно rollback до продолжения.
- [ ] `BT-03` Каждый item имеет provenance, author, reviewer и target role/family ID.
- [ ] `BT-04` До release запустить duplicate/semantic-overlap scan с сохранённым threshold.
- [ ] `BT-05` После release пересчитать unique IDs, placements, locales и joins.
- [ ] `BT-06` Failure одного item не откатывает другие green packs, но блокирует promotion tuple.
- [ ] `BT-07` Cumulative totals вычисляются из manifests, не из prose или UI labels.
- [ ] `BT-08` Каждый batch имеет отдельный commit, release ID и rollback evidence.

### 3.4 Release tiers — не смешивать

- [ ] `RT-001` `development-integrated`: W00–W09A PASS, truthful manifests/compiler, контент ещё может быть неполным.
- [ ] `RT-002` `production-usable`: ≥48 families/≥92 revisions, ≥24 compatible practices на primary backend path, core learner loop без dead ends.
- [ ] `RT-003` `big-tech-complete`: все W00–W20 PASS, 2 300 core placements, 233 Lessons, 1 601 primary, 699 supporting, 51 checkpoints, 168/456 Runtime portfolio и все path activity targets.
- [ ] `RT-004` `pilot-ready`: production-usable либо big-tech-complete плюс consented learner pilot, telemetry/privacy и rollback owner.
- [ ] `RT-005` `plan-2026-ready`: актуальные Plan 2026/ADR/glossary/runbooks согласованы с exact release tuple.
- [ ] `RT-006` `learner-mastered`: персональный результат Сергея; никогда не выводится из product tests.
- [ ] `RT-007` Этот master plan закрывается только `big-tech-complete`; промежуточный tier не помечает оставшиеся waves DONE.

- [ ] Снять before-state и exact release tuple.
- [ ] Назвать owner и source of truth.
- [ ] Сначала добавить failing positive contract test.
- [ ] Добавить failing negative/foreign-language/invalid-state test.
- [ ] Выполнить минимальное изменение или новую immutable revision.
- [ ] Запустить targeted tests владельца.
- [ ] Запустить full tests владельца.
- [ ] Запустить cross-service release-join tests.
- [ ] Выполнить deliberate failure injection и сохранить non-zero exit.
- [ ] Выполнить clean restart/idempotency check.
- [ ] Пройти browser flow, если изменился learner-visible контракт.
- [ ] Сохранить after evidence с SHA/release/hash.
- [ ] Получить independent reviewer PASS.
- [ ] Создать атомарный commit `type(scope): result [wave-id]`; записать SHA в ledger.
- [ ] Проверить `git show --stat --check <sha>` и повторить targeted gate на committed tree.
- [ ] Обновить root pointer отдельным integration commit после green child release.
- [ ] Только после этого отметить wave/checkpoint DONE.

## W00 — Authority, безопасность и no-freeze charter

- [ ] `W00-01` Прочитать root/child `AGENTS.md`, `CONTEXT.md`, активные ADR и планы.
- [ ] `W00-02` Сохранить branch/HEAD/upstream/ahead/behind/dirty ledger для пяти репозиториев.
- [ ] `W00-03` Зафиксировать, какие изменения принадлежат пользователю; не включать их случайно.
- [ ] `W00-04` Создать один authoritative execution-plan pointer в root docs.
- [ ] `W00-05` Пометить старые конкурирующие планы `superseded_by`, не удаляя историю.
- [ ] `W00-06` Зафиксировать правило «baseline immutable, development continuous» в glossary/plan.
- [ ] `W00-07` Удалить из активной терминологии двусмысленное «freeze проекта».
- [ ] `W00-08` Проверить remote-backed состояние всех child repos.
- [ ] `W00-09` Проверить, что root pointers соответствуют выбранным child SHAs.
- [ ] `W00-10` Evidence: `verification/production-closure/W00/` + reviewer PASS.

## W01 — Воспроизводимый umbrella + five-child workspace

- [ ] `W01-01` На clean clone выполнить canonical `pnpm dev`, без ручного запуска сервисов.
- [ ] `W01-02` Проверить `pnpm status`: Brain, Runtime, Lab API, Vue, observability healthy.
- [ ] `W01-03` Проверить один compose project/namespace на сервис и отсутствие orphan containers.
- [ ] `W01-04` Проверить `pnpm down`, повторный `pnpm dev` и сохранение разрешённых данных.
- [ ] `W01-05` Проверить backup/restore Brain и Lab state.
- [ ] `W01-06` Проверить bounded prune только workspace-owned images/volumes/networks.
- [ ] `W01-07` Зафиксировать exact toolchains и lockfiles.
- [ ] `W01-08` Устранить непроверенный Vue remote и unpublished root/child commits.
- [ ] `W01-09` Создать clean-clone smoke в CI.
- [ ] `W01-10` Failure: чужой compose project/volume не должен удаляться.
- [ ] `W01-11` SourceProvenanceTuple включает root, Lab, Vue, Brain, Runtime и Vault SHAs; RuntimeReleaseTuple включает только исполняемые production releases.

## W02 — Синхронизация Plan 2026 и документации

- [ ] `W02-01` Обновить 1 143 → 1 591 cards; 24 tasks → 48 structured/19 runnable revisions.
- [ ] `W02-02` Заменить legacy `CLAUDE.md` на `AGENTS.md` + `CONTEXT.md` + active plan.
- [ ] `W02-03` Удалить July Event Loop как hard-coded current action; current action сервер-владелец.
- [ ] `W02-04` Заменить Angular-primary на Vue/TypeScript primary; Angular оставить historical/contrast evidence.
- [ ] `W02-05` Исправить старую ссылку Interview English на актуальный Weekly Operating System.
- [ ] `W02-06` Переписать «каждая capability executable» на typed EvidenceMode contract.
- [ ] `W02-07` Разделить software product-ready и личное learner mastery.
- [ ] `W02-08` Project Books сделать preview-visible; execution гейтить по checkpoint prerequisites.
- [ ] `W02-09` Добавить таблицу release vocabulary и denominators.
- [ ] `W02-10` Добавить docs link/stale-literal checker в CI.

## W03 — Immutable baseline и release tuple

- [ ] `W03-01` Discover текущий Brain release и сравнить с observed reference `question-release-d00a14931e607336`; unexplained drift = STOP.
- [ ] `W03-02` Discover текущий Runtime release и сравнить с observed reference `runtime-task-release-2026-08-26-qb-d00a1493-g10`; unexplained drift = STOP.
- [ ] `W03-03` Снять Lab/Vue SHA, schemas и API contract versions.
- [ ] `W03-04` Сохранить 1 591 unique/published/mapped и locale integrity.
- [ ] `W03-05` Сохранить raw/ready/path/task/profile counts из отчёта.
- [ ] `W03-06` Сохранить current browser screenshots ключевых flows как baseline, не как design truth.
- [ ] `W03-07` Ввести stale-release и stale-source-SHA detection.
- [ ] `W03-08` Проверить deterministic regeneration и hash equality.
- [ ] `W03-09` Failure: подмена любого release ID блокирует verification.
- [ ] `W03-10` Baseline пометить historical immutable; authoring продолжить в новых releases.

## W04 — CapabilityRegistry и CoverageManifest

- [ ] `W04-01` Описать schema Capability: key, outcome, prerequisites, owner, depth, evidencePolicy.
- [ ] `W04-02` Описать CapabilityBundle roles и обязательность каждой роли.
- [ ] `W04-03` Описать machine-readable target counts по lane/module/capability.
- [ ] `W04-04` Устранить конфликт «16/68 mapped» и фактических 1 591 placements.
- [ ] `W04-05` Связать 100% core cards с capability и role либо explicit supplemental/quarantine.
- [ ] `W04-06` Ввести controlled `languageKey` отдельно от runtime profile.
- [ ] `W04-07` Нормализовать level vocabulary: depth и seniority раздельно.
- [ ] `W04-08` Запретить empty mandatory capability.
- [ ] `W04-09` Добавить coverage score и threshold 0.90.
- [ ] `W04-10` Failure: raw count без role completeness не проходит production gate.
- [ ] `W04-11` Выпустить `TaskPortfolioManifest` с exact IDs, kind, current disposition `existing|new|superseded`, compatibility и target revisions.
- [ ] `W04-12` Выпустить `PathCompletionManifest` с unique card IDs, placements, primary/support denominators, Activities и checkpoints.
- [ ] `W04-13` Пересчитать provisional 794/418/68/2 368; любые новые authoritative числа обновляют report/plan versioned decision.

## W05 — LearningModule registry и composition model

- [ ] `W05-01` Сверить 24 Plan modules с release registry.
- [ ] `W05-02` Заполнить либо честно пометить planned три zero-placement modules: backend-core, messaging, system-design.
- [ ] `W05-03` Создать отдельный NestJS native module.
- [ ] `W05-04` Создать Messaging module: Outbox, idempotency, DLQ, replay, ordering.
- [ ] `W05-05` Разделить System Design catch-all на API/data/distributed/network/testing/delivery case modules.
- [ ] `W05-06` Создать Cache/Search/Graph module.
- [ ] `W05-07` Создать AI-native module с честным evidence policy.
- [ ] `W05-08` Разделить Docker, Kubernetes и Observability prerequisites/evidence.
- [ ] `W05-09` Для каждого module указать kind `native|shared|overlay|preview`.
- [ ] `W05-10` Failure: mandatory module с 0 capabilities/placements блокирует release.

## W06 — Нормализация текущих 1 591 карточек

- [ ] `W06-01` Присвоить каждой card disposition `ready|partial|supplemental|quarantined`.
- [ ] `W06-02` Создать deterministic queue для 491 incomplete cards.
- [ ] `W06-03` Проверить short answer, mechanism, RU, traps, terms, follow-ups, practice, project evidence.
- [ ] `W06-04` Нормализовать 54 missing group и 42 missing/mixed level.
- [ ] `W06-05` Исправить canonical topic aliases и facet projection.
- [ ] `W06-06` Перенести 7 DOM-event cards из Node native в Web Core/Frontend.
- [ ] `W06-07` Перенести generic Auth/Cache/API в shared modules без копирования cards.
- [ ] `W06-08` Пересмотреть cross-runtime GC ownership.
- [ ] `W06-09` Проверить 20 cards × каждый path × каждую role.
- [ ] `W06-10` Failure: prompt-as-answer, silent core locale fallback или missing provenance блокируют release.

## W07 — Безопасный content expansion pipeline

- [ ] `W07-01` Для каждого gap сначала сформулировать outcome, roles, edge cases и assessment mode.
- [ ] `W07-02` Research выполнять по официальной документации и license-compatible OSS.
- [ ] `W07-03` Сохранять URL, accessed date, commit/hash, SPDX/license и reviewer.
- [ ] `W07-04` Ввести `provenance.json` с `original|inspired|derived`.
- [ ] `W07-05` Не копировать paid/no-license wording, code и solutions.
- [ ] `W07-06` Использовать LLM только для proposal; human/editorial review обязателен.
- [ ] `W07-07` Добавить duplicate/semantic-near-duplicate detector.
- [ ] `W07-08` Добавить preview → accept/reject → audit trail → new release.
- [ ] `W07-09` Bulk accept разрешать только для однородного reviewed решения.
- [ ] `W07-10` Failure: missing license/provenance/reviewer блокирует content release.

## W08 — TrackView composition для всех путей

- [ ] `W08-01` Effective path = native modules + approved shared modules + optional overlays.
- [ ] `W08-02` Создать explicit include/exclude manifest для 9/9 paths.
- [ ] `W08-03` Node не включает Java/Go/.NET native modules.
- [ ] `W08-04` Java не включает Node runtime/JS-only native content.
- [ ] `W08-05` Go не включает JVM/.NET/Node-native implementation questions.
- [ ] `W08-06` .NET не включает JVM/Go/Node-native implementation questions.
- [ ] `W08-07` Vue включает Vue/Web Core/TS и только approved shared modules.
- [ ] `W08-08` Python остаётся preview до собственного approved manifest.
- [ ] `W08-09` Algorithms/Behavioral оформить как overlays с явным membership policy.
- [ ] `W08-10` Failure: foreign native module, duplicate placement или implicit catch-all блокирует release.

## W09 — Prerequisite DAG и порядок обучения

- [ ] `W09-01` Создать directed prerequisite graph Capability/Module.
- [ ] `W09-02` Запретить cycles, orphans, duplicate edges и empty mandatory nodes.
- [ ] `W09-03` Зафиксировать deterministic order module → capability depth → role → stable key.
- [ ] `W09-04` Создать meaningful available/locked/complete/mastered semantics.
- [ ] `W09-05` Добавить textual ordered alternative графу.
- [ ] `W09-06` Проверить переходы beginner → mechanism → failure → production → defense.
- [ ] `W09-07` Проверить unlock альтернативных подходов без нарушения prerequisites.
- [ ] `W09-08` Проверить stable membership hash.
- [ ] `W09-09` Failure: cycle и missing prerequisite дают typed compiler error.
- [ ] `W09-10` Independent curriculum reviewer подтверждает sequence rationale.

### W09A — Truthful projection compiler до массового authoring

- [ ] `W09A-01` Реализовать contract join Path→Module→Lesson→Capability→Placement→Activity→Family→Revision.
- [ ] `W09A-02` Compiler принимает proposed manifests до publication и выдаёт deterministic preview.
- [ ] `W09A-03` Проверить unique/native/shared/overlay denominators и membership hashes.
- [ ] `W09A-04` Проверить compatibility через exact TaskRevision, не domain/title projection.
- [ ] `W09A-05` Добавить foreign-native, duplicate-placement, missing-prerequisite и stale-release negative fixtures.
- [ ] `W09A-06` W10/W13–W17 authoring запрещён, пока compiler contract не PASS.

## W10 — Закрытие question portfolios по нормативной матрице

- [ ] `W10-01` Node: 32 capabilities/320 ready core cards.
- [ ] `W10-02` Java: 32/320.
- [ ] `W10-03` Go: 28/280.
- [ ] `W10-04` .NET: 28/280.
- [ ] `W10-05` Vue/Web: 36/360.
- [ ] `W10-06` Algorithms: 15 families/120 cards.
- [ ] `W10-07` System Design/shared: 50/500 core; 68 excess классифицировать.
- [ ] `W10-08` Behavioral: 12/120.
- [ ] `W10-09` После W04 exact manifest выпустить рассчитанный минимум новых original high-signal cards; observed planning estimate = 794.
- [ ] `W10-10` Нормализовать 418 assigned core records; классифицировать 68 System Design non-ready records; итоговые ready counts брать только из manifest.
- [ ] `W10-11` Запретить закрытие по total count без role matrix.
- [ ] `W10-12` Expert sample review по каждому capability cluster.

### W10.N — Node.js + NestJS completion pack

Известный baseline: 294 raw / 173 ready, 26 отсутствующих core cards, 121
incomplete; capability mapping почти отсутствует. Curriculum modules: JS/TS
foundations; async/event loop; I/O/streams; V8/memory/workers; Nest core and
request pipeline; Nest data/security/testing/production.

- [ ] `N-001` Track Lead фиксирует 6 modules, 32 capabilities и prerequisite DAG.
- [ ] `N-002` Inventory Agent распределяет все 294 cards по capability/role/disposition.
- [ ] `N-003` Отдельно вынести 7 DOM-event cards в Web shared placement.
- [ ] `N-004` Отдельно вынести generic Auth/Cache/API в approved shared modules.
- [ ] `N-005` Нормализовать 121 incomplete revisions до полного EN/RU learning layer.
- [ ] `N-006` Research Agents закрывают exact ledger 26 отсутствующих role IDs.
- [ ] `N-007` Выпустить 224 primary placements и 96 supporting placements без дублей.
- [ ] `N-008` Собрать 32 Lessons и 7 module/final checkpoints.
- [ ] `N-009` Выпустить 16 native Runtime families N01–N16; переиспользовать 7 существующих, добавить 9.
- [ ] `N-010` Подключить 24 shared, 16 SQL, 8 infra и 6 project activities: total 70.
- [ ] `N-011` Проверить CJS/ESM, nextTick/microtasks, libuv pool, streams/backpressure, workers, ALS, AbortSignal, timers, Buffer, GC, HTTP lifecycle, process signals, errors, diagnostics, listener leaks.
- [ ] `N-012` Проверить Nest DI scopes, lifecycle, middleware, guards, pipes, interceptors, filters, validation, authz ownership, transactions, testing и observability.
- [ ] `N-013` Forbidden-set test: JVM, goroutine и CLR-native material отсутствует.
- [ ] `N-014` Browser journey проходит 32 Lessons, 70 Activities и language selector JS/TS.
- [ ] `N-015` Commit chain: Brain normalization → Runtime pack → Brain release → Lab composition → Vue UI → root pointer.
- [ ] `N-016` Independent Node/Nest reviewer подписывает semantic и runtime evidence.

### W10.J — Java + Spring completion pack

Baseline: 191 raw / 126 ready, минимум 129 новых и 65 incomplete; ни одна
карточка не даёт достаточного capability graph, Runtime имеет только одну
Java-compatible shared revision. Modules: language/type system;
collections/generics; JVM/memory; concurrency; Spring core/web; Spring
data/security/testing/production.

- [ ] `J-001` Track Lead фиксирует 6 modules, 32 capabilities и prerequisites.
- [ ] `J-002` Inventory Agent классифицирует 191 cards и запрещает Node-derived placement.
- [ ] `J-003` Нормализовать 65 incomplete revisions до полного EN/RU layer.
- [ ] `J-004` Research Agents создают gap briefs для 129 отсутствующих role IDs.
- [ ] `J-005` Выпустить 224 primary и 96 supporting placements.
- [ ] `J-006` Собрать 32 Lessons и 7 module/final checkpoints.
- [ ] `J-007` Выпустить 16 native families J01–J16 и 23 отсутствующие shared Java revisions.
- [ ] `J-008` Подключить 24 shared, 16 SQL, 8 infra и 6 Java project activities: total 70.
- [ ] `J-009` Проверить type system, equality/hashCode, generics, collections, exceptions, streams и I/O.
- [ ] `J-010` Проверить JMM, locks/atomics, concurrent collections, virtual threads, interruption, futures, executor saturation, GC/classloading и diagnostics.
- [ ] `J-011` Проверить Spring DI scopes, proxies/transactions, MVC lifecycle, validation, data access, security ownership и testing.
- [ ] `J-012` Forbidden-set test: Node event-loop и Go channel questions не появляются как Java native.
- [ ] `J-013` Все Java Run CTA разрешаются только в exact Java TaskRevision/profile.
- [ ] `J-014` Browser journey проходит 32 Lessons, 70 Activities и 7 checkpoints.
- [ ] `J-015` Commit chain сохраняет отдельные Brain/Runtime/Lab/Vue commits и immutable releases.
- [ ] `J-016` Independent JVM/Spring reviewer подписывает evidence.

### W10.G — Go completion pack

Baseline: 130 raw / 65 ready, минимум 150 новых и 65 incomplete; runtime — одна
shared Go revision. Modules: language/types; interfaces/errors;
goroutines/channels/sync; runtime/memory; net/http/tooling/testing/production.

- [ ] `G-001` Track Lead фиксирует 5 modules, 28 capabilities и prerequisites.
- [ ] `G-002` Inventory Agent классифицирует 130 cards и отделяет generic concurrency.
- [ ] `G-003` Нормализовать 65 incomplete revisions.
- [ ] `G-004` Research Agents закрывают 150 missing role IDs официальными Go sources.
- [ ] `G-005` Выпустить 196 primary и 84 supporting placements.
- [ ] `G-006` Собрать 28 Lessons и 6 module/final checkpoints.
- [ ] `G-007` Обновить Go profile immutable revision до поддерживаемого toolchain до authoring pack.
- [ ] `G-008` Выпустить 16 native families G01–G16 и 23 missing shared Go revisions.
- [ ] `G-009` Подключить 24 shared, 16 SQL, 8 infra и 6 Go project activities: total 70.
- [ ] `G-010` Проверить goroutine leaks, ownership/close, select/context, race, sync/atomic, pools и timers.
- [ ] `G-011` Проверить slices/maps, nil interfaces, errors, HTTP shutdown, pprof, escape analysis и packages.
- [ ] `G-012` Forbidden-set test: JVM/.NET/Node-native mechanics отсутствуют.
- [ ] `G-013` Race detector и leak scenarios обязаны убивать seeded wrong solutions.
- [ ] `G-014` Browser journey проходит 28 Lessons, 70 Activities и 6 checkpoints.
- [ ] `G-015` Commit chain и release tuple проверены на clean restart/rollback.
- [ ] `G-016` Independent Go reviewer подписывает evidence.

### W10.D — .NET + C# completion pack

Baseline: 75 raw / 73 ready, минимум 205 новых и 2 incomplete; Runtime имеет
Rate Limiter и cancellation coverage. Modules: C#/collections/LINQ;
CLR/memory; async/concurrency; ASP.NET/DI/middleware;
EF/security/testing/diagnostics.

- [ ] `D-001` Track Lead фиксирует 5 modules, 28 capabilities и prerequisites.
- [ ] `D-002` Inventory Agent классифицирует 75 cards и shared placements.
- [ ] `D-003` Нормализовать 2 incomplete revisions и проверить остальные 73 на role quality.
- [ ] `D-004` Research Agents закрывают 205 missing role IDs официальными .NET sources.
- [ ] `D-005` Выпустить 196 primary и 84 supporting placements.
- [ ] `D-006` Собрать 28 Lessons и 6 module/final checkpoints.
- [ ] `D-007` Выпустить 16 native families D01–D16; переиспользовать cancellation, добавить 15.
- [ ] `D-008` Выпустить 23 missing shared C# revisions.
- [ ] `D-009` Подключить 24 shared, 16 SQL, 8 infra и 6 .NET project activities: total 70.
- [ ] `D-010` Проверить TAP, cancellation, exceptions, ValueTask, Channels, concurrency и lifetime/disposal.
- [ ] `D-011` Проверить ASP.NET middleware/DI, EF tracking/concurrency/transactions, HttpClientFactory, Activity и diagnostics.
- [ ] `D-012` Forbidden-set test: JVM/Go/Node-native mechanics отсутствуют.
- [ ] `D-013` Все Run CTA разрешаются только в exact dotnet profile/revision.
- [ ] `D-014` Browser journey проходит 28 Lessons, 70 Activities и 6 checkpoints.
- [ ] `D-015` Commit chain и release tuple проверены на clean restart/rollback.
- [ ] `D-016` Independent .NET reviewer подписывает evidence.

### W10.V — Vue + Web completion pack

Baseline Frontend: 161 raw / 153 ready, минимум 199 новых и 8 incomplete;
Vue-specific cards = 0, Runtime Vue/browser coverage = 0. Modules: browser/Web
APIs; frontend JS/TS; templates/components; reactivity/composables;
Router/Pinia/forms; testing/performance/a11y/security/design system.

- [ ] `V-001` Track Lead фиксирует 6 modules, 36 capabilities и prerequisites.
- [ ] `V-002` Inventory Agent отделяет reusable Web/TS от Angular/React historical/contrast.
- [ ] `V-003` Нормализовать 8 incomplete revisions.
- [ ] `V-004` Research Agents закрывают 199 missing Vue/Web role IDs.
- [ ] `V-005` Выпустить 252 primary и 108 supporting placements.
- [ ] `V-006` Собрать 36 Lessons и 7 module/final checkpoints.
- [ ] `V-007` Выпустить 16 native Vue families V01–V16.
- [ ] `V-008` Подключить 12 shared algorithm и ровно 8 approved Web/API/security families.
- [ ] `V-009` Добавить 8 browser performance/a11y investigations и 6 project milestones: total 50.
- [ ] `V-010` Проверить ref/reactive, computed/watch, cleanup, composables, props/events, slots и lifecycle.
- [ ] `V-011` Проверить Pinia, Router, async/Suspense, forms+Zod, keyed identity, errors, performance, SSR/hydration, tests и a11y.
- [ ] `V-012` Разделить Vitest/jsdom, real-browser и external-workspace evidence.
- [ ] `V-013` Forbidden-set test: Angular/React карточки не становятся Vue primary без contrast role.
- [ ] `V-014` Browser journey проходит 36 Lessons, 50 Activities и 7 checkpoints.
- [ ] `V-015` Commit chain и release tuple проверены в RU/EN, light/dark и desktop widths.
- [ ] `V-016` Independent Vue/Web/a11y reviewer подписывает evidence.

### W10.A — Algorithms overlay completion pack

- [ ] `A-001` Зафиксировать 5 modules и 15 technique capabilities.
- [ ] `A-002` Классифицировать 52 raw / 37 ready cards и 15 incomplete.
- [ ] `A-003` Выпустить минимум 68 missing cards: final 75 primary +45 supporting.
- [ ] `A-004` Собрать 15 Lessons и 6 checkpoints.
- [ ] `A-005` Выпустить 12 shared algorithm TaskFamily S01–S12 с JS/TS/Java/Go/C# revisions.
- [ ] `A-006` Добавить 48 дополнительных problem briefs/revisions так, чтобы path имел 60 runnable problems без клонирования families ради языка.
- [ ] `A-007` Каждая technique закрывает baseline, complexity, proof, easy/medium/hard и edge tests.
- [ ] `A-008` Добавить debugging/test-repair и trade-off defense evidence там, где sandbox не доказывает понимание.
- [ ] `A-009` Language selector показывает только released revisions одной problem family.
- [ ] `A-010` Seeded wrong solutions убиваются hidden edge tests; exemplar 20/20 stable.
- [ ] `A-011` Никакая generic algorithm task автоматически не считается runtime-native capability.
- [ ] `A-012` Independent algorithms reviewer подписывает complexity/proof и test quality.

### W10.S — System Design overlay completion pack

- [ ] `S-001` Разделить catch-all 568 cards на 6 modules и 50 capabilities.
- [ ] `S-002` Нормализовать минимум 65 core incomplete; 68 excess классифицировать supplemental/core replacement.
- [ ] `S-003` Выпустить 350 primary и 150 supporting/defense placements.
- [ ] `S-004` Собрать 50 Lessons и 7 checkpoints.
- [ ] `S-005` Выпустить 32 rubric-scored design/defense cases.
- [ ] `S-006` Выпустить 12 isolated infra labs через scenario orchestrator, не ослабляя code sandbox.
- [ ] `S-007` Добавить 6 architecture project milestones: total 50 activities.
- [ ] `S-008` Покрыть requirements/SLO, capacity, API, data model, consistency и failure model.
- [ ] `S-009` Покрыть messaging, caching, network/OS, reliability, observability, delivery/cloud и incidents.
- [ ] `S-010` Design case не получает fake deterministic PASS; rubric/evidence обязательны.
- [ ] `S-011` Проверить reuse внутри language paths через approved shared placements.
- [ ] `S-012` Independent architecture/SRE reviewer подписывает cases и failure labs.

### W10.B — Behavioral overlay completion pack

- [ ] `B-001` Зафиксировать 4 modules, 12 capabilities и bilingual rubric.
- [ ] `B-002` Классифицировать 103 raw / 26 ready cards; нормализовать 77 incomplete.
- [ ] `B-003` Добавить минимум 17 missing cards: final 84 primary +36 supporting.
- [ ] `B-004` Собрать 12 Lessons и 5 checkpoints.
- [ ] `B-005` Выпустить 24 spoken/story rehearsal activities без fake sandbox.
- [ ] `B-006` Связать 6 story/project checkpoints с реальным project evidence Сергея.
- [ ] `B-007` Покрыть recruiter/self, project deep-dive, conflict/leadership и engineering defense.
- [ ] `B-008` RU understanding layer не заменяет English spoken answer evidence.
- [ ] `B-009` Проверить follow-up probes, contradictions, metrics и ownership claims.
- [ ] `B-010` Independent interview/editorial reviewer подписывает rubric и language quality.

## W11 — Activity/EvidenceMode policy

- [ ] `W11-01` Назначить каждой capability режимы recall/predict/code/debug/design/incident/spoken/project/external-repo.
- [ ] `W11-02` Разобрать 126 Practical Tasks: 41 structured + 85 unstructured.
- [ ] `W11-03` Каждой task-like card назначить `structured|brief|converted|rejected`.
- [ ] `W11-04` Сверить 7 structured tasks вне Practical Tasks group.
- [ ] `W11-05` Не считать recall/brief/deferred отсутствующей практикой без policy.
- [ ] `W11-06` Для critical capability назначить 2 independent scenarios.
- [ ] `W11-07` Для spoken/design cases добавить rubric и evidence persistence.
- [ ] `W11-08` Для external repo добавить checkpoint contract и return evidence.
- [ ] `W11-09` Исправить G12: coverage только capability-level denominator + compatible revision join.
- [ ] `W11-10` Failure: одна revision не может пометить весь domain covered.

## W12 — TaskFamily/TaskRevision authoring contract

- [ ] `W12-01` Сохранить текущую правильную границу Family → Revision.
- [ ] `W12-02` Добавить bilingual instructions, hints, design notes и author-only exemplar.
- [ ] `W12-03` Добавить shared canonical behavior fixtures.
- [ ] `W12-04` Hidden tests: happy, boundary, malformed, concurrency/time, resource/abuse.
- [ ] `W12-05` Empty и минимум 3 seeded wrong solutions обязаны падать с правильной taxonomy.
- [ ] `W12-06` Exemplar обязан проходить 20 одинаковых runs без flakiness.
- [ ] `W12-07` Сохранить timeout/memory/PID/network/read-only proofs.
- [ ] `W12-08` Добавить exact Brain bindings и path compatibility tuple.
- [ ] `W12-09` Pin upstream Docker `FROM` по digest; сохранить SBOM/build provenance.
- [ ] `W12-10` Обновить Go profile новой immutable revision после официально поддерживаемой версии.
- [ ] `W12-11` Исправить project-book descriptor/family status contradiction.
- [ ] `W12-12` Failure: hidden tests/brief/provenance/digest отсутствуют — release отклонён.
- [ ] `W12-13` TaskPortfolioManifest reconcile: 60 algorithm + 12 shared backend + 80 native + 16 PostgreSQL = 168 families.
- [ ] `W12-14` Revision reconcile: 300 algorithm + 60 shared backend + 80 native + 16 PostgreSQL = 456 revisions.
- [ ] `W12-15` Current 15/19 получают exact `existing|superseded|supplemental` IDs до вычисления gap.

## W13 — Shared multi-language task families

- [ ] `W13-01` Создать 12 shared algorithm/data-structure families.
- [ ] `W13-02` Создать 12 shared backend families: rate limiter, cache stampede, authz ownership, idempotent consumer, bounded concurrency, cancellation/deadline, retry/jitter, circuit breaker, graceful shutdown, outbox, validation/versioning, telemetry.
- [ ] `W13-03` Для 24 специально выбранных portable core families выпустить JS, TS, Java, Go и C# revisions; прочие families требуют explicit compatibility decision.
- [ ] `W13-04` Переиспользовать canonical fixtures, но сохранить idiomatic public API.
- [ ] `W13-05` Проверить одинаковые outcome/invariants/rubric/failure taxonomy.
- [ ] `W13-06` Не переиспользовать family при смене изучаемого runtime mechanism.
- [ ] `W13-07` Проверить 120 planned shared revisions.
- [ ] `W13-08` Cross-language conformance reviewer для каждой family.
- [ ] `W13-09` Failure: Java revision на Node profile и наоборот блокируются.
- [ ] `W13-10` Проверить learner language selector только по released compatible revisions.

## W14 — Native runtime families

- [ ] `W14-01` Node: выпустить 16 native families (event loop, libuv, workers, streams, Buffer, ALS, AbortSignal, timers, modules, HTTP, signals, errors, GC, diagnostics, EventEmitter leaks, OS boundary).
- [ ] `W14-02` Java/Spring: 16 native families (JMM, locks, collections, virtual threads, interruption, futures, saturation, GC, classloading, equality, streams, DI scopes, proxies/transactions, MVC, security, diagnostics).
- [ ] `W14-03` Go G01–G16: goroutine leak; channel ownership/close; select cancellation; context propagation; race detector; mutex/atomic; worker pool; timer/ticker cleanup; slice aliasing; map concurrency; interface nil; error wrapping; HTTP graceful shutdown; pprof; escape/allocation; package/API design.
- [ ] `W14-04` .NET D01–D16: TAP cancellation; async exceptions; ValueTask; Channels; concurrent collections; lock/Interlocked; DI lifetimes; ASP.NET middleware; EF tracking; EF concurrency/transactions; GC/lifetime; Span/Memory; LINQ deferred execution; disposal; HttpClientFactory; Activity/diagnostics.
- [ ] `W14-05` Для каждого pack пройти authoring gate W12.
- [ ] `W14-06` Проверить native cards → capability → family bindings.
- [ ] `W14-07` Проверить deliberate runtime-specific failure.
- [ ] `W14-08` Проверить 24+ compatible activities на каждый backend path на production-usable checkpoint.
- [ ] `W14-09` Failure: foreign native family не попадает в другой TrackView.
- [ ] `W14-10` Independent expert review по каждому runtime.

## W15 — PostgreSQL, Vue/browser и typed design activities

- [ ] `W15-01` PostgreSQL P01–P16: planner; row locks; DB rate limiter; isolation anomalies; serialization retry; deadlock ordering; index design (partial/covering/multicolumn); join strategy; CTE/materialization; JSONB indexes; vacuum/bloat; partition pruning; WAL/replication lag; safe migrations; constraints/deferrable; advisory locks.
- [ ] `W15-02` Каждая SQL family имеет before/after evidence и deterministic reset.
- [ ] `W15-03` Vue: создать 16 native headless/component families.
- [ ] `W15-04` Vue: добавить 4 advanced real-browser activities.
- [ ] `W15-05` Разделить Vitest/jsdom evidence и isolated Chromium evidence.
- [ ] `W15-06` Browser Run не рекламировать до нового browser execution profile.
- [ ] `W15-07` System Design: создать 32 timed defense cases с rubric.
- [ ] `W15-08` Behavioral: создать минимум 24 spoken/story drills.
- [ ] `W15-09` Algorithms: создать 60 distinct problem TaskFamily × 5 compatible language revisions = 300 revisions; первые S01–S12 одновременно входят в portable core kernel.
- [ ] `W15-10` Failure: design/spoken case не получает fake deterministic PASS.

## W16 — Shared production systems и infrastructure labs

- [ ] `W16-01` HTTP/security: auth, ownership, CORS, retries, versioning, WebSocket/proxy.
- [ ] `W16-02` Cache/Redis: invalidation, stampede, hot key, structures, consistency.
- [ ] `W16-03` Messaging: Outbox crash window, idempotent consumer, ordering, DLQ, replay.
- [ ] `W16-04` OS/network: TCP/UDP, DNS, MTU, sockets, process/thread/memory.
- [ ] `W16-05` Docker: layers/cache, networks, volumes, image/container semantics.
- [ ] `W16-06` Kubernetes: probes, resources, config/secrets, scale, rollback, failed pod diagnosis.
- [ ] `W16-07` Observability: trace/log/metric correlation, cardinality, retry amplification, runbook.
- [ ] `W16-08` Выпустить 12 isolated failure labs с deterministic setup/reset.
- [ ] `W16-09` Проверить cleanup после 20 последовательных runs.
- [ ] `W16-10` Failure: leaked container/volume/process блокирует release.

## W17 — Project Books и сложные внешние репозитории

- [ ] `W17-01` Заменить global hard lock на preview + checkpoint prerequisite states.
- [ ] `W17-02` Microservice decomposition book: boundaries, contracts, data ownership, versioning.
- [ ] `W17-03` Distributed cache book: consistency, invalidation, hot key, degradation.
- [ ] `W17-04` Production telemetry book: sampling, cardinality, correlation, storage cost.
- [ ] `W17-05` Kubernetes delivery book: secrets, migrations, no-downtime, rollback under load.
- [ ] `W17-06` Event workflow book: saga, compensation, idempotency, poison replay.
- [ ] `W17-07` Подключить PHP→Java strangler и personal Nexxen/PWC evidence.
- [ ] `W17-08` Каждый book имеет 6 assessed milestones и return evidence contract.
- [ ] `W17-09` Project Books живут в Lab; внешний code repo регистрируется в `ProjectRegistry` по remote+immutable SHA и не становится новым child root автоматически.
- [ ] `W17-09A` Новый child root разрешён только отдельным topology decision с remote, pin, CI, cleanup и rollback policy.
- [ ] `W17-10` Product release не зависит от личного completion проекта.

## W18 — Learner API и Vue UX

- [ ] `W18-01` API компилирует один join Path→Module→Capability→Card→Activity→Family→Revision.
- [ ] `W18-02` `/questions?pathKey=` возвращает native + approved shared + overlays без копирования.
- [ ] `W18-03` Effective counts: native/shared/overlay/total объяснимы в UI.
- [ ] `W18-04` Facets вычисляются только из effective result set.
- [ ] `W18-05` Run selector показывает только compatible released revisions.
- [ ] `W18-06` Ноль revisions показывает честный brief/theory/project disposition.
- [ ] `W18-07` Прогресс хранит Attempt, Evidence, cold repeat, journal и mastery отдельно.
- [ ] `W18-08` Program→Path→Capability→Question/Activity→Evidence→repeat проходит без dead ends.
- [ ] `W18-09` RU/EN, light/dark/auto, 1280/1728/2560 и 200% без overlap/overflow.
- [ ] `W18-10` Keyboard/focus/VoiceOver и textual graph alternative.
- [ ] `W18-11` Optional local AI получает route/task/card context, но не владеет facts/readiness.
- [ ] `W18-12` Failure: stale/foreign runtime CTA никогда не появляется.

## W19 — Security, flakiness, performance и operations

- [ ] `W19-01` Проверить sandbox network none, readonly mounts, cap drop, no-new-privileges.
- [ ] `W19-02` Проверить secret/hidden-test/source leakage в payload/logs/traces.
- [ ] `W19-03` Проверить CPU/memory/PID/wall-clock limits на всех profiles.
- [ ] `W19-04` Выполнить 20-repeat flakiness matrix для каждого нового family pack.
- [ ] `W19-05` Dependency-offline matrix Brain/Runtime/AI/Jaeger/Postgres/Redis.
- [ ] `W19-06` Retry/double-submit/idempotency и concurrent attempts.
- [ ] `W19-07` Long session: 10 capabilities, 10 revisions, 10 runs.
- [ ] `W19-08` Compare containers/images/volumes/networks/processes до/после.
- [ ] `W19-09` Backup/restore/rollback с exact release tuple.
- [ ] `W19-10` Observability доказывает journey без утечки private answers.

## W20 — Production release rehearsal и sign-off

- [ ] `W20-01` Clean clone → `pnpm dev` → `pnpm status` → canonical `pnpm verify`.
- [ ] `W20-02` Проверить exact Brain↔Runtime↔Lab↔Vue release joins.
- [ ] `W20-03` Full crawl RU+EN всех paths/modules/capabilities/questions/activities.
- [ ] `W20-04` 100% advertised Run URL разрешаются в compatible released revision.
- [ ] `W20-05` Theory/brief/deferred не рекламируют Run.
- [ ] `W20-06` Выполнить fail/pass для каждого language/profile и PostgreSQL/browser.
- [ ] `W20-07` Проверить backend paths имеют target 70 activities без дубликатов.
- [ ] `W20-08` Проверить Vue 50, System Design 50, 32 defense и 12 infra labs.
- [ ] `W20-09` Проверить 2 300 core placements = 1 601 primary +699 supporting, 233 Lessons и 51 checkpoints; supplemental считать отдельно.
- [ ] `W20-09A` Проверить 168 TaskFamily, 456 runnable revisions и точный TaskPortfolioManifest без двойного счёта.
- [ ] `W20-10` Independent semantic, runtime/security и design/a11y reviewers дают PASS.
- [ ] `W20-11` Zero P0/P1; P2 закрыты либо имеют owner/date/risk acceptance.
- [ ] `W20-12` Собрать release manifest: SHAs, releases, schemas, images, SBOM, evidence hashes.
- [ ] `W20-13` Выполнить rollback на previous tuple и повторный forward deploy.
- [ ] `W20-14` Root/children clean и signed release candidate. Push child→root выполняется только при `publish_authorized=true`; иначе SHAs передаются пользователю без remote mutation.
- [ ] `W20-15` Объявить отдельно: Product-ready, Pilot-ready, Plan-2026-ready; не объявлять Learner mastered.

## 4. Обязательный evidence ledger

| Wave | Owner | Input tuple | Output tuple | Commits | Positive/negative gates | Rollback proof | Browser/semantic proof | Reviewer | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W00 | umbrella | TODO | TODO | TODO | TODO | TODO | n/a | TODO | TODO |
| W01 | umbrella/ops | TODO | TODO | TODO | TODO | TODO | smoke | TODO | TODO |
| W02 | docs/Plan | TODO | TODO | TODO | TODO | TODO | link crawl | TODO | TODO |
| W03 | umbrella/releases | TODO | TODO | TODO | TODO | TODO | baseline matrix | TODO | TODO |
| W04 | Brain/Lab/Runtime | TODO | TODO | TODO | TODO | TODO | manifest compiler | TODO | TODO |
| W05 | Brain/Lab | TODO | TODO | TODO | TODO | TODO | module projection | TODO | TODO |
| W06 | Brain | TODO | TODO | TODO | TODO | TODO | deterministic sample | TODO | TODO |
| W07 | Brain/editorial | TODO | TODO | TODO | TODO | TODO | provenance audit | TODO | TODO |
| W08 | Lab | TODO | TODO | TODO | TODO | TODO | nine-path isolation | TODO | TODO |
| W09 | Brain/Lab | TODO | TODO | TODO | TODO | TODO | DAG/text alternative | TODO | TODO |
| W10 | Brain/Lab | TODO | TODO | TODO | TODO | TODO | eight path packs | TODO | TODO |
| W11 | Brain/Lab | TODO | TODO | TODO | TODO | TODO | evidence disposition | TODO | TODO |
| W12 | Runtime | TODO | TODO | TODO | TODO | TODO | runtime contract | TODO | TODO |
| W13 | Runtime | TODO | TODO | TODO | TODO | TODO | language selector | TODO | TODO |
| W14 | Runtime/Brain | TODO | TODO | TODO | TODO | TODO | native isolation | TODO | TODO |
| W15 | Runtime/Lab/Vue | TODO | TODO | TODO | TODO | TODO | SQL/browser/design | TODO | TODO |
| W16 | Runtime/Lab/ops | TODO | TODO | TODO | TODO | TODO | failure labs | TODO | TODO |
| W17 | Lab/projects | TODO | TODO | TODO | TODO | TODO | project checkpoints | TODO | TODO |
| W18 | Lab/Vue | TODO | TODO | TODO | TODO | TODO | full learner journey | TODO | TODO |
| W19 | all security/ops | TODO | TODO | TODO | TODO | TODO | hardening matrix | TODO | TODO |
| W20 | release auditor | TODO | TODO | TODO | TODO | TODO | full crawl | TODO | TODO |

Статус `DONE` разрешён только при заполненной строке, сохранённом
`verification/production-closure/Wxx/wave-contract.json`, machine-readable
proofs и reviewer PASS. Если gate не проверяет найденный дефект, зелёный
результат не считается доказательством и сам gate возвращается в работу.

## 5. Первые действия агента

1. Выполнить W00–W03 без изменения curriculum semantics.
2. Исправить ложные G12 semantics и создать CapabilityRegistry/CoverageManifest.
3. Закрыть W05, W08, W09 и W09A projection compiler: только после truthful
   preview разрешено массовое authoring.
4. Закрыть W06–W07 bounded normalization/expansion pipeline.
5. Запустить восемь W10 path packs и W12–W17 task/activity packs параллельно
   разными owners, но публиковать их через последовательные immutable release tuples.
6. Не ждать дополнительных указаний при обнаружении контентного пробела: создать
   research item, пройти provenance/review gate и выпустить новую revision.
7. После W18–W20 объявить `big-tech-complete` только при всех exact manifests и
   independent PASS; промежуточный `production-usable` не завершает этот план.
