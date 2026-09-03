# Greenfield plan progress — 2026-09-03 — readiness row contracts

Снимок выполнен после target commit `5bbd2f9` (`fix(gates): harden readiness
evidence rows`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что исправлено

В G11.0, G11.2, G11.3, G11.4, G11.5, G11.6 и G12.5 build-time row теперь
проверяет тот же контракт, что и manifest validator:

- известное policy definition и обязательные evidence kinds;
- точную shape `{ kind, path, sha256 }` без лишних полей;
- kind из policy, отсутствие duplicate kind и наличие всех kinds для `ready`;
- безопасный allowlisted repository path;
- SHA-256 текущего source file.

Row issues включаются в общий readiness report и исключают повреждённую строку
из ready/blocked/evidence-bound summaries. Это устраняет возможность получить
ложный summary, когда глобальный validator уже нашёл неверный kind или path,
но build-row оставался пустым. Контракт остаётся metadata-only и PREP_ONLY:
контент, release pointer, learner state, serving, Docker и production data не
менялись.

## Проверки

- focused suites затронутых gates — **47/47 PASS**:
  `g11.0` (8), `g11.2` (7), `g11.3` (6), `g11.4` (7), `g11.5` (7), `g11.6`
  (6), `g12.5` (6);
- ранее зафиксированный G12.2/G12.3 hardening остаётся зелёным (`6/6` и
  `7/7` соответственно);
- полный target `pnpm check` прошёл lint, typecheck, build и обычные
  content/runtime/security/architecture gates (**543/543 broad tests PASS**);
  единственный ожидаемый останов — historical G10S-226 index drift после
  пересборки readiness reports;
- после `node tools/dev/g10s-evidence-schema.mjs --write-index`:
  `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check` и `git diff --check` — **PASS**;
- target clean после commit `5bbd2f9`, локальная ветка опережает `origin/main`
  на **547** commits; push не выполнялся.

## Текущая граница

Счётчики мастер-плана намеренно не изменены. Readiness hardening не закрывает
G11 breadth, 12 owner dispositions G12.3, G12.5 human requalification,
independent review или remote G12.2 attestation. G11.2 по-прежнему показывает
1 597 unresolved records; G11.3–G11.6 и G12.5 остаются `PASS_WITH_GAPS` по
своим содержательным/человеческим ограничениям.

## Следующий безопасный порядок

1. Закрывать G11.2 classification/authoring/review evidence bounded batches,
   затем G11.3–G11.6 path and learning breadth.
2. Получить 12 owner dispositions, связать их с 71 state evidence и пересобрать
   G12.3 manifest на свежем target SHA.
3. После сброса Actions quota создать согласованный immutable RC и durable
   remote attestation для G12.2.
4. Выполнить G12.5 human requalification, independent review и production
   sign-off.
5. G13 cleanup/decommission старых репозиториев, сущностей, Docker
   containers/volumes, caches и данных не начинать без новой явной
   авторизации владельца.

Дата: 3 сентября 2026
