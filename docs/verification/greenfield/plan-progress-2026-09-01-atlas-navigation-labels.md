# Срез master-плана — Atlas navigation labels — 1 сентября 2026

## Счётчик

**658 checked / 476 remaining / 1134 total / 58,02%**  
Источник: `pnpm plan:progress:json` из umbrella-репозитория. Atlas
i18n/accessibility fix не изменяет формальный checkbox-счётчик.

## Закрытый corrective срез

- target implementation: `fluent-interview-platform/main` at
  `d3e44cb1ef5d82a6c234f7b38aafd5c11b588880`;
- evidence: `328a5aaef6049b1d09b7fb8c73aefe47b51b1390`;
- Atlas controls group, learning-track tablist и graph viewport используют
  locale-owned RU/EN accessible names;
- live RU/EN checks прошли после fresh scoped stack session
  `040db586-0e49-4ada-b53f-2b1c475bd108`;
- focused web tests: **71/71**;
- полный target ladder (`NX_CI=1 pnpm check`, boundary, toolchain) — **PASS**;
- scoped stack: **6/6** services healthy, migrations **18/18**, pending **0**;
- evidence metadata-only, без изменений БД, Docker state и remote.

## Граница

Срез ограничен Atlas navigation accessibility copy. Он не меняет граф, zoom,
track IDs, curriculum, runtime authority или progress ledger. Human owner
acceptance (`G10S-246`), G11 breadth/review queue, G12.5 revalidation,
independent final review и G13 cleanup/decommission всё ещё открыты. Все
commits локальные, push не выполнялся.

## Доказательство

- [Atlas navigation evidence](../../../../fluent-interview-platform/docs/verification/greenfield/G10S-inputs/atlas-navigation-labels-localization-2026-09-01.md)
