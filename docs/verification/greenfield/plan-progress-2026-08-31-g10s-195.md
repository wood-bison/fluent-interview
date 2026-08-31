# Greenfield plan progress — 2026-08-31 — G10S-195

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`  
Команда: `pnpm plan:progress`  
Последний закрытый executable item: **G10S-195 — C098 authoring pipeline**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **607** |
| Remaining | **527** |
| Total | **1 134** |
| Completion | **53.53%** |

После G10S-195 прогресс вырос с `606/528` до `607/527`. В G10S.8 закрыто
`9/23`; следующим executable item остаётся **G10S-196**.

## Закрытая фаза

G10S-195 зафиксирован target implementation `315baaa` и evidence commit
`77b10c5`. Для точной координаты C098 (`ordering/generic`) gate проверяет
последовательность `author → review → publish-request`: revision/layers/receipt,
immutable review decision/policy evaluation и release-candidate request.
Serving tables, active pointer, JSONL, browser mutation, import и release не
затрагиваются; gate metadata-only.

Проверочный ladder фазы: focused `6/6`, content `469/469`, content-gates/full
check/boundary/toolchain `PASS`, deep body-boundary `1392/1384/8`, `8122`
fragments, `0` matches, source baseline `2526/2526`.

## Как читать счётчик

Чекбокс считается закрытым только после implementation commit, evidence,
детерминированной focused-проверки и полного commit gate. Внутри незавершённой
фазы работу можно собирать пакетно: focused tests и Nx cache дают быстрый
feedback, а полный `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` остаются обязательными перед каждым локальным commit по
`AGENTS.md`. Push отложен из-за Actions quota.

## Следующий срез

**G10S-196** — экспортировать C098 bundle через rights, locale, layer, task и
graph gates и materialize loss ledger без обхода authoring/review boundary.
