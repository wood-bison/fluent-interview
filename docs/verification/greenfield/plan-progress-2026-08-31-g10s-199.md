# Greenfield plan progress — 2026-08-31 — G10S-199

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`
Команда: `pnpm plan:progress`
Последний закрытый executable item: **G10S-199 — C098 runtime selector**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **611** |
| Remaining | **523** |
| Total | **1 134** |
| Completion | **53.88%** |

После G10S-198 прогресс вырос с `610/524` до `611/523`; в G10S.8 закрыто
`13/23`. Следующим executable item становится **G10S-200**.

## Закрытая фаза

G10S-199 реализован в target `main` implementation-коммитом `19d60a7`,
metadata-only evidence зафиксирован коммитом `bd1203d`. Строгий learner
selector связывает UI с текущими public Run/Submit contracts и для C098
показывает ровно JavaScript revision 1 / `node-26-commonjs` (Node.js 26.7.0).
Preview TypeScript, Go, Java, Python и .NET не selectable, а direct preview
vectors получают HTTP 400. EN/RU routes отвечают 200; canonical Run проходит
с ожидаемым выводом и trace, но не изменяет mastery, unlock или acceptance.

## Проверочный ladder

- selector policy: **21/21**;
- focused selector tests: **12/12**;
- live `pnpm runtime:c098-selector-journey`: **PASS**;
- golden `FLUENT_GOLDEN_REQUIRE_CLEAN=1 pnpm runtime:journey`: **PASS** (5/5
  routes 200, 5 output lines, 8 trace events, worker cleanup);
- полный `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check`: **PASS**;
- static state hash:
  `76cfc8263a3bf736834c88644f71c2af02c255d82b765c54061d7c71d0680a24`;
- policy hash:
  `04fc945abde0b7e64b3a20d40c600cbec64db43262eae896480e6a5a927cfec1`;
- source-set hash:
  `946efc63af8a4f2b6b7cb66ceae2b035d69bb4bf18735bafe127e32f6bd2553e`;
- evidence metadata-only: bodies, hidden evaluator assets,
  database mutations, import и release authority отсутствуют.

## Как читать счётчик

Чекбокс считается закрытым только после implementation commit, evidence,
детерминированной focused/live-проверки и полного commit gate. Перед каждым
локальным коммитом target ladder остаётся обязательным; push отложен из-за
Actions quota, `origin/main` намеренно не изменён.

## Следующий срез

**G10S-200** — public Run выполняет эксперимент и не создаёт mastery/verdict.
