# G12-025 — Review state-evidence wave

Дата: 2 сентября 2026  
Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`  
Ветка: `main`  
Коммит: `63731c9` (`feat(g12): capture review state evidence`)  
Push: не выполнялся (лимит GitHub Actions)

## Что закрыто

Live compose-project-scoped stacks проверены на пяти критических состояниях
маршрута `/review`:

- `empty` — свежий disposable stack честно показывает `NO ASSESSMENTS YET` и
  нулевой прогресс;
- `recent-evidence` — основной stack показывает принятые Node.js evidence,
  журнал и EN-копию без смены route identity;
- `cold-repeat-due` — server-stamped событие старше 48 часов показывает
  `Cold repeat · Priority 80`; браузерные часы не используются;
- `offline` — остановка только API показывает `LEDGER UNAVAILABLE` и
  `Progress is not ready`, затем восстановление возвращает route;
- `error` — malformed submission line даёт 500 только evidence endpoint, а
  `/api/progress` остаётся читаемым; повреждённый журнал не маскируется под
  успех.

Для каждого state сохранены `interaction.json`, `semantic.json` и реальный
`visual.jpg` в
`fluent-interview-platform/docs/verification/greenfield/G12/state-evidence/review/`.
Индекс, registry и SHA-256 manifest обновлены атомарно.

## Проверки

- основной stack `http://127.0.0.1:47360/` и disposable stack
  `http://127.0.0.1:47370/`; disposable volume использован только для
  cold/offline/error fixtures;
- review assertions: **5/5 PASS**;
- route, `<main>`/heading и единственный scroll owner `.app-scroll-region`;
- registry `stateHash=8f8e79c8e7696fb15a65f2c674cd57c6c535d9a25ce4e755fa7abff0ffc00ea4`;
- evidence-ready states: **47/71**;
- open states: **24**;
- open dispositions: **12/12**;
- unresolved items: **36**;
- structural failures: **0**;
- G10S historical metadata index: **579/579**, `rewritesDetected=0`;
- `sha256sum -c G12/checksums.sha256`: PASS;
- focused registry tests: **4/4 PASS**;
- основной target test набор: **247/247 PASS**;
- обязательный target ladder с `NX_CI=1 pnpm check`, boundary/toolchain
  checks и commit: PASS.

## Прогресс и следующая очередь

Master counter: **658 закрыто / 476 осталось / 1134 всего — 58,02%**. Волна
evidence-only, поэтому curriculum counter не изменился. G12-025 остаётся
`OPEN`: нужно закрыть 24 state-evidence и 12 human dispositions.

Следующая bounded очередь: Projects, Studio, Control Center и Settings;
затем G10S-246 human acceptance, G11 breadth, path-specific closure packs,
G12.5 requalification, independent final review и G13 decommission.

Push намеренно отложен до сброса лимита GitHub Actions; локальный target
commit уже в `main`.
