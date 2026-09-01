# Plan progress — project catalog labels correction

Дата: 1 сентября 2026

## Снимок

- Проверено: **658**
- Осталось: **476**
- Всего: **1134**
- Прогресс: **58,02%**

Снимок получен `pnpm plan:progress:json`. Corrective UI/i18n и boundary-
precision срез не меняет checkbox-счётчик и не означает production readiness.

## Закрытый corrective срез

- target implementation: `fluent-interview-platform/main` at
  `16c3e431ecf38ce15bfb6b0bf47343e79057d77b`;
- evidence: `fluent-interview-platform/main` at `f100a5d`;
- `apps/web/app/components/project-labels.ts` содержит reviewed EN/RU copy
  для пяти project books и тридцати milestone;
- Projects Panel показывает русские titles в RU, английские canonical titles в
  EN; stable IDs остаются диагностическими;
- boundary-check больше не принимает learner vocabulary за прямой DB/Docker
  доступ, при этом imports, credentials, DSN и runtime authority остаются
  запрещены;
- live HTTP crawl: 48/48 внутренних маршрутов ответили 200;
- web regression `71/71`, полный ladder и scoped stack `6/6`, migrations
  `18/18`, pending `0` — PASS;
- evidence metadata-only; тела контента, learner records, БД/Docker state и
  remote не изменялись.

## Граница и следующие шаги

Срез устраняет последний подтверждённый English-only project catalog на RU и
false-positive архитектурного guard. Он не добавляет проекты, milestone,
вопросы, задачи, evidence или progress records. Неизвестные будущие IDs
требуют reviewed copy. Следующий gate — **G10S-246** human owner acceptance;
после него G11 breadth/revalidation, G12.5 и G13 cleanup. Продукт не объявлен
production-ready. Все commits локальные, push не выполнялся.
