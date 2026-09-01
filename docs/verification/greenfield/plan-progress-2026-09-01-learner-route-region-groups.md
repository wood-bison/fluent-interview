# Срез master-плана — локализованные learner route groups — 1 сентября 2026

## Счётчик

**658 checked / 476 remaining / 1134 total / 58,02%**

Источник: `pnpm plan:progress:json` из umbrella-репозитория. Corrective
accessibility/i18n slice не меняет формальный checkbox-счётчик.

## Закрытый corrective срез

- target implementation: `fluent-interview-platform/main` at
  `ced575d79a98526859847669734b4f23bd33d5a3`;
- evidence: `fluent-interview-platform/main` at
  `089caef6db1cc11946482f8fb94ee6b805d5838a`;
- five compact learner surfaces теперь имеют явный `role="group"` и
  locale-owned `aria-labelledby` anchors: coverage, progress, home actions,
  placement и lesson context;
- live RU/EN Program, Review, Home, Lesson и Questions подтверждают точные
  локализованные accessible names; Atlas minimap/jump labels перепроверены;
- fresh scoped stack: `7aed9213-2f53-4f2d-b4e5-d2a66ecea0d7`,
  `http://127.0.0.1:47360/`, **6/6** services healthy, migrations **18/18**,
  pending `0`;
- focused web tests: **76/76**;
- полный target ladder (`NX_CI=1 pnpm check`, `pnpm boundary:check`,
  `pnpm toolchain:check`) — **PASS**;
- evidence metadata-only, без изменений БД/Docker, learner bodies или remote
  push.

## Граница

Срез делает существующие локализованные подписи доступными в accessibility
tree. Он не меняет layout, route semantics, граф, filters, question bank,
runtime evaluator, activity, mastery или progress ledger. Human owner
acceptance (`G10S-246`), G11 breadth/review queue, G12.5 revalidation,
independent final review и G13 cleanup/decommission остаются открытыми. Все
commits локальные, push не выполнялся из-за ограничения Actions quota.

## Доказательство

- [Learner route region groups evidence](../../../../fluent-interview-platform/docs/verification/greenfield/G10S-inputs/learner-route-region-groups-localization-2026-09-01.md)
