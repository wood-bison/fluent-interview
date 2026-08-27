# W11 Task Runtime binding gate

Runtime release: `task-family-release-2026-08-26-g10`
Brain release: `question-release-d00a14931e607336`
Status: **PASS**

Read-only reconciliation of raw Runtime revisions, TaskFamily projection and published Brain bindings. Identity is always task family + revision; there is no silent latest fallback.

- Raw tasks: **20**; runnable learner revisions: **19**; families: **16** (runnable **15**).
- Bound public questions: **19**; Brain cards: **1591**.
- Violations: **0**; warnings: **0**.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
RUNTIME_API_URL=http://127.0.0.1:48227 BRAIN_API_URL=http://127.0.0.1:48127 pnpm runtime:bindings:gate
RUNTIME_API_URL=http://127.0.0.1:48227 BRAIN_API_URL=http://127.0.0.1:48127 pnpm runtime:bindings:gate:check
```

Stable content digest: `1b6b0f16afe3848b0fa6469b0e2fbe124a108b76b3e696de439e47008793453d`
