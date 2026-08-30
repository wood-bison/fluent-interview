# G11.0 — coverage policy audit

Target implementation commit: `c0f3e86`  
Target evidence commit: `3ab6354`  
Evidence: `fluent-interview-platform/docs/verification/greenfield/G11/coverage-policy-audit-2026-08-30.{json,md}`

`coverage-policy-audit.v1` проверяет policy независимо от UI: точный набор
десяти путей, role SLA для technical-core и algorithms, запрет filler-квот и
пять hard-gates (`released`, `localeComplete`, `provenanceComplete`,
`noQuarantine`, `placementComplete`). G11-001…004 прошли.

G11-005 остаётся открытым намеренно: production score seed-релиза равен `0.00`
для Node/Java/Go, поэтому ни один путь не eligible. Это content-authoring gap,
а не разрешение повысить score вручную. Следующий шаг — review/provenance и
typed promotion из Brain/Vault authoring queue.

Счётчик главного плана после синхронизации: `410 checked / 196 remaining / 606`
(`68%`).
