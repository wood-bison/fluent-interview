# Прогресс мастер-плана — Control Center shared specimens (1 сентября 2026)

## Срез

- **Проверено:** 658
- **Осталось:** 476
- **Всего:** 1134
- **Готовность:** 58,02%
- **Ограничение:** изменения закоммичены локально, push не выполнялся из-за
  лимита GitHub Actions.

## Закрытая волна

В `fluent-interview-platform` закрыт точечный accessibility/i18n slice для
операторского Control Center:

- `TokenSpecimen` получил locale-owned `themeLabel` и `themeLabels`;
- theme contract стал явной именованной `role="group"` областью;
- корневые TokenSpecimen/StateCatalog используют локализованные
  `aria-labelledby` anchors вместо статических английских `aria-label`;
- RU/EN проверены live на свежем compose-project-scoped stack;
- internal sample state/action copy не притворяется полностью переведённым и
  остаётся отдельной последующей границей.

## Координаты и проверки

| Артефакт | Координата |
| --- | --- |
| target implementation | `fluent-interview-platform/main@07b7822f0e8adffa9079f3866fab67c7fc5b26de` |
| target evidence | `fluent-interview-platform/main@366a7b5` |
| stack session | `5ea499be-e9b2-4bd7-a6ca-386dcddb2cf5` |
| URL | `http://127.0.0.1:47360/` |
| focused web suite | 77/77 PASS |
| full ladder | `NX_CI=1 pnpm check` + boundary + toolchain — PASS |
| stack | 6/6 services healthy; migrations 18/18; pending 0 |
| historical evidence | 428/428 verified |

## Следующая очередь

1. При необходимости локализовать внутренние sample action/state labels
   `StateCatalog`, сохранив shared API и не смешивая learner-facing copy с
   operator demonstration.
2. Перейти к G10S-246 human owner acceptance с реальным screenshot/keyboard
   sign-off.
3. Продолжить G11 content breadth и связанные C098/G12.5 gates.
4. После независимого финального review пройти G13 cleanup/decommission.
