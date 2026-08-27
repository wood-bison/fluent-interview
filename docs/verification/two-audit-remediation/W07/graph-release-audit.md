# W07 graph release audit

Release: `question-graph-release-e3b0c44298fc1c14`
Status: **PASS**

Read-only audit of the active Question Brain graph release. Every edge is joined to accepted proposal evidence and the published catalog; no learner payloads are returned.

- Edges: **0**; accepted proposals: **0**; catalog cards: **1591**.
- Test provenance: **0**; stale: **0**; archived: **0**; orphaned: **0**; cycles: **0**.
- Violations: **0**; warnings: **0**.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
QUESTION_BRAIN_API_URL=http://127.0.0.1:48127 GRAPH_AUDIT_JSON=/Users/sergeyzhechko/developer/fluent-interview/docs/verification/two-audit-remediation/W07/graph-release-audit.json GRAPH_AUDIT_MD=/Users/sergeyzhechko/developer/fluent-interview/docs/verification/two-audit-remediation/W07/graph-release-audit.md node fluent-question-brain/scripts/graph-release-audit.mjs
QUESTION_BRAIN_API_URL=http://127.0.0.1:48127 GRAPH_AUDIT_JSON=/Users/sergeyzhechko/developer/fluent-interview/docs/verification/two-audit-remediation/W07/graph-release-audit.json node fluent-question-brain/scripts/graph-release-audit.mjs --check
```

Stable content digest: `f0b86bc98bec316bc296c0b52662aea8b911f9acc0749dcaa1b12725e5dbe03d`
