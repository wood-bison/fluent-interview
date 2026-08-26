# Fluent Interview — Vue-only migration plan

**Дата ревизии:** 2026-08-26  
**Статус:** migration closure complete; Vue-only runtime verified  
**Workspace:** `/Users/sergeyzhechko/developer/fluent-interview`

Этот документ заменяет старый pilot-план. Мы не поддерживаем два learner UI:
Vue 3 + Vite — единственная web-поверхность, а Nest/Lab остаётся владельцем
API, curriculum, progress, evidence и AI-boundary. Question Brain и Task Runtime
остаются отдельными сервисами с versioned HTTP-контрактами.

## Решение и границы

| Слой | Владелец | Канонический путь |
| --- | --- | --- |
| Web learner/operator UI | `fluent-engineering-vue` | `http://localhost:47350` |
| Learning API | `fluent-engineering-lab/apps/learning-api` | `http://localhost:47000` |
| Contracts/projections | `fluent-engineering-lab/libs/lab-contracts` | Nx library |
| Question source of truth | `fluent-question-brain` | `http://localhost:48127` |
| Execution authority | `fluent-task-runtime` | `http://localhost:48227` |

Удалены Angular app, Nx web libraries, browser e2e harness и соответствующие
зависимости. Старые исторические отчёты в `fluent-engineering-lab/reports/` и
`docs/production/evidence/` не являются runtime-кодом и не подключаются к
сборке; новые решения должны ссылаться только на Vue-пути.

## Сделано

- [x] Vue shell, router, tokens, reusable UI primitives и все learner/operator
  routes собраны в sibling workspace.
- [x] `/`, `/questions`, `/practice`, `/learning-map`, `/progress`, `/journal`,
  `/projects/*`, `/lab/*`, `/studio/*`, `/onboarding` и recovery fallback имеют
  реальные Vue views; aliases `/practice/questions` и `/practice/lab/*` тоже
  работают.
- [x] API client валидирует ingress/egress через Zod; runtime verdict остаётся
  server-owned, браузер только отображает evidence.
- [x] Canvas/trace/terminal/code-editor переведены на Vue-компоненты с
  keyboard/focus/reduced-motion контрактами и desktop overflow guards.
- [x] FE-01 curriculum переименован в Vue terminology:
  `fe01-vue-components`, `fe01-vue-reactivity`, `cap.vue-rendering` и
  `vue-browser`; старые framework IDs не используются в активном коде.
- [x] Удалены `apps/web`, `libs/code-editor`, `libs/route-graph-angular`,
  `libs/route-graph-core`, `internals/web-e2e`, Angular/Nx web packages и
  `@nestjs/schematics`/`@nx/nest` из Lab.
- [x] Production/package scripts, browser gates и bundle guards смотрят на
  `../fluent-engineering-vue/dist/apps/web`.
- [x] Lockfile пересобран: прямых и транзитивных Angular-пакетов нет.

## Доказательства последнего прогона

Команды выполняются из соответствующего репозитория:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-vue
pnpm check
pnpm e2e --workers=1

cd ../fluent-engineering-lab
pnpm check
node scripts/g9-deviation-gate.mjs --check

cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm production:check
pnpm package:local:test
pnpm package:local:lifecycle:test
pnpm g14:hardening:check
pnpm tier1:g524:operations
```

Подтверждённый результат финальной cleanup-волны (26 августа 2026): Vue E2E
**56/56** на MacBook Pro 16 light и Studio Display dark; Lab check — curriculum
drift 0, contracts **247 suites / 1,254 tests**, learning-api **166 suites /
717 tests** (1 intentional skip), observability **7 suites / 39 tests**.
Production check закрывает G0–G9 (136/136); G9 deviation gate — PASS; package
contract/lifecycle — **8/8** и **11/11**; G14 hardening — `valid: true` (13
benchmarks, 5 health checks); Tier-1 G5-24.06 operations — `valid: true`;
packaged local boundary поднят и readiness — **5/5 компонентов**.

Ключевые commits закрытия:

- Lab `114e9bd` — Vue стал единственным learner web runtime.
- Lab `8d2b792` — production gates, shared telemetry и Tier-1 evidence
  синхронизированы с Vue.
- Lab `78ec62a` — удалены последние Angular editor/recommendation hints из
  tracked developer tooling.
- Vue `345bc18` — standalone learner workspace с полным route surface.

## Результат закрытия

1. [x] Vue dist пересобран; G9 и production bundle gates проходят после
   удаления Angular-зависимостей.
2. [x] Vue `check` и E2E повторены на чистом lockfile; deep links, question
   detail, TaskFamily, Studio tabs и `/onboarding` проверены через live API.
3. [x] Packaged `pnpm package:local` smoke повторён; proxy отдаёт тот же Vue
   dist, readiness подтверждает Postgres, Redis, Task Runtime, Learning API и
   learner web.
4. [x] Release evidence обновлены: operational reports ссылаются на Vue build
   и не создают ложных Angular rollback claims.
5. [x] Последние gate/evidence изменения зафиксированы в Lab commits `114e9bd`
   и `8d2b792`; standalone Vue workspace зафиксирован commit `345bc18`.

Следующая работа — уже не миграция, а развитие учебного контента и platform
features поверх стабильной Vue boundary. Push не выполнялся автоматически:
это отдельная операция с внешним эффектом и делается по явному запросу.

## Правила на будущее

- Не добавлять второй frontend runtime или Angular-совместимый adapter.
- Не переносить вопросы, hidden tests или verdict в браузер.
- Новые UI-сценарии сначала получают route + typed projection + failure state,
  затем desktop keyboard/e2e proof.
- Mobile остаётся вне acceptance scope текущего desktop-first этапа.
- Любое изменение curriculum ID требует обновления source graph, release
  evidence и drift gate одним изменением.
