import test from "node:test";
import assert from "node:assert/strict";
import { parseChecklist, rowCategory, summarize } from "./plan-progress.mjs";

test("parses checklist rows and keeps the nearest heading as a section", () => {
  const rows = parseChecklist(
    "# G1\n- [x] `G1-001` done\n## notes\n- [ ] `G1-002` next\n",
  );
  assert.deepEqual(rows, [
    {
      checked: true,
      id: "G1-001",
      label: "`G1-001` done",
      line: 2,
      section: "G1",
    },
    {
      checked: false,
      id: "G1-002",
      label: "`G1-002` next",
      line: 4,
      section: "notes",
    },
  ]);
});

test("summarizes checked and remaining work without mutating the plan", () => {
  const summary = summarize(parseChecklist("# G1\n- [x] done\n- [ ] next\n"));
  assert.equal(summary.checked, 1);
  assert.equal(summary.remaining, 1);
  assert.equal(summary.total, 2);
  assert.equal(summary.completionPercent, 50);
  assert.deepEqual(summary.sections, {
    G1: { checked: 1, remaining: 1, total: 2 },
  });
});

test("separates standing policy from execution workstreams", () => {
  const rows = parseChecklist(`
# policy
- [ ] \`P-001\` order
- [ ] \`A-001\` architecture
- [ ] \`D-001\` done definition
# closure
- [x] \`G10S-001\` migrated
- [ ] \`G11-001\` content
- [ ] \`G12-R01\` requalify
- [ ] \`R-001\` independent review
- [ ] \`G13-001\` cleanup
`);
  const summary = summarize(rows);

  assert.equal(summary.standingPolicy.total, 3);
  assert.equal(summary.execution.checked, 1);
  assert.equal(summary.execution.remaining, 4);
  assert.equal(summary.workstreams.productClosure.remaining, 1);
  assert.equal(
    summary.workstreams.requalificationAndIndependentReview.remaining,
    2,
  );
  assert.equal(summary.workstreams.decommission.remaining, 1);
  assert.equal(rowCategory(rows[0]), "standingPolicy");
});
