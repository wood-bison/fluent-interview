# Greenfield plan progress — 2026-09-01 — G10S-221

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`
Команда: `pnpm plan:progress:json`
Последний закрытый executable item: **G10S-221 — one-root startup and migrations**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **633** |
| Remaining | **501** |
| Total | **1 134** |
| Completion | **55.82%** |

После G10S-220 закрыт G10S-221. Счётчик вырос с `632/502` до `633/501`;
G10S.8 остаётся `23/23`, G10S.9 теперь `12/16`. Следующим executable item
становится **G10S-222** — доказать scoped `pnpm down`, отсутствие orphan
containers/networks и сохранение declared durable volumes.

## Закрытая фаза

G10S-221 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota:

- `c81e358` — `pnpm dev` применяет checked-in migrations перед полным Compose
  startup; fail-closed runner и migration ledger;
- `9b4040b` — machine-readable rehearsal evidence, human report и G10S README.

Изолированный stack достиг `ready` с ровно шестью сервисами, migrations
`18/18`, ledger `count=18`, шестью обязательными route probes `200`, а scoped
cleanup оставил `0` containers / `0` networks и сохранил `postgres-data` и
`platform-events`. Отчёт содержит только IDs, counts, status, byte counts,
hashes и exit codes; bodies, credentials, SQL и raw logs исключены.

## Проверочный ladder

- `git diff --cached --check`: **green**;
- `pnpm check`: **green**;
- `pnpm boundary:check`: **green**;
- `pnpm toolchain:check`: **green** (`node v26.7.0`);
- focused migration/one-root tests: **7/7**;
- live rehearsal: **PASS** (`fluent-g10s-221-mthx3yvd`, port `47490`).

## Evidence и handoff

Target evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-221-one-root-startup-2026-09-01.{json,md}`

G10S-222 остаётся отдельным cleanup-retention gate; этот rehearsal не удаляет
durable volumes. Физическое удаление standalone Strata по-прежнему возможно
только в owner-approved G13 после полного production acceptance. Push
намеренно не выполнялся из-за Actions quota.
