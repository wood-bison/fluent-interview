# W05 curriculum shape gate

The executable cross-service shape report is owned by Fluent Engineering Lab:

- JSON: `fluent-engineering-lab/docs/verification/two-audit-remediation/W05/curriculum-shape.json`
- Markdown: `fluent-engineering-lab/docs/verification/two-audit-remediation/W05/curriculum-shape.md`
- Contract: `question-curriculum-shape.v1`
- Release: `question-release-d00a14931e607336`
- Result: `1591` production rows, `0` violations, `978` explicit generic-language
  scopes preserved without a fictional programming language.

The root release verifier runs this gate in development mode and fails closed
on missing placement, dedicated-lane leakage, unknown language values,
language/path mismatches, or unrelated Algorithms/Behavioral topics.
