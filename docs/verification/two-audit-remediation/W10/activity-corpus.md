# W10 activity corpus gate

Release: `question-release-d00a14931e607336`
Status: **PASS**

Answer-free disposition of every published card. Brain’s practice layer is not treated as a sandbox promise; Run remains unavailable until a released TaskFamily is bound.

- Cards/activities: **1591 / 1591**; structured task flags: **48**; released runnable: **0**.
- Editorial queue: **85** total; **85** returned (bounded at 100).
- Violations: **0**; warnings: **0**.

## Activity kinds

| Kind | Count |
| --- | ---: |
| `code` | 79 |
| `debug` | 2 |
| `defend` | 72 |
| `design` | 88 |
| `explain` | 1234 |
| `recall` | 116 |

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
BRAIN_API_URL=http://127.0.0.1:48127 pnpm activity:gate
BRAIN_API_URL=http://127.0.0.1:48127 pnpm activity:gate:check
```

Stable content digest: `ae02882e6906c7a771f661f7d517a8031a4094903a2673f83548991efe25d563`
