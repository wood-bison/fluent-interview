# Greenfield plan progress — 2026-08-31 — G10S-197

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`
Команда: `pnpm plan:progress`
Последний закрытый executable item: **G10S-197 — C098 serving import**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **609** |
| Remaining | **525** |
| Total | **1 134** |
| Completion | **53.70%** |

После G10S-196 прогресс вырос с `608/526` до `609/525`. В G10S.8 закрыто
`11/23`; следующим executable item становится **G10S-198**.

## Закрытая фаза

G10S-197 реализован в target `main` коммитами `e1d2eb8` и `6bb023c`;
metadata-only evidence зафиксирован коммитом `fef29c1`. File-only
`question-release-bundle.v1` проходит validation-before-transaction и
импортируется в serving projection одной транзакцией с immutable manifest,
active pointer, pointer event, outbox event и idempotency receipt. Readback
выполняется отдельно read-only и сравнивает exact logical hash.

Disposable live rehearsal на 17 миграциях подтвердил релиз
`2026.08.28-questions.1`: `6` cards/revisions, `12` translations, `10`
placements, `40` roles, `6` supporting prompts, `7` activities и `3` graph
edges. Первый hash drift был остановлен и исправлен (graph revision alias и
zero-millisecond timestamp normalization); повторные import/replay/readback,
exact IDs/counts и cleanup прошли, persistent developer database не менялась.

## Проверочный ladder

- focused G10S-197 tests: **6/6**;
- release-import tests: **18/18**;
- content compiler suite: **481/481**;
- architecture suite: **213/213**;
- `content:gates`, полный `pnpm check`, `pnpm boundary:check` и
  `pnpm toolchain:check`: **PASS**;
- deep body-boundary: `1405` tracked / `1397` text / `8` binary,
  `8122` source fragments, `0` body matches, source baseline `2526/2526`;
- metadata-only evidence, disposable DB cleanup и отсутствие persistent DB
  mutation подтверждены.

## Как читать счётчик

Чекбокс считается закрытым только после implementation commit, evidence,
детерминированной focused-проверки и полного commit gate. Внутри завершённой
фазы проверки можно собирать пакетно с Nx cache, но перед каждым локальным
коммитом обязательны `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` согласно target `AGENTS.md`. Push отложен из-за
Actions quota; `origin/main` намеренно не изменён.

## Следующий срез

**G10S-198** — открыть C098 в learner route, отдать все expected answer layers
и доказать отсутствие broken/dead links.
