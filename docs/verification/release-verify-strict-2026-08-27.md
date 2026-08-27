# Release verification — strict production profile

**Дата:** 2026-08-27  
**Команда:** `pnpm release:verify -- --out=docs/verification/release-verify-strict-2026-08-27.json`  
**Режим:** fail-closed production; package promotion не выполнялась

## Результат

**BLOCKED — production promotion корректно остановлена на provenance boundary.**

Положительно завершились:

- workspace contract, layout, port registry и immutable task-image manifest;
- `git diff --check` для всех пяти child repositories;
- Lab quality (`247 suites / 1,255 tests`) и Vue quality (typecheck, lint,
  Vitest, Vite build).

Блокирующие проверки:

- `workspace-git`: четыре roots содержат незакоммиченные изменения, Vault
  находится на development review branch, а `workspace.yaml` ещё не содержит
  immutable 40-character revision pins; Vue остаётся `local-only`;
- `package-provenance-plan`: `executable=false`, потому что пятикомпонентный
  source tuple нельзя безопасно упаковать из dirty/unpinned checkout;
- `production-package-boundary`: packaged readiness и G14 не запускались.

Это ожидаемый и безопасный результат. Строгий gate не выдаёт dev-профиль за
production и не трогает Docker, volumes или рабочие trees.

## Следующий шаг

После отдельного review/commit/push каждого child repository нужно:

1. вернуть Vault на согласованный release branch;
2. добавить remote-backed immutable pins пяти roots в `workspace.yaml`;
3. запустить `pnpm package:local` на чистом checkout;
4. повторить `pnpm release:verify` и только затем закрыть G14 (health,
   Prometheus targets, Jaeger continuity, SLO и recovery evidence).

Машинный результат сохранён в
[`release-verify-strict-2026-08-27.json`](release-verify-strict-2026-08-27.json).
