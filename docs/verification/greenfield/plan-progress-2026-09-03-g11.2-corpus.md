# Greenfield plan progress — 2026-09-03 — G11.2 corpus reconciliation

Снимок выполнен после target commit `78264ac`
(`gate(g11.2): stage corpus reconciliation readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт G11.2:

- policy перечисляет три канонических corpus-обязательства `G11-013`,
  `G11-018`, `G11-019`, owners, domains, acceptance и разрешённые evidence
  kinds/source paths;
- manifest хранит deterministic order и явные blocked reasons; ни одна строка
  не повышается автоматически в `ready`;
- readiness guard проверяет target ancestry, source/evidence digests,
  owner/kind/path bindings, ready/blocked invariants, sorted reasons и
  отсутствие answer-shaped metadata;
- machine signals читают только существующие classification, authoring,
  expert-review и coverage reports и не создают контент, revisions, releases
  или learner evidence;
- controls запрещают content/release/database/Docker/learner writes,
  auto-promotion, push и deletion.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed obligations | 3 / 3 |
| Ready | 0 |
| Blocked | 3 (`G11-013`, `G11-018`, `G11-019`) |
| Failed rows | 0 |
| Bound evidence obligations | 0 |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |
| Source snapshots | 9 уникальных путей |
| Evidence index | `721/721`, rewrites `0` |

Граница corpus остаётся честно открытой: `1 597` records в classification
ledger, `0` classified и `1 597` unresolved; research pack имеет `0`
review-ready records; expert sample audit содержит `27` кластеров, `27`
selected samples и `0` recorded decisions; production coverage score не
проходит. Это не генератор вопросов и не production promotion.

## Проверки и границы

- `pnpm test:g11.2-corpus` — **5/5 PASS**;
- `pnpm corpus:g11.2-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- полный target `pnpm check` — lint, typecheck, project/content/runtime,
  architecture, security и performance команды прошли; единственный
  исторический drift evidence index устранён штатным `--write-index`;
- target `pnpm architecture:evidence-schema` и
  `pnpm architecture:evidence-inputs` — **PASS**;
- target `pnpm boundary:check`, `pnpm toolchain:check` и `git diff --check` —
  **PASS**;
- target clean после commit; ветка локально опережает `origin/main` на 538
  commits; push не выполнялся.

Formal master-plan counters намеренно не изменены: PREP_ONLY readiness не
подменяет content breadth, authoring, review, G11 final evidence, G12.5,
human learning/visual sign-off или independent review. G13 decommission
остаётся отложенным и неразрушающимся.

## Следующий порядок

1. Для `G11-013` разметить все records стабильными canonical IDs, role,
   provenance и disposition; unresolved строки не скрывать.
2. Для `G11-018` подготовить оригинальные объяснения и официальные источники,
   typed placements и reviewer receipts.
3. Для `G11-019` провести независимый expert sample review каждого из 27
   capability clusters.
4. Обновить manifest только свежими evidence/digests, повторить focused и
   full gates, затем сделать отдельный atomic commit на каждую подтверждённую
   группу.
5. После G11 breadth продолжить G12.5 и independent review; G13 cleanup
   возможен только после новой явной авторизации, до неё ничего не удалять.

Дата: 3 сентября 2026
