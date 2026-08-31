# Greenfield plan progress — 2026-08-31 — G10S-205

Источник: `docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md`  
Команда: `pnpm plan:progress --json`  
Последний закрытый executable item: **G10S-205 — C098 desktop route matrix**

## Сводка

| Метрика | Значение |
|---|---:|
| Checked | **617** |
| Remaining | **517** |
| Total | **1 134** |
| Completion | **54.41%** |

После G10S-204 закрыт G10S-205. Счётчик вырос с `616/518` до `617/517`; в
G10S.8 закрыто `19/23`. Следующим executable item становится **G10S-206**.

## Закрытая фаза

G10S-205 закрыт в target `main` implementation/evidence-коммитом `a35c919` и
target index-коммитом `8dc3b8b`; push намеренно отложен из-за Actions quota.
Policy `g10s-c098-desktop-matrix-policy.v1` фиксирует 23 exact route templates,
две локали, две темы и три desktop viewport profiles. Browser matrix PASS:
`276/276` cases, `9,612` controls inspected, нулевые overflow/clipping,
unreachable controls, missing landmarks, viewport mismatches и ошибки
console/page/request. Query strings сохраняются точными, без нормализации.

## Проверочный ladder

- Static policy: **30/30**; focused mutation tests: **7/7**.
- Live evidence: `276/276` (`en`/`ru` × `light`/`dark` × MacBook Pro 13
  1280×800, MacBook Pro 16 1728×1117, Apple Studio Display 2560×1440),
  `.app-scroll-region` — scroll owner во всех кейсах.
- Полные `pnpm check`, `pnpm boundary:check` и `pnpm toolchain:check` прошли;
  metadata-only report не содержит source/prompt/answer/solution/content/
  dump/credential/hidden evaluator bodies и не выдаёт learner/authoring/import/
  release authority.

## Следующий срез

**G10S-206** — keyboard/screen-reader baseline: headings, labels, focus order,
dialog/panel behavior и accessible names для code/runtime controls.
