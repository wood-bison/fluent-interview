# Vue production playbook — Fluent Interview

Редакция: **2026-08-28**  
Владелец: `fluent-engineering-vue` (единственный browser-клиент)

Этот документ — рабочая инструкция для следующих волн разработки. Он фиксирует
не «модный набор библиотек», а проверяемые правила, которые сохраняют текущую
архитектуру: Lab владеет learner API, Brain — вопросами, Runtime — запуском,
Vue — только представлением и пользовательскими действиями.

## Текущий baseline

Проверенные pinned-версии в Vue workspace:

| Слой | Версия/решение | Правило |
| --- | --- | --- |
| Vue / build | Vue 3.5.41, Vite 8.2.2 | Composition API и `<script setup>`; route chunks lazy |
| Routing | Vue Router 5.2.0 | переходы только через именованные canonical routes |
| Client state | Pinia 4.0.3 | только UI/session preferences и локальный workflow state |
| Server state | TanStack Vue Query 5.102.4 | cache/invalidation для API; не дублировать ответы в Pinia |
| Boundary validation | Zod 4.4.3 | каждый внешний payload парсится до попадания в компонент |
| Styling | Tailwind CSS 4.3.3 + `@fel/design-tokens` | semantic `--fel-*` tokens; utility-классы не вводят новую палитру |
| Primitives | `@fel/ui`, Reka UI 2.10.4 | Reka используется только через наши обёртки, не напрямую из views |
| Verification | TypeScript 6, Vitest 4, Playwright 1.62 | unit/contract + desktop E2E на каждом release gate |

По состоянию W22 `pnpm check` и `pnpm e2e` зелёные; E2E содержит 102 сценария
на MacBook Pro 16 light и Studio Display dark. Это baseline, а не разрешение
объявить M3/M4 закрытыми.

## Правила реализации

### 1. Компонентная граница

- `apps/web/src/views` только композирует экран и вызывает composables.
- Повторяемое поведение выносится в `apps/web/src/components` или
  `apps/web/src/composables`; визуальные примитивы живут в `packages/ui`.
- Новый примитив сначала получает keyboard/focus/disabled/loading/error states,
  затем light/dark и reduced-motion проверки, и только после этого используется
  в view.
- Не добавлять второй набор button/dialog/select primitives. Если Reka
  закрывает задачу, обёртка `@fel/ui` должна скрывать vendor API и принимать
  только наши semantic props.

### 2. State ownership

```text
Question Brain / Runtime / Lab API
              ↓ Zod boundary
TanStack Query (server state + cache)
              ↓ derived computed state
Pinia (UI preferences, session controls)
              ↓
Vue components (render + user intent)
```

- В Pinia нельзя хранить копию QuestionCard, TaskRevision, evidence или
  verdict. Эти данные принадлежат server projections и должны инвалидироваться
  по release id.
- `mastered`, `passed` и другие verdict-поля никогда не вычисляются браузером.
- Каждый mutation имеет pending/error/retry state и связывает ответ с точным
  `taskFamilyKey`, revision и attempt.

### 3. Contracts и Zod

- Парсить ответ API в `packages/api-client` до возврата из метода клиента.
- Для пользовательских форм использовать `safeParse`, показывать field-level
  ошибки и сохранять введённое значение; не отправлять частично валидный
  payload.
- Любое изменение envelope требует синхронного изменения
  `packages/contracts`, consumer test и release evidence.
- Не использовать `as`, `any`, silent fallback или «последнюю доступную
  revision», чтобы скрыть несовместимость.

### 4. Routes и deep links

- Один route registry в `apps/web/src/router.ts`; aliases только с явной
  canonical redirect и тестом.
- Lazy route должен иметь loading, typed error/recovery и meaningful `h1`.
- Route → question → capability/family → exact revision → attempt должен
  передавать идентичность без повторного поиска по title.
- Новый route добавляется в route matrix до merge; stale/unpublished deep link
  должен fail closed и объяснять следующий шаг.

### 5. Design tokens и Liquid Glass

- Цвета, радиусы, spacing, типографика и motion берутся из
  `packages/design-tokens/tokens.css`; raw hex/px в view-scoped CSS запрещены,
  кроме документированных geometry exceptions.
- Glass применяется к toolbar, navigation, inspector и transient controls.
  Код, конспект, граф и таблицы остаются стабильными читаемыми поверхностями.
- Проверять контраст, `prefers-reduced-motion`,
  `prefers-reduced-transparency`, keyboard focus и 200% zoom.
- Не применять blur/opacity к тексту и editor content; это визуальный дефект,
  а не «стилистическое направление».

### 6. Формы, задания и runtime

- Выбранный язык виден рядом с TaskFamily и отражается в editor mode.
- `Run` disabled, пока нет валидного prediction/solution; ошибка runtime
  показывает recoverable action и не создаёт evidence.
- Hint/solution/AI остаются advisory и не могут закрыть deterministic gate.
- Все TaskFamily revisions показывают availability; `coming soon` не выглядит
  как runnable.

## Инструменты и их допустимая роль

| Инструмент | Использовать | Не использовать |
| --- | --- | --- |
| Reka UI | accessible primitives внутри `@fel/ui` | прямые vendor-компоненты в каждом view |
| shadcn-vue | как source pattern для composition и tokens | копировать компоненты без owner/test/token адаптации |
| Tailwind 4 | layout/variants поверх semantic tokens | отдельные arbitrary цвета и новый shadow language |
| Storybook | визуальный catalog после появления реальных primitives | заменять runtime E2E story fixtures вместо API |
| Vue Test Utils + Vitest | component/contract edge cases | считать snapshot доказательством UX |
| axe/Playwright | automated a11y + desktop interaction | заявлять mobile production, пока он вне scope |
| Module Federation / microfrontends | только после измеренного независимого deploy/runtime boundary | дробить один learner shell на remote chunks сейчас |

## Следующая очередь после W22

Порядок намеренно не перескакивает через M3:

1. **Human M3:** реальный ответ, spoken explanation, reflection и cold repeat
   через 48–72 часа; зафиксировать evidence от профиля Сергея.
2. **M4:** добавить owner/formula/release id и drill-down collection каждому
   counter; доказать одну inventory projection во всех consumers.
3. **Frontend syllabus:** оформить Vue/TypeScript/Reactives/Router/Query/UI
   как server-owned lessons и tasks, а не статическую страницу; привязать к
   существующему path graph.
4. **Component hardening:** внедрить Reka-backed wrappers только для реально
   повторяемых primitives, добавить VTU/Storybook/axe coverage и не ломать
   current E2E matrix.
5. **Package-mode drills:** прогнать полный matrix языков только через pinned
   Runtime images; результаты должны попасть в release evidence.
6. **Strict production:** создать настоящий remote для Vue, затем повторить
   strict verifier и human screenshot diff/sign-off.

## Gate перед merge

Из корня Vue:

```bash
pnpm check
pnpm e2e
```

Из umbrella:

```bash
pnpm release:verify:dev
git diff --check
```

Коммит допускается только при зелёном gate, чистых исходных деревьях и
обновлённом evidence. Strict production нельзя «починить» ослаблением
проверки, фиктивным remote или ручным изменением counters.

## Официальные ссылки

- [Vue `<script setup>`](https://vuejs.org/api/sfc-script-setup.html) и
  [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue tooling](https://vuejs.org/guide/scaling-up/tooling) и
  [testing](https://vuejs.org/guide/scaling-up/testing)
- [Vue Router typed routes](https://router.vuejs.org/guide/advanced/typed-routes)
- [TanStack Vue Query reactivity](https://tanstack.com/query/latest/docs/framework/vue/reactivity)
- [Zod](https://zod.dev/) и [Zod codecs](https://zod.dev/codecs)
- [Reka UI introduction](https://www.reka-ui.com/docs/overview/introduction) и
  [accessibility](https://www.reka-ui.com/docs/overview/accessibility)
- [shadcn-vue](https://www.shadcn-vue.com/docs/introduction)
- [Storybook Vue + Vite](https://storybook.js.org/docs/9/get-started/frameworks/vue3-vite)

