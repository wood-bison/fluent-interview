# Прогресс мастер-плана — именованные scroll/support-группы

Дата среза: 1 сентября 2026
Target: `fluent-interview-platform/main`
Implementation: `65700017df78d03c87ad52fe888bd5318d956345`
Evidence: `6b90fd9f1faeaae4eb8cf6d57216d813b9723c4a`

## Закрытая волна

Семантическая accessibility-проверка завершена. Контейнеры route graph legend,
route graph scroll, Deep Lab facets, runtime filebar, runtime support panels и
Atlas viewport теперь имеют `role="group"` и locale-owned `aria-label`. Route
graph scroll и Atlas viewport фокусируемы (`tabIndex=0`). Визуальный CSS и
layout не менялись, поэтому frozen G10S-205 source-set hash не нарушен.

## Доказательства

- штатный scoped стек после `pnpm down && pnpm dev -- --detached`:
  `http://127.0.0.1:47360/`, session
  `9c767f52-701f-44ea-b3b5-5ad81b784368`;
- RU и EN live-маршруты home, practice, event-loop lesson и Atlas показали все
  шесть именованных групп без bilingual slash-captions;
- web regression **77/77**;
- `NX_CI=1 pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check` — PASS;
- стек: **6/6**, migrations **18/18**, pending **0**;
- evidence index: **428/428** historical records, metadata-only;
- database/docker mutations и remote push не выполнялись.

## Счётчик

По `pnpm plan:progress:json` мастер-план сейчас:

**658 checked / 476 remaining / 1134 total / 58,02%**.

Семантическая волна не добавляет учебный контент и не меняет curriculum
progress, поэтому числа неизменны.

## Следующая очередь

1. `G10S-246` — human owner acceptance для локального production path.
2. `G11` — breadth: покрытие тем, языков, generic/native связей и task depth.
3. `G12.5` — повторяемая финальная release-проверка с независимым reviewer.
4. Независимая финальная верификация полного greenfield-переезда.
5. `G13` — controlled cleanup/decommission старых репозиториев и артефактов.

Каждый следующий corrective slice должен сохранить commit → evidence → plan
цепочку и не объявлять эти границы закрытыми без проверяемого артефакта.
