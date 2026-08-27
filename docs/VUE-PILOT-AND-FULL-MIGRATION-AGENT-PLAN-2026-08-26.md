# Fluent Interview — Vue-only migration plan

**Дата ревизии:** 2026-08-26  
**Статус:** Vue-only route/API boundary verified; feature parity with Angular is **not yet complete**
**Workspace:** `/Users/sergeyzhechko/developer/fluent-interview`

> **Status correction (26 августа 2026).** Предыдущая формулировка «migration
> closure complete» была слишком сильной. Коммит `114e9bd` действительно сделал
> Vue единственным web runtime и удалил Angular surface, но это не был
> feature-by-feature перенос: одним шагом исчезло 526 файлов (1 955 добавлений,
> 98 309 удалений), включая старые Program/Atlas/Studio/Question Brain и
> browser harness. Vue commit `345bc18` создал самостоятельный pilot с рабочими
> route/API flows, но не полным поведенческим паритетом. Текущая цель —
> восстановить P0/P1 parity поверх Vue, не выдавая route coverage за готовый
> production learner продукт. Подробная матрица: `fluent-engineering-vue/docs/ANGULAR-VUE-PARITY-AUDIT-2026-08-26.md`.

> **Актуализация 27 августа 2026.** После baseline исправлены exact
> TaskFamily revision propagation, fail-closed path actions, progressive
> loading states, taxonomy ordering, актуальные Lab CI workflow и digest pins
> для Compose/task images. Vue E2E теперь стабильно проходит 72/72 при двух
> workers. Production package теперь сохраняет component provenance пяти
> shipped Git roots (revision, clean/dirty и tree digest), поэтому P0-03 закрыт;
> Vue по-прежнему `local-only`, а
> production-only `g14` требует package API на 49301 и не считается PASS в
> dev-профиле (последний запуск выявил readiness/trace/SLO gaps). См.
> [`FULL-PLATFORM-DEEP-AUDIT-AND-REMEDIATION-PLAN-2026-08-26.md`](FULL-PLATFORM-DEEP-AUDIT-AND-REMEDIATION-PLAN-2026-08-26.md).

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

Подтверждённый результат route/API parity baseline (26 августа 2026) и
повторной remediation-проверки (27 августа 2026): Vue E2E **72/72** на MacBook
Pro 16 light и Studio Display dark; Lab check — curriculum
drift 0, contracts **247 suites / 1,255 tests**, learning-api **167 suites /
727 tests** (1 intentional skip), observability **7 suites / 39 tests**.
Targeted revision/taxonomy tests и `practice:health`/G13 — PASS; digest/static
image checks — PASS. Production-only `g14` и packaged release не объявляются
зелёными из dev-профиля: package readiness/trace/SLO evidence требует отдельного
запуска на 49301 и свежего operational snapshot.

Ключевые commits закрытия:

- Lab `114e9bd` — Vue стал единственным learner web runtime.
- Lab `8d2b792` — production gates, shared telemetry и Tier-1 evidence
  синхронизированы с Vue.
- Lab `78ec62a` — удалены последние Angular editor/recommendation hints из
  tracked developer tooling.
- Lab `f2cb172` — удалена последняя Angular cache-ignore запись из tracked
  tooling configuration.
- Vue `345bc18` — standalone learner workspace с полным route surface.

## Результат route/API boundary (не feature parity)

1. [x] Vue dist пересобран; G9 и production bundle gates проходят после
   удаления Angular-зависимостей.
2. [x] Vue `check` и E2E повторены на чистом lockfile; deep links, question
   detail, TaskFamily, Studio tabs и `/onboarding` проверены через live API.
3. [ ] Packaged `pnpm package:local` smoke повторён в production-профиле; dev
   proxy и local Compose работают, но это не доказательство package readiness.
4. [ ] Release evidence обновлены: operational reports ссылаются на Vue build
   и не создают ложных Angular rollback claims.
5. [ ] Последние gate/evidence изменения зафиксированы в Lab commits `114e9bd`
   и `8d2b792`; standalone Vue workspace зафиксирован commit `345bc18`.

Следующая работа — P0/P1 восстановление learner/Studio поведения: canonical
navigation registry, полный Program/Atlas action matrix, Questions review
modes, Studio Graph/Review/System, и только затем production closure. Push не
выполняется автоматически: это отдельная операция с внешним эффектом и
делается по явному запросу.

### Parity wave 1 (26 августа 2026)

- [x] `PRIMARY_NAVIGATION` и utility routes вынесены в единый Vue registry;
  shell использует его для ссылок и active-state, поэтому IA не расходится с
  router.
- [x] Question Brain learner index получил реальные release-метрики и
  cursor-пагинацию (`24 → 48 → …`), без подмены полного корпуса первой
  страницей.
- [x] `/questions` передаёт backend все поддержанные server-owned filters:
  execution mode, readiness, due/weak, stage, capability, question type,
  language layer и mastery. Пустой срез остаётся объяснимым empty state.
- [x] Smoke/E2E добавляет проверку пагинации и фильтра и завершён с
  результатом **72/72** на MacBook Pro 16 light и Studio Display dark.
- [x] Live manual matrix прошёл все learner/Studio deep-links, позитивный и
  негативный Event Loop run, AI fallback, scroll owner и переключение тем.

Оставшийся P0 — полноценный recall/saved-view workflow из Angular, а также
write-boundary Studio; их нельзя объявлять реализованными только потому, что
read-only projection уже отображается.

## Правила на будущее

- Не добавлять второй frontend runtime или Angular-совместимый adapter.
- Не переносить вопросы, hidden tests или verdict в браузер.
- Новые UI-сценарии сначала получают route + typed projection + failure state,
  затем desktop keyboard/e2e proof.
- Mobile остаётся вне acceptance scope текущего desktop-first этапа.
- Любое изменение curriculum ID требует обновления source graph, release
  evidence и drift gate одним изменением.

### Verification wave 2026-08-27

Последний непрерывный прогон обновил фактические browser и release guards:

- Vue E2E: **72/72** на MacBook Pro 16 light и Studio Display dark; добавлены
  global-English smoke для core и secondary learner/project surfaces;
- Vue `pnpm check`: typecheck, lint (0 errors), 11 Vitest tests и Vite build;
- Lab `pnpm check`: drift valid, 247 suites / 1,255 contract tests, learning-api
  167 suites (727 passed, 1 intentional skip), observability 7 suites / 39;
- accessibility smoke: 10 routes, `main.fel-main` как scroll owner, 0
  horizontal overflow и 0 unlabeled controls;
- desktop visual baseline: 12 states, 81 map rows, readable floor ≥12px;
- desktop regression guard: Vue artifact, 37 chunks, initial 257,023 bytes,
  largest lazy 331,270 bytes;
- semantic placement/G12/G13/G9/practice-health/curriculum smoke — PASS;
- published Docker Ordering Lab и systems scenario покрыты server-owned
  source/content/runtime contracts; drafts fail closed.

`pnpm package:local` по-прежнему намеренно блокируется на dirty source
(`package.dirty-source`), а G14 не объявляется зелёным без чистой release
boundary. Это provenance guard, а не причина обходить проверку.

### Locale and accessibility hardening wave (27 августа 2026)

- [x] Shared `FelDialog` close control receives a locale-aware accessible
  name; the shell navigation landmark uses the same locale contract.
- [x] Practice, Questions, Atlas and TaskFamily route-owned chrome follows the
  global RU/EN preference, while server-authored titles and answer bodies stay
  owned by their released projections.
- [x] English smoke covers the four core learner surfaces on both target
  desktop projects.
- [x] Route-owned dictionaries now cover Projects, Studio, onboarding,
  progress/journal, failure states, question detail, project readers and
  recovery; server-authored titles/bodies remain projection-owned by design.
  P2-14 is closed for the current Vue learner shell, with the EN secondary
  surface smoke protecting the contract.
- [x] Shared runtime picker localizes its pending/empty option suffixes, and
  Question detail uses the selected locale for linked TaskFamily titles.

### Release-aware deep-link wave (27 августа 2026)

- [x] `LessonView` проверяет опубликованный Program map до запроса конспекта;
  темы без authored `hasTheory` получают явную unavailable boundary вместо
  каскада 404.
- [x] `QuestionDetailView` использует released Question Brain lookup перед
  detail/content/relations, поддерживает legacy `Q1062 → question.q1062` и
  показывает честную pending boundary для неопубликованного ID.
- [x] Lab readiness contracts больше не считают любой `execution: concept`
  готовым уроком; это синхронизировано в Program, Progress, Topic Workspace и
  diagnostics projection.
- [x] SQL и ordering projections передают полный typed runtime/release
  contract, включая `published`; draft station не притворяется runnable.
- [x] E2E добавил stale deep-link regression и deterministic EN locale для
  question answer-layer сценария.
- [x] Проверено: Vue E2E **72/72**, Lab **247 suites / 1,255 tests**, полный
  crawl **466 routes в каждом desktop-профиле / 0 failures**, a11y/visual/performance/G9/G13 PASS.

### Multi-repository package provenance wave (27 августа 2026)

- [x] `local-production-package` фиксирует Lab, Vue, Task Runtime, Question
  Brain и Question Vault как один provenance tuple.
- [x] Install manifest, lifecycle state и last-known-good boundary сохраняют
  revision, clean/dirty и Git tree digest каждого shipped root без абсолютных
  путей и секретов.
- [x] Ownership/rollback отвергают boundary с изменённым Vue/runtime/content
  tree; dirty любой child root оставляет package fail-closed.
- [x] Package unit/lifecycle regression и общий desktop/browser gate повторно
  пройдены; G14 ожидает только reviewed clean handoff и immutable remote pins.

Граница миграции остаётся прежней: production package/G14 требует clean
reviewed child revisions и не может быть выведен из dev-профиля. Commit/push
этой волны выполняется только после отдельного явного запроса.
