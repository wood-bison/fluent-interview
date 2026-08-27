# W06 changes

- `fluent-question-brain/internal/search/types.go`: added release-pinned,
  answer-free `CatalogLearningLayers`.
- `fluent-question-brain/internal/store/catalog_layers.go`: deterministic
  section/payload summarizer with tests.
- `fluent-question-brain/internal/store/postgres.go`: populate layer summary
  while building the catalog.
- `fluent-engineering-lab/apps/learning-api/src/app/question-brain/question-brain.client.ts`:
  validate and type the summary contract.
- `fluent-engineering-lab/apps/learning-api/src/app/question-brain/question-brain.library.ts`:
  consume the summary with a conservative pre-W06 fallback.
- `fluent-engineering-lab/libs/lab-contracts/src/lib/question-brain-learner.ts`:
  prevent false `ready` labels for incomplete cards, carry the
  `projectEvidence` layer, and expose explicit content/placement/runtime/
  learner readiness dimensions.
- `fluent-engineering-lab/apps/learning-api/src/app/question-brain/question-brain.mapper.ts`:
  normalize editorial section-title variants and map Project Evidence without
  leaking source metadata.
- `fluent-engineering-vue/packages/contracts/src/index.ts` and
  `apps/web/src/views/QuestionDetailView.vue`: validate/render the optional
  Project Evidence layer on the released detail route.
- Added regression tests for malformed summaries, incomplete readiness and
  ready/guided query filtering, list/detail layer parity and learner-safe
  Project Evidence projection.
- `fluent-engineering-lab/libs/lab-contracts/src/lib/question-curriculum-funnel.ts`:
  added the answer-free `question-curriculum-funnel.v1` contract, conservative
  layer accounting, bounded editorial queue and no-auto-publish policy.
- `fluent-engineering-lab/apps/learning-api/src/app/question-brain/question-brain.library.ts`
  and `question-brain-learner.controller.ts`: expose the Studio-only
  `/api/questions/funnel?locale=en|ru` projection with private/no-store
  caching.
- `fluent-engineering-vue/packages/api-client/src/index.ts` and
  `apps/web/src/views/StudioBoundaryView.vue`: validate and render the funnel,
  layer cards and bounded queue for EN/RU without answer bodies.
- `fluent-engineering-lab/scripts/question-curriculum-funnel-gate.mjs`:
  added executable live contract/arithmetic/privacy/policy checks and generated
  the EN/RU reports linked from `findings.md`.
