# Срез master-плана — learner navigation labels — 1 сентября 2026

## Счётчик

**658 checked / 476 remaining / 1134 total / 58,02%**
Источник: `pnpm plan:progress:json` из umbrella-репозитория. Learner
accessibility/i18n corrective fix не изменяет формальный checkbox-счётчик.

## Закрытый corrective срез

- target implementation: `fluent-interview-platform/main` at
  `06cd6379866d5c319b31346288a9caf941882d81`;
- evidence: `84bf9a11b7270a6bb0463a07ec0723cb1cd27614`;
- Practice, Studio и Questions используют locale-owned `aria-labelledby`
  anchors вместо slash-delimited bilingual literal labels;
- live RU/EN checks прошли на fresh scoped stack
  `2458ad30-a9c4-45b3-a4e9-e7e239eb885b` (`http://127.0.0.1:47360/`);
- focused web tests: **75/75**;
- полный target ladder (`NX_CI=1 pnpm check`, boundary, toolchain) —
  **PASS**;
- scoped stack: **6/6** services healthy, migrations **18/18**, pending `0`;
- evidence metadata-only, без изменений БД, Docker state и remote.

## Граница

Срез ограничен accessibility naming learner navigation: Practice modes,
Tracks, Studio summary и Questions search. Он не меняет маршруты, фильтры,
question bank, runtime evaluator, activity, mastery или progress ledger.
Human owner acceptance (`G10S-246`), G11 breadth/review queue, G12.5
revalidation, independent final review и G13 cleanup/decommission всё ещё
открыты. Все commits локальные, push не выполнялся.

## Доказательство

- [Learner navigation evidence](../../../../fluent-interview-platform/docs/verification/greenfield/G10S-inputs/learner-navigation-labels-localization-2026-09-01.md)
