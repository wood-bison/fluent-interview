# Greenfield plan progress — 2026-09-01 — G10S-216

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`  
Команда: `pnpm plan:progress:json`  
Последний закрытый executable item: **G10S-216 — pre-G10S backup restore и product continuity**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **628** |
| Remaining | **506** |
| Total | **1 134** |
| Completion | **55.38%** |

После G10S-215 закрыт G10S-216. Счётчик вырос с `627/507` до `628/506`;
G10S.8 остаётся `23/23`, G10S.9 теперь `7/16`. Следующим executable item
становится **G10S-217** — immutable Strata archive tag/bundle, hash manifest и
clean clone/source checks.

## Закрытая фаза

G10S-216 закрыт в target `main` двумя локальными commit-gated коммитами без
push из-за Actions quota:

- `c428809` — scoped Compose restore rehearsal, ACL replay, изолированный
  role-check DB и focused tests;
- `bce1e17` — metadata-only evidence, checksums, README и reproduction link.

Rehearsal создала source DB на миграциях `1..17` и target DB на `1..18`,
выгрузила synthetic baseline/C098 через `pg_dump --no-owner --no-acl`, явно
восстановила role ACL metadata, применила migration `0018` и сравнила
logical hash `c8682e78c7a550dc05fc2005b96a283a84ad748515926e9d2d3f53dca43d8cef`
и 19 release-history counts. Schema/role checks дали `12/12` PASS.
Reference product успешно отвечал до и после restore (`/`, `/questions`,
active-release HTTP `200`; internal API readiness exit `0`). Все scoped
databases, dump и Compose resources удалены; persistent stack не затронут.

## Проверочный ladder

- `git diff --check`: **green**;
- `pnpm check`: **green**;
- `pnpm boundary:check`: **green**;
- `pnpm toolchain:check`: **green** (`node v26.7.0`);
- `pnpm architecture:pre-g10s-restore-product`: **PASS**;
- focused restore tests: **3/3**;
- evidence: metadata-only, `contentBodiesEmitted=0`.

## Evidence и воспроизведение

Target evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S/pre-g10s-restore-product-2026-09-01.{json,md}`

```bash
pnpm architecture:pre-g10s-restore-product
pnpm test:architecture -- --test-name-pattern='pre-G10S restore'
```

Ограничение зафиксировано явно: это deterministic synthetic/disposable
rehearsal для restore path, а не доказательство наличия production backup,
retention policy или внешнего backup provider. Эти claims закрываются
отдельными release/decommission gates.

