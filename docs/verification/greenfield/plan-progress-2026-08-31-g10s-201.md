# Greenfield plan progress — 2026-08-31 — G10S-201

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`
Команда: `pnpm plan:progress`
Последний закрытый executable item: **G10S-201 — C098 hidden Submit authority**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **613** |
| Remaining | **521** |
| Total | **1 134** |
| Completion | **54.06%** |

После G10S-199 закрыты два executable item: G10S-200 и G10S-201. Поэтому
счётчик вырос с `611/523` до `613/521`; в G10S.8 закрыто `15/23`.
Следующим executable item становится **G10S-202**.

## Закрытая фаза

G10S-200 закрыт в target `main` implementation-коммитом `a6d6fc5` и
metadata-only evidence-коммитом `7d95250`. Public Run для released C098
выполняет exact `node-event-loop-001@revision 1` на `node-26-commonjs`,
возвращает 5 output lines и 8 trace events, но не меняет mastery, unlock,
verdict или acceptance; progress digest до/после стабилен.

G10S-201 закрыт implementation-коммитом `c7e7dbd` и evidence-коммитом
`c067a05`. Hidden Submit связывает Browser, Go runtime-control, evaluator и
API с exact TaskRevision/release/profile, возвращает пять passing hidden checks
и создаёт только strict metadata-only verdict/evidence. Exact replay стабилен,
изменённый запрос с тем же idempotency key получает `409`, stale revision и
incompatible profile — `400`, worker очищается, learner progress не меняется.

## Проверочный ladder

- G10S-200 static policy: **13/13**; focused tests: **10/10**; live journey:
  **PASS**.
- G10S-201 static policy: **26/26**; focused tests: **4/4**; live journey:
  **PASS**; создана одна authority evidence-запись без raw source/prediction и
  hidden material.
- Для обоих срезов прошли полный `pnpm check`,
  `pnpm boundary:check` и `pnpm toolchain:check` перед соответствующими
  коммитами.
- Push намеренно отложен из-за лимита GitHub Actions; `origin/main` не
  изменён, локальный target остаётся на `main`.

## Следующий срез

**G10S-202** — wrong-order, malformed-input, stale-revision, forged-verdict и
duplicate-idempotency vectors должны fail correctly. После его реализации
снова выполнить `pnpm plan:progress`, записать новый snapshot и только затем
переходить к G10S-203.
