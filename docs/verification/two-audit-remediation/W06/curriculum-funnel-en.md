# W06 curriculum funnel (EN)

Release: `question-release-d00a14931e607336`
Status: **PASS**

Answer-free, release-pinned readiness projection for Studio. Counts use required-layer denominators; the editorial queue exposes stable IDs and missing layer names only.

- Cards: **1591**; content-ready: **1100**; guided: **491**.
- Queue: **491** total; **100** returned (bounded at 100).
- Violations: **0**.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
LEARNING_API_URL=http://127.0.0.1:47000 pnpm question:curriculum:funnel -- --locale=en
LEARNING_API_URL=http://127.0.0.1:47000 pnpm question:curriculum:funnel:check -- --locale=en
```

Stable content digest: `b1b6af995809a0ee45c9302cf92575cb4fb4be0af1ab4e485eafc95be5cfc68f`
