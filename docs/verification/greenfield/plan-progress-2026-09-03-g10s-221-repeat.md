# Greenfield plan progress — 2026-09-03 — G10S-221 repeat

## Результат

Повторный one-root startup rehearsal target `main` подтвердил инфраструктурный
контракт на текущем коде (до evidence-коммита `abad4585…`):

- изолированный Compose project `fluent-g10s-221-mtljt725`, web port `47490`,
  штатный `pnpm run dev -- --detached --json` достиг `ready` за `32 416 ms`;
- allowlist сервисов — **6/6**, пять сервисов `running/healthy`,
  `api-data-init` завершился с exit `0`, самостоятельного Strata service нет;
- PostgreSQL migration ledger — **18/18**, `0` pending, `count=18`, `maxId=18`;
- обязательные learner/API routes — **6/6 HTTP 200**;
- scoped cleanup — exit `0`, **0 containers / 0 networks**, сохранены только
  `postgres-data` и `platform-events`;
- evidence metadata-only: response bodies, question/answer content,
  credentials и raw logs не записывались.

Machine evidence:
[`fluent-interview-platform/docs/verification/greenfield/G10S/G10S-221-one-root-startup-2026-09-03.json`](../../../fluent-interview-platform/docs/verification/greenfield/G10S/G10S-221-one-root-startup-2026-09-03.json),
hash `d15d8683…51249cad0`.

## Проверочный ladder

Перед фиксацией evidence в target повторно прошёл полный `pnpm check` —
**rc=0**; в его составе все 543 content/domain tests, 6 Navigator tests,
14 Studio tests, 15 security tests, 20 runtime/performance tests, 2 projection
tests, 8 observability tests, 5 project tests, CI/evidence/readiness gates и
architecture/boundary/toolchain validators — **PASS**. Вывод намеренно не
сохраняет тела или логи.

Target evidence дополняет исторический index до `728` записей через
`pnpm architecture:evidence-schema -- --write-index`; сам index повторно
проверен как `PASS`, без переписывания исторических артефактов.

## Что это значит для roadmap

Это повторная проверка уже закрытого G10S-221, поэтому master-plan counters не
увеличиваются и content breadth не объявляется готовым:

| Срез | Закрыто | Осталось | Всего |
| --- | ---: | ---: | ---: |
| Формальный master-plan | **664** | **470** | **1 134** |
| Исполнимые gates/checks | **664** | **278** | **942** |
| Неразрушающее закрытие | **664** | **128** | **792** |

Execution — **70,49%**, non-destructive closure — **83,84%**. Следующий
реальный шаг не автоматизируется: свежая current-main revalidation G10S-246 с
owner review; после неё — bounded `G11-P001`, G11.2–G11.6, 12 G12.3
dispositions, новый immutable RC/remote attestation, G12.5 human
requalification и independent sign-off. Старые repositories, сущности,
Docker resources, volumes и caches не удалялись; push не выполнялся из-за
лимита GitHub Actions.

Дата: 3 сентября 2026
