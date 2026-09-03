# Progress snapshot — complete G11 PREP_ONLY worksheet index — 3 сентября 2026

## Что сделано

В target `fluent-interview-platform` добавлен детерминированный metadata-only
индекс всех bounded-пакетов G11:

- target commit: `8dba70e0e0002a7b43d2bf6690cc0254ab6526ec`
  (`feat(g11): index bounded authoring worksheets`);
- индекс: `G11/prep-only-authoring-worksheet-index-2026-09-03.json`;
- покрытие: **80/80** пакетов (`G11-P001…G11-P080`) и **1 597/1 597** ссылок
  на записи;
- каждый пакет связан с worksheet hash, source hash и стабильными record refs;
- на запись зафиксированы десять обязательных будущих полей: identity,
  bilingual question, mechanism, answer/solution, sources, follow-ups,
  typed placement, assessed activity и reviewer decision.

Индекс не содержит текстов вопросов, ответов, решений, кода или исходных
формулировок. Он не импортирует записи, не пишет Strata/serving/release/learner
state и не меняет active release pointer.

## Fail-closed граница

Все 80 пакетов остаются `BLOCKED_BY_G10S-246_REVALIDATION`,
`promotionAllowed=false`, `autoPromotion=false`. Индекс только организует
очередь authoring; он не является authoring decision, review, release или
production evidence. Перед human authoring/review требуется current-main
revalidation G10S-246 и остановка при любом source-hash drift.

Удаление старых репозиториев, сущностей, Docker resources, volumes и caches не
выполнялось и этим коммитом не разрешается.

## Проверки

Перед commit выполнен полный target gate:

```text
pnpm check
pnpm boundary:check
pnpm toolchain:check
git diff --check
```

Результат: `rc=0`. Дополнительно прошли:

```text
pnpm content:prep-only-worksheet-index -- <plan> <index>  # PASS, 80/80, 1597/1597
node --test tools/content-compiler/test/prep-only-authoring-worksheet.test.mjs  # 3/3
pnpm architecture:evidence-schema                       # PASS, 731/731
pnpm architecture:evidence-inputs                        # PASS
pnpm boundary:check                                      # PASS
pnpm toolchain:check                                     # PASS
git diff --check                                         # PASS
```

Target `main` чистый после commit; push не выполнялся из-за ограничения CI
Actions minutes.

## Счётчики и следующий шаг

Индекс — подготовка, а не закрытие content breadth, поэтому counters не
изменились:

- формальный план: **665 / 469 / 1 134**;
- исполнимые gates/checks: **665 / 277 / 942** (`70,59%`);
- неразрушающее закрытие: **665 / 127 / 792** (`83,96%`);
- product closure: **665 / 72 / 737** (`90,23%`);
- G11 PREP_ONLY: **1 597** записей ещё не прошли human authoring/review.

Следующий безопасный порядок: current-main G10S-246 revalidation → human
mapping/authoring/review `G11-P001` (один bounded packet) → evidence commit →
повторная сверка G11.2–G11.6. Пока human/owner gates не закрыты, нельзя честно
помечать эти записи `DONE` или объявлять production readiness.
