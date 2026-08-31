# Greenfield plan progress — 2026-08-31 — G10S-198

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`
Команда: `pnpm plan:progress`
Последний закрытый executable item: **G10S-198 — C098 learner route**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **610** |
| Remaining | **524** |
| Total | **1 134** |
| Completion | **53.79%** |

После G10S-197 прогресс вырос с `609/525` до `610/524`. В G10S.8 закрыто
`12/23`; следующим executable item становится **G10S-199**.

## Закрытая фаза

G10S-198 реализован в target `main` implementation-коммитом
`a8d6eb7bb0b1f5d8f81925dca3e782667649d707`; metadata-only evidence зафиксирован
коммитом `3148c98`. Release-only route target `/practice/lesson/:id` открывает
точно `question.node-event-loop-001@r1`, проверяет identity и EN/RU locale и
возвращает все семь expected answer layers, включая `evidence`. Контракт
фиксирует practice runtime `node-event-loop-001@1` / `node-26-commonjs`,
Questions/track/locale/Atlas/related-question links и graph target
`question.node-nexttick-promise-001.r1`; unknown, stale, preview или
unsupported runtime закрываются fail-closed.

## Проверочный ladder

- focused G10S-198 tests: **6/6**;
- combined smoke/boundary route tests: **54/54**;
- content compiler suite: **487/487**;
- architecture suite: **213/213**;
- `content:gates`, полный `pnpm check`, `pnpm boundary:check` и
  `pnpm toolchain:check`: **PASS**;
- static metadata-only gate: state hash
  `61180869fd35b8cbb6fe9e190d636d232104cb7c661c6f99344bb11aa60d4548`,
  policy hash `a4ea07cb5caecc47d4acfa00a115cded7a194589daf4a10aa696f60452dd26d1`,
  route manifest hash
  `7be333d945b55544f6b46eeb990e5e934098d7e6695a8c8496bd43e1d58b76ac`;
- evidence metadata-only: answer bodies, hidden evaluator assets, automatic
  task creation, import/release authority и database mutation отсутствуют.

## Как читать счётчик

Чекбокс считается закрытым только после implementation commit, evidence,
детерминированной focused-проверки и полного commit gate. Внутри завершённой
фазы проверки можно собирать пакетно с Nx cache, но перед каждым локальным
коммитом обязательны `pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` согласно target `AGENTS.md`. Push отложен из-за
Actions quota; `origin/main` намеренно не изменён.

## Следующий срез

**G10S-199** — selector должен показывать только реально compatible released
Node profile; preview languages не активны.
