# Release verification — development profile

**Дата:** 2026-08-27  
**Команда:** `pnpm release:verify:dev --out=docs/verification/two-audit-remediation/W17/release-verify-dev-wave-2026-08-27.json`  
**Режим:** read-only development; production promotion не выполняется

## Результат

**PASS — все release-verify шаги завершены без failures.**

Пройдено:

- workspace Git/topology report (development warnings видимы, не скрыты);
- capability contract, пять независимых Git roots, port registry и immutable
  task-image manifest;
- `git diff --check` для Lab, Vue, Runtime, Question Brain и Vault;
- Lab quality (`247 suites / 1,255 tests`) и Vue quality (typecheck, lint,
  Vitest, Vite build);
- Brain/Runtime/Lab dev readiness;
- live Runtime release/failure matrix: exact revision, five rate-limiter
  profiles, failure outcomes, redaction, resource policy and Jaeger identity;
- route audit `81/81`, canonical-route coverage, G12 coverage/disposition,
  semantic placement и G13/G9;
- accessibility, desktop visual (12 состояний) и regression budget;
- Vue Chromium E2E `92/92` для MacBook Pro 16 Light и Studio Display Dark.

После отдельной toolchain maintenance-волны Vue lint повторно даёт **0
errors / 0 warnings**, `pnpm peers check` — без peer issues, а ESLint 10 и
`typescript-eslint 8.68` больше не печатают прежнее предупреждение о
несовместимости с TypeScript 6.

## Важная граница

`package:local:plan` честно возвращает `executable=false`: child trees
имеют незакоммиченные remediation-изменения, Vue остаётся `local-only`, а
workspace manifest пока не содержит immutable commit pins. Поэтому этот отчёт
подтверждает dev learner surface, но не является production release. Для
строгого режима нужно сначала отдельно review/commit/push child repositories,
затем записать remote-backed pins и выполнить `pnpm release:verify`.
