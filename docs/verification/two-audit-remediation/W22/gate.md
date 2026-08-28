# W22 — package-mode revalidation Vue и межрепозиторного контура

Дата: **2026-08-28**  
Статус: **технический PASS; strict promotion заблокирован только policy-gate remote Vue**

## Результат

Волна повторно проверила текущие `main`-состояния пяти репозиториев, живой
Vue-клиент и immutable local production package. Development release verifier
завершился `valid: true`: **56/56 шагов PASS, 0 предупреждений, 0 ошибок**.
Машинный отчёт сохранён в
[`release-verify-dev.json`](./release-verify-dev.json).

```text
pnpm release:verify:dev -- \
  --out=docs/verification/two-audit-remediation/W22/release-verify-dev.json
```

Первичный отчёт создан: `2026-08-28T12:23:02.266Z`; после package/provenance
фикса финальный development отчёт обновлён в `2026-08-28T13:40:08.382Z`.

После этого package был пересобран штатной командой `pnpm package:local` с
новым Vue provenance, а полный strict verifier завершил все исполнимые
проверки. Машинный результат сохранён в
[`release-verify-strict.json`](./release-verify-strict.json): `g14-hardening`,
`vue-e2e-package`, `package-language-drill`,
`route-question-attempt-package` и `m4-counter-drilldown-package` — PASS.
Итог strict `valid: false` содержит ровно один ожидаемый policy warning — Vue
репозиторий объявлен `local-only`.

## Что доказано

| Контур | Результат |
| --- | --- |
| Vue typecheck, ESLint, Vitest, Vite build | PASS через `vue-check` |
| Vue browser E2E | **102/102 PASS** |
| Desktop profiles | MacBook Pro 16 light + Studio Display dark |
| Package-mode browser E2E | **102/102 PASS** на `http://localhost:49300` |
| Package-mode runtime language drill | **6/6 PASS**, 24/24 checks; Node, TypeScript, Go, Java, C#, PostgreSQL |
| Route → question → family → revision → attempt | **PASS**: `question.q315` → `node-rate-limiter-001@1`; attempt persisted, Sergey hash unchanged |
| Counter provenance / drill-down | **12/12 PASS**: owner, formula, release/snapshot id и публичный API маршрут; значения пересчитаны по API |
| Route/API validation | route matrix, canonical aliases, schema и live validation PASS |
| Brain / Runtime | readiness HTTP 200; release join и negative boundary PASS |
| Content/placement | graph release, curriculum shape, placement, coverage/backlog, task bindings PASS |
| UI quality | accessibility smoke, desktop visual и regression guards PASS |
| Runtime failure matrix | PASS; retry/timeout/outage boundaries fail closed |
| Docker/package checks | image manifest, provenance и executable local package plan PASS |

## Что было закрыто в этой волне

- В Vue добавлен явный package-mode Playwright config
  [`playwright.package.config.ts`](../../../../fluent-engineering-vue/playwright.package.config.ts)
  и команда `pnpm e2e:package`. Конфигурация не поднимает второй сервер и не
  подменяет API: она проверяет тот же desktop matrix против порта immutable
  package `49300`.
- Package boundary пересобран штатным lifecycle-владельцем и получил operation
  `0de98ee2-88ba-4500-b436-6fda6ff8cee5`; состояние `ready`, package-managed,
  readiness всех пяти компонентов и verified backup — `true`.
- `workspace.yaml` обновлён на фактический Lab `ba495d657b7576b04718e3f09b6f1767924dc7bc`
  и Vue `ea2b0b7108a22a7e4d13130eb5ac4b2f5bc89e0d` commits, поэтому provenance
  больше не drift'ит. Подтверждённый stale lock предыдущей завершённой
  операции удалён;
  данные и контейнерные volumes не удалялись.
- Strict release verifier теперь включает `vue-e2e-package` после G14. Это
  постоянный release guard, а не одноразовый ручной прогон.
- `package-language-drill` выполняет все пять кодовых ревизий общего
  `task-family.rate-limiter` и отдельную PostgreSQL SQL-ревизию через package
  Learning API. Все шесть ответов получили HTTP 201 и 4/4 теста; stable
  progress hash профиля Сергея не изменился. Машинные hash-only evidence:
  [`package-language-drill.json`](./package-language-drill.json) и
  [`package-language-drill.md`](./package-language-drill.md).
- `route-question-attempt-drill` одним вызовом проверяет server-owned join от
  learner route через published Question Brain relation и точную
  `TaskFamily/revision` до сохранённой попытки. `question.q315` корректно
  связан с `node-rate-limiter-001`, попытка получает 4/4 PASS, а stable
  progress hash Сергея остаётся неизменным. Evidence:
  [`route-question-attempt.json`](./route-question-attempt.json) и
  [`route-question-attempt.md`](./route-question-attempt.md).
- `m4-counter-drilldown-gate` проверяет все 12 счётчиков Product Inventory:
  owner/formula/release provenance не расходятся, каждый drill-down отвечает
  HTTP 200, а значение совпадает с независимой агрегацией публичного map,
  Question Brain, Runtime, Coverage и Curriculum Progress API. Evidence:
  [`m4-counter-drilldown.json`](./m4-counter-drilldown.json) и
  [`m4-counter-drilldown.md`](./m4-counter-drilldown.md).

Отдельный `pnpm --dir fluent-engineering-vue e2e` также завершился **102/102
PASS**. В набор входят scroll owner и 200% zoom, RU/EN × light/dark,
keyboard-only вход, route matrix, question/detail, TaskFamily language
selection, Event Loop run/recovery, AI outage, history/attempt persistence и
browser console guards.

## Граница, которую волна не закрывает

Это техническая revalidation, а не новый release claim:

1. Strict promotion остаётся `false` только из-за настоящего доверенного
   remote для `fluent-engineering-vue`; `local-only` нельзя заменять выдуманным
   URL. После появления remote нужно обновить его адрес в `workspace.yaml`,
   push'нуть `ea2b0b7` и повторить strict verifier.
2. M3 остаётся `ACTIVE / WAITING_HUMAN`: нужны реальный ответ Сергея,
   spoken explanation, reflection и cold repeat через 48–72 часа.
3. M4 и последующие gates не переводятся в `DONE` только на основании E2E.
   Counter drill-down теперь закрыт технически в W22; Vue-native syllabus,
   human screenshot sign-off и полная curriculum/task-portfolio closure
   остаются в очереди. Package-mode multi-language runtime drill закрыт
   технически, но не заменяет эту curriculum closure.

## Репродуцируемость и чистота

- Проверялись pinned `main`-коммиты: Lab `ba495d6`, Vue `ea2b0b7`, Runtime
  `6b09771`, Brain `9f02c92`, Vault `f4d4622`.
- Изменения этой волны ограничены package E2E/language-drill и
  route/question/attempt drill contracts, release-gate wiring и provenance
  pin; Question Brain, Runtime и learner data не менялись.
- Сгенерированные timestamped evidence-файлы от verifier не являются
  изменением поведения; W22 отчёты сохранены отдельно и проходят
  `git diff --check`.
- Следующий допустимый шаг — закрыть один из честных внешних барьеров (создать
  реальный Vue remote или провести human M3-сессию), затем повторить strict
  gate; не ослаблять проверки и не переименовывать статусы.
