# Greenfield plan progress — 2026-09-03 — G11.0 coverage readiness

Снимок выполнен после target commit `4ce4f1d`
(`gate(g11.0): stage coverage readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт для открытого
`G11-005`:

- policy фиксирует score threshold `0.90`, точный production path set Node/Java/
  Go и пять hard-gates;
- manifest хранит одну deterministic blocked row с причинами
  `eligible-production-paths-missing` и `production-score-below-threshold`;
- readiness guard проверяет policy/manifest shape, owners, source paths и
  SHA-256, target ancestry, sorted reasons, evidence bindings и отсутствие
  answer-shaped metadata;
- machine signals читают существующий coverage audit, публикуя actual/target
  dimensions по каждому path, но не создают карточки, release или learner
  evidence;
- controls запрещают filler, auto-promotion, database/Docker/learner/release
  writes, push и deletion.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed obligations | 1 / 1 |
| Ready | 0 |
| Blocked | 1 (`G11-005`) |
| Failed rows | 0 |
| Production score | Node `0.00`, Java `0.00`, Go `0.00` |
| Eligible production paths | 0 / 3 |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |
| Evidence index | `723/723`, rewrites `0` |

Hard-gates текущих released cards проходят, но supporting prompts отсутствуют,
а actual dimensions ниже policy denominators. Поэтому score нельзя закрывать
дубликатами или ручным повышением числа.

## Проверки и границы

- `pnpm test:g11.0-coverage` — **5/5 PASS**;
- `pnpm coverage:g11.0-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- полный target `pnpm check` — все lint, typecheck, project/content/runtime,
  architecture, security и performance проверки прошли; финальный index drift
  устранён штатным `--write-index`;
- `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check` и `git diff --check` — **PASS**;
- target clean после commit; ветка локально опережает `origin/main` на 539
  commits; push не выполнялся.

Formal master-plan counters намеренно не изменены: PREP_ONLY readiness не
закрывает authoring/review/release, G11 breadth, G12.5 или independent review.
G13 decommission остаётся отложенным и неразрушающимся.

## Следующий порядок

1. Закрыть G11.2 classification/provenance и authoring queue без скрытия
   unresolved records.
2. Создать reviewed supporting prompts, assessed activities и projects по
   production paths с typed placement и свежими receipts.
3. Пересобрать release и coverage audit; score считается после hard-gates и
   без filler-дубликатов.
4. Привязать coverage/content/release evidence к `G11-005`, повторить full
   gate и только затем рассматривать promotion.
5. После G11 breadth продолжить G12.5 и independent review; G13 cleanup
   возможен только после новой явной авторизации.

Дата: 3 сентября 2026
