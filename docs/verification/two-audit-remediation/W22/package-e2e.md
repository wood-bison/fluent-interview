# W22 package-mode browser evidence

Дата: **2026-08-28**  
Статус: **PASS — 106/106**

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
| Всего тестов | 106 |
| Ошибок | 0 |
| Время | 66,0 с |

Проверены route/catalogue/question/detail flows, канонические
Path → Domain → Capability deep links (включая malformed-link fail-closed), шесть rate-limiter language
revisions (JavaScript, TypeScript, Go, Java, C#, SQL), Event Loop run/recovery, AI context/error boundaries, RU/EN ×
light/dark, keyboard entry, scroll owner, 200% zoom, history persistence и
browser-console guard. Фикстуры для намеренных outage/error-сценариев остаются
изолированными внутри resilience tests и не подменяют обычный released путь.

Machine record: [`package-e2e.json`](./package-e2e.json).

Последний прогон выполнен после пересборки package operation
`5ad558ba-c67f-4a22-b48e-1fe620eee94d` из Lab `ba495d657b7576b04718e3f09b6f1767924dc7bc`
с Vue `41ac41da63526b84fa994c58f7d0012d24fe6d1b`.
