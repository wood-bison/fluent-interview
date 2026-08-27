# W09 findings

## Fixed

- The live Program/Map projection exposes exactly nine canonical paths and nine
  shared domains.
- All path counters reconcile with Brain: Node 294, Java 191, .NET 75, Go 130,
  Frontend 161, System Design 568, Algorithms 52, Behavioral 103, Python 17.
- Every path has `acceptedCount == publishedCount` and `proposedCount == 0`;
  no route claims review backlog as learner content.
- Algorithms is limited to `domain.algorithms` + explicit testing support;
  Behavioral is limited to `domain.behavioral` + explicit delivery support.
- All entry routes are canonical `/paths/<slug>` values.

## Remaining W09 work

- Native syllabus depth and executable TaskFamily coverage still require W10/W11
  authoring; preview paths must remain preview until those releases exist.
- The gate validates path/domain isolation and counters, but it does not infer
  per-card capability semantics or create missing language-native tasks.
