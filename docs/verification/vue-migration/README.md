# Vue migration closure evidence

Этот каталог содержит только актуальные материалы Vue-only миграции. Старые
pilot-документы, описывавшие второй frontend runtime, удалены, чтобы не давать
агентам и разработчикам ложный rollback-путь.

## Runtime boundary

- Web: `/Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-vue`
- API/contracts: `/Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab`
- Dev entry: `cd /Users/sergeyzhechko/developer/fluent-interview && pnpm run dev`
- Web URL: `http://localhost:47350/`

## Closure checklist

- [x] Angular source tree and Nx web libraries removed from Lab.
- [x] Vue owns learner, lab, question, project, Studio and recovery routes.
- [x] Lab production/package scripts serve Vue `dist/apps/web`.
- [x] Lockfile no longer contains Angular packages.
- [x] Vue desktop E2E baseline: 56/56 passed on the two supported profiles.
- [x] Lab contracts/API baseline green after curriculum terminology migration.
- [x] Fresh G9/production bundle evidence regenerated from the Vue dist.
- [x] Packaged local release smoke repeated after the final dist rebuild.
- [x] G14 hardening evidence is valid: shared Jaeger, trace continuity, health
  and benchmark checks all pass.
- [x] Tier-1 G5-24.06 operations evidence is valid: profile isolation, recovery
  and recursive browser source scan pass.

Миграция закрыта. Дальнейшие пункты относятся к развитию учебного контента,
новым labs и platform features, а не к поддержке второго frontend runtime.
