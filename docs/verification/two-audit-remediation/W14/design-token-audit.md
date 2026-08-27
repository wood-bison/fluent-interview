# W14 — design token audit

Снимок: 2026-08-27T22:32:52.987Z
Статус: **pass**

Token source: `fluent-engineering-vue/packages/design-tokens/tokens.css` · 116/49 required names present.

| Check | Result |
| --- | --- |
| Required semantic/scales | PASS |
| Duplicate declarations inside @theme | PASS |
| Raw colours outside token source | PASS |
| Light/dark/system/reduced-* hooks | PASS |
| Policy documentation | PASS |

Feature code may consume semantic `--fel-*` roles or Tailwind utilities mapped by `@theme inline`; palette literals remain confined to the token source.
