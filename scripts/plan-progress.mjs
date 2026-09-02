#!/usr/bin/env node

/**
 * Print reproducible formal and actionable progress snapshots for an execution
 * plan.
 *
 * This is intentionally a read-only helper. It does not edit checkboxes or
 * infer product readiness from them. Standing policy/architecture/DONE rules
 * remain visible while executable work is reported separately.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultPlan =
  "docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md";
const args = process.argv.slice(2);

function valueFor(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

const planArgument = valueFor("--plan") ?? defaultPlan;
const planPath = path.resolve(root, planArgument);
const asJson = args.includes("--json");

function parseChecklist(text) {
  const rows = [];
  let section = "Unsectioned";
  for (const [lineNumber, line] of text.split(/\r?\n/u).entries()) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/u);
    if (heading) section = heading[1];
    const checkbox = line.match(/^\s*-\s+\[([ xX])\]\s+(.+?)\s*$/u);
    if (!checkbox) continue;
    const checked = checkbox[1].toLowerCase() === "x";
    const id = checkbox[2].match(/`([^`]+)`/u)?.[1] ?? null;
    rows.push({
      checked,
      id,
      label: checkbox[2],
      line: lineNumber + 1,
      section,
    });
  }
  return rows;
}

function counts(rows) {
  const checked = rows.filter((row) => row.checked).length;
  const remaining = rows.length - checked;
  return {
    checked,
    remaining,
    total: rows.length,
    completionPercent:
      rows.length === 0
        ? 0
        : Number(((checked / rows.length) * 100).toFixed(2)),
  };
}

function rowCategory(row) {
  const id = row.id ?? "";
  if (/^(?:P|A|D)-/u.test(id)) return "standingPolicy";
  if (/^G13-/u.test(id)) return "decommission";
  if (/^(?:G12-R|R-)/u.test(id)) return "requalificationAndIndependentReview";
  return "productClosure";
}

function summarize(rows) {
  const formal = counts(rows);
  const bySection = new Map();
  for (const row of rows) {
    const current = bySection.get(row.section) ?? {
      checked: 0,
      remaining: 0,
      total: 0,
    };
    current[row.checked ? "checked" : "remaining"] += 1;
    current.total += 1;
    bySection.set(row.section, current);
  }
  const standingPolicyRows = rows.filter(
    (row) => rowCategory(row) === "standingPolicy",
  );
  const executionRows = rows.filter(
    (row) => rowCategory(row) !== "standingPolicy",
  );
  const workstreams = Object.fromEntries(
    [
      "productClosure",
      "requalificationAndIndependentReview",
      "decommission",
    ].map((category) => [
      category,
      counts(rows.filter((row) => rowCategory(row) === category)),
    ]),
  );
  return {
    plan: path.relative(root, planPath),
    ...formal,
    execution: counts(executionRows),
    standingPolicy: counts(standingPolicyRows),
    workstreams,
    sections: Object.fromEntries(bySection),
  };
}

function main() {
  let text;
  try {
    text = readFileSync(planPath, "utf8");
  } catch (error) {
    console.error(`Cannot read plan ${planArgument}: ${error.message}`);
    process.exitCode = 1;
  }

  if (text !== undefined) {
    const summary = summarize(parseChecklist(text));
    if (asJson) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      console.log(`Plan: ${summary.plan}`);
      console.log(`Checked: ${summary.checked}`);
      console.log(`Remaining: ${summary.remaining}`);
      console.log(`Total: ${summary.total}`);
      console.log(`Completion: ${summary.completionPercent}%`);
      console.log(
        `Execution: ${summary.execution.checked} checked, ${summary.execution.remaining} remaining, ${summary.execution.total} total (${summary.execution.completionPercent}%)`,
      );
      console.log(
        `Standing policy: ${summary.standingPolicy.total} rules (enforced continuously; excluded from execution remaining)`,
      );
      console.log("\nRemaining execution workstreams:");
      console.log(
        `- Product closure: ${summary.workstreams.productClosure.remaining}`,
      );
      console.log(
        `- Requalification + independent review: ${summary.workstreams.requalificationAndIndependentReview.remaining}`,
      );
      console.log(
        `- Decommission: ${summary.workstreams.decommission.remaining}`,
      );
      console.log("\nBy section:");
      for (const [section, counts] of Object.entries(summary.sections)) {
        console.log(
          `- ${section}: ${counts.checked} checked, ${counts.remaining} remaining, ${counts.total} total`,
        );
      }
    }
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main();
}

export { counts, parseChecklist, rowCategory, summarize };
