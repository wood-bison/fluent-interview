# W20 — release verification gate

Статус: **PASS (development live)**

Полный `pnpm release:verify:dev -- --out=docs/verification/two-audit-remediation/W20/release-verify-dev.json` завершился с `valid: true`: 55 из 55 шагов прошли, включая live API, контентные gates, accessibility, visual regression и Playwright E2E.

## Результат

- Dev stack: Vue `http://localhost:47350/`, learning-api `:47000`, Brain `:48127`, Runtime `:48227`.
- Production package: `http://localhost:49300/onboarding`, operation `f011aabc-6bfd-4a37-9369-833957e815fa`, state `ready`.
- E2E: `92/92` на профилях MacBook Pro 16 и Studio Display (light/dark).
- Content: 1,591 published cards, route/path/catalog/placement gates зелёные.
- Safety: full-local backup verified, 12,251 rows, `dataPreserved: true`.

`productionPromotable: false` остаётся честным governance-сигналом: Vue в
workspace manifest имеет `remote: local-only`. Это не ошибка live-продукта и не
заменяется выдуманным remote.
