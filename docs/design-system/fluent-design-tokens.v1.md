# Fluent Engineering design tokens v1

Статус: **source-of-truth для Vue learner surface** · версия `1.0` · 2026-08-27

## Зачем это нужно

Все learner-поверхности используют один семантический слой из
`fluent-engineering-vue/packages/design-tokens/tokens.css`. Feature CSS не
владеет цветом, типографической шкалой или motion-таймингом. Это делает
светлую, тёмную и системную темы проверяемыми и не даёт локальной карточке
сломать контраст соседней панели.

## Semantic roles

| Role | Token | Назначение |
| --- | --- | --- |
| canvas | `--fel-surface-canvas` | фон приложения |
| content | `--fel-surface-content` | стабильные читаемые карточки |
| muted | `--fel-surface-muted` | вторичный слой/группировка |
| control | `--fel-surface-control` | functional glass rail/top bar |
| ink | `--fel-ink` | основной текст |
| ink muted | `--fel-ink-muted` | вторичный текст |
| border subtle/strong | `--fel-border-subtle`, `--fel-border-strong` | разделители и focus/active |
| accent | `--fel-accent`, `--fel-accent-soft`, `--fel-accent-contrast` | действие/состояние |
| status | `--fel-success`, `--fel-warning`, `--fel-danger` | семантические статусы |
| code | `--fel-code-*` | редактор без влияния на content cards |
| terminal | `--fel-terminal-*` | runtime evidence |

Палитра (`--fel-field`, `--fel-plate`, `--fel-cameo` и т. п.) — только
primitive source. В компонентах разрешены только semantic roles и
documented compatibility aliases.

## Scales

- Type: `--fel-type-xs`, `--fel-type-sm`, `--fel-type-body`, `--fel-type-lead`,
  `--fel-type-title`, `--fel-type-display`.
- Space: `--fel-space-0` … `--fel-space-12` и `--fel-space-unit`.
- Radius: `--fel-radius-xs`, `--fel-radius-sm`, `--fel-radius-md`,
  `--fel-radius-lg`, `--fel-radius-pill`.
- Elevation/material: `--fel-shadow`, `--fel-shadow-control`,
  `--fel-shadow-active`, `--fel-glass-*`.
- Motion: `--fel-motion-fast`, `--fel-motion-normal`,
  `--fel-motion-emphasis`, `--fel-ease-standard`, `--fel-ease-emphasis`.

## Tailwind policy

Tailwind 4 остаётся компилятором утилит, а не вторым владельцем темы. Его
`@theme inline` mapping в `tokens.css` экспортирует только значения,
связанные с `--fel-*`. В feature-коде запрещены `text-[#...]`, arbitrary
background/border colors и inline raw `rgb()/hsl()/hex`; вместо этого
используются `var(--fel-...)` или token-aware utility (`bg-background`,
`text-foreground`, `border-border`). Если utility невозможно выразить через
semantic role, сначала добавляется роль и её документация, затем utility.

Исполняемая проверка: `pnpm design:tokens:check` из umbrella root. Она
проверяет обязательные роли и scales, light/dark/system hooks, дубликаты в
одной CSS scope и raw colors вне token source.

## Material boundary

Liquid Glass разрешён только на functional/navigation layers (rail, top bar,
docked inspector и transient controls). Текст, code surface, terminal и
learning cards остаются непрозрачными стабильными материалами. При
`prefers-reduced-transparency: reduce` все functional surfaces отключают
backdrop-filter; при `prefers-reduced-motion: reduce` transition/animation
сводятся к безопасному минимуму.

## Ownership and change protocol

1. Изменение роли начинается с этого документа и token audit.
2. Feature-компонент не добавляет новый цвет или timing напрямую.
3. Light/dark/system значения должны пройти `design:tokens:check`, Vue
   type/lint/test/build и desktop E2E.
4. Compatibility alias можно оставить только с комментарием, consumer-списком
   и планом удаления; старые Angular names не являются новым API.

