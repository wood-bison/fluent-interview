# Срез master-плана — home route graph labels — 1 сентября 2026

## Счётчик

**658 checked / 476 remaining / 1134 total / 58,02%**  
Источник: `pnpm plan:progress:json` из umbrella-репозитория. Home graph
accessibility fix не изменяет формальный checkbox-счётчик.

## Закрытый corrective срез

- target implementation: `fluent-interview-platform/main` at
  `034e94ccbbfef3f80d66f4ad02a6b9b46db1b443`;
- evidence: `dfe823b66acc763421c9ee37e8662dae7cfe60cb`;
- home route graph legend, viewport, stage list и station names используют
  locale-owned RU/EN accessible labels;
- live RU/EN checks прошли после fresh scoped stack session
  `92019b2b-2be5-4e49-842d-308937f5933f`;
- focused web tests: **72/72**;
- полный target ladder (`NX_CI=1 pnpm check`, boundary, toolchain) — **PASS**;
- scoped stack: **6/6** services healthy, migrations **18/18**, pending **0**;
- evidence metadata-only, без изменений БД, Docker state и remote.

## Граница

Срез ограничен home route graph accessibility copy. Он не меняет graph geometry,
edge semantics, keyboard selection, curriculum, runtime authority или progress
ledger. Human owner acceptance (`G10S-246`), G11 breadth/review queue, G12.5
revalidation, independent final review и G13 cleanup/decommission всё ещё
открыты. Все commits локальные, push не выполнялся.

## Доказательство

- [route graph evidence](../../../../fluent-interview-platform/docs/verification/greenfield/G10S-inputs/route-graph-labels-localization-2026-09-01.md)
