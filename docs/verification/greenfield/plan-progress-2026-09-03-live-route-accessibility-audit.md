# Live route и accessibility audit — 3 сентября 2026

## Граница проверки

Проверка выполнена после локального target-коммита `abad4585c8489a1cebf5edb3bf7443421c581e60` (`fix(g10s): make revalidation CLI use canonical defaults`). Umbrella stack поднят штатно из корня:

```text
pnpm dev
```

Приложение отвечало на `http://localhost:47350/`; Question Brain, Task Runtime,
Lab API и Postgres/Redis были healthy. Проверка браузера была read-only для
содержимого: не запускались learner experiments, не отправлялись AI-запросы,
не менялись owner inputs и release pointers.

## Live route smoke

Из основных learner-экранов собраны все same-origin ссылки, включая preview,
lab, lesson, question, project и Studio hand-offs. Результат:

- **114/114** внутренних ссылок открыли страницу без ошибки навигации;
- **0** страниц без `main` landmark;
- `/questions/Q1062` после ожидания API отрисовал каноническую карточку с `h1` и
  без `role=alert`;
- legacy hand-offs редиректят на канонические пути: `/practice/questions` →
  `/questions`, `/practice/lab/*` → `/lab/*` (7 алиасов, включая Event Loop);
- все проверенные lab/lesson/project маршруты имеют заголовок и непустой
  контент. Слова `failure/error` в доменном тексте не считались 404 — это не
  ошибка маршрута.

Ключевые интерактивные проверки на `/questions` и `/lab/node-event-loop-001`:

- серверный поиск `event loop` уменьшил выборку до **29**, `Сбросить` вернул
  корпус **1591**;
- `Показать ещё` увеличил выдачу с 24 до **48** карточек;
- lab содержит **6** последовательных challenge-задач, code editor,
  prediction textarea, terminal, trace/evidence и подсказки;
- на `/questions` основной контейнер `.fel-main` имеет `clientHeight=660`,
  `scrollHeight=5249`; `scrollTop` изменился `0 → 480`, то есть вертикальный
  scroll работает внутри приложения, несмотря на `body { overflow: hidden }`;
- RU → EN → RU меняет заголовок без смены маршрута; light → dark меняет
  `data-theme` и `color-scheme`, затем состояние восстановлено в light;
- штурман открывается как правый dock `416×660` при viewport `1280×720` и
  закрывается кнопкой `aria-label="Закрыть"`;
- настройки AI открываются отдельным modal `576×448`; локальная модель не
  вызывалась.

## Независимый machine accessibility gate

Команда запускалась на disposable stack с временным output, чтобы не менять
tracked evidence:

```text
node tools/design/accessibility-audit.mjs /tmp/fluent-accessibility-audit-2026-09-03.json
```

Результат: **`PASS_WITH_LIMITATIONS`**, `G12-021`.

- curated learner surface: **23/23** маршрута pass;
- source guards: skip-link, `:focus-visible`, reduced-motion,
  reduced-transparency, `<main>`, `<nav>`, named controls — **7/7**;
- positive `tabindex`: **0**;
- controls: **723/723 named**, unnamed **0**;
- token contrast: **27/27**, light/dark/system — **PASS**;
- human VoiceOver/NVDA smoke и browser-specific focus painting остаются
  отдельным ограничением, как и post-hydration visual review.

Disposable stack остановлен штатным `node tools/stack/cli.mjs down --json`;
`durableDataPreserved=true`. Другие контейнеры, старые репозитории, данные и
кэши не удалялись.

## Что не закрыто этим audit

Это не новая owner acceptance и не promotion. `G10S-246` по-прежнему fail-closed:

- reviewed packet head: `008703c769a37434b10ca198059109140d6fcc91`;
- текущий target head: `abad4585c8489a1cebf5edb3bf7443421c581e60`;
- closure failure: `git:post-snapshot-non-metadata`;
- `G11` breadth, serving и release pointer остаются заблокированы до новой
  current-main revalidation и owner review.

Следующий разрешённый порядок не меняется: свежая G10S-246 revalidation →
bounded G11-P001 authoring/review → G11.2–G11.6 → G12.3/G12.2 → immutable RC
и remote attestation → G12.5 human requalification → independent sign-off.
G13 cleanup по-прежнему требует отдельной явной owner authorization.
