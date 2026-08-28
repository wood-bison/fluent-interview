# W22 package-mode browser evidence

Дата: **2026-08-28**  
Статус: **PASS — 102/102**

Команда:

```bash
pnpm --dir fluent-engineering-vue e2e:package
```

Конфигурация [`playwright.package.config.ts`](../../../../fluent-engineering-vue/playwright.package.config.ts)
перенаправляет тот же desktop matrix на immutable learner package
`http://localhost:49300`. Она не запускает отдельный web server и не подменяет
released API responses.

| Профиль | Результат |
| --- | --- |
| MacBook Pro 16 Light | PASS |
| Studio Display Dark | PASS |
| Всего тестов | 102 |
| Ошибок | 0 |
| Время | 62,8 с |

Проверены route/catalogue/question/detail flows, пять rate-limiter language
revisions, Event Loop run/recovery, AI context/error boundaries, RU/EN ×
light/dark, keyboard entry, scroll owner, 200% zoom, history persistence и
browser-console guard. Фикстуры для намеренных outage/error-сценариев остаются
изолированными внутри resilience tests и не подменяют обычный released путь.

Machine record: [`package-e2e.json`](./package-e2e.json).
