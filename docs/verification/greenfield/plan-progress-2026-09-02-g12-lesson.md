# G12-025 — Lesson state-evidence wave

Дата: 2 сентября 2026  
Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`  
Ветка: `main`  
Коммит: `642e6b40874cd31a77fec0550b5ed08e43e68f8a`  
Push: не выполнялся (лимит GitHub Actions)

## Что закрыто

Live compose-project-scoped stack проверен на пяти критических состояниях
маршрута `/practice/lesson/[id]`:

- `question-selected` — выбран опубликованный вопрос
  `question.node-nexttick-promise-001`; observe activity остаётся без ложной
  runnable-ссылки;
- `activity-released` — `question.node-event-loop-001` показывает две
  assessed activities и явный переход в `/practice/node-event-loop-001`;
- `activity-preview` — плановый `js-scheduling` без released card честно
  отображает preview и recovery в Questions/Program;
- `missing-question` — неизвестный query fail-closed, без silent substitution;
- `ru` — `html[lang]=ru`, русская копия и Node.js placement/activity identity
  сохранены.

Для каждого state сохранены `interaction.json`, `semantic.json` и реальный
`visual.jpg` в
`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence/lesson/`.
Все assertions PASS: route, main/heading, `.app-scroll-region` как единственный
владелец вертикальной прокрутки и state-specific invariant.

## Проверки

- 6/6 compose services healthy;
- migrations 18/18, pending 0;
- registry `stateHash=d5133cdbd17a02352857c3c6ff13791a77e46c5a0d338b1a57844cc996c43554`;
- evidence-ready states: **42/71**;
- open states: **29**;
- open dispositions: **12/12**;
- unresolved items: **41**;
- structural failures: **0**;
- G10S historical metadata index: **563** записей;
- `sha256sum -c G12/checksums.sha256`: PASS;
- focused registry tests: **4/4 PASS**;
- target ladder с полным `NX_CI=1 pnpm check`, boundary/toolchain checks и
  commit: PASS.

Первый запуск quality-gate обнаружил повреждённый JSON terminator (`\\n` как
текст); запись исправлена, после чего повторный g10s index и полный gate
прошли без ошибок. Это не дефект приложения, а исправленная ошибка
генерации evidence.

## Прогресс и следующая очередь

Master counter: **658 закрыто / 476 осталось / 1134 всего — 58,02%**. Волна
evidence-only, поэтому curriculum counter не изменился. G12-025 остаётся
`OPEN`: нужно закрыть 29 state-evidence и 12 human dispositions.

Следующая очередь: Review, Projects, Studio, Control Center и Settings; затем
G10S-246 human acceptance, G11 breadth, path-specific closure packs,
G12.5 requalification, independent final review и G13 decommission.

Push намеренно отложен до сброса лимита GitHub Actions; локальный target
commit уже в `main`.
