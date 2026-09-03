# Greenfield plan progress — 2026-09-03 — G12.2 remote-CI readiness

Снимок выполнен после target commit `aca0a4b` (`gate(g12.2): stage remote-ci
readiness`) в `/Users/sergeyzhechko/developer/fluent-interview-platform`.
Commit локальный; push не выполнялся из-за ограничения GitHub Actions. Старые
репозитории, сущности, containers/volumes и данные не удалялись.

## Что добавлено

В target добавлен fail-closed, metadata-only PREP_ONLY контракт для открытого
`G12-024`:

- policy и manifest фиксируют точную immutable RC, допустимые evidence kinds и
  owner `release-owner`;
- guard `pnpm remote-ci:g12.2-readiness` проверяет shape, ancestry, source
  allowlist/SHA-256, deterministic blocked reasons и отсутствие body-shaped
  metadata;
- local clean-archive evidence проверяется как эквивалент CI, но не выдаётся
  за remote attestation;
- workflow и `rc-manifest.json` читаются через `git show <immutable-tag>:<path>`.
  Это исправляет реальный дефект старого exact-RC audit, который читал
  текущий checkout и мог принять current-main manifest за manifest immutable
  tag;
- exact-RC unit tests теперь отдельно проверяют соответствие manifest
  immutable SHA и отказ при подмене `headSha`;
- controls запрещают auto-promotion, release/catalog/DB/Docker/learner writes,
  push и deletion.

## Machine result

| Метрика | Значение |
| --- | ---: |
| Expected / listed obligations | 1 / 1 |
| Ready | 0 |
| Blocked | 1 (`G12-024`) |
| Failed rows | 0 |
| Local clean-archive evidence | PASS |
| Remote attestation | не выполнялась |
| Immutable RC manifest | `PASS_WITH_LIMITATIONS` |
| Blocked reasons | `actions-quota-bound`, `immutable-rc-manifest-mismatch`, `remote-attestation-missing` |
| Guard status | `PASS_WITH_GAPS` |
| Guard valid | `true` |
| Evidence index | `726/726`, rewrites `0` |

Текущий immutable tag `rc-2026.08.29.1` разрешается в
`476aa01b852ffbb9ca91da11e7eb0922dd7f6f95`, тогда как исторический
`rc-manifest.json` содержит другой короткий head. Это намеренный blocker:
историю тега нельзя переписывать; после восстановления Actions quota нужно
выпустить новый immutable RC с согласованными manifest/evidence и получить
настоящий run/job identity.

## Проверки и границы

- `pnpm test:g12.2-remote-ci` — **5/5 PASS**;
- `pnpm test:ci-policy` — **6/6 PASS**, включая exact-RC manifest regression;
- полный `pnpm test` — **PASS** для project/content/runtime/architecture,
  security, performance и G11/G12 readiness ladders;
- после штатного `node tools/dev/g10s-evidence-schema.mjs --write-index`
  `architecture:evidence-schema`, `architecture:evidence-inputs`,
  `boundary:check`, `toolchain:check` и `git diff --check` — **PASS**;
- target clean после commit; ветка локально опережает `origin/main` на 541
  commit; push не выполнялся.

Formal master-plan counters намеренно не изменены: PREP_ONLY readiness не
закрывает remote attestation, immutable-RC correction, G11 breadth, G12.5 или
independent review. G13 decommission остаётся отложенным и неразрушающимся.

## Следующий порядок

1. После сброса Actions quota создать новый immutable RC, где tag, resolved
   SHA и `rc-manifest.headSha` согласованы; не менять историю старого тега.
2. Запустить pinned GitHub Actions workflow и записать durable run/job identity
   в отдельный evidence-файл; повторить guard до `1/1 ready`.
3. Повторно проверить local archive и exact-RC audit на новом immutable SHA.
4. Вернуться к G12.3 и получить 12 owner screen dispositions, затем продолжить
   G11.2 classification/authoring queue и G12.5 requalification.
5. G13 cleanup (старые репозитории, entities, Docker containers/volumes и
   данные) не начинать без новой явной авторизации владельца.

Дата: 3 сентября 2026
