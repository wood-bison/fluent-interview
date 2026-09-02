# Прогресс мастер-плана — G12 Program track state evidence (2 сентября 2026)

## Срез

- **Проверено:** 658
- **Осталось:** 476
- **Всего:** 1134
- **Готовность:** 58,02%
- **Статус:** G12-025 открыт: в этой волне добавлено 5 состояний Program из 71
- **Ограничение:** изменения закоммичены локально, push не выполнялся из-за
  лимита GitHub Actions.

## Закрытая часть волны

В `fluent-interview-platform/main` записано реальное state-evidence для
Program на desktop-профиле `1280×720`, DPR 2:

1. `node-selected` — deep-link Node.js и выбранный JavaScript foundation;
2. `java-selected` — deep-link Java и Java foundation;
3. `go-selected` — deep-link Go и Go foundation;
4. `empty-module` — неизвестный модуль даёт явное восстановление к треку;
5. `long-copy` — русская локаль с длинным текстом и sole scroll owner.

Для каждого состояния сохранены interaction trace, semantic snapshot и
визуальный JPEG. Это позволяет проверять не только пиксели, но и observable
контракт выбранного трека, доступные модули, boundary recovery и локализацию.

## Координаты и проверки

| Артефакт | Координата |
| --- | --- |
| target implementation/evidence | `fluent-interview-platform/main@b337c7e` |
| live stack | session `7afeba77-21d6-4238-8aa8-1d822d99e574` |
| URL | `http://127.0.0.1:47360/` |
| stack health | 6/6 services healthy; migrations 18/18; pending 0 |
| registry | `stateHash=0c96911e…`, 12 screens, 71 states, 10 evidence-ready, 61 open |
| dispositions | 12 open; unresolved items 73; structural failures 0 |
| G10S evidence index | 462 metadata-only entries; immutable historical anchor preserved |
| focused registry tests | 4/4 PASS |
| checksum manifest | all entries PASS |
| mandatory target ladder | `NX_CI=1 pnpm check` + boundary + toolchain — PASS |

## Что дальше

1. Дособрать state evidence для Atlas, Questions/Practice и оставшихся learner и
   operator surfaces; закрывать registry только после interaction + semantic +
   visual proof.
2. Провести G10S-246 human owner acceptance с keyboard и screenshot sign-off.
3. Продолжить G11 breadth: reconciliation источников, executable practice
   portfolio и path-specific closure packs для всех треков.
4. После G11 повторить G12.5 requalification, независимый финальный review и
   только затем переходить к G13 decommission/cleanup.

