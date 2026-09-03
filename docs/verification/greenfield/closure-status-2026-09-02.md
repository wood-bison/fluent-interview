# Честная граница закрытия — 2 сентября 2026

## Итог

Платформа не находится «на 58%». Этот формальный процент включает постоянные
правила и отложенный destructive cleanup. Актуальный срез:

| Срез | Закрыто | Осталось | Всего | Готовность |
| --- | ---: | ---: | ---: | ---: |
| Product closure | 658 | 79 | 737 | 89,28% |
| Product + final requalification, без удаления | 658 | 134 | 792 | 83,08% |
| Decommission, запрещённый владельцем | 0 | 150 | 150 | отложен |
| Standing policy | 0 | 192 | 192 | не является очередью задач |

Источник счётчиков: `pnpm plan:progress:json` в umbrella workspace.

## Что проверено на текущем приложении

Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`, `main`,
`a6c1c75e266880f35cd8dc99f963b76473d8fa35`.

Live-проход через Browser по 12 обязательным маршрутам подтвердил:

- 12/12 маршрутов открываются и содержат основной learner/operator surface;
- 12/12 не создают document-level horizontal overflow в проверенном viewport;
- на всех маршрутах присутствует ровно один основной `main`, кроме `/`, где во
  время server recovery одновременно наблюдались loading и ready regions;
- console warning/error — 0;
- `/control-center` сообщает о готовности локальных сервисов;
- каталог вопросов показывает 6 released cards, Practice — executable Event
  Loop challenge 1/6, Projects — Node, Java, Go и Next.js project books.

Это route-level smoke, а не human visual sign-off всех 71 состояний.

## Реальный блокер

`G10S-246` owner packet остаётся `AWAITING_OWNER`, но закреплён на target HEAD
`6e5314914baad976f0fb03b610a4a00269f8111b`. Текущий `main` на 44 коммита
впереди. Revalidation намеренно требует exact HEAD и поэтому не позволит
подписать устаревший snapshot.

Правильная короткая последовательность:

1. одним consolidated прогоном обновить 71 interaction/visual/semantic state
   evidence и owner packet для текущего immutable HEAD;
2. показать владельцу 12 маршрутов одной сессией;
3. получить одно сообщение «принять все» либо список исключений;
4. материализовать 12 dispositions и выполнить strict revalidation;
5. закрыть 79 G11/product checks пакетами, затем 55 final checks;
6. G13 не выполнять до отдельной авторизации удаления.

## Что не следует обещать

- Нельзя назвать продукт 100% завершённым до owner sign-off и G11 breadth.
- Нельзя считать 1 597 PREP_ONLY записей reviewed/released автоматически.
- Нельзя подписать старый G10S-246 packet для нового HEAD.
- Нельзя включать 150 G13 пунктов в активную очередь, пока удаление запрещено.

После refresh packet минимальный human input — одно принятие 12 экранов или
только список исключений. Всё остальное выполняется агентом и проверяется
машинными gate.

## Вход владельца — 3 сентября 2026

Владелец прислал единое решение:

> Принимаю все 12 экранов текущей версии.

Решение записано в target-репозитории в
`docs/verification/greenfield/G10S-inputs/G10S-246-owner-acceptance-intent-2026-09-03.md`.
Оно покрывает scope всех 12 экранов (71 состояние), но не подменяет строгую
валидацию: текущий packet всё ещё содержит snapshot старого HEAD. Поэтому
`G10S-246` остаётся `AWAITING_OWNER` до обновления evidence/registry и
материализации 12 явных `ported|adapted` dispositions для нового HEAD.

Массовое наполнение вынесено в отдельный
[`CURRICULUM-CONTENT-EXPANSION-PLAN-2026-09-02.md`](../../CURRICULUM-CONTENT-EXPANSION-PLAN-2026-09-02.md): это ускоряет platform
closure, но не объявляет G11 закрытым.
