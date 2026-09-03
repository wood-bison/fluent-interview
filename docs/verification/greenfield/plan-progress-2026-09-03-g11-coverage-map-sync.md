# Greenfield plan progress — 2026-09-03 — coverage-map gate sync

Этот follow-up snapshot закрывает документационную рассинхронизацию, найденную
после G11 PREP_ONLY hardening. Target —
`/Users/sergeyzhechko/developer/fluent-interview-platform`, ветка `main`.
Старые репозитории/данные/Docker не удалялись; push не выполнялся из-за
лимита GitHub Actions.

## Target change

Commit `b6aee69` (`docs(g11): align coverage map revalidation gate`) заменил
устаревший label в
`docs/verification/greenfield/G11/prep-only-coverage-map-2026-09-02.md`:

```text
G10S-246 owner acceptance before any PREP_ONLY promotion
```

теперь совпадает с JSON, review-plan и status contract:

```text
G10S-246 current-main revalidation before any PREP_ONLY promotion
```

В Markdown также явно записано, что 12 owner decisions относятся к reviewed
snapshot, а subsequent non-metadata commits требуют свежей revalidation до
human authoring. Evidence-index пересобран на фактический digest; исторические
артефакты не переписывались и не удалялись.

Вместе с предыдущими target commits `5ee94af` и `75a47a4` это оставляет
единую fail-closed границу: 1 597 записей/80 пакетов имеют статус
`BLOCKED_BY_G10S-246_REVALIDATION`, promotion и serving запрещены.

## Проверки

- полный target `pnpm check` — **rc=0**;
- `pnpm boundary:check` и `pnpm toolchain:check` — **PASS**;
- `pnpm evidence:validate` — **13/13 PASS**;
- `pnpm architecture:evidence-schema` — **726/726 PASS**;
- PREP_ONLY focused suites — **9/9 PASS**;
- readiness write policy — **1/1 PASS**;
- `git diff --check` — **PASS**, target clean после `b6aee69`.

`architecture:gate-246-closure` по-прежнему ожидаемо FAIL только по
`git:post-snapshot-non-metadata`: reviewed head `008703c…` старше текущего
`main`. Это не скрывается документацией и требует отдельной current-main
revalidation, а не автоматического owner sign-off.

## Прогресс

Синхронизация label не создаёт content и не меняет counters:

| Срез | Закрыто | Осталось | Всего |
| --- | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 |
| Исполнимые gates/checks | 664 | 278 | 942 |
| Неразрушающее закрытие продукта | 664 | 128 | 792 |
| ↳ текущий product closure | 664 | 73 | 737 |
| ↳ requalification + independent review | 0 | 55 | 55 |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 |

Execution — **70,49%**, non-destructive closure — **83,84%**. Следующий
разрешённый шаг: свежая G10S-246 current-main revalidation, затем один
bounded G11 packet с original content, provenance, typed placement и human
review. G13 cleanup остаётся запрещённым без новой авторизации.

Дата: 3 сентября 2026
