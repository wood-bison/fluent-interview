# W03 — CI/workflow inventory

Снимок: 2026-08-28T00:51:30.287Z
Статус: **pass-with-coverage-gaps**

Инвентарь не притворяется aggregate CI: он показывает, какие child workflows реально существуют, какие обязательные маркеры покрыты и какие gaps остаются.

| Repository | Workflows | Required markers missing | Stale refs | Status |
| --- | ---: | --- | ---: | --- |
| fluent-engineering-lab | 2 | — | 0 | pass |
| fluent-engineering-vue | 1 | — | 0 | pass |
| fluent-question-brain | 1 | — | 0 | pass |
| fluent-task-runtime | 1 | — | 0 | pass |
| fluent-question-vault | 0 | — | 0 | pass |

## W03 interpretation

- `valid` означает только отсутствие stale references; warnings показывают coverage gaps и не скрываются.
- Question Vault намеренно не считается product CI owner: его проверяет umbrella provenance и Brain release gate.
- Полный cross-repository aggregate запускается отдельной командой `pnpm release:verify`.
