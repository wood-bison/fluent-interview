# W22 — package-mode revalidation Vue и межрепозиторного контура

Дата: **2026-08-28**  
Статус: **технический PASS; strict promotion заблокирован только policy-gate remote Vue**

## Результат

Волна повторно проверила текущие `main`-состояния пяти репозиториев, живой
Vue-клиент и immutable local production package. Development release verifier
завершился `valid: true`: **55/55 шагов PASS, 0 предупреждений, 0 ошибок**.
Машинный отчёт сохранён в
[`release-verify-dev.json`](./release-verify-dev.json).

```text
pnpm release:verify:dev -- \
  --out=docs/verification/two-audit-remediation/W22/release-verify-dev.json
```

Первичный отчёт создан: `2026-08-28T12:23:02.266Z`; после package/provenance
фикса финальный development отчёт обновлён в `2026-08-28T12:43:16.766Z`.

После этого package был пересобран штатной командой `pnpm package:local` с
новым Vue provenance, а полный strict verifier завершил все исполнимые
проверки. Машинный результат сохранён в
[`release-verify-strict.json`](./release-verify-strict.json): `g14-hardening` и
`vue-e2e-package` — PASS; итог strict `valid: false` содержит ровно один
ожидаемый policy warning — Vue репозиторий объявлен `local-only`.

## Что доказано

| Контур | Результат |
| --- | --- |
| Vue typecheck, ESLint, Vitest, Vite build | PASS через `vue-check` |
| Vue browser E2E | **102/102 PASS** |
| Desktop profiles | MacBook Pro 16 light + Studio Display dark |
| Package-mode browser E2E | **102/102 PASS** на `http://localhost:49300` |
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
  `142e93c7-125a-4e47-8ba7-3875258b8bfe`; состояние `ready`, package-managed,
  readiness всех пяти компонентов и verified backup — `true`.
- `workspace.yaml` обновлён на фактический Vue commit
  `ea2b0b7108a22a7e4d13130eb5ac4b2f5bc89e0d`, поэтому provenance больше не
  drift'ит. Подтверждённый stale lock предыдущей завершённой операции удалён;
  данные и контейнерные volumes не удалялись.
- Strict release verifier теперь включает `vue-e2e-package` после G14. Это
  постоянный release guard, а не одноразовый ручной прогон.

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
3. M4 и последующие gates не переводятся в `DONE` только на основании E2E;
   counter drill-down, package-mode multi-language drills, Vue-native syllabus
   и human screenshot sign-off остаются в очереди closure plan.

## Репродуцируемость и чистота

- Проверялись pinned `main`-коммиты: Lab `5c6eef8`, Vue `ea2b0b7`, Runtime
  `6b09771`, Brain `9f02c92`, Vault `f4d4622`.
- Изменения этой волны ограничены package E2E contract, release-gate wiring и
  provenance pin; Question Brain, Runtime и learner data не менялись.
- Сгенерированные timestamped evidence-файлы от verifier не являются
  изменением поведения; W22 отчёты сохранены отдельно и проходят
  `git diff --check`.
- Следующий допустимый шаг — закрыть один из честных внешних барьеров (создать
  реальный Vue remote или провести human M3-сессию), затем повторить strict
  gate; не ослаблять проверки и не переименовывать статусы.
