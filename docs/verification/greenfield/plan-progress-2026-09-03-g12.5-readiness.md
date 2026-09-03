# Greenfield plan progress — 2026-09-03 — G12.5 requalification readiness

Снимок выполнен после target commit `c563a94`
(`gate(g12.5): stage requalification readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, контейнеры, volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт G12.5:

- policy фиксирует gate, target ancestor, 12 обязательных evidence kinds и
  18 владельцев/доменов `G12-R01…G12-R18`;
- manifest перечисляет каждый пункт в каноническом порядке и сохраняет
  явные blocked reasons; ни один пункт не получает автоматический `ready`;
- readiness guard проверяет policy/manifest shape, owners, sorted reasons,
  repository-relative source paths, source SHA-256, target ancestry и
  запрет body/secret-shaped metadata;
- controls явно фиксируют отсутствие release/database/Docker/learner writes,
  push и deletion.

G12.5 не исполняет новый RC, не импортирует bundle, не меняет serving pointer и
не считает PREP_ONLY кандидатов production content. Source evidence только
хешируется и остаётся read-only.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed checks | 18 / 18 |
| Ready | 0 |
| Blocked | 18 |
| Failed rows | 0 |
| Bound evidence items | 0 |
| Source evidence snapshots | 22 |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |
| State hash | `b7d3b9b0bdcbd1e22402b9eb3af419153a0a6defba847370089780ee14a468ba` |

Blocked reasons — это реальные owner gates, а не ошибки валидатора: новый exact
RC и release pointer не выпущены, language/overlay breadth и path-specific
packs не закрыты, one-database/restore checks не повторены, human
visual/accessibility/learning review отсутствует, remote CI quota ещё не
освобождена. До появления bound evidence статус не повышается.

## Проверки и границы

- `pnpm test:g12.5-requalification` — **4/4 PASS**;
- `pnpm requalification:g12.5-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- target `pnpm check` — **PASS** (lint/typecheck/tests/build/content/
  architecture suites);
- target `pnpm boundary:check` — **PASS**;
- target `pnpm toolchain:check` — **PASS**;
- evidence index — `712/712` entries verified, `rewritesDetected=0`;
- target clean после commit, `origin/main...main = 0 533`.

Полный target suite выполнил 543 content tests, 247 architecture/dev tests и
остальные runtime/UI/security/performance suites без failures. Предупреждения
`NO_COLOR/FORCE_COLOR` остаются cosmetic и не являются новым дефектом этого
среза.

G12.5 не закрывает автоматически G11 breadth, G11 final evidence, product
content, independent human review или production promotion. Формальные
счётчики master-plan намеренно не изменены. G13 decommission запрещён
явной границей владельца и остаётся только записанным backlog.

## Следующий порядок

1. Собрать reviewed path/overlay packs и повторить R07–R13 на одном atomic
   batch.
2. Выпустить новый exact RC и bound evidence для G12-R01…G12-R16; remote CI
   повторить после quota reset.
3. Провести human visual/accessibility/learning review, закрыть G12-R17/R18 и
   только после этого создать G11 final evidence.
4. Запустить independent review и release-scoped reconciliation.
5. Отдельно согласовать возможное G13 cleanup; до явной авторизации ничего
   не удалять.

Дата: 3 сентября 2026
