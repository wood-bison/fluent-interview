# Vue toolchain maintenance — 2026-08-27

Цель этой волны — убрать шум formatter/lint и согласовать инструменты с
текущими Vue 3 + Vite 8 + TypeScript 6.

## Изменения

- ESLint `9.34.0` → `10.9.1`;
- `@eslint/js` `9.34.0` → `10.0.1`;
- `eslint-plugin-vue` `10.4.0` → `10.10.0`;
- `vue-eslint-parser` `10.2.0` → `10.4.1`;
- `typescript-eslint` `8.42.0` → `8.68.0`;
- `@vitejs/plugin-vue` `6.0.1` → `6.0.8` (совместимость с Vite 8);
- шаблонные атрибуты и многострочный контент отформатированы ESLint
  `--fix`; логика компонентов не менялась.

## Проверки

Из `/Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-vue`:

```text
pnpm peers check  # No peer dependency issues found
pnpm check        # typecheck + ESLint 0/0 + Vitest 11/11 + Vite build PASS
pnpm e2e          # 72 passed, MacBook Pro 16 Light + Studio Display Dark
```

Umbrella `pnpm release:verify:dev` после обновления также завершился `valid:
true`: 25 PASS и один ожидаемый WARN `package-provenance-plan` (dirty/unpinned
five-root checkout). Production promotion и коммиты этой волной не выполнялись.
