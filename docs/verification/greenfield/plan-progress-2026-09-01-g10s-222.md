# Greenfield plan progress — 2026-09-01 — G10S-222

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`
Команда: `pnpm plan:progress:json`
Последний закрытый executable item: **G10S-222 — scoped cleanup and durable-volume retention**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **634** |
| Remaining | **500** |
| Total | **1 134** |
| Completion | **55.91%** |

После G10S-221 закрыт G10S-222. Счётчик вырос с `633/501` до `634/500`;
G10S.8 остаётся `23/23`, G10S.9 теперь `13/16`. Следующим executable item
становится **G10S-223** — выровнять G11 input inventory/authoring queue с
Strata authority и C098 release schema.

## Закрытая фаза

G10S-222 закрыт в target `main` локальной commit-gated цепочкой без push из-за
Actions quota:

- `2942587` — scoped cleanup rehearsal, negative fixtures и package script;
- `943fd45` — machine-readable evidence, human report и G10S README.

Изолированный stack `fluent-g10s-222-mthxl0rl` стартовал через `pnpm dev`,
включил optional `observability` profile, затем дважды прошёл публичный
`pnpm down`. Оба раза осталось `0` containers / `0` networks и `3` durable
volumes с теми же IDs (`postgres-data`, `platform-events`, `otel-data`). После
первого shutdown повторный startup прочитал ledger `18/18`; volume-deletion
flags не использовались. Evidence содержит только names/IDs/counts/status,
bounded output hashes и exit codes.

## Проверочный ladder

- `git diff --cached --check`: **green**;
- `pnpm check`: **green**;
- `pnpm boundary:check`: **green**;
- `pnpm toolchain:check`: **green** (`node v26.7.0`);
- focused scoped-cleanup tests: **3/3**;
- live rehearsal: **PASS** (optional profile, two shutdowns, restart ledger).

## Evidence и handoff

Target evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-222-scoped-cleanup-2026-09-01.{json,md}`

G10S-223 остаётся следующим content/authoring alignment gate. Durable volumes
намеренно retained; физическое удаление legacy checkout и ресурсов возможно
только после owner-approved G13 archive/restore proof. Push намеренно не
выполнялся из-за Actions quota.
