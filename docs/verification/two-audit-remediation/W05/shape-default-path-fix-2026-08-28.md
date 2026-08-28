# W05 shape-gate default path fix — 28 августа 2026

## Finding

`pnpm question:curriculum:shape:check` из корня Fluent Lab не находил
сохранённый отчёт и завершался `ENOENT`: скрипт по умолчанию искал устаревший
`docs/production/evidence/question-curriculum-shape.json`, тогда как reviewed
artifact живёт в W05 ledger.

## Change

Lab commit `8e76a6764d7195a55ec580c3bfe8c1e359038013` направляет оба default
пути (`json` и `md`) в
`docs/verification/two-audit-remediation/W05/`. Environment overrides оставлены
для изолированных отчётов и umbrella release verifier.

## Proof

```text
BRAIN_API_URL=http://127.0.0.1:48127 pnpm question:curriculum:shape:check
valid=true
questionCount=1591
violationCount=0
genericLanguageCount=978
```

Lab `pnpm check` также прошёл: curriculum drift valid, 249 test suites / 1267
Lab-contract tests passed, 167 learning-api suites / 744 tests passed, lint и
build завершились без ошибок (остались только ранее существовавшие warnings).

Это устраняет false-negative owner command и не меняет Question Brain payload,
release ID или learner data.
