# Fluent Interview: путь от полного Question Brain до полноценных путей Lab

Дата среза: **2026-08-24**. Документ описывает post-release content frontier. Он
не переоткрывает закрытые продуктовые gates Fluent Lab и не меняет владельцев
данных.

## Что уже есть в live-системе

| Слой | Сейчас | Что это означает |
| --- | ---: | --- |
| Program | 1 | одна программа `Backend Engineer · Node.js primary` |
| Curriculum areas | 15 | крупные области учебного графа Lab, не программы и не языковые пути |
| Stations | 81 | опубликованные станции/темы Lab; они могут быть открыты для обзора, но mastery зависит от evidence |
| Question Brain | 1 591 карточка / 135 topic-групп | единый переиспользуемый корпус вопросов |
| Accepted station placements | 19 | только явно проверенные crosswalk-связи |
| Unbound cards | 1 572 | карточки найдены и доступны в Questions, но ещё не назначены станции |
| Task Runtime | 18 descriptors | 17 валидных вопросных связей и 1 capability-only descriptor; это не 1 591 исполняемая задача |

`discoveryCount` в карточке пути — это результат точного server-owned поиска по
общему корпусу. `questionStats.publishedCount` — только принятые placement-связи
со станциями. Эти числа намеренно не складываются и не открывают друг друга.

## Целевая модель

```text
Question Brain card (immutable revision + RU/EN)
        │ explicit reviewed crosswalk
        ▼
Program → Path → Shared Domain → Capability/Station
        │ optional TaskBrief relation
        ▼
Task Runtime revision (Go / Java / Node.js / .NET / SQL …)
        │ deterministic run
        ▼
Evidence → mastery / repeat / next decision in Fluent Lab
```

Карточка отвечает на «что нужно объяснить». `TaskBrief` отвечает на «что нужно
реализовать или спроектировать». `Task Runtime` отвечает на «как это проверить».
Одна карточка может иметь несколько языковых revisions, но у каждой revision
свой starter, тесты, sandbox-политика и evidence. Задача не копируется в vault и
не получает вторую тему: место в дереве наследуется от явно связанного вопроса.

## Ordered execution frontier

Работа идёт строго сверху вниз. Следующая фаза не начинается, пока предыдущая
не имеет dry-run, review и release proof.

### C0 — Truth baseline (закрыто)

- [x] Разделены `Program`, `areas`, `stations`, `Question Brain`, `placements` и `Task Runtime`.
- [x] В Lab есть режим `Explore freely`: обзор не выдаёт mastery и не подменяет evidence-gates.
- [x] Путь имеет явный `discoveryQuery`/`discoveryCount`, а UI показывает `discoverable` и `linked` раздельно.
- [x] В браузере проверены RU/EN, конспект, TaskBrief → 4 runtime revisions, editor/terminal и два desktop viewport.

### C1 — Editorial path crosswalk (следующий блок)

Цель: превратить backlog `1 572 unbound` в проверяемый манифест, не угадывая
путь из `Track`, `Group`, `Topic`, заголовка или breadcrumb.

1. Собрать партиции по будущим путям: Node.js + TypeScript, Java + Spring,
   .NET + C#, Go, Frontend, System Design, Algorithms, Behavioral.
2. Для каждой карточки выбрать `program_key`, `path_key`, `domain_key` и при
   необходимости `capability_key`; неизвестное оставить `unmapped`.
3. Проверить RU-вопрос, EN-вопрос, topic, уровень, тип и дубликаты.
4. Сгенерировать полный manifest с `revision_id` и `content_hash` для каждой
   текущей production-ревизии.
5. Провести dry-run; только после editor approval выполнить `qb-map-release
   --approve`. Никаких локальных копий и fallback-веток в Lab.

**Done when:** каждый из восьми путей имеет опубликованный manifest и отчёт
`accepted / proposed / rejected / unmapped`; ни одна связь не выведена
автоматически.

### C2 — TaskBrief coverage (после C1)

1. Для каждой capability определить, нужен ли recall-only, design brief,
   controlled lab или несколько форматов.
2. Каждая runnable-задача обязана ссылаться минимум на один Question Brain
   stable key и на released question revision.
3. Наполнить runtime revisions из авторских материалов (Go, Java, Node.js,
   C#, SQL/Postgres и далее), не копируя карточки в Runtime.
4. Добавить language-specific starter/tests/hidden-tests и deterministic
   evidence; capability-only descriptor допускается только для осознанного
   capstone и должен быть видимым в аудите.
5. Для задач без runtime не рисовать кнопку «Run» — показывать объяснимый
   `brief available / runtime not released`.

**Done when:** для каждой published executable capability есть валидный
`questionKeys`/`capabilityKeys` join, минимум одна проверенная revision и
runtime health/readiness в release evidence.

### C3 — Lab projection and free exploration

1. Lab читает новый Question Brain graph release и runtime manifest только по
   версиям HTTP-контрактов.
2. `Program` показывает 8 понятных stack/discipline paths; `Knowledge Map`
   показывает полные 15 areas и 81 station без смешивания уровней.
3. `Explore freely` открывает просмотр любой опубликованной станции и вопроса;
   `Recommended` оставляет prerequisite/evidence-gates для следующего шага.
4. По каждой карточке видны: source topic, mapping state, TaskBrief count,
   языковые revisions, Run и Evidence. Состояние «locked» всегда содержит
   причину и маршрут восстановления.
5. Проверить deep links и сохранение истории: выбор свободного вопроса не
   меняет canonical ordering и не выдаёт mastery.

**Done when:** один sampled path проходит `QuestionCard → TaskBrief → Run →
Evidence → Repeat`, а остальные пути честно показывают `preview` или `not
released`, если для них ещё нет crosswalk/runtime.

### C4 — Content release and operations

- [ ] Повторяемые quality/drift/duplicate/translation audits.
- [ ] RU/EN completeness и отсутствие `ru prompt == ru answer`.
- [ ] Release rollback и backup/restore drill для каждого crosswalk/revision.
- [ ] Desktop a11y, no-overflow, performance и observability smoke на
  `1728×1117` и `2560×1440`.
- [ ] Git commit/push всех трёх репозиториев только после доказательств C1–C3;
  vault, Question Brain, Runtime и Lab не становятся вторыми источниками.

## Что не делаем

- Не считаем 1 591 карточку 1 591 станцией или 1 591 задачей.
- Не открываем mastery простой сменой режима или наличием файла.
- Не выводим path/domain/capability из legacy taxonomy.
- Не запускаем код в Lab и не кладём копию задач в Question Brain vault.
- Не добавляем fallback-каталоги, фиктивные связи или «успешные» runtime
  verdicts при недоступной зависимости.

## Проверяемая команда запуска

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm dev
pnpm status
```

`pnpm dev` поднимает Question Brain, Task Runtime и desktop Lab на уникальных
loopback-портах из `workspace.yaml`. Для остановки используется `pnpm down`;
тома не удаляются.
