# Plan progress — curriculum labels correction

Дата: 1 сентября 2026

## Снимок

- Проверено: **658**
- Осталось: **476**
- Всего: **1134**
- Прогресс: **58,02%**

Снимок получен командой `pnpm plan:progress:json` из корня umbrella
репозитория. Эта corrective UI/i18n итерация не меняет checkbox-счётчик и не
является утверждением production readiness.

## Закрытый corrective срез

- target implementation: `fluent-interview-platform` `main` at
  `005c8a1b9f89e104d23bc718912672a1262592f0`;
- evidence: `fluent-interview-platform` `main` at
  `341c03e5d2d84b09bc69f342c4d5cfb6aefc52e0`;
- shared resolver: `apps/web/app/components/curriculum-labels.ts`;
- покрыты Program, Practice, Atlas, route graph, home, Questions и lesson
  breadcrumbs/preview;
- live RU/EN route checks и web regression `70/70` — PASS;
- full ladder (`NX_CI=1 pnpm check`, `pnpm boundary:check`,
  `pnpm toolchain:check`) — PASS;
- scoped stack `6/6`, migrations `18/18`, pending `0`;
- evidence metadata-only; исходники ответов, БД/Docker state и remote не
  изменялись.

## Граница и следующие шаги

Срез устраняет смешение языков в динамических curriculum labels, но не
добавляет новые вопросы, задачи, placements, activity или progress records.
Неизвестные будущие IDs требуют reviewed copy. Следующий gate — **G10S-246**:
human owner acceptance; затем G11 breadth/revalidation, G12.5 и G13 cleanup.
Продукт не объявлен production-ready. Все commits локальные, push не
выполнялся из-за Actions quota.
