# Plan progress — G10S-008

Дата: 1 сентября 2026

## Снимок

- Проверено: **658**
- Осталось: **476**
- Всего: **1134**
- Прогресс: **58,02%**

Счётчик получен командой `pnpm plan:progress:json` из корня umbrella
репозитория после отметки `G10S-008` в мастер-плане. Это счётчик чекбоксов,
а не утверждение о production readiness: открытые human, breadth и release
gates остаются явными.

## Закрытый срез

`G10S-008` закрыт локальным target-коммитом
`fluent-interview-platform@6179a77`:

- `pnpm run dev` поднял scoped Compose project
  `fluent-interview-platform-dev` на `http://127.0.0.1:47360/`;
- migrations `18/18`, pending `0`, ожидаемые сервисы `6/6` (5 healthy и
  `api-data-init` exited `0`);
- read-only `/`, `/studio`, `/api/studio/releases/active` и `/api/studio` —
  HTTP `200`;
- Studio state: `1` candidate, `1` review, `1` release, `3` audit events и
  `3` command receipts;
- изолированный `pnpm studio:postgres-journey` — PASS: replay stable,
  readback verified, retired endpoints `410`, disposable resources удалены;
- строгая лестница `pnpm check`, `pnpm boundary:check`,
  `pnpm toolchain:check` — PASS; push не выполнялся из-за Actions quota.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-008-studio-baseline-2026-09-01.{json,md}`.

## Коррекция после live-аудита

В ходе проверки языковых дорожек найден и исправлен отдельный defect в
learner observability projection: `/practice` раньше показывал весь каталог
на Node, Java и Go. Локальные target-коммиты без push:

- `fa3979d` — фильтр `observabilityScenariosForTrack(trackId)` в domain и
  learner route плюс regression test;
- `aecce6b` — metadata-only evidence с browser DOM-проверкой.

Проверенный результат: Node — 2 собственных сценария, Java — 2, Go — 2;
`0` cross-language scenarios, `0` alerts, счётчики planned/released совпадают
с каталогом. Полный target ladder после исправления зелёный. Общий счётчик
мастер-плана не изменён: это исправление качества уже закрытого G10S-194, а не
новый curriculum checkbox.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-194-observability-track-filter-2026-09-01.{json,md}`.

## Коррекция контекста placement в Questions

После предыдущей live-проверки найден отдельный defect: запрос только с
`lesson=java-http` мог выбрать карточку Java, но взять первое (Node.js)
placement и построить неправильный deep link. Исправление закоммичено локально
в target `main`:

- `7620388` — единый `track + lesson` predicate и contextual selector в
  `/questions`;
- `67991d0` — metadata-only G10S-198 corrective evidence.

Live после штатной пересборки `pnpm run dev -- --detached`:

- `/questions?lesson=java-http` → `java · java-http` и Java lesson link;
- `/questions?lesson=go-http` → `go · go-http` и Go lesson link;
- `/questions?track=node&lesson=java-http` → `0` карточек и no-match state.

Source guard, focused placement tests `7/7`, web smoke `54/54`, route/content
gates, `NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` —
`PASS`. Общий счётчик не изменён: это исправление уже существующего
G10S-198 seam, а не новая учебная ёмкость.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-198-question-placement-context-2026-09-01.{json,md}`.

## Коррекция контекста Atlas

В live-аудите найден ещё один misleading fallback: неизвестные `track` или
`node` в `/atlas` silently открывали Node/первый модуль. Это нарушало правило
«deep link должен показывать именно запрошенный контекст» и могло незаметно
перенаправить учебную сессию на чужой путь.

Локальные target-коммиты без push:

- `eafcbf6` — Atlas fail-closed для неизвестного track/node и canonical URL
  после выбора стартовой станции;
- `5777f42` — metadata-only evidence и live-case receipts.

Проверены четыре состояния на scoped stack `http://127.0.0.1:47360/`: Java
service selection, invalid track (`TRACK NOT FOUND`), invalid node (`MODULE NOT
FOUND`) и обычный Node runtime. Source guard, web regression `55/55`, build и
строгая лестница `NX_CI=1 pnpm check`, `pnpm boundary:check`,
`pnpm toolchain:check` — `PASS`. Исправление не добавляет учебный контент и
поэтому не меняет снимок **658 / 476 / 1134 / 58,02%**; G10S-246 и G11
остаются открытыми.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/atlas-route-context-correction-2026-09-01.{json,md}`.

## Коррекция контекста learner track

Повторная проверка deep links нашла общий fallback-дефект: неизвестный
`track` в `/program`, `/practice` и workbench мог незаметно показывать Node, а
lesson lookup мог перескочить на placement другой дорожки. Это исправлено
локальным target-коммитом без push:

- `d56479d` — fail-closed `TRACK NOT FOUND`, строгая фильтрация
  `track → lesson → placement` и отсутствие cross-track fallback;
- `f437f46` — metadata-only evidence с шестью live-case и результатами
  регрессионных проверок.

После пересборки scoped stack `http://127.0.0.1:47360/` проверены обычный Node
маршрут, unknown track в трёх learner surfaces, несовместимый Node+Java
lesson и валидные Java program/lesson. Focused `8/8`, web smoke `56/56`,
`NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` — `PASS`.
Неверные deep links теперь объясняются recovery/no-match state, а не
подменяются другим языком.

Это corrective seam, поэтому снимок остаётся **658 / 476 / 1134 / 58,02%**;
учебная ёмкость не добавлена. G10S-246 и G11 по-прежнему открыты.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/learner-track-context-correction-2026-09-01.{json,md}`.

## Коррекция module-контекста Program

Live-аудит нашёл ещё один misleading fallback: неизвестный `module` в
`/program?track=…&module=…` незаметно открывал первый модуль трека. Это
исправлено локальными target-коммитами без push:

- `2fdf865` — explicit module matching и двуязычный `MODULE NOT FOUND`;
- `93c8a4a` — metadata-only evidence и live receipts.

Проверены invalid URL `module=missing-module` (recovery, первая глава не
подменена) и valid `module=node-runtime` (выбранный модуль отображён).
Source guard, web smoke `50/50`, `NX_CI=1 pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` — `PASS`.

Это исправление deep-link маршрутизации, а не новая учебная ёмкость; снимок
остаётся **658 / 476 / 1134 / 58,02%**. G10S-246 и G11 остаются открытыми.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/program-module-context-correction-2026-09-01.{json,md}`.

## Коррекция mode-контекста Practice

Live-аудит нашёл silent fallback в `/practice`: явный неизвестный `mode`
превращался в `all`, поэтому deep link мог показать лишние practice entries.
Исправление и evidence сделаны локально, без push:

- `0055b80` — explicit mode matching и двуязычный `MODE NOT FOUND` recovery;
- `bc5041f` — metadata-only evidence с invalid/valid live cases.

На scoped stack `http://127.0.0.1:47360/` invalid
`mode=missing-mode` остаётся в recovery и не подменяется All entries, а valid
`mode=controlled-lab` открывает контролируемый entry point. Web smoke `51/51`,
source guard, `NX_CI=1 pnpm check`, `pnpm boundary:check` и
`pnpm toolchain:check` — `PASS`.

Это исправление маршрутизации, а не новая учебная ёмкость: снимок остаётся
**658 / 476 / 1134 / 58,02%**. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/practice-mode-context-correction-2026-09-01.{json,md}`.

## Коррекция locale-контекста

Live-аудит нашёл silent fallback: неизвестный явный `locale` в Questions и
Lesson молча становился English. Это исправлено локальными коммитами без push:

- `8d09b8d` — централизованная проверка `en`/`ru`, `LOCALE NOT FOUND` recovery и
  сохранение не-locale части deep link;
- `d95ab70` — metadata-only evidence с live invalid/valid cases.

На scoped stack `http://127.0.0.1:47360/` invalid
`/questions?track=node&locale=xx` и invalid
`/practice/lesson/js-closures-001?question=question.js-closures-001&track=node&locale=xx`
показывают `LOCALE NOT FOUND`; valid `/questions?track=node&locale=ru`
остаётся русским. Web smoke `52/52`, C098 learner-route `9/9`, полный
`NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` — `PASS`.

Это corrective routing seam, без новой учебной ёмкости; снимок остаётся
**658 / 476 / 1134 / 58,02%**. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/locale-context-correction-2026-09-01.{json,md}`.

## Коррекция question deep-link-контекста

Live-аудит нашёл fail-open: явный неизвестный или устаревший `question` мог
открыть общий preview либо карточку из другого placement. Исправлено локальными
коммитами без push:

- `998d0bf` — точное разрешение question по опубликованному `track + lesson`,
  normalized query и двуязычный `QUESTION NOT FOUND` recovery;
- `f4ee9d2` — metadata-only evidence с пятью live-кейсами и полным ladder.

На scoped stack `http://127.0.0.1:47360/` проверены invalid lesson
`question.not-released`, valid lesson `question.memory-ownership-001`, invalid
и valid `/questions` deep-links, а также Node question в Java placement.
Unknown/stale cases не показывают preview или чужую карточку; valid карточка
сохраняет свой placement. Web smoke `62/62`, C098 learner-route `9/9`, полный
`NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` — `PASS`.

Это corrective routing seam, без новой учебной ёмкости; снимок остаётся
**658 / 476 / 1134 / 58,02%**. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-198-question-deep-link-context-2026-09-01.{json,md}`.

## Коррекция destination-копирайта Questions recovery

После fail-closed исправления deep-link найден UX-дефект: recovery в
`/questions` показывал `Return to lesson`, хотя кнопка возвращала в каталог.
Это исправлено локальными target-коммитами без push:

- `5fb40cd` — явный `destination="catalog"` для Questions и корректные
  `Return to questions` / `Вернуться к вопросам`; lesson recovery не изменён;
- `28046b4` — metadata-only evidence с invalid Questions и invalid lesson
  live-case.

На scoped stack `http://127.0.0.1:47360/` catalog recovery сохраняет
`track=node&locale=en`, не показывает preview и ведёт на `/questions`; lesson
recovery по-прежнему ведёт на урок. Web smoke `53/53`, полный
`NX_CI=1 pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` — `PASS`.
Счётчик не изменён: **658 / 476 / 1134 / 58,02%**. Push не выполнялся.

Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-198-question-recovery-copy-2026-09-01.{json,md}`.

## Коррекция объяснимости shared placement

Live-проверка Java и Go показала недостающую подсказку, а не ошибку каталога:
одна canonical-карточка может быть generic и осознанно находиться в нескольких
языковых маршрутах. Раньше learner видел только выбранный `track · lesson` и не
понимал, почему одна концепция повторяется.

Локальные target-коммиты без push:

- `897e330` — переиспользуемый `PlacementContext` в Questions и lesson;
  generic/native labels, список generic-треков и bilingual route explanation;
- `9579789` — metadata-only evidence с live Java/Go catalog и lesson cases.

Проверено на scoped stack `http://127.0.0.1:47360/`:

- `/questions?track=java&locale=en` и `/questions?track=go&locale=en` показывают
  shared placement и сохраняют выбранный маршрут;
- `/practice/lesson/java-memory?track=java&locale=en` и
  `/practice/lesson/go-values?track=go&locale=ru` показывают тот же контекст;
- горизонтальный overflow отсутствует.

Source guard и web smoke `53/53`, затем полная ladder
`NX_CI=1 pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check` — `PASS`.
Исправление только объясняет уже существующий граф: `G11-015` остаётся открытым
до reviewed path-specific prerequisites для всех generic records. Счётчик
мастер-плана остаётся **658 / 476 / 1134 / 58,02%**; G10S-246 также остаётся
human boundary. Evidence:
`fluent-interview-platform/docs/verification/greenfield/G10S-inputs/G10S-198-shared-placement-context-2026-09-01.{json,md}`.

## Что дальше

Следующий исполнимый пункт — **G10S-246**: owner sign-off и финальная
acceptance boundary. Это намеренная человеческая граница; её нельзя закрывать
машинным smoke-test или фиктивным `DONE`. После PASS открывается G11 breadth.
Остаются также контентные и human-boundary группы G5.2/G6/G7/G8/G9, G11,
G12.2–G12.3, G12.5, финальная независимая проверка и G13 decommission.
