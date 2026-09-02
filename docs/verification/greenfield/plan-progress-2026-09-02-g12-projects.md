# G12-025 — Projects state-evidence wave

Дата: 2 сентября 2026  
Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`  
Ветка: `main`  
Коммит: `a189a77` (`feat(g12): capture projects state evidence`)  
Push: не выполнялся (лимит GitHub Actions)

## Закрытая bounded-волна

Пять состояний `/projects` проверены live и записаны в immutable evidence:

1. `backend-lane` — Node.js, Java и Go books видны с отдельными track IDs;
2. `next-lane` — Next.js book содержит шесть milestone и свою rubric;
3. `system-design-lane` — system-design book содержит отдельные failure-drill
   и trade-off-defense rubrics;
4. `locked` — первый milestone ready, зависимые locked, без false completion;
5. `assessed` — disposable server-side passing failure-drill даёт один
   completed milestone (`1/6 complete`) и accepted evidence.

Artifacts: `interaction.json`, `semantic.json`, `visual.jpg` для каждого state
в target `G12/state-evidence/projects/`; SHA-256 внесены в
`G12/state-evidence/index.json` и `G12/checksums.sha256`.

## Самопроверка

- 5/5 state assertions PASS;
- main/heading и `.app-scroll-region` подтверждены для каждого состояния;
- assessment status `pass`, score `1`, evidence принят сервером,
  `milestoneSelfDeclared=false`;
- registry `stateHash=970e0bf6…`, `52/71` ready, `19` open,
  `31` unresolved, `0` structural failures;
- G10S historical metadata index: **595/595**, rewrites `0`;
- target ladder и основной suite: **247/247 PASS**.

## Дальше

Master counter: **658 закрыто / 476 осталось / 1134 всего — 58,02%**. Это
evidence-only волна; curriculum counter не меняется. G12-025 остаётся `OPEN`
до остальных 19 состояний и 12 human dispositions.

Следующая bounded очередь: Studio, Control Center и Settings; затем G10S-246
human acceptance, G11 breadth, path-specific closure packs, G12.5
requalification, independent final review и G13 decommission. Push отложен до
сброса лимита GitHub Actions.
