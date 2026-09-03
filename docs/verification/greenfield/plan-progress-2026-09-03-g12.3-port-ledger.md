# Greenfield plan progress — 2026-09-03 — G12.3 port-ledger readiness

Снимок выполнен после target commit `4cef0992183efc3862a33f91d0e83b776eb0aeb7`
(`gate(g12.3): stage port-ledger readiness`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт для открытого
`G12-025`:

- policy фиксирует четыре вида обязательного evidence (`interaction`, `visual`,
  `semantic`, `disposition`) и три допустимых owner dispositions
  (`ported`, `adapted`, `dropped` с причиной);
- manifest хранит одну deterministic blocked row с причинами
  `screen-dispositions-open` и `state-evidence-not-bound-to-dispositions`;
- readiness guard проверяет shape policy/manifest, exact source allowlist,
  SHA-256 и ancestry target commit, evidence bindings, sorted reasons и
  отсутствие body-shaped metadata;
- machine signals сверяют port ledger, geometry audit и latest state-evidence
  registry, но не создают screenshots, dispositions, release или learner
  evidence;
- controls запрещают auto-promotion, catalog/DB/Docker/release/learner writes,
  push и deletion.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed obligations | 1 / 1 |
| Ready | 0 |
| Blocked | 1 (`G12-025`) |
| Failed rows | 0 |
| Declared screens / critical states | 12 / 71 |
| State evidence ready | 71 / 71 |
| Open state entries | 0 |
| Open screen dispositions | 12 |
| Unresolved disposition items | 12 |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |
| Evidence index | `725/725`, rewrites `0` |

Все state-evidence entries структурно готовы, но это не означает, что владелец
принял screen-by-screen решения. До заполнения 12 disposition records guard
не может перейти в `ready`.

## Проверки и границы

- `pnpm test:g12.3-port-ledger` — **5/5 PASS**;
- `pnpm port-ledger:g12.3-readiness` — **PASS_WITH_GAPS**, `valid: true`;
- `pnpm test:g11.0-coverage` — **6/6 PASS**, включая malformed-ready
  fail-closed regression;
- полный target `pnpm check` прошёл lint, typecheck, project/content/runtime,
  architecture, security, performance и G11/G12 readiness checks; ожидаемый
  historical index drift G10S-226 устранён штатным `--write-index`;
- `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check` и `git diff --check` — **PASS**;
- target clean после commit; ветка локально опережает `origin/main` на 540
  commits; push не выполнялся.

Также в commit вошла защитная правка G11.0: malformed `ready` row без массива
evidence теперь возвращает явный `FAIL`, а не вызывает runtime exception.

Formal master-plan counters намеренно не изменены: PREP_ONLY readiness не
закрывает owner dispositions, content breadth, authoring/review/release,
G12.5 или independent review. G13 decommission остаётся отложенным и
неразрушающимся.

## Следующий порядок

1. Владелец фиксирует 12 `ported|adapted|dropped(reason)` screen dispositions,
   каждое решение получает evidence и reviewer/actor metadata.
2. Повторить G12.3 на свежем immutable target SHA; guard должен показать `1/1`
   ready и связать disposition evidence со всеми `71/71` state entries.
3. После этого выполнить один consolidated visual sign-off для desktop/light,
   desktop/dark, MacBook и Studio Display; human sign-off не заменяется
   synthetic evidence.
4. Вернуться к G11.2 classification/authoring queue и закрыть supporting
   prompts/activities без filler-дубликатов, затем пересобрать coverage и
   release evidence.
5. Только после G11 breadth продолжить G12.5 clean-room requalification и
   independent review. G13 cleanup возможен лишь после новой явной
   авторизации владельца.

Дата: 3 сентября 2026
