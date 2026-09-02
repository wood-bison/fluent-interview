# G12-025 — Practice workbench state-evidence wave

Дата: 2 сентября 2026  
Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`  
Ветка: `main`  
Коммит: `9e2a0f10e6c14dae8f6b44b9890942bb03275d9d`  
Push: не выполнялся (лимит GitHub Actions)

## Что закрыто в этой волне

Live compose-project-scoped stack проверен на маршруте
`/practice/node-event-loop-001?track=node&locale=en` для девяти состояний
workbench:

`idle`, `running`, `passed`, `mismatch`, `error`, `cancelled`, `runner-down`,
`focus-mode`, `resized`.

На каждое состояние сохранены три независимых артефакта:

1. `interaction.json` — действия пользователя и observed DOM state;
2. `semantic.json` — route/profile/theme, diagnostics, verdict, terminal,
   доступность controls и scroll owner;
3. `visual.jpg` — фактический снимок live UI.

Канонический каталог: `G12/state-evidence/index.json`; checksum manifest:
`G12/checksums.sha256`; отчёт target-репозитория:
`G12/state-evidence/practice-workbench-wave-2026-09-02.md`.

## Результаты и гейты

- 6/6 compose services healthy;
- migrations 18/18, pending 0;
- registry `stateHash=ae263fb441c10b9c303adb08b47ff2dc428d8b9dd8df6b77e9fc1b878716cc69`;
- 37/71 evidence-ready states, 34 open states;
- 0/12 dispositions ready, 12 open dispositions;
- 46 unresolved registry items;
- structural failure count 0;
- G10S historical metadata index: 547 записей;
- SHA-256 manifest: PASS;
- focused state-registry tests: 4/4 PASS;
- target quality ladder: PASS (`git status`, `git diff --check`, `NX_CI=1
  pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check`, commit).

`runner-down` проверен безопасно: остановлен только project-scoped
`runtime-control`, UI показал retryable диагностическую ошибку, затем сервис
восстановлен и compose снова healthy. Deterministic assessment не изменён.

## Прогресс master-плана

**658 закрыто / 476 осталось / 1134 всего — 58,02%.**  
Эта волна только добавляет доказательства состояния интерфейса и поэтому не
увеличивает закрытие curriculum-пунктов.

## Следующая очередь

1. Оставшиеся G12 state groups и закрытие 34 open states.
2. G10S-246 human acceptance (ответ, spoken explanation, reflection и
   повтор через 48–72 часа).
3. G11 breadth и path-specific closure packs для Node/Java/Go плюс generic.
4. G12.5 requalification, independent final review.
5. G13 decommission после подтверждения нового стека и retention window.

Ограничение: push отложен до сброса лимита GitHub Actions; локальные
коммиты и evidence остаются в `main`.
