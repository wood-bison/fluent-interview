# W06 curriculum funnel (RU)

Release: `question-release-d00a14931e607336`
Status: **PASS**

Answer-free, release-pinned readiness projection for Studio. Counts use required-layer denominators; the editorial queue exposes stable IDs and missing layer names only.

- Cards: **1591**; content-ready: **989**; guided: **602**.
- Queue: **602** total; **100** returned (bounded at 100).
- Violations: **0**.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
LEARNING_API_URL=http://127.0.0.1:47000 pnpm question:curriculum:funnel -- --locale=ru
LEARNING_API_URL=http://127.0.0.1:47000 pnpm question:curriculum:funnel:check -- --locale=ru
```

Stable content digest: `1c182f9a2a1a4296d158839d966eeaf3ab55c8f0940981a4a068e67f77c27730`
