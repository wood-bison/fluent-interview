# W06 findings

## Fixed

- Question Brain now publishes answer-free `learning_layers` flags derived at
  the canonical content boundary. The catalog exposes availability without
  shipping answer bodies.
- Lab validates the optional summary shape and maps the flags into the learner
  projection; malformed summaries fail closed.
- The learner coverage projection now derives the public readiness label from
  the authoritative `learningReady` boolean. An incomplete card cannot carry
  the public `ready` label.
- `learning-ready` and `guided` query filters now agree with their booleans for
  both locales. EN and RU denominators are independently visible.
- Project Evidence is now a first-class optional layer: Brain emits its
  answer-free availability flag, Lab maps the selected source section, and
  Vue renders the revealed content only after the learner opens the reference.
- List/detail title variants are normalized (`Follow-up Q&A`, `Common pitfalls`,
  `Deep dive`, Russian labels), so a section rename cannot silently drop a
  teaching layer.
- Coverage items carry independent `content`, `placement`, `runtime`, and
  `learner` dimensions; a bare ambiguous `ready` state is rejected by the
  learner contract guard.
- Studio now receives an answer-free, release-pinned curriculum funnel for
  both locales. It exposes total/content-ready/guided/incomplete counts, eight
  layer denominators, and a bounded editorial queue without prompt, answer, or
  source-body leakage.
- The funnel is guarded by an executable Lab check for arithmetic, locale and
  release identity, queue bounds, policy (`humanReviewRequired=true`,
  `llmAutoPublish=false`), and the generic-language preservation rule. EN and
  RU live reports both pass (1591 cards; 100 queue items returned from bounded
  queues).

## Remaining W06 work

Required-layer policy is still not type-specific: the platform has not yet
declared different required layers for behavioral, design, puzzle and runtime
cards. The current funnel therefore uses the conservative shared policy. Live
catalog metadata does not provide numeric `depth` or `execution_mode`, so the
optional mechanism/follow-up/trap/term/practice denominators remain zero
instead of being guessed from `level`; this is an explicit W09 editorial
follow-up, not evidence that those layers are complete.

The queue is bounded and answer-free, but owner assignment, topic-batch
partitioning, human-review records, and a separately versioned summary release
remain open checklist items. See the locale reports owned by Lab:

- `fluent-engineering-lab/docs/verification/two-audit-remediation/W06/curriculum-funnel-en.md`
- `fluent-engineering-lab/docs/verification/two-audit-remediation/W06/curriculum-funnel-ru.md`
