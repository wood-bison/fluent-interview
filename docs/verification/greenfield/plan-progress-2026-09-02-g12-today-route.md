# Прогресс мастер-плана — G12 Today route state evidence (2 сентября 2026)

## Срез

- **Проверено:** 658
- **Осталось:** 476
- **Всего:** 1134
- **Готовность:** 58,02%
- **Статус:** G12-025 открыт: в этой волне зафиксировано 5 из 71 состояний
- **Ограничение:** изменения закоммичены локально, push не выполнялся из-за
  лимита GitHub Actions.

## Закрытая часть волны

В `fluent-interview-platform/main` записано реальное state-evidence для Today
route на desktop-профиле `1280×720`, DPR 2, locale `en`, theme `dark`:

1. `ready` — исходная станция и доступный переход в практику;
2. `in-progress` — текущая станция после начала пути;
3. `selected-station` — выбранная станция маршрута;
4. `scroll-end` — фактическая прокрутка sole owner до `scrollTop=scrollMax`;
5. `rail-collapsed` — свёрнутый navigation rail с изменением layout state.

Для каждого состояния сохранены interaction trace, semantic snapshot и
visual JPEG; индекс и SHA-256 собраны в target G12 index и checksum manifest.
Такой формат позволяет следующему срезу сравнивать не только пиксельный
скриншот, но и observable DOM/interaction contract.

## Координаты и проверки

| Артефакт | Координата |
| --- | --- |
| target implementation/evidence | `fluent-interview-platform/main@fc2f24f26738889ccee795a003b52aa9139b0a3f` |
| live stack | session `7afeba77-21d6-4238-8aa8-1d822d99e574` |
| URL | `http://127.0.0.1:47360/` |
| stack health | 6/6 services healthy; migrations 18/18; pending 0 |
| Today scroll contract | `clientHeight=660`, `scrollHeight=2130`, `scrollMax=1470`, `atEnd=true` |
| registry | `status=OPEN`, 12 screens, 71 states, 5 evidence-ready, 66 open |
| open dispositions | 12; unresolved items 78; structural failures 0 |
| focused registry tests | 4/4 PASS |
| G10S historical/schema tests | 9/9 PASS |
| checksum manifest | all entries PASS |
| mandatory target ladder | `NX_CI=1 pnpm check` + boundary + toolchain — PASS |

## Что дальше

1. Дособрать state evidence для Program и Atlas, затем остальных learner и
   operator surfaces; закрывать registry только после interaction + semantic +
   visual proof.
2. Провести G10S-246 human owner acceptance с keyboard и screenshot sign-off.
3. Продолжить G11 breadth: reconciliation источников, executable practice
   portfolio и path-specific closure packs для всех треков.
4. После G11 повторить G12.5 requalification, независимый финальный review и
   только затем переходить к G13 decommission/cleanup.

