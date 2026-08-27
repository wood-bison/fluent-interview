# W08 learning module release gate

Release: `learning-module-release-2026-08-27.1`
Question release: `question-release-d00a14931e607336`
Status: **PASS**

Answer-free Lab-owned join over the published Brain catalogue. Shared domains are pathless; runtime cards retain their explicit native path; every stable key must have exactly one primary placement.

- Modules: **17**; placements: **1591**; published cards: **1591**.
- Shared placements: **910**; native placements: **664**.
- Violations: **0**; warnings: **0**.

## Module families

| Module | Placements |
| --- | ---: |
| `module.behavioral-english` | 103 |
| `module.data-postgresql` | 171 |
| `module.delivery-observability` | 62 |
| `module.distributed-systems` | 275 |
| `module.dotnet-csharp-runtime` | 56 |
| `module.frontend-runtime` | 111 |
| `module.go-runtime` | 127 |
| `module.http-api-security` | 166 |
| `module.java-spring-runtime` | 155 |
| `module.nodejs-typescript-runtime` | 215 |
| `module.os-networking` | 33 |
| `module.python-runtime-preview` | 17 |
| `module.testing` | 48 |
| `module.universal-cs-core` | 52 |

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
BRAIN_API_URL=http://127.0.0.1:48127 pnpm learning:modules:gate
BRAIN_API_URL=http://127.0.0.1:48127 pnpm learning:modules:gate:check
```

Stable content digest: `833dbf314250b3313f15a599bf2b590956d328ca9de5ec2c603fa768496699e9`
