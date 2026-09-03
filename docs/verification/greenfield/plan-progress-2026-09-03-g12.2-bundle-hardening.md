# Greenfield plan progress — 2026-09-03 — G12.2 bundle hardening

Снимок выполнен после target commit `af08cf5` (`fix(gates): close remote
evidence bundle gaps`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что исправлено

G12.2 remote-CI readiness теперь одинаково fail-closed на двух уровнях:

- manifest validator требует для `ready` полного набора
  `local-ci-equivalent` и `remote-attestation`, каждый kind ровно один раз;
- missing kind диагностируется отдельно, поэтому две копии одного evidence не
  маскируют отсутствие второго;
- build-row проверяет shape, допустимый kind, allowlisted path, SHA-256,
  duplicate и missing kinds, а ошибки привязываются к конкретному item;
- readiness summary считает строку ready только при отсутствии row issues;
- remote attestation и Actions quota остаются независимыми условиями: local
  pass не выдаётся за remote success.

Изменение не открывает импорт/release, не пишет в БД или Docker и не меняет
learner state.

## Проверки

- `node --test tools/dev/test/g12.2-remote-ci-readiness.test.mjs` — **6/6
  PASS**, включая duplicate/missing evidence regression;
- полный target `pnpm check`: lint, typecheck, build, content/runtime/security
  gates и broad suite — **543/543 PASS**;
- после `node tools/dev/g10s-evidence-schema.mjs --write-index`:
  `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check`, `git diff --check` — **PASS**;
- target clean после commit; локальная ветка опережает `origin/main` на
  **545** commits; push не выполнялся.

## Текущая граница и порядок дальше

Счётчики master-plan не изменены: G12.2 всё ещё `PASS_WITH_GAPS` из-за
Actions quota, несогласованного старого immutable RC и отсутствующей remote
attestation. Дальше безопасный порядок такой:

1. После сброса quota выпустить новый immutable RC, где tag, resolved SHA и
   `rc-manifest.headSha` совпадают.
2. Получить durable Actions run/job identity и повторить G12.2 до `1/1 ready`.
3. Закрыть 12 owner dispositions G12.3 и G11.2–G11.6 breadth/evidence.
4. Выполнить G12.5 human requalification и independent review.
5. G13 decommission не начинать без новой явной авторизации владельца.

Дата: 3 сентября 2026
