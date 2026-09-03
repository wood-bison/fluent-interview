# Greenfield plan progress — 2026-09-03 — G11.3 practice portfolio

Снимок выполнен после target commit `07876eb`
(`gate(g11.3): stage practice portfolio readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт G11.3:

- policy описывает 8 канонических item ID, владельцев, acceptance и
  допустимые evidence kinds/source paths;
- manifest сохраняет deterministic order и blocked reasons для шести
  отсутствующих breadth gates, а два уже подтверждённых пункта связывает с
  SHA-256 evidence;
- readiness guard проверяет target ancestry, source/evidence digests,
  owner/kind/path bindings, ready/blocked invariants, sorted reasons и
  отсутствие answer-shaped metadata;
- machine signals читает только существующие audit/revalidation/package
  reports и не создаёт content, revisions, releases или learner evidence;
- controls запрещают content/release/database/Docker/learner writes,
  auto-promotion, push и deletion.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed items | 8 / 8 |
| Ready | 2 (`G11-027`, `G11-028`) |
| Blocked | 6 (`G11-021…026`) |
| Failed rows | 0 |
| Bound evidence items | 2 |
| Current seed cards / activities | 6 / 7 |
| Runnable revisions | 0 |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |

`G11-027` подтверждён seeded wrong-solution и canary evidence. `G11-028`
подтверждён package-mode `run/submit/replay/cleanup` для единственного
released профиля `node-26-commonjs`; остальные языки и runtime profiles этой
готовностью не объявляются.

## Проверки и границы

- `pnpm test:g11.3-practice-portfolio` — **5/5 PASS**;
- `pnpm practice-portfolio:g11.3-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- target `pnpm check` — **PASS**;
- target `pnpm boundary:check` — **PASS**;
- target `pnpm toolchain:check` — **PASS**;
- `pnpm architecture:evidence-schema` — **PASS**, evidence index
  `717/717`, `rewritesDetected=0`;
- target clean после commit, push не выполнялся.

Формальные counters master-plan намеренно не изменены: readiness contract не
подменяет шесть незакрытых portfolio gates, G11.4/G11.5, G12.5 или human
independent review. G13 decommission остаётся отложенным и неразрушающимся.

## Следующий порядок

1. Авторски закрыть G11-021…026: TaskFamily/revisions, shared compatibility,
   backend/Next/system-design facet breadth и `scenarioKey` fixtures.
2. Выполнить fresh runtime/browser evidence и повторить G11.3 + R07–R13 на
   одном atomic batch; статус ready меняется только с bound SHA-256 artifacts.
3. Собрать exact RC и evidence для G12.5, затем human visual/accessibility/
   learning sign-off и independent review.
4. Отдельно согласовать возможный G13 cleanup; до явной авторизации ничего не
   удалять.

Дата: 3 сентября 2026
