# Progress snapshot — G11/G12 readiness rebind — 3 сентября 2026

## Что сделано

После target-коммита `dbfcbd4` все текущие G11/G12 readiness envelopes и
исторический G10S evidence index пересобраны на фактическом `main`:

- target repository: `fluent-interview-platform`;
- target branch: `main`;
- evidence commit: `9b423cf` (`docs(readiness): rebind g11 and g12 evidence to current main`);
- десять metadata-only JSON отчётов получили `currentHead=9b423cf`;
- G10S index проверяет `728/728` исторических записей, `rewritesDetected=0`;
- тела вопросов/ответов, serving release, learner state и database authority не
  изменялись.

Обновлены envelopes для G11-R07/R08/R09/R12/R13/R14, G11.0, G11.2, G11.3,
G11.5, G12.2, G12.3 и G12.5. Все отчёты валидны; там, где входов ещё не
хватает, статус честно остаётся `PASS_WITH_GAPS`.

## Машинная проверка

Перед commit выполнена полная связанная цепочка target:

```text
pnpm check
pnpm boundary:check
pnpm toolchain:check
git diff --check
```

`rc=0`. После commit дополнительно прошли schema/index, evidence-inputs,
boundary, toolchain и все revalidation/readiness команды в read-only режиме
`READINESS_WRITE=0`; target `main` чистый.

Ключевые результаты:

| Область | Результат | Честная граница |
| --- | --- | --- |
| G11-R07 activity/runtime | `PASS_WITH_GAPS` | 2 exact runnable из 7 assessed, 2 broken candidates заблокированы |
| G11-R08 language paths | `PASS_WITH_GAPS` | 3 из 8 track оценены; dotnet/kotlin/python/react/next заблокированы |
| G11-R09 overlays | `PASS_WITH_GAPS` | 0 из 3 overlays оценено до появления placements |
| G11-R12/R13 | `PASS_WITH_GAPS` | 0/11 phase bundles готовы; final evidence не опубликовано |
| G11-R14 lifecycle | `PASS` | 92/92 классифицированы, 32 still-valid, 60 superseded |
| G11.0 coverage | `PASS_WITH_GAPS` | Node/Java/Go score `0`, production threshold не достигнут |
| G12.2 remote CI | `PASS_WITH_GAPS` | remote Actions не запускались из-за quota |
| G12.3 port ledger | `PASS_WITH_GAPS` | 71/71 state evidence есть, 12 screen dispositions открыты |
| G12.5 requalification | `PASS_WITH_GAPS` | 18/18 обязательных пунктов ждут новый RC и human review |

## Счётчики

`pnpm plan:progress:json` после target и umbrella commits:

- формальный master-plan: **665 checked / 469 remaining / 1 134 total**;
- исполнимые gates/checks: **665 / 277 / 942** (**70,59%**);
- неразрушающее закрытие: **665 / 127 / 792** (**83,96%**);
- product closure: **665 / 72 / 737**;
- standing policy: **192** постоянных правил, не implementation backlog;
- human requalification + independent review: **55**;
- G13 decommission: **150**, отложены владельцем и не выполняются.

Пересборка evidence не уменьшает эти числа: это синхронизация доказательств,
а не фальшивое закрытие контентных или человеческих gates.

## Следующий исполнимый порядок

1. Получить current-main G10S-246 revalidation/owner decision; старый reviewed
   snapshot не переносится автоматически.
2. После этого провести bounded G11-P001 authoring/review с оригинальным
   контентом и provenance.
3. Пакетно закрыть corpus, runtime joins, language paths, overlays,
   path-specific bundles и learning-quality evidence.
4. Сформировать новый RC, выполнить G12.5 clean-room requalification и
   independent review.
5. G13 archive/removal остаётся отдельной явно авторизованной волной; до неё
   старые repositories, entities, Docker resources, volumes и caches сохраняются.

