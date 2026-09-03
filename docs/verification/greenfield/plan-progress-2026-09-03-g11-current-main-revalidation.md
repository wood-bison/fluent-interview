# Greenfield plan progress — 2026-09-03 — current-main G10S-246 boundary

Этот снимок описывает два локальных коммита target-проекта
`/Users/sergeyzhechko/developer/fluent-interview-platform` и синхронизацию его
evidence-документации с umbrella master-plan. Push не выполнялся из-за лимита
GitHub Actions; старые репозитории, сущности, Docker containers/volumes,
caches и данные не удалялись.

## Что сделано

### `5ee94af` — fail-closed PREP_ONLY status

Изменён только контракт подготовки G11, не serving и не production content:

- manifest и review-plan теперь явно требуют
  `G10S-246 current-main revalidation before any PREP_ONLY promotion`;
- validator отклоняет план без этого точного текущего gate;
- статус PREP_ONLY теперь различает уже записанное owner decision и устаревший
  для текущего `main` снимок: `REVALIDATION_REQUIRED`,
  `ownerAcceptanceRequired=false`, `ownerAcceptanceRecorded=true`,
  `ownerDecisionSet=RECORDED_PENDING_REVALIDATION`,
  `revalidationRequired=true`;
- все 80 bounded-пакетов (1 597 записей) получают явный статус
  `BLOCKED_BY_G10S-246_REVALIDATION` и следующий action — повторить
  current-main revalidation до authoring/review;
- `promotionAllowed=false`, `productClaim=NOT_PRODUCTION_READY` остаются
  обязательными; тела вопросов, ответы, serving/release pointers и learner
  state не трогались;
- regression suite обновлён и проверяет новую границу, включая отсутствие
  body-shaped полей.

### `75a47a4` — R14/evidence documentation sync

R14 был пересобран на target HEAD `5ee94af`, а соседний Markdown приведён к
тому же JSON. Сейчас lifecycle report фиксирует 92/92 классифицированных
артефакта, 32 `still-valid`, 60 `superseded`, 0 unclassified и 0 rule
overlap; state hash —
`0e52bd866dd52491f51e46052b7d28e60cd29eeab77f83b18b03e96d04424c81`.
Evidence-index обновлён без изменения исторических тел и без удаления. R14
сохраняет `targetCommit=e9d5b634…` как immutable anchor, а
`currentHead=5ee94aff…` как commit, на котором выполнена эта revalidation.

## Проверки

- полный target `pnpm check` — **rc=0** после синхронизации index; lint,
  typecheck, build, content/runtime/security/architecture gates и broad tests
  прошли;
- `pnpm boundary:check` — **PASS**;
- `pnpm toolchain:check` — **PASS** (`Node v26.7.0`);
- PREP_ONLY manifest/coverage/review-plan/review-status — **9/9 PASS**;
- readiness write policy — **1/1 PASS** при `READINESS_WRITE=0`;
- `pnpm evidence:validate` — **13/13 PASS**;
- `pnpm architecture:evidence-schema` — **726/726 historical entries PASS**;
- `git diff --check` — **PASS** перед обоими коммитами;
- `pnpm architecture:gate-246-closure` остаётся ожидаемо **FAIL** по
  `git:post-snapshot-non-metadata`: текущий `main` содержит изменения после
  reviewed head `008703c…`. Это не замаскировано под PASS и означает, что
  current-main revalidation ещё действительно нужна.

## Текущая граница

Owner decision-set уже записан для reviewed snapshot (12 adapted decisions),
но он не даёт права автоматически объявить текущий `main` подтверждённым:
последующие non-metadata commits требуют свежей G10S-246 revalidation.
Поэтому G11 authoring/import/promotion не начат, а PREP_ONLY остаётся
metadata-only и fail-closed. Human review, source wording, bilingual answers,
typed placement и runtime evidence не генерируются этим шагом.

## Счётчики master-plan

Машинное hardening и синхронизация отчётов не создают curriculum content, так
что счётчики не уменьшаются:

| Срез | Закрыто | Осталось | Всего |
| --- | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 |
| Исполнимые gates/checks | 664 | 278 | 942 |
| Неразрушающее закрытие продукта | 664 | 128 | 792 |
| ↳ текущий product closure | 664 | 73 | 737 |
| ↳ requalification + independent review | 0 | 55 | 55 |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 |

Execution completion остаётся **70,49%**, non-destructive closure —
**83,84%**. Эти числа описывают проверяемую очередь, а не production
readiness.

## Следующий порядок

1. Выполнить новую G10S-246 current-main revalidation на точном `main` и
   зафиксировать свежие packet/decision/revalidation hashes.
2. Только после PASS открыть один bounded packet `G11-P001`; для каждой записи
   сохранить исходный текст, provenance, typed placement и reviewer decision.
3. Последовательно закрыть G11.2–G11.6: corpus breadth, runnable activities,
   language paths, overlays, learning-quality и independent revalidation;
   каждый slice — отдельный commit с тем же test ladder.
4. Получить 12 G12.3 screen dispositions, пересобрать свежий immutable RC и
   после сброса quota получить remote CI attestation (G12.2).
5. Выполнить G12.5 human requalification и независимый финальный review;
   только после этих gates возможен production sign-off.
6. G13 cleanup/decommission старых репозиториев, сущностей, Docker и caches
   остаётся запрещённым до новой явной авторизации владельца и отдельного
   restore-proof.

Дата: 3 сентября 2026
