# Greenfield plan progress — 2026-09-03 — G12.3 row-level bundle hardening

Снимок выполнен после target commit `a2bb51e` (`fix(gates): close port ledger
evidence rows`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что исправлено

G12.3 теперь fail-closed не только на уровне policy/manifest, но и для каждой
строки `items`:

- row должен ссылаться на известное policy definition и его allowlisted source
  evidence;
- `ready` row обязан иметь ровно четыре обязательных kind
  (`interaction`, `visual`, `semantic`, `disposition`), без duplicate или
  missing kind;
- shape, kind, path и SHA-256 каждой evidence-записи сверяются с текущим
  source content;
- ошибки строки добавляются в общий report и исключают её из
  `readyItemCount`, `blockedItemCount` и `evidenceBoundItemCount`;
- summary больше не может показать готовность повреждённой строки, даже если
  глобальный manifest validator не выявил тот же дефект.

Это закрывает второй fail-open путь в port-ledger readiness. Реальные owner
screen dispositions, state evidence, serving/release, learner state, Docker и
production content не менялись; G12.3 по-прежнему остаётся `PREP_ONLY` и
`PASS_WITH_GAPS`.

## Проверки

- `pnpm test:g12.3-port-ledger` — **7/7 PASS**, включая regression для
  duplicate/missing evidence kinds;
- полный target `pnpm check` прошёл lint, typecheck, build и обычные
  content/runtime/security/architecture gates (**543/543 broad tests PASS**);
  исходный запуск остановился только на ожидаемом G10S-226 historical-index
  drift после пересборки readiness reports;
- после штатного `node tools/dev/g10s-evidence-schema.mjs --write-index`:
  `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check` и `git diff --check` — **PASS**;
- target clean после commit `a2bb51e`, локальная ветка опережает `origin/main`
  на **546** commits; push не выполнялся.

## Текущая граница

Счётчики мастер-плана намеренно не изменены: hardening guards не создают
контент и не закрывают G11 breadth, 12 owner dispositions G12.3, G12.5 human
requalification, independent review или remote G12.2 attestation. Машинный
G12.3 остаётся заблокированным открытыми 12 screen dispositions; G12.2
остаётся заблокированным Actions quota, immutable-RC mismatch и отсутствующей
remote attestation.

## Следующий безопасный порядок

1. Подготовить и независимо проверить G11.2 classification/authoring evidence,
   затем расширить G11.3–G11.6 bounded content batches.
2. Получить 12 owner dispositions, привязать их к 71 state evidence и
   пересобрать G12.3 manifest на свежем target SHA.
3. После сброса Actions quota выпустить новый согласованный immutable RC,
   получить durable remote run/job identity и повторить G12.2.
4. Выполнить G12.5 human requalification, independent review и production
   sign-off.
5. G13 decommission старых репозиториев, сущностей, Docker containers/volumes,
   caches и данных не начинать без новой явной авторизации владельца.

Дата: 3 сентября 2026
