# Greenfield plan progress — 2026-08-31 — G10S-204

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`  
Команда: `pnpm plan:progress --json`  
Последний закрытый executable item: **G10S-204 — C098 persistence и exact restore**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **616** |
| Remaining | **518** |
| Total | **1 134** |
| Completion | **54.32%** |

После G10S-203 закрыт G10S-204. Счётчик вырос с `615/519` до `616/518`; в
G10S.8 закрыто `18/23`. Следующим executable item становится **G10S-205**.

## Закрытая фаза

G10S-204 закрыт в target `main` implementation-коммитом `b113da1` и
evidence-коммитом `0b2c4a5`; push намеренно отложен из-за Actions quota.
Policy `g10s-c098-persistence-policy.v1` фиксирует C098 Node identity,
runtime profile и scenario. Persistence journey подтверждает сохранность
submission, progress, четырёх evidence kinds и Studio active release через
service restart, scoped Compose down/up и full restart.

## Проверочный ladder

- Static policy: **33/33**; focused tests: **5/5**.
- Live `pnpm runtime:c098-persistence-journey`: **PASS** — backup matrix
  `14` canonical ledger entries, `0` issues, integrity-checked restore,
  baseline restored, post-backup sentinels removed и cleanup `0 containers / 0
  networks`.
- Full `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` прошли до
  evidence-коммита; metadata-only report не содержит source/prompt/answer/
  dump/credential/hidden evaluator bodies и не выдаёт import/release authority.
- Исправлены nested Studio release identity read и stale-volume reuse: каждый
  повторный запуск получает свежий disposable stack ID.

## Следующий срез

**G10S-205** — RU/EN × light/dark × MacBook 13/16 × Studio Display browser
matrix без overflow, clipping и unreachable controls.
