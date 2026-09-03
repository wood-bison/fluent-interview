# Greenfield plan progress — 2026-09-03 — readiness evidence hardening

Снимок выполнен после target commit `b377f20` (`fix(gates): require complete
readiness evidence bundles`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что исправлено

Readiness guards G11.0, G11.2, G11.3, G11.4, G11.5, G11.6 и G12.5 теперь
fail-closed для объявленного `ready` evidence bundle:

- policy-required kinds должны присутствовать ровно по одному разу;
- лишние, дублированные или пропущенные kinds не могут превратить строку в
  `ready`;
- каждый evidence path и SHA-256 по-прежнему проверяются against allowlist и
  текущему source content;
- build-time rows с повреждённым bundle попадают в report issues и не входят в
  ready summary;
- существующие диагностические коды для пустых evidence сохранены, чтобы
  regression не скрывала уже известные gaps.

Это защищает от ручного или устаревшего manifest, который раньше мог пройти
только с частичным evidence. Контент, learner state, release/catalog, Docker,
remote CI и production serving не менялись.

## Проверки

- seven focused readiness suites — **42/42 PASS**:
  `g11.0` (7), `g11.2` (6), `g11.3` (6), `g11.4` (6), `g11.5` (6), `g11.6`
  (6), `g12.5` (5);
- полный target `pnpm check` прошёл lint, typecheck, build, broad content/
  runtime/security/architecture tests (**543/543 PASS**) и readiness commands;
- после штатного `node tools/dev/g10s-evidence-schema.mjs --write-index`
  `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check` и `git diff --check` — **PASS**;
- target clean после commit; локальная ветка опережает `origin/main` на
  **544** commits; push не выполнялся.

## Текущая граница

Счётчики мастер-плана не изменены: hardening guards не закрывают G11 breadth,
owner dispositions G12.3, G12.5 human requalification, independent review или
G13 cleanup. Текущая машинная readiness остаётся честно
`PASS_WITH_GAPS`:

- G11.0: `1` blocked;
- G11.2: `3` blocked;
- G11.3: `2` ready / `6` blocked;
- G11.4: `24` blocked;
- G11.5: `8` blocked;
- G11.6: `3` ready / `11` blocked;
- G12.5: `18` blocked;
- G12.3: `12` open screen dispositions;
- G12.2: Actions quota, immutable-RC mismatch и remote attestation остаются
  открытыми.

## Следующий безопасный порядок

1. Заполнить и независимо проверить G11.2 classification/authoring evidence;
   затем расширить G11.3 practice portfolio и path-specific G11.4 packs.
2. Получить 12 owner screen dispositions и пересобрать G12.3 manifest на
   свежем target SHA.
3. После сброса Actions quota выпустить новый согласованный immutable RC и
   получить настоящий remote run/job identity для G12.2.
4. Выполнить G12.5 human requalification, затем independent final review и
   production sign-off.
5. G13 decommission (старые репозитории, entities, Docker containers/volumes,
   caches и данные) не начинать без новой явной авторизации владельца.

Дата: 3 сентября 2026
