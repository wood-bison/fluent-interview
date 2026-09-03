# Greenfield plan progress — 2026-09-03 — G11.5 learning quality

Снимок выполнен после target commit `d4467e9d437c56617f168314bdd6bf75ffe1831e`
(`gate(g11.5): stage learning quality readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт G11.5:

- policy фиксирует восемь quality items `G11-029…G11-036`, владельцев,
  домены, acceptance criteria и обязательные evidence kinds;
- manifest хранит канонический порядок и явные blocked reasons, не назначая
  автоматически ни одной строке `ready`;
- readiness guard проверяет shape policy/manifest, target ancestry,
  repository-relative source paths и SHA-256 snapshots, порядок, owners,
  sorted reasons и отсутствие body/secret-shaped metadata;
- machine signals дают только безопасную оценку текущего corpus: question
  cards, assessed activities, runnable revisions, scaffold/retention,
  unseen-variant, timed-coding, system-design, incident-response и English
  defense coverage;
- controls запрещают content/release/database/Docker/learner writes,
  auto-promotion, push и deletion.

Guard не создаёт новые вопросы, задачи, ответы, ревью или learner evidence.
Для `ready` требуются реальные bound artifacts; человек остаётся владельцем
spoken explanation, reflection, retention и внешнего mock evidence.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed items | 8 / 8 |
| Ready | 0 |
| Blocked | 8 |
| Failed rows | 0 |
| Bound evidence items | 0 |
| Source evidence snapshots | 20 |
| Question cards / assessed activities | 6 / 7 |
| Runnable revisions | 0 |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |

Blocked reasons — реальные owner/content gates: нет scaffolded learning
sequence, retention checkpoints и unseen-variant evidence; timed-coding,
system-design и incident rubrics неполны; English defense и human external
mock evidence отсутствуют. Новый exact release candidate и path/overlay
breadth также ещё не закрыты. До появления bound evidence статус не повышается.

## Проверки и границы

- `pnpm test:g11.5-learning-quality` — **5/5 PASS**;
- `pnpm learning-quality:g11.5-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- target `pnpm check` — **PASS** (lint/typecheck/tests/build/content/
  architecture suites);
- target `pnpm boundary:check` — **PASS**;
- target `pnpm toolchain:check` — **PASS**;
- `pnpm architecture:evidence-schema` — **PASS**, evidence index
  `714/714`, `rewritesDetected=0`;
- target clean после commit, `origin/main...main = 0 534`.

Мастер-план намеренно не получил новых галочек и counters не изменились:
PREP_ONLY guard не подменяет G11 final evidence, G12.5 requalification,
human sign-off или independent review. G13 decommission остаётся отложенным и
неразрушающимся до новой явной авторизации.

## Следующий порядок

1. Собрать reviewed path/overlay packs и повторить R07–R13 на одном atomic
   batch.
2. Выпустить новый exact RC и bound evidence для G12-R01…G12-R16; повторить
   remote CI после quota reset.
3. Провести human visual/accessibility/learning review и закрыть G12-R17/R18.
4. Повторить G11 final evidence binding, затем independent review и
   release-scoped reconciliation.
5. Отдельно согласовать возможное G13 cleanup; до явной авторизации ничего
   не удалять.

Дата: 3 сентября 2026
