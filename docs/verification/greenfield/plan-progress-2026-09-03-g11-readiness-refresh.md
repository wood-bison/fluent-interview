# Greenfield plan progress — 2026-09-03 — G11/G12 readiness evidence refresh

## Результат bounded-волны

На текущем target `main` выполнена read-only пересборка девяти readiness
отчётов, чтобы их `currentHead` и зависимые digests не ссылались на устаревший
снимок. Обновлены только metadata/evidence envelopes:

- `G11/coverage-readiness-2026-09-03.json` — `PASS_WITH_GAPS`, 1 blocked;
- `G11/corpus-reconciliation-readiness-2026-09-03.json` —
  `PASS_WITH_GAPS`, 3 blocked;
- `G11/practice-portfolio-readiness-2026-09-03.json` — `PASS_WITH_GAPS`,
  2 ready / 6 blocked;
- `G11/path-closure-readiness-2026-09-03.json` — `PASS_WITH_GAPS`, 24 blocked;
- `G11/learning-quality-readiness-2026-09-03.json` — `PASS_WITH_GAPS`,
  8 blocked;
- `G11/revalidation-readiness-2026-09-03.json` — `PASS_WITH_GAPS`,
  3 ready / 11 blocked;
- `G12/remote-ci-readiness-2026-09-03.json` — `PASS_WITH_GAPS`, 1 blocked;
- `G12/port-ledger-readiness-2026-09-03.json` — `PASS_WITH_GAPS`, 1 blocked;
- `G12/g12.5-requalification-readiness-2026-09-03.json` — `PASS_WITH_GAPS`,
  18 blocked;
- `G10S/evidence-index.v1.json` — пересобран по фактическим size/digest, без
  переписывания тел исторических evidence; индекс снова содержит `728/728`
  проверенных записей.

Целевой коммит: `5859206` (`docs(g11): refresh readiness evidence on current
main`). Target `main` чистый. Полный target `pnpm check` завершился `rc=0`;
`architecture:evidence-schema`, `architecture:evidence-inputs`,
`boundary:check`, `toolchain:check` и `git diff --check` — **PASS**. Это
evidence-only синхронизация: содержимое вопросов/ответов, serving/release,
БД, Docker, старые репозитории, volumes и caches не менялись; push не
выполнялся из-за лимита GitHub Actions.

## Почему счётчик не уменьшился

Отчёты подтверждают корректность guards, но не создают отсутствующее
содержимое, human review или remote attestation. Поэтому галочки G11/G12 не
переставлялись, а master-plan остаётся:

| Срез | Закрыто | Осталось | Всего |
| --- | ---: | ---: | ---: |
| Формальный master-plan | **664** | **470** | **1 134** |
| Исполнимые gates/checks | **664** | **278** | **942** |
| Неразрушающее закрытие | **664** | **128** | **792** |

Execution — **70,49%**, non-destructive closure — **83,84%**. Внутри
product-closure остаётся `73` пунктов; из них основная масса — реальные
content breadth, typed placements, package-mode runtimes, human review и
owner dispositions, а не недостающие скрипты.

## Следующий допустимый порядок

1. Сформировать новый immutable G10S-246 packet на текущем `5859206` и
   пройти owner revalidation; старый reviewed snapshot автоматически не
   переносится.
2. Закрыть bounded `G11-P001` только через original content → provenance →
   typed placement → reviewer decision; direct serving writes запрещены.
3. Продолжить G11.2–G11.6 по реальным source records, без filler и без
   скрытия quarantine/unresolved counts.
4. Оформить 12 G12.3 owner dispositions, затем immutable RC и G12.2 remote
   attestation после сброса Actions quota.
5. Выполнить G12.5 human requalification и независимый финальный review.

G13 decommission/удаление старых репозиториев, сущностей, контейнеров,
volumes и caches намеренно не запускались: для них нужна отдельная явная
авторизация владельца, которой нет.

Дата: 3 сентября 2026
