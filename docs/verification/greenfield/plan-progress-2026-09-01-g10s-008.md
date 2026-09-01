# Plan progress — G10S-008

Дата: 1 сентября 2026

## Снимок

- Проверено: **658**
- Осталось: **476**
- Всего: **1134**
- Прогресс: **58,02%**

Счётчик получен командой `pnpm plan:progress:json` из корня umbrella
репозитория после отметки `G10S-008` в мастер-плане. Это счётчик чекбоксов,
а не утверждение о production readiness: открытые human, breadth и release
gates остаются явными.

## Закрытый срез

`G10S-008` закрыт локальным target-коммитом
`fluent-interview-platform@6179a77`:

- `pnpm run dev` поднял scoped Compose project
  `fluent-interview-platform-dev` на `http://127.0.0.1:47360/`;
- migrations `18/18`, pending `0`, ожидаемые сервисы `6/6` (5 healthy и
  `api-data-init` exited `0`);
- read-only `/`, `/studio`, `/api/studio/releases/active` и `/api/studio` —
  HTTP `200`;
- Studio state: `1` candidate, `1` review, `1` release, `3` audit events и
  `3` command receipts;
- изолированный `pnpm studio:postgres-journey` — PASS: replay stable,
  readback verified, retired endpoints `410`, disposable resources удалены;
- строгая лестница `pnpm check`, `pnpm boundary:check`,
  `pnpm toolchain:check` — PASS; push не выполнялся из-за Actions quota.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-008-studio-baseline-2026-09-01.{json,md}`.

## Коррекция после live-аудита

В ходе проверки языковых дорожек найден и исправлен отдельный defect в
learner observability projection: `/practice` раньше показывал весь каталог
на Node, Java и Go. Локальные target-коммиты без push:

- `fa3979d` — фильтр `observabilityScenariosForTrack(trackId)` в domain и
  learner route плюс regression test;
- `aecce6b` — metadata-only evidence с browser DOM-проверкой.

Проверенный результат: Node — 2 собственных сценария, Java — 2, Go — 2;
`0` cross-language scenarios, `0` alerts, счётчики planned/released совпадают
с каталогом. Полный target ladder после исправления зелёный. Общий счётчик
мастер-плана не изменён: это исправление качества уже закрытого G10S-194, а не
новый curriculum checkbox.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-194-observability-track-filter-2026-09-01.{json,md}`.

## Что дальше

Следующий исполнимый пункт — **G10S-246**: owner sign-off и финальная
acceptance boundary. Это намеренная человеческая граница; её нельзя закрывать
машинным smoke-test или фиктивным `DONE`. После PASS открывается G11 breadth.
Остаются также контентные и human-boundary группы G5.2/G6/G7/G8/G9, G11,
G12.2–G12.3, G12.5, финальная независимая проверка и G13 decommission.
