# Fluent Interview — мастер-план исправления двух аудитов

**Версия:** 2026-08-27  
**Рабочая директория:** `/Users/sergeyzhechko/developer/fluent-interview`  
**Режим:** последовательное выполнение с fail-closed gates  
**Цель:** довести платформу до состояния, в котором опубликованные вопросы, маршруты, задачи, Runtime, UI и release truth можно честно использовать для обучения.

## 0. Источники правды

План объединяет и уточняет:

1. [`FULL-PLATFORM-DEEP-AUDIT-AND-REMEDIATION-PLAN-2026-08-26.md`](FULL-PLATFORM-DEEP-AUDIT-AND-REMEDIATION-PLAN-2026-08-26.md);
2. [`Question Brain → учебные маршруты — аудит 27 августа 2026`](reports/question-brain-route-recomposition-audit-2026-08-27/report.html);
3. [`artifact.json`](reports/question-brain-route-recomposition-audit-2026-08-27/artifact.json) второго аудита;
4. root и child `AGENTS.md`, `CONTEXT.md`, ADR, release manifests и live API projections;
5. текущий production-closure plan как исторический и compatibility baseline.

Если цифра или claim расходится с live-состоянием, агент обязан:

- не выбирать удобную версию;
- записать обе версии в discrepancy ledger;
- установить причину расхождения;
- выбрать один канонический источник;
- добавить regression gate;
- только затем обновить документацию.

## 1. Исходные подтверждённые риски

- Question Brain содержит 1 591 опубликованную production-карточку.
- Только 19 карточек имеют reviewed capability binding.
- Только 6 карточек однозначно доходят до Lab station.
- 1 585 карточек остаются station-unbound.
- В Brain найдено 245 task-like карточек.
- Только 48 имеют нормализованный `task` object.
- Только одна structured task содержит `task_family_key`.
- Runtime связан с 19 вопросами и содержит 19 learner-runnable revisions.
- Learner projection объявляет все 1 591 карточку режимом `puzzle`.
- Source содержит 900 follow-up sets, 832 traps, 772 term sets, 901 practice sections и 295 Project Evidence blocks, но list projection их не показывает.
- RU `learningReady` фактически подтверждён для 989 карточек, однако фильтр `learning-ready` возвращает 1 591.
- Активный Question Brain graph release содержит 7 test-like edges и не является production curriculum graph.
- `path.system-design` хранит 568 преимущественно shared backend-карточек.
- Algorithms ошибочно свёрнут в `domain.runtime`, Behavioral — в `domain.testing`.
- 978 карточек не имеют надёжного language metadata; 42 — level; 54 — group.
- Frontend-корпус содержит Angular/React/RxJS, но не содержит полноценного Vue syllabus.
- .NET имеет заметный теоретический корпус, но практически не имеет нормализованной практики.
- Python-корпус слишком мал для production track.
- Предыдущий аудит обнаружил release provenance, Docker lifecycle, CI, canonical routing, visual consistency, accessibility, observability и repository hygiene gaps.

Эти числа являются baseline, а не вечными константами. Каждый gate сохраняет свежий snapshot.

## 2. Неподлежащие нарушению границы

- Question Brain — единственный владелец QuestionCard, локалей, content layers, editorial relations и question releases.
- Fluent Lab — владелец Program, TrackView, LearningModule, CurriculumStation, progress, evidence и learner action projection.
- Task Runtime — владелец TaskFamily, TaskRevision, sandbox, hidden tests, run verdict и execution trace.
- Vue workspace — единственный browser UI; он отображает server truth и не вычисляет readiness/runnability самостоятельно.
- Question Vault — history mirror; learner runtime его не читает.
- Umbrella workspace — orchestrator, но не новый владелец domain data.
- Shared-модули подключаются к нескольким маршрутам ссылками; вопросы не копируются по языкам.
- Published не означает placed, ready, runnable или mastered.
- Отсутствующая практика отображается как `recall_only`, `brief_only` или `deferred`, а не как фальшивая кнопка Run.
- Никаких silent fallbacks на Event Loop, Node, latest revision, mutable image tag или локальный fixture.
- Никаких hidden tests, private answers и learner code в browser payload, AI prompt или telemetry.

## 3. Канонический словарь, который агент обязан закрепить

| Термин | Значение |
|---|---|
| `QuestionCard` | Одна каноническая двуязычная карточка Brain. |
| `Capability` | Стабильный наблюдаемый навык, не topic и не task ID. |
| `QuestionPlacement` | Reviewed many-to-many связь карточки с capability/module/station. |
| `LearningModule` | Версионированный reusable блок capabilities и prerequisite DAG. |
| `TrackView` | Node/Java/Go/.NET/Python/Vue и другой learner view, собранный из modules. |
| `Activity` | Recall, predict, code, debug, design, incident, explain или defend. |
| `EvidenceMode` | Как learner доказывает понимание. |
| `TaskFamily` | Language-neutral executable objective Runtime. |
| `TaskRevision` | Immutable language/profile-specific implementation. |
| `LearningActionProjection` | Server-owned разрешённое следующее действие и причина unavailable. |
| `ContentReadiness` | Полнота authored learning layers. |
| `PlacementReadiness` | Валидность curricular placement и prerequisites. |
| `RuntimeReadiness` | Наличие released executable revision и healthy profile. |
| `LearnerReadiness` | Производная только от опубликованных предыдущих состояний и evidence. |

## 4. Протокол закрытия каждого пункта

Каждый checkbox ниже закрывается только после выполнения всех подпунктов протокола:

1. Снять `before` evidence.
2. Назвать owner repository и domain owner.
3. Проверить рабочее дерево; не затронуть user-owned изменения.
4. Сформулировать failing test/gate до исправления либо объяснить, почему это невозможно.
5. Внести минимальное owner-scoped изменение.
6. Запустить targeted tests.
7. Запустить owner repository full check.
8. Запустить cross-service contract check, если менялся контракт.
9. Проверить negative case и fail-closed поведение.
10. Проверить migration rollback, если менялись данные.
11. Снять `after` evidence.
12. Обновить evidence ledger и affected docs.
13. Выполнить `git diff --check`.
14. Провести self-review diff без доверия к зелёным тестам.
15. Только после этого заменить `[ ]` на `[x]`.

Запрещено закрывать пункт словами «скорее всего», «визуально похоже», «тест не запускался», «не относится», не указав проверяемое доказательство.

## 5. Артефакты исполнения

Для каждой волны создать `docs/verification/two-audit-remediation/WNN/`:

- `baseline.json`;
- `commands.jsonl` с command, cwd, start/end, exit code и timeout;
- `findings.md`;
- `changes.md`;
- `tests.json`;
- `routes.json`, если затронут UI;
- `screenshots/`, если затронут UI;
- `migration-before.json` и `migration-after.json`, если затронуты данные;
- `rollback.md`;
- `gate.md` с итогом `PASS` или `BLOCKED`;
- Git SHA/dirty state всех repositories.

## 6. Wave 00 — freeze, инвентаризация и защита данных

- [x] W00-001 Прочитать root и все child `AGENTS.md` полностью.
- [x] W00-002 Прочитать root и Lab `CONTEXT.md` полностью.
- [x] W00-003 Собрать список всех Git roots непосредственно под workspace.
- [x] W00-004 Зафиксировать branch, HEAD, remote, upstream, ahead/behind и dirty state каждого root.
- [x] W00-005 Классифицировать каждый dirty файл как user-owned, audit-owned или generated.
- [x] W00-006 Запретить автоматическое удаление/перезапись неизвестных изменений.
- [x] W00-007 Снять `workspace.yaml`, package manager и toolchain versions.
- [x] W00-008 Снять `docker compose ls`.
- [x] W00-009 Снять container names, projects, images, IDs, digests, labels, ports и health.
- [x] W00-010 Снять volumes, owners, labels и estimated sizes.
- [x] W00-011 Снять active Question Brain release ID.
- [x] W00-012 Снять active capability binding release ID.
- [x] W00-013 Снять active question graph release ID.
- [x] W00-014 Снять active Lab program/curriculum release ID.
- [x] W00-015 Снять active Task Runtime release ID.
- [x] W00-016 Экспортировать Brain metadata backup без секретов.
- [x] W00-017 Проверить restore backup в изолированном Compose project.
- [x] W00-018 Снять learner progress snapshot без private answer data.
- [x] W00-019 Снять route × locale × theme desktop screenshot baseline.
- [x] W00-020 Сохранить API response hashes для Program, Atlas, Questions, Practice и Runtime catalogue.
- [x] W00-021 Проверить, что audit scripts read-only.
- [x] W00-022 Создать discrepancy ledger двух аудитов против live snapshot.
- [x] W00-023 Пометить ранее исправленные defects как `candidate-verified`, но не `done`.
- [x] W00-024 Запустить root `pnpm status` и сохранить полный результат.
- [x] W00-025 Запустить текущий `pnpm release:verify:dev` без изменения данных.

**Gate W00:** backup/restore доказан; baseline complete; неизвестные dirty changes не затронуты; следующий шаг разрешён только при наличии `gate.md`.

## 7. Wave 01 — воспроизводимый multi-repository workspace

- [x] W01-001 Проверить, что все пять product repos находятся внутри `fluent-interview`.
- [x] W01-002 Классифицировать sibling `fluent-*` директории вне workspace.
- [x] W01-003 Не удалять sibling до доказательства, что он stale и не содержит уникальных commits.
- [ ] W01-004 Обеспечить remote для Vue repository.
- [ ] W01-005 Зафиксировать canonical remote URL каждого repo.
- [x] W01-006 Зафиксировать exact compatible SHA каждого repo в workspace manifest.
- [x] W01-007 Зафиксировать expected branch policy.
- [x] W01-008 Зафиксировать toolchain: Node, pnpm, Go, Docker/Compose.
- [ ] W01-009 Удалить `local-only` как допустимый production provenance state.
- [ ] W01-010 Расширить layout check на remote mismatch.
- [ ] W01-011 Расширить layout check на missing repository.
- [ ] W01-012 Расширить layout check на wrong branch.
- [ ] W01-013 Расширить layout check на dirty source.
- [ ] W01-014 Расширить layout check на unexpected sibling product repo.
- [ ] W01-015 Добавить frozen bootstrap exact SHAs.
- [ ] W01-016 Проверить bootstrap в новой временной директории.
- [ ] W01-017 Проверить frozen installs всех repositories.
- [ ] W01-018 Проверить отсутствие абсолютных путей в committed manifests.
- [ ] W01-019 Проверить отсутствие секретов в bootstrap logs.
- [ ] W01-020 Проверить повторный bootstrap как idempotent.
- [ ] W01-021 Проверить deliberate SHA mismatch как failure.
- [ ] W01-022 Проверить deliberate dirty repo как strict failure.
- [x] W01-023 Обновить `WORKSPACE-TOPOLOGY.md` фактическими owners.
- [ ] W01-024 Сформировать compatibility bundle digest.

**Gate W01:** fresh clone полностью воспроизводится из одного manifest; все repositories remote-backed и exact-pinned.

## 8. Wave 02 — domain model, ownership и ADR

- [x] W02-001 Сопоставить текущий glossary с каноническими терминами этого плана.
- [x] W02-002 Устранить перегрузку слова `path`.
- [x] W02-003 Добавить `LearningModule` в Lab glossary.
- [x] W02-004 Добавить `TrackView` и отделить его от Brain track.
- [x] W02-005 Добавить `QuestionPlacement` и many-to-many invariant.
- [x] W02-006 Добавить `Activity` и допустимые activity kinds.
- [x] W02-007 Добавить `EvidenceMode`.
- [x] W02-008 Разделить четыре readiness состояния.
- [x] W02-009 Уточнить owner `TaskBrief`: Brain content или Lab activity projection.
- [x] W02-010 Уточнить owner `TaskFamilyReference`.
- [x] W02-011 Уточнить owner module prerequisite graph.
- [x] W02-012 Уточнить owner editorial question relations.
- [x] W02-013 Уточнить versioning каждой cross-service projection.
- [x] W02-014 Зафиксировать hard-to-reverse решения ADR.
- [x] W02-015 Зафиксировать отказ от копирования generic cards ADR.
- [x] W02-016 Зафиксировать release-scoped placement ADR.
- [x] W02-017 Зафиксировать distinction content graph/curriculum graph ADR.
- [x] W02-018 Проверить glossary/code contradictions.
- [x] W02-019 Добавить contract tests на owner boundaries.
- [x] W02-020 Запретить browser-owned counts/readiness/routing verdicts.

**Gate W02:** glossary однозначен; ADR покрывают необратимые trade-offs; ownership tests fail при нарушении границы.

## 9. Wave 03 — CI, version truth и terminal release gate

- [x] W03-001 Инвентаризировать workflows каждого repository.
- [x] W03-002 Удалить ссылки на удалённый Angular/Nx web.
- [x] W03-003 Удалить stale task-image paths.
- [x] W03-004 Удалить вызовы отсутствующих scripts.
- [x] W03-005 Brain CI: gofmt, test, vet, migrations, schema, import, quality.
- [x] W03-006 Brain CI: backup/restore smoke.
- [x] W03-007 Runtime CI: gofmt, test, vet, catalogue, sandbox, image manifest.
- [x] W03-008 Lab CI: lint, unit, contracts, curriculum, package boundaries.
- [x] W03-009 Vue CI: frozen install, typecheck, lint zero warnings, unit, build.
- [ ] W03-010 Vue CI: route E2E на двух desktop profiles.
- [ ] W03-011 Umbrella CI: topology and compatibility join.
- [ ] W03-012 Umbrella CI: fresh clone/bootstrap smoke.
- [x] W03-013 Добавить aggregate `release:verify`.
- [x] W03-014 Включить semantic placement gate.
- [x] W03-015 Включить production graph gate.
- [x] W03-016 Включить question completeness gate.
- [x] W03-017 Включить runtime release join gate (Brain release ID, Runtime dependency, binding revision/hash и immutable runnable revisions).
- [x] W03-018 Включить Docker provenance gate.
- [x] W03-019 Включить route crawler.
- [x] W03-020 Включить a11y and visual gates.
- [ ] W03-021 Включить G14 hardening, а не запускать отдельно.
- [ ] W03-022 Проверить deliberate failure каждого child gate.
- [ ] W03-023 Запретить historical markdown печатать `RELEASED`.
- [x] W03-024 Сохранять machine-readable release evidence.
- [x] W03-025 Установить bounded timeout на каждый gate.

**Gate W03:** ни один broken child repository не может дать зелёный aggregate status.

## 10. Wave 04 — Docker, OCI provenance и lifecycle

- [x] W04-001 Подтвердить ровно три Compose project owners.
- [x] W04-002 Проверить project names на отсутствие случайных duplicates.
- [x] W04-003 Проверить configured и running image digest каждого service.
- [x] W04-004 Запретить `org.opencontainers.image.revision=unknown`.
- [x] W04-005 Pin base images по digest.
- [ ] W04-006 Pin service images по digest в release mode.
- [x] W04-007 Pin task images по digest.
- [x] W04-008 Добавить source revision labels.
- [ ] W04-009 Добавить SBOM reference.
- [ ] W04-010 Добавить provenance reference.
- [x] W04-011 Runtime проверяет inspected digest перед каждым run.
- [x] W04-012 Mismatch digest приводит к fail-closed verdict.
- [x] W04-013 Missing image не скачивается скрыто во время learner run.
- [x] W04-014 Добавить exclusive `dev | package` mode lock.
- [x] W04-015 Одновременные dev/package services считать конфликтом.
- [x] W04-016 `status` должен non-zero при mandatory offline service.
- [x] W04-017 `down` не должен скрывать Compose errors.
- [x] W04-018 Normal down сохраняет durable volumes.
- [ ] W04-019 Normal down останавливает optional profiles.
- [x] W04-020 `prune --plan` показывает exact owned resources.
- [x] W04-021 Prune использует labels, manifest и retention age.
- [x] W04-022 Prune не затрагивает default/global builder.
- [x] W04-023 Prune не затрагивает unrelated containers/images/volumes.
- [ ] W04-024 Разобрать duplicate task image series без слепого удаления.
- [ ] W04-025 Проверить restart preserving data.
- [ ] W04-026 Проверить rollback exact digests.
- [ ] W04-027 Проверить clean start после normal down.
- [x] W04-028 Проверить advertised Grafana/Jaeger URLs.

**Gate W04:** release исполняет exact bytes; lifecycle безопасен; чужие Docker resources недостижимы cleanup-командами.

## 11. Wave 05 — Question Brain schema, metadata и taxonomy

- [x] W05-001 Снять полный inventory 1 591 current revisions.
- [x] W05-002 Проверить stable key uniqueness.
- [x] W05-003 Проверить EN/RU revision parity.
- [x] W05-004 Ввести canonical registries Path, Domain, Topic, Language, Level, Group.
- [x] W05-005 Отделить stable IDs от labels.
- [x] W05-006 Ввести aliases вместо почти одинаковых topic IDs.
- [x] W05-007 Объединить Distributed Systems resilience aliases.
- [x] W05-008 Объединить Go Channels/select aliases.
- [x] W05-009 Объединить Go Sync aliases.
- [x] W05-010 Исправить Algorithms domain.
- [x] W05-011 Исправить Behavioral domain.
- [x] W05-012 Проверить Java cards на Node lane leakage.
- [x] W05-013 Проверить .NET cards на Node lane leakage.
- [ ] W05-014 Проверить RxJS/Angular lane placement.
- [ ] W05-015 Проверить Oracle/PostgreSQL distinctions.
- [ ] W05-016 Классифицировать 978 missing-language cases.
- [x] W05-017 Не заставлять generic question иметь фиктивный language.
- [ ] W05-018 Заполнить 42 missing levels либо explicit `level.unspecified`.
- [ ] W05-019 Заполнить 54 missing groups либо explicit exception.
- [x] W05-020 Проверить duplicate normalized prompts.
- [x] W05-021 Каждый duplicate связать `duplicate|variant|supersedes`.
- [x] W05-022 Добавить accepted-values validation.
- [x] W05-023 Добавить path × domain × topic × language shape rules.
- [x] W05-024 Добавить migration dry-run.
- [x] W05-025 Сохранить counts before/after.
- [x] W05-026 Проверить migration idempotency.
- [ ] W05-027 Проверить rollback.
- [x] W05-028 Выпустить новый immutable Brain mapping release (question payload release unchanged).

**Gate W05:** 0 unexplained taxonomy violations, 0 unreviewed aliases, 0 silent metadata coercions.

## 12. Wave 06 — learning layers и честный readiness

- [x] W06-001 Определить required layers по QuestionType и level.
- [x] W06-002 Не требовать code starter от behavioral/design card.
- [x] W06-003 Проецировать short answer completeness.
- [x] W06-004 Проецировать mechanism completeness.
- [x] W06-005 Проецировать follow-ups availability.
- [x] W06-006 Проецировать traps availability.
- [x] W06-007 Проецировать must-say terms availability.
- [x] W06-008 Проецировать practice availability.
- [x] W06-009 Проецировать Project Evidence availability.
- [x] W06-010 Исправить RU readiness denominator.
- [x] W06-011 Исправить `learning-ready` filter по boolean/state contract.
- [x] W06-012 Добавить negative fixture с incomplete card.
- [x] W06-013 Разделить ContentReadiness.
- [x] W06-014 Разделить PlacementReadiness.
- [x] W06-015 Разделить RuntimeReadiness.
- [x] W06-016 Разделить LearnerReadiness.
- [x] W06-017 Запретить единый ambiguous `ready`.
- [x] W06-018 Показать funnel в Studio.
- [x] W06-019 Создать editorial queue для incomplete cards.
- [x] W06-020 Назначить missing layers и owner каждой incomplete card.
- [x] W06-021 Разбить очередь bounded topic batches.
- [x] W06-022 Запретить массовый LLM auto-publish.
- [ ] W06-023 Требовать human review evidence.
- [x] W06-024 Сверить list и detail projection.
- [x] W06-025 Проверить EN/RU completeness независимо.
- [x] W06-026 Выпустить versioned summary projection.

**Gate W06:** list не теряет существующие layers; readiness filters возвращают только реально соответствующие карточки.

## 13. Wave 07 — production content graph

- [x] W07-001 Изолировать test graph workspace.
- [x] W07-002 Запретить promotion release с test actor.
- [x] W07-003 Удалить fixture rationale из production candidate.
- [x] W07-004 Проверить все 7 текущих active edges вручную.
- [x] W07-005 Отклонить семантически неверные edges.
- [ ] W07-006 Проверить 2 001 proposed related edges.
- [ ] W07-007 Отклонить edges к archived fixture questions.
- [x] W07-008 Ввести edge kinds registry.
- [x] W07-009 Определить prerequisite semantics.
- [x] W07-010 Определить follow-up semantics.
- [x] W07-011 Определить contrast semantics.
- [x] W07-012 Определить variant semantics.
- [x] W07-013 Определить supersedes semantics.
- [x] W07-014 Запретить confidence 1.0 без provenance/reviewer.
- [x] W07-015 Добавить cycle detection для prerequisites.
- [x] W07-016 Добавить orphan detection.
- [x] W07-017 Добавить archived-target detection.
- [ ] W07-018 Добавить incompatible-capability detection.
- [x] W07-019 Добавить minimum reviewer policy.
- [ ] W07-020 Добавить diff previous/candidate release.
- [ ] W07-021 Добавить impact preview на TrackViews.
- [ ] W07-022 Выпустить human-reviewed graph release.
- [ ] W07-023 Проверить learner recommendations против release.
- [ ] W07-024 Проверить rollback graph release.

**Gate W07:** production graph не содержит test provenance, cycles, archived targets или необъяснимые prerequisites.

## 14. Wave 08 — reusable modules и many-to-many placement

- [x] W08-001 Спроектировать versioned `LearningModule` contract.
- [x] W08-002 Спроектировать `QuestionPlacement` contract.
- [x] W08-003 Поддержать primary/follow-up/contrast/recall roles.
- [x] W08-004 Поддержать many-to-many card placement.
- [x] W08-005 Создать Universal CS Core module family.
- [x] W08-006 Создать Backend Core module family.
- [x] W08-007 Создать Data/PostgreSQL module family.
- [x] W08-008 Создать HTTP/API/Security module family.
- [x] W08-009 Создать Distributed Systems module family.
- [x] W08-010 Создать Messaging module family.
- [x] W08-011 Создать OS/Networking module family.
- [x] W08-012 Создать Testing module family.
- [x] W08-013 Создать Delivery/Observability module family.
- [x] W08-014 Создать System Design case family.
- [x] W08-015 Создать Behavioral/English module family.
- [ ] W08-016 Переклассифицировать 568 system-design cards editorially.
- [x] W08-017 Не переносить language-specific exceptions в shared module.
- [ ] W08-018 Проверить минимум 22 language-specific exceptions.
- [ ] W08-019 Привязать cards к capabilities.
- [x] W08-020 Привязать capabilities к modules.
- [ ] W08-021 Привязать modules к stations.
- [x] W08-022 Выпустить module release.
- [ ] W08-023 Сравнить 6 station-bound baseline с новым coverage.
- [x] W08-024 Проверить отсутствие копий stable key по routes.

**Gate W08:** любой shared вопрос хранится один раз и виден в нужных TrackViews через reviewed placement.

## 15. Wave 09 — пересборка TrackViews

### Общий template каждого маршрута

- [ ] W09-001 Добавить diagnostic entry.
- [ ] W09-002 Подключить Universal CS Core.
- [ ] W09-003 Подключить language-native runtime.
- [ ] W09-004 Подключить Backend Core, где применимо.
- [ ] W09-005 Подключить data/concurrency.
- [ ] W09-006 Подключить distributed/production.
- [ ] W09-007 Подключить System Design.
- [ ] W09-008 Подключить Behavioral/English.
- [ ] W09-009 Подключить project evidence/defense.
- [ ] W09-010 Для каждой station указать `native|shared|prerequisite|future`.
- [ ] W09-011 Для каждой station указать visibility reason.
- [ ] W09-012 Проверить deterministic recommended order.

### Node.js + TypeScript

- [ ] W09-013 Покрыть JS execution model и closures.
- [ ] W09-014 Покрыть event loop, timers, microtasks и `nextTick`.
- [ ] W09-015 Покрыть promises, cancellation и error propagation.
- [ ] W09-016 Покрыть streams/backpressure.
- [ ] W09-017 Покрыть worker threads/child processes.
- [ ] W09-018 Покрыть V8, memory и GC.
- [ ] W09-019 Покрыть modules CJS/ESM и package boundaries.
- [ ] W09-020 Покрыть TypeScript type system/tooling.
- [ ] W09-021 Покрыть NestJS lifecycle, DI, pipes, guards, interceptors и filters.
- [ ] W09-022 Подключить shared HTTP/data/messaging/observability modules.

### Java + Spring

- [ ] W09-023 Покрыть Java language/core collections/generics.
- [ ] W09-024 Покрыть JVM memory/GC/classloading.
- [ ] W09-025 Покрыть Java concurrency и virtual threads.
- [ ] W09-026 Покрыть Spring DI/lifecycle/configuration.
- [ ] W09-027 Покрыть Spring MVC/WebFlux границы.
- [ ] W09-028 Покрыть transactions/data access/security/testing.
- [ ] W09-029 Не показывать Node runtime как native Java content.
- [ ] W09-030 Добавить Java-native practice families.

### Go

- [ ] W09-031 Покрыть language/runtime/interfaces/errors.
- [ ] W09-032 Покрыть goroutines/channels/select.
- [ ] W09-033 Покрыть sync primitives и memory model.
- [ ] W09-034 Покрыть context cancellation.
- [ ] W09-035 Добавить `net/http`.
- [ ] W09-036 Добавить `database/sql`.
- [ ] W09-037 Добавить testing/fuzzing/race detector.
- [ ] W09-038 Добавить profiling/pprof.
- [ ] W09-039 Добавить Go-native runtime tasks.
- [ ] W09-040 Устранить topic aliases.

### .NET + C#

- [ ] W09-041 Покрыть C# language/type system/LINQ.
- [ ] W09-042 Покрыть CLR, allocations и GC.
- [ ] W09-043 Покрыть async/await и cancellation.
- [ ] W09-044 Покрыть ASP.NET Core pipeline.
- [ ] W09-045 Покрыть DI/configuration/hosting.
- [ ] W09-046 Покрыть EF Core/transactions/testing.
- [ ] W09-047 Добавить .NET-native practice families.
- [ ] W09-048 Устранить нулевую task-like coverage.

### Python

- [ ] W09-049 Пометить текущий путь preview, пока syllabus недостаточен.
- [ ] W09-050 Добавить Python data model/types/iterators/context managers.
- [ ] W09-051 Добавить async/event loop/concurrency.
- [ ] W09-052 Добавить packaging/testing/profiling.
- [ ] W09-053 Добавить web/data access boundaries.
- [ ] W09-054 Не обещать runtime до released Python profile.
- [ ] W09-055 Определить minimum content threshold для promotion.
- [ ] W09-056 Добавить Python-native practice plan.

### Frontend + Vue/TypeScript

- [ ] W09-057 Сохранить полезный Angular/React/RxJS historical corpus.
- [ ] W09-058 Создать отдельный Vue 3 syllabus.
- [ ] W09-059 Покрыть Composition API и `<script setup>`.
- [ ] W09-060 Покрыть reactivity internals, refs, computed и watchers.
- [ ] W09-061 Покрыть component contracts, slots, provide/inject.
- [ ] W09-062 Покрыть Vue Router и Pinia/state boundaries.
- [ ] W09-063 Покрыть forms и Zod validation boundaries.
- [ ] W09-064 Покрыть accessibility, performance, SSR/hydration concepts.
- [ ] W09-065 Покрыть testing Vue components/composables.
- [ ] W09-066 Добавить browser-capable frontend practice contract.

### Algorithms, System Design, Behavioral

- [ ] W09-067 Перенести Algorithms из `domain.runtime`.
- [ ] W09-068 Составить prerequisite sequence complexity → structures → patterns → graphs → DP.
- [ ] W09-069 Нормализовать 52 algorithm cards.
- [ ] W09-070 Превратить подходящие algorithm cards в language-neutral TaskFamilies.
- [ ] W09-071 Связать implementations по JS/TS/Java/Go/C#/Python.
- [ ] W09-072 Разделить System Design knowledge и design-case activities.
- [ ] W09-073 Добавить capacity, data, consistency, reliability и observability rubrics.
- [ ] W09-074 Перенести Behavioral из `domain.testing`.
- [ ] W09-075 Разделить behavioral recall, STAR rehearsal и project defense.
- [ ] W09-076 Добавить English answer practice без дублирования technical content.

**Gate W09:** каждый route содержит только native или объяснённый shared контент; preview paths не притворяются runnable.

## 16. Wave 10 — нормализация Activities и task corpus

- [x] W10-001 Провести editorial triage 245 task-like cards.
- [x] W10-002 Назначить каждому `activity_kind`.
- [x] W10-003 Назначить каждому `evidence_mode`.
- [x] W10-004 Разделить recall/predict/code/debug/design/incident/explain/defend.
- [x] W10-005 Не превращать behavioral prompt в sandbox task.
- [x] W10-006 Не превращать design case в unit-test-only task.
- [ ] W10-007 Нормализовать 197 cards без structured task object.
- [ ] W10-008 Проверить condition каждой task.
- [ ] W10-009 Проверить expected outcome/rubric.
- [ ] W10-010 Проверить walkthrough/hints.
- [ ] W10-011 Проверить starter ownership.
- [ ] W10-012 Проверить public tests vs hidden tests boundary.
- [ ] W10-013 Проверить capability compatibility.
- [ ] W10-014 Создать TaskFamily только для executable objectives.
- [ ] W10-015 Создать external brief для отдельного repository/project work.
- [ ] W10-016 Создать controlled lab для instrumented system behavior.
- [ ] W10-017 Создать design defense activity с rubric.
- [ ] W10-018 Создать incident activity с evidence contract.
- [ ] W10-019 Связать Project Evidence blocks с project defenses.
- [ ] W10-020 Добавить provenance каждой normalized activity.
- [ ] W10-021 Добавить reviewer и review timestamp.
- [ ] W10-022 Добавить migration dry-run/rollback.
- [ ] W10-023 Выпустить Activity release.
- [ ] W10-024 Проверить counts по каждому TrackView.

**Gate W10:** каждая задача имеет честный тип и evidence; `Run` виден только для released executable activity.

## 17. Wave 11 — Task Runtime и multi-language execution

- [x] W11-001 Сверить raw 16 families/20 revisions с learner-valid 15/19 baseline.
- [x] W11-002 Исключить capability-only revision из runnable counts.
- [x] W11-003 Устранить runtime manifest/catalogue drift.
- [x] W11-004 Проверить immutable question binding hashes.
- [x] W11-005 Проверить exact family/task/revision identity.
- [x] W11-006 Запретить silent latest fallback.
- [x] W11-007 Проверить Node JS profile.
- [x] W11-008 Проверить Node TS profile.
- [x] W11-009 Проверить Go profile.
- [x] W11-010 Проверить Java profile.
- [x] W11-011 Проверить C# profile.
- [x] W11-012 Проверить PostgreSQL profile.
- [ ] W11-013 Спроектировать Python profile, но не publish без sandbox proof.
- [ ] W11-014 Спроектировать browser frontend profile отдельно от server sandbox.
- [x] W11-015 Проверить rate limiter во всех пяти языках.
- [x] W11-016 Проверить pass verdict.
- [x] W11-017 Проверить compile failure.
- [x] W11-018 Проверить test failure.
- [x] W11-019 Проверить timeout.
- [x] W11-020 Проверить memory/PID limit.
- [x] W11-021 Проверить network none.
- [ ] W11-022 Проверить retry и idempotency.
- [x] W11-023 Проверить trace/evidence identity.
- [x] W11-024 Проверить no hidden-test leakage.
- [x] W11-025 Проверить no private answer leakage.
- [ ] W11-026 Выпустить immutable Runtime release.

**Gate W11:** выбранная language revision является той, которая реально исполнилась и записалась в evidence.

## 18. Wave 12 — Lab projections и canonical routing

- [x] W12-001 Реализовать versioned LearningActionProjection.
- [x] W12-002 Проецировать theory route.
- [x] W12-003 Проецировать TaskFamily route.
- [x] W12-004 Проецировать selected revision route.
- [x] W12-005 Проецировать preview route.
- [x] W12-006 Проецировать repeat/progress route.
- [x] W12-007 Проецировать unavailable reason.
- [x] W12-008 Удалить hard-coded task destinations (learner CTA surfaces now use released route projection; canonical-route guard covers the boundary).
- [x] W12-009 Удалить hard-coded Event Loop fallback (LessonView no longer invents the Event Loop destination).
- [x] W12-010 Canonicalize `/questions` aliases.
- [x] W12-011 Canonicalize lab aliases.
- [x] W12-012 Canonicalize learning-map/path aliases.
- [x] W12-013 Исправить Studio recovery alias.
- [x] W12-014 Сохранить query/hash при redirect.
- [x] W12-015 Передавать exact revision в Workspace.
- [x] W12-016 Передавать exact revision в Run.
- [x] W12-017 Возвращать exact identity в response.
- [x] W12-018 Отклонять incompatible query tampering.
- [ ] W12-019 Проецировать native/shared/prerequisite/future.
- [ ] W12-020 Проецировать correct released/runnable counts.
- [ ] W12-021 Объяснять cross-domain resume.
- [x] W12-022 Не публиковать action с broken API contract.
- [x] W12-023 Добавить route contract snapshots.
- [x] W12-024 Добавить backward compatibility tests.
- [ ] W12-025 Выпустить новый Program projection.

**Gate W12:** ни один browser route не придуман UI; каждый CTA разрешён server release и ведёт к соответствующему content/task.

## 19. Wave 13 — learner UX и функциональные поверхности

- [x] W13-001 Program показывает общий прогресс и следующий честный action.
- [x] W13-002 Atlas отображает released module graph.
- [x] W13-003 Atlas имеет keyboard alternative list.
- [x] W13-004 Atlas nodes кликабельны только согласно action projection.
- [x] W13-005 Path view объясняет shared station.
- [x] W13-006 Path view не смешивает unrelated language content.
- [x] W13-007 Questions list показывает настоящие learning layers.
- [x] W13-008 Questions filters используют server counts.
- [x] W13-009 Question detail показывает correct relations.
- [x] W13-010 Question detail показывает correct TaskFamily или отсутствие практики.
- [x] W13-011 Lesson показывает readiness без ложной полноты.
- [x] W13-012 Practice различает runnable/brief/recall/deferred.
- [x] W13-013 TaskFamily показывает language revisions.
- [x] W13-014 Runtime picker сохраняет selection в URL.
- [x] W13-015 Workspace показывает выбранный language/profile/runtime.
- [x] W13-016 Editor mode и extension соответствуют language (CodeMirror grammars are lazy-loaded for JavaScript/TypeScript/Go/Java/C#/SQL and browser-proven per released revision).
- [x] W13-017 Run result отображает exact revision/digest.
- [x] W13-018 Evidence доступно после run.
- [x] W13-019 Explain step требует learner explanation, где положено (empty explanation is disabled; server gate remains authoritative).
- [x] W13-020 Cold repeat создаёт следующую попытку корректно (real AppModule HTTP integration evidence in W17).
- [ ] W13-021 Progress не загрязняется synthetic tests.
- [x] W13-022 Projects показывают только существующие books/checkpoints.
- [x] W13-023 Missing project book имеет честный empty state.
- [x] W13-024 AI companion получает route/question/task context без hidden data.
- [x] W13-025 AI offline/loading/stream/cancel/error/history работают.
- [x] W13-026 Navigator открывается в заявленной docked geometry.
- [x] W13-027 Dialog/popover positioning соответствует trigger context.
- [x] W13-028 Back/forward восстанавливает state.
- [x] W13-029 Reload deep link сохраняет selection.
- [x] W13-030 Scroll restoration не ломает nested workspaces.

**Gate W13:** golden learner journey проходит без ручного редактирования URL и без смыслового несоответствия контента пути.

## 20. Wave 14 — design system, Liquid Glass, i18n и accessibility

- [x] W14-001 Инвентаризировать все design tokens.
- [x] W14-002 Удалить дубли токенов и undocumented magic values.
- [x] W14-003 Зафиксировать semantic color roles.
- [x] W14-004 Зафиксировать typography scale.
- [x] W14-005 Зафиксировать spacing/grid scale.
- [x] W14-006 Зафиксировать radius/elevation/material scale.
- [x] W14-007 Зафиксировать motion durations/easings.
- [x] W14-008 Определить Tailwind token-aware policy либо удалить Tailwind.
- [x] W14-009 Запретить arbitrary colors в feature code.
- [ ] W14-010 Создать AppRail primitive.
- [ ] W14-011 Создать TopBar primitive.
- [ ] W14-012 Создать CommandPalette primitive.
- [ ] W14-013 Создать DockedInspector primitive.
- [ ] W14-014 Создать StateCard/MetricStrip primitives.
- [ ] W14-015 Создать FilterBar/DataList primitives.
- [ ] W14-016 Создать RuntimePicker primitive.
- [ ] W14-017 Создать canonical Dialog/Popover primitives.
- [ ] W14-018 Создать code workspace layout primitive.
- [ ] W14-019 Liquid Glass использовать только для functional/navigation layers.
- [ ] W14-020 Content cards оставить стабильным читаемым material.
- [ ] W14-021 Проверить light theme.
- [ ] W14-022 Проверить dark theme.
- [ ] W14-023 Проверить system theme.
- [ ] W14-024 Проверить increased contrast.
- [ ] W14-025 Проверить reduced transparency.
- [ ] W14-026 Проверить reduced motion.
- [ ] W14-027 Проверить 200% zoom.
- [ ] W14-028 Обеспечить один top-level `main`.
- [ ] W14-029 Обеспечить один осмысленный h1.
- [ ] W14-030 Исправить heading order.
- [ ] W14-031 Исправить native button/link semantics.
- [ ] W14-032 Исправить focus visible/not obscured.
- [ ] W14-033 Исправить focus return dialogs/popovers.
- [ ] W14-034 Исправить roving tabindex graph/list controls.
- [ ] W14-035 Добавить `aria-current` Atlas/path navigation.
- [ ] W14-036 Проверить target sizes.
- [ ] W14-037 Проверить RU dictionary coverage.
- [ ] W14-038 Проверить EN dictionary coverage.
- [ ] W14-039 Запретить raw enums в UI.
- [ ] W14-040 Проверить long RU/EN labels без overlap.
- [ ] W14-041 Проверить MacBook Pro 16 `1728×1117`.
- [ ] W14-042 Проверить Studio Display `2560×1440`.
- [ ] W14-043 Проверить narrow desktop `1280×800` как degradation baseline.
- [ ] W14-044 Проверить отсутствие body horizontal overflow.
- [ ] W14-045 Проверить каждый scroll owner wheel/trackpad/keyboard.

**Gate W14:** все canonical surfaces проходят axe, keyboard и visual matrix; нет overlap, clipping, false dialog geometry или broken scroll.

## 21. Wave 15 — performance и repository hygiene

- [x] W15-001 Снять initial JS/CSS baseline.
- [x] W15-002 Снять per-route chunk baseline.
- [x] W15-003 Lazy-load xterm только в workspace.
- [x] W15-004 Lazy-load editor/runtime-specific code. (CodeMirror language
  grammars are dynamically imported only by the workspace editor.)
- [x] W15-005 Проверить network trace Program/Questions без xterm.
- [ ] W15-006 Virtualize большие question lists.
- [ ] W15-007 Virtualize graph/list surfaces при threshold.
- [x] W15-008 Установить initial bundle budget.
- [x] W15-009 Установить lazy chunk budgets.
- [ ] W15-010 Установить interaction/render budgets.
- [ ] W15-011 Удалить доказанно unused dependencies.
- [ ] W15-012 Исправить Nx/ESLint deprecations.
- [ ] W15-013 Исправить NO_COLOR/FORCE_COLOR warnings.
- [ ] W15-014 Перенести bulky traces из normal Git history policy.
- [ ] W15-015 Ввести bounded evidence retention.
- [ ] W15-016 Сохранять checksums/manifests promoted evidence.
- [ ] W15-017 Проверить fresh clone size.
- [ ] W15-018 Проверить build cache ownership.
- [ ] W15-019 Проверить remote cache decision и security.
- [x] W15-020 Добавить performance regression gate.

**Gate W15:** initial routes не загружают workspace payload; budgets fail на намеренной регрессии; evidence retention ограничен.

## 22. Wave 16 — observability и learner analytics

- [x] W16-001 Нормализовать OTel service name/version/instance/environment.
- [x] W16-002 Добавить source revision и release IDs. Shared Lab projections,
  logs and traces now carry the validated tuple; Runtime and Brain readiness
  responses expose the exact source revision/release/environment.
- [ ] W16-003 Протянуть correlation route→question→family→revision→attempt.
- [x] W16-004 Добавить AI conversation ID без prompt/private content.
- [x] W16-005 Измерять false/unavailable CTA через finite learner-event
  vocabulary без profile/task labels.
- [x] W16-006 Измерять readiness funnel через bounded readiness/learner events.
- [x] W16-007 Измерять help/reveal frequency через bounded learner events.
- [x] W16-008 Измерять time-to-first-run от валидированного browser-session
  marker после persisted first run; повторный marker дедуплицируется.
- [x] W16-009 Измерять failed-run outcome без raw reason/private payload.
- [x] W16-010 Измерять explanation/repeat completion через bounded outcomes.
- [x] W16-011 Измерять AI latency/cancel/error/provider.
- [x] W16-012 Измерять semantic gate violations через bounded refusal outcome.
- [x] W16-013 Проверить Prometheus targets. (Live target inventory includes
  explicit bounded Task Runtime and Question Brain scrapes, both `up`; the
  package-oriented Lab target remains an explicit dev-profile warning.)
- [x] W16-014 Проверить Loki ingestion/query. (Optional profile returned a
  successful bounded LogQL `query_range` response.)
- [x] W16-015 Проверить Jaeger continuity. Disposable released
  `node-rate-limiter-001` evidence contains route-context, Lab run and
  Task Runtime `task.run` spans with one correlation id and one shared trace.
- [x] W16-016 Проверить Grafana availability и dashboards. (Health and the
  `fel-golden-signals` dashboard projection both returned HTTP 200.)
- [x] W16-017 Studio diagnostics показывает honest online/offline.
- [x] W16-018 Synthetic journey использует disposable test profile. Evidence
  is generated by `scripts/observability-journey-gate.mjs` and records only
  bounded statuses/counts/hashes/trace identities.
- [x] W16-019 Synthetic journey не меняет Sergey progress. Before/after
  stable learner projection hashes are identical in `W16/jaeger-continuity.json`.
- [x] W16-020 Проверить telemetry redaction.

**Gate W16:** один golden journey трассируется end-to-end; PII/private answer/code/hidden tests отсутствуют.

## 23. Wave 17 — полная validation matrix

### API и contracts

- [x] W17-001 Brain health/readiness/release/quality/search.
- [x] W17-002 Runtime health/readiness/catalogue/profiles/runs.
- [x] W17-003 Lab health/readiness/program/questions/practice/progress.
- [x] W17-004 Schema compatibility current/current.
- [x] W17-005 Schema compatibility previous/current.
- [x] W17-006 Invalid release ID rejection.
- [x] W17-007 Stale revision rejection.
- [x] W17-008 Timeout/retry/idempotency.

### Routes

- [x] W17-009 Crawl every router record.
- [x] W17-010 Crawl every server-projected internal href.
- [x] W17-011 Test direct navigation.
- [x] W17-012 Test reload.
- [x] W17-013 Test back/forward.
- [x] W17-014 Test alias redirect.
- [x] W17-015 Test query/hash preservation.
- [x] W17-016 Test loading/error/retry/empty.
- [x] W17-017 Assert meaningful heading.
- [x] W17-018 Assert no console errors/warnings.
- [x] W17-019 Assert no failed unexpected requests.
- [x] W17-020 Assert no horizontal overflow.

### Track semantic isolation

- [x] W17-021 Node route: no unexplained Java/.NET/Go native cards.
- [x] W17-022 Java route: no Node-native cards.
- [x] W17-023 Go route: no Node/Java-native cards.
- [x] W17-024 .NET route: no Node-native cards.
- [x] W17-025 Python route: no fake runnable runtime.
- [ ] W17-026 Vue route: Vue-native syllabus present.
- [x] W17-027 Algorithms route: algorithm domain and practice correct.
- [x] W17-028 System Design route: design cases and shared backend clearly separated.
- [x] W17-029 Behavioral route: no testing-domain misclassification.
- [x] W17-030 Shared cards show visibility reason (learner-safe native/shared/proposed/unmapped projection; current release has no shared card to render).

### Golden journeys

- [x] W17-031 Theory-only question.
- [x] W17-032 Incomplete question.
- [x] W17-033 Question with rich learning layers.
- [x] W17-034 Node Event Loop six challenges.
- [x] W17-035 Rate Limiter JS (browser binding + Runtime G9 4/4 evidence).
- [x] W17-036 Rate Limiter TS (browser binding + Runtime G9 4/4 evidence).
- [x] W17-037 Rate Limiter Go (browser binding + Runtime G9 4/4 evidence).
- [x] W17-038 Rate Limiter Java (browser binding + Runtime G9 4/4 evidence).
- [x] W17-039 Rate Limiter C# (browser binding + Runtime G9 4/4 evidence).
- [x] W17-040 PostgreSQL concurrency task (real PostgreSQL 17 sandbox, five
  harness checks; evidence `W17/postgresql-concurrency-run.json`).
- [x] W17-041 Design-case activity (server-owned ordering source + correct
  commit, 8/8; evidence `W17/design-case-run.json`).
- [x] W17-042 Incident/debug activity (released Node.js 24 task, 4/4
  worker/cancellation/cleanup checks; evidence `W17/incident-debug-run.json`).
- [x] W17-043 Project-book checkpoint.
- [x] W17-044 Explanation and evidence.
- [x] W17-045 Cold repeat (AppModule HTTP creates initial → explanation →
  linked repeat and retained comeback; evidence `W17/cold-repeat-http-run.json`).
- [x] W17-046 AI offline/retry/cancel.
- [x] W17-047 Failure recovery.

### Visual/state matrix

- [x] W17-048 MacBook light RU.
- [x] W17-049 MacBook dark RU.
- [x] W17-050 MacBook light EN.
- [x] W17-051 MacBook dark EN.
- [x] W17-052 Studio light RU.
- [x] W17-053 Studio dark RU.
- [x] W17-054 Studio light EN.
- [x] W17-055 Studio dark EN.
- [x] W17-056 Keyboard-only journeys.
- [x] W17-057 Reduced motion/transparency.
- [x] W17-058 200% zoom.
- [ ] W17-059 Screenshot diff review человеком/независимым reviewer.

**Gate W17:** все matrices зелёные; flaky test должен быть исправлен, а не перезапущен до случайного PASS.

## 24. Wave 18 — release closure

- [ ] W18-001 Повторить clean fresh clone.
- [ ] W18-002 Повторить frozen bootstrap.
- [ ] W18-003 Проверить clean Git roots и exact pins.
- [ ] W18-004 Выполнить full owner checks.
- [ ] W18-005 Выполнить aggregate release gate.
- [ ] W18-006 Собрать production package.
- [ ] W18-007 Проверить package provenance tuple.
- [ ] W18-008 Запустить exclusive package mode.
- [ ] W18-009 Повторить golden journeys в package mode.
- [ ] W18-010 Проверить restart.
- [ ] W18-011 Проверить backup/restore.
- [ ] W18-012 Проверить rollback previous release.
- [ ] W18-013 Проверить normal down preserving volumes.
- [ ] W18-014 Проверить prune plan без удаления.
- [ ] W18-015 Получить независимый code review.
- [ ] W18-016 Получить независимый architecture/domain review.
- [ ] W18-017 Получить независимый UI/a11y review.
- [ ] W18-018 Закрыть все P0.
- [ ] W18-019 Закрыть все P1.
- [ ] W18-020 Для каждого оставшегося P2 указать owner/date/explicit acceptance.
- [ ] W18-021 Обновить README/ADR/roadmap/handoff.
- [ ] W18-022 Обновить Obsidian Plan 2026 только проверенными результатами.
- [ ] W18-023 Зафиксировать все child commits отдельно.
- [ ] W18-024 Обновить umbrella compatibility manifest.
- [ ] W18-025 Повторить release gate после commits.
- [ ] W18-026 Push только при явном разрешении пользователя.
- [ ] W18-027 Сформировать final evidence index.
- [ ] W18-028 Сформировать список реально доступных learner journeys.
- [ ] W18-029 Сформировать honest deferred backlog.
- [ ] W18-030 Только после независимого PASS присвоить статус `RELEASED`.

**Gate W18:** clean committed package проходит aggregate verification, rollback и независимые reviews; итоговый статус подтверждён evidence index.

## 25. Обязательные команды финальной проверки

Агент должен реализовать или использовать эквивалентные команды:

```bash
pnpm bootstrap --frozen
pnpm layout:check --strict
pnpm verify:git
pnpm verify:contracts
pnpm verify:brain
pnpm verify:runtime
pnpm verify:lab
pnpm verify:vue
pnpm verify:taxonomy
pnpm verify:content-readiness
pnpm verify:question-graph
pnpm verify:curriculum-graph
pnpm verify:placements
pnpm verify:activities
pnpm verify:runtime-bindings
pnpm verify:docker-provenance
pnpm verify:routes
pnpm verify:track-isolation
pnpm verify:accessibility
pnpm verify:visual
pnpm verify:performance
pnpm verify:observability
pnpm verify:hardening
pnpm release:verify
```

Каждая команда должна быть read-only по умолчанию, bounded timeout, non-zero при дефекте и сохранять machine-readable result с release IDs и Git SHAs.

## 26. Commit protocol

1. Один repository owner — один логический commit.
2. Cross-repo contract change — coordinated commits плюс compatibility manifest.
3. Не смешивать migration, UI polish и infrastructure в одном commit.
4. Перед commit: targeted tests, full owner check, contract tests, `git diff --check`.
5. После commit: повторить relevant gate на committed tree.
6. Не использовать `git reset --hard`, destructive checkout или force push.
7. Не переписывать user history.
8. Не push без явного разрешения пользователя.

## 27. Условия немедленной остановки

Агент обязан остановить текущую волну, но не маскировать её как complete, если:

- существует риск потери Brain/Runtime/progress data;
- требуется удалить volume или неизвестный Docker resource;
- обнаружены уникальные commits во внешнем sibling repo;
- контракт ownership неразрешим без ADR/решения пользователя;
- migration counts отличаются от ожидаемых;
- hidden tests/private content появились в client/log/trace;
- release gate зелёный только после ослабления проверки;
- не удаётся воспроизвести baseline;
- требуется внешний credential/remote authority.

Статус в этом случае — `BLOCKED`, с точной причиной, evidence и безопасным следующим действием.

## 28. Definition of Done

План завершён только если одновременно истинно:

- workspace воспроизводится fresh clone;
- все product repos remote-backed и exact-pinned;
- все release inputs immutable и traceable;
- 1 591 карточка имеют честные content/placement/runtime states;
- shared knowledge переиспользуется через modules;
- production graph human-reviewed и свободен от test fixtures;
- каждый TrackView семантически чист и объясняет shared content;
- task-like corpus классифицирован в честные Activities;
- runnable tasks связаны с immutable TaskRevisions;
- language picker изменяет реально исполняемую revision;
- 0 false CTA, unrelated fallback и broken published action;
- Vue/Frontend syllabus существует и связан с практикой;
- RU/EN, light/dark и целевые desktop viewports проходят visual/a11y gates;
- observability показывает end-to-end learner journey без утечки private data;
- backup/restore/restart/rollback доказаны;
- aggregate release gate PASS на clean committed revisions;
- независимый reviewer подтвердил 0 P0/P1;
- final report содержит evidence, а не только отмеченные checkbox.

## 29. Первые действия агента

1. Не редактировать product code.
2. Выполнить W00 полностью.
3. Создать discrepancy ledger старых claims против live snapshot.
4. Показать список реально открытых blockers.
5. Начать W01 только после PASS W00.
6. Никогда не перескакивать к визуальной полировке через красный data/release gate.

## 30. Журнал выполнения (2026-08-27)

- **W00:** выполнен. Baseline, backup/restore smoke, API hashes и dev release
  verification сохранены в `docs/verification/two-audit-remediation/W00/`.
- **W01:** в работе. Пять Git-root подтверждены внутри workspace, Vault
  fast-forward перенесён в local `main`, exact SHA pins добавлены. Gate
  остаётся `BLOCKED`, пока Vue не получит проверенный origin и child trees не
  будут опубликованы чистыми commits. Evidence: `W01/`.
- **W06:** partial pass. Brain catalog теперь публикует answer-free layer
  flags; Lab валидирует их; readiness filter больше не маскирует incomplete
  cards (EN 1100/491, RU 989/602). Evidence: `W06/`.
- **W02:** pass with explicit W12 debt. Canonical glossary, ownership
  boundaries and ADRs 0038–0040 добавлены; the versioned module/placement
  negative matrix and browser owner-boundary guard pass. Fourteen existing
  Vue derivations remain inventoried transitional debt for W12. Evidence:
  `W02/`.
- **W04:** partial pass. Brain/Runtime images rebuilt from digest-pinned bases
  with exact OCI source revisions; live provenance, readiness, Compose config
  and read-only prune plan pass. Production service digest/SBOM release,
  rollback and clean-package lifecycle remain open. Evidence: `W04/`.
- **W06 layer parity:** list/detail projection now accepts editorial title
  variants (including Russian, `Follow-up Q&A`, `Common pitfalls`, `Deep dive`)
  and has regression coverage; EN/RU readiness counts remain independently
  verified.
- **W05:** выполнен catalog integrity gate. EN/RU — 1 591/1 591, stable IDs
  уникальны, locale parity и published enums проходят. Две observed prompt
  collision получили durable decisions (`not_duplicate` и `keep_separate`);
  открытых duplicate groups — 0. Evidence: `W05/`, digest
  `6cc1df1d3049e591cae0b32ca723e10f1db64f369c232640db56da22f04e4c09`.
- **W06 layer model:** Project Evidence добавлен в Brain answer-free flags,
  Lab content mapper, learner contract, detail view и projection tests.
  Coverage теперь несёт отдельные `content`, `placement`, `runtime`,
  `learner` readiness dimensions; `ready` без области запрещён guard-ом.
- **W03/W04 execution:** child workflow inventory, Brain backup/restore CI
  steps, aggregate development release verification and the exclusive
  `development|production` mode guard are green. A clean `pnpm down` →
  `pnpm dev` restart acquired the lock while preserving durable volumes.
  Evidence: `W03/` and `W04/`.
- **W07:** graph edge semantics, reviewer/provenance guards and a read-only
  release audit are in place. Fixture/smoke proposals were rejected through
  the review API with history preserved; the active production graph release
  is empty and deterministic. Evidence: `W07/`.
- **W08–W11:** 17 LearningModule families and 1 591 answer-free placements
  were released; nine isolated path projections, a typed activity corpus and
  exact Runtime family/revision bindings pass their gates. Evidence: `W08/`,
  `W09/`, `W10/`, `W11/`.
- **W12:** server-owned `learner-route-context.v1` now controls route phases,
  readiness and actions. TaskFamily selection, exact TaskFamily + revision
  identity, repeat-due actions and tamper-safe recovery are covered; Workspace
  and Run receive the same tuple. The live route/action gate is 12/12, the
  canonical-route guard is 8/8, and all 35 Vue router records are covered by
  the static/live route matrix. Remaining debt is limited to the full native /
  shared Program projection and cross-domain resume semantics; production
  provenance remains open. Evidence: `W12/`.
- **W13:** the Vue learner journeys now have 76 passing desktop scenarios over
  Program, Atlas, paths, Questions, Konspekt, TaskFamilies, Runtime, Projects,
  AI, locale/theme switching and scroll/history recovery. The corresponding
  learner UX rows are checked above; synthetic-progress isolation remains an
  explicit warning. Evidence: `W13/`.
- **W14:** the token audit now covers 116 tokens and 49 required semantic roles,
  with zero duplicate theme declarations, zero raw feature colours and all
  light/dark/system/reduced-motion/reduced-transparency hooks present. Primitive
  extraction and the full visual/a11y matrix remain open. Evidence: `W14/`.
- **W15:** Vite manifest and performance gate prove that the initial route stays
  below the measured JS/CSS budgets and does not load xterm; bounded Questions
  pagination is enforced. Interaction timing, dependency cleanup and cache
  policy remain open. Evidence: `W15/`.
- **W16:** observability contract/privacy checks (24 static, 15 live; 9
  required and 6 optional live probes) and the observability unit suite pass
  with zero warnings or failures. Build identity, finite learner funnel
  events and bounded first-run timing avoid prompt/output/hidden-test leakage.
  Question Brain and Task Runtime have explicit healthy Prometheus targets. A
  disposable released rate-limiter journey proves route → Lab run → Task
  Runtime Jaeger continuity, first-run timing and unchanged Sergey progress.
  W16-003 (the full route → question → family → revision → attempt join)
  remains open by design because the public projection does not yet expose
  the question join. Evidence: `W16/`.
- **W17:** the read-only validation matrix now checks all 35 Vue route records,
  43 representative direct/alias/dynamic/recovery URLs, 16 public API probes
  and 27 semantic path/placement checks. It passed 107/107 checks and
  reconciled the graph/manifest tuple, 1,591-card Question Brain release,
  bounded pagination, code/PostgreSQL family separation and native placement
  isolation. Current/current and previous/current schema fixtures pass 14
  executable contract tests. The browser suite is 102/102 across both desktop
  projects. The seven named golden journeys pass 14/14 executions across both
  projects (including released runtime-to-editor language mode), and the visual state matrix passes 8/8 executions (RU/EN × light/dark, keyboard, reduced
  motion/transparency and 200% zoom). The released `pg-locks-016` task also
  passed a real PostgreSQL 17 concurrency run with all five harness checks
  green. W17-026 (Vue-native Frontend syllabus) and human visual sign-off
  remain explicit gaps.
  Evidence: `W17/`.
- **Aggregate development gate:** after W16–W17 integration, `release-verify:dev`
  passed 50/51 steps with one explicit package-provenance warning. It remains a
  development verification, not a production promotion, because the five-root
  source tuple is dirty and Vue has no verified remote.
- **Execution snapshot 2026-08-27 18:42Z:** `observability:journey` and
  `observability:live` now pass with zero warnings (24 static, 15 live, 9
  required + 6 optional). The repeated aggregate gate passed 51/51 functional
  checks (50 pass + one expected provenance warning; Vue E2E 102/102). The
  first aggregate rerun exposed and then fixed a genuine cold-load defect in
  the answer-free Question Brain quality projection: identical requests are
  now coalesced behind a two-second process-local snapshot bounded to 32
  workspace/scope entries and Lab's operator client uses a bounded 4s timeout.
  A 20-request concurrent probe returned 20/20 HTTP 200 responses; catalogue
  integrity and `studio-system` are green. Brain's HTTP package tests are
  race-clean and the full Question Brain/Task Runtime Go test and vet suites
  pass.
  The strict gate was also run and correctly returned `BLOCKED` on dirty/unpinned
  roots, the Vue `local-only` remote and the non-executable package boundary;
  no production package was promoted. Evidence:
  `W16/jaeger-continuity.json`,
  `W17/release-verify-dev-wave-2026-08-27.json`, and
  `release-verify-strict-wave-2026-08-27.json`.
- Следующие волны разрешены только после сохранения evidence и повторения
  owner/cross-service checks; незакрытые пункты не считаются выполненными.
