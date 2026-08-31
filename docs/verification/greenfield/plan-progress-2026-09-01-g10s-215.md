# Greenfield plan progress — 2026-09-01 — G10S-215

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`  
Команда: `pnpm plan:progress:json`  
Последний закрытый executable item: **G10S-215 — serving pointer rollback и forward restore**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **627** |
| Remaining | **507** |
| Total | **1 134** |
| Completion | **55.29%** |

После G10S-214 закрыт G10S-215. Счётчик вырос с `626/508` до `627/507`;
G10S.8 остаётся `23/23`, G10S.9 теперь `6/16`. Следующим executable item
становится **G10S-216** — восстановить pre-G10S backup в disposable stack и
подтвердить запускаемость reference product.

## Закрытая фаза

G10S-215 закрыт в target `main` двумя локальными commit-gated коммитами без
push из-за Actions quota:

- `58b017f` — migration 0018, operator-only transition CLI, immutable pointer
  events, optimistic lock/idempotency и rehearsal;
- `175395e` — metadata-only evidence, README и reproduction link.

Disposable rehearsal применила 18 миграций, импортировала synthetic pre-G10S и
C098 releases, выполнила rollback, отклонила stale transition, восстановила
C098 и повторила forward-команду без второй записи. Получены четыре события
`import → import → rollback → activate`, стабильный projection digest,
подтверждённый readback и нулевое тело контента; disposable DB, one-shot
containers и временные bundle удалены.

## Проверочный ladder

- `git diff --check`: **green**;
- `pnpm check`: **green**;
- `pnpm boundary:check`: **green**;
- `pnpm toolchain:check`: **green** (`node v26.7.0`);
- `pnpm architecture:release-pointer-transition`: **PASS**;
- evidence: metadata-only, `contentBodiesEmitted=0`.

## Evidence и воспроизведение

Target evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/release-pointer-transition-2026-09-01.{json,md}`

```bash
pnpm architecture:release-pointer-transition
pnpm test:architecture -- --test-name-pattern='transition'
```

Операторский переход не является HTTP API: serving API остаётся read-only,
а `pnpm release:transition` работает короткоживущим server-side шагом только
по уже импортированным immutable releases.
