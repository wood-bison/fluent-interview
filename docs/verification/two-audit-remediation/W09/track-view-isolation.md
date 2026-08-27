# W09 TrackView isolation gate

Status: **PASS**
Brain release: `question-release-d00a14931e607336`

Read-only comparison of the server-owned Program path catalogue with the published Brain path crosswalk. It checks canonical entry routes, honest counters, shared-domain references and dedicated Algorithms/Behavioral isolation.

- Paths: **9**; shared domains: **9**; Brain cards: **1591**.
- Violations: **0**; warnings: **0**.

## Path counts

| Path | Brain cards |
| --- | ---: |
| `path.algorithms` | 52 |
| `path.behavioral` | 103 |
| `path.dotnet-csharp` | 75 |
| `path.frontend` | 161 |
| `path.go` | 130 |
| `path.java-spring` | 191 |
| `path.nodejs-typescript` | 294 |
| `path.python` | 17 |
| `path.system-design` | 568 |

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
LEARNING_API_URL=http://127.0.0.1:47000 BRAIN_API_URL=http://127.0.0.1:48127 pnpm track:views:gate
LEARNING_API_URL=http://127.0.0.1:47000 BRAIN_API_URL=http://127.0.0.1:48127 pnpm track:views:gate:check
```

Stable content digest: `bb82f5cee7f6f644461d69390e7ae02177e2232719a8b17fbe473eb3c070f4b8`
