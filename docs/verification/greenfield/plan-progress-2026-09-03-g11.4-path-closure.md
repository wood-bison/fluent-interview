# Greenfield plan progress — 2026-09-03 — G11.4 path closure

Снимок выполнен после target commit `f2dbab46ca54cfa6647915afcd1b907d6baedd65`
(`gate(g11.4): stage path closure readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт G11.4:

- policy описывает 24 канонических item ID, 11 path/overlay lanes, владельцев,
  lesson/activity denominators, runtime profile prefixes, acceptance и
  обязательные evidence kinds;
- manifest сохраняет тот же порядок и явные blocked reasons для каждого
  Node/Nest/JS, Java/Spring/JVM, Go, .NET, Kotlin, Python, React/Next и
  Algorithms/System Design/Behavioral slice;
- readiness guard проверяет policy/manifest shape, target ancestry, source
  paths и SHA-256 snapshots, exact path/owner bindings, sorted reasons и
  отсутствие body/secret-shaped metadata;
- machine signals безопасно сверяют текущие release cards/placements,
  activity/runtime summaries и path-phase statuses, не создавая content,
  revisions, releases или learner evidence;
- controls запрещают content/release/database/Docker/learner writes,
  auto-promotion, push и deletion.

Guard не считает общий card count заменой path-specific denominator. Generic
placement может удовлетворить только reviewed shared requirement; native lane
требует собственный content и runtime evidence.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed items | 24 / 24 |
| Ready | 0 |
| Blocked | 24 |
| Failed rows | 0 |
| Bound evidence items | 0 |
| Current question cards / placements | 6 / 10 |
| Path phases currently blocked | 11 / 11 |
| Browser/runtime closure evidence | absent |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |

Blocked reasons — реальные owner/content gates: language-native packs,
framework decisions, exact runtime revisions, seeded failure scenarios,
overlay placements, lesson/activity denominators и browser journeys ещё не
выпущены. До появления complete artifact set с bound SHA-256 evidence статус
не повышается.

## Проверки и границы

- `pnpm test:g11.4-path-closure` — **5/5 PASS**;
- `pnpm path-closure:g11.4-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- target `pnpm check` — **PASS** (lint/typecheck/tests/build/content/
  architecture suites);
- target `pnpm boundary:check` — **PASS**;
- target `pnpm toolchain:check` — **PASS**;
- `pnpm architecture:evidence-schema` — **PASS**, evidence index
  `715/715`, `rewritesDetected=0`;
- target clean после commit, `origin/main...main = 0 535`.

Формальные counters master-plan намеренно не изменены: этот PREP_ONLY pack
создаёт проверяемую очередь, но не закрывает G11.4 product пункты, G11 final
evidence, G12.5 requalification или independent review. G13 decommission
остаётся отложенным и неразрушающимся.

## Следующий порядок

1. Использовать 24-item pack для reviewed path/overlay authoring и собрать
   первый atomic batch с exact bundle, runtime и browser evidence.
2. Повторить R07–R13 и обновить G11.4 rows только при наличии bound artifacts;
   не считать preview links и общие карточки закрытием native slices.
3. Выпустить новый exact RC и bound evidence для G12-R01…G12-R16, затем
   провести human visual/accessibility/learning sign-off для R17/R18.
4. Создать G11 final evidence, independent review и release-scoped
   reconciliation.
5. Отдельно согласовать возможное G13 cleanup; до явной авторизации ничего
   не удалять.

Дата: 3 сентября 2026
