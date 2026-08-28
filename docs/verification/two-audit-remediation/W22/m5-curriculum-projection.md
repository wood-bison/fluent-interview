# W22 — Path → Domain → Capability projection gate

Дата: **2026-08-28**
Статус: **PASS в development и immutable package**

`m5-curriculum-projection-gate.mjs` читает server-owned
`GET /api/program/map` и не создаёт новые связи на клиенте. Для каждой
опубликованной записи он проверяет:

- release status и наличие опубликованного графа;
- уникальные Path keys и точные `entryRoute` (`/paths/<slug>`);
- разрешимость и уникальность каждого `curriculumAreaIds` в списке доменов;
- уникальные station IDs и допустимые learner routes
  (`/practice/lesson|lab/<id>`);
- непустую capability label для каждой станции;
- отсутствие коллизий в детерминированных `capability.<NFKD-slug>` keys.

| Запуск | API | Результат |
| --- | --- | --- |
| development | `http://127.0.0.1:47000` | **237/237 PASS** |
| immutable package | `http://127.0.0.1:49301` | **237/237 PASS** |

Проверены 9 путей, 15 доменов, 81 станция и 47 capability keys. Это
технический контракт проекции, а не утверждение, что M5 формально закрыт:
independent review и human screenshot sign-off остаются обязательными.
