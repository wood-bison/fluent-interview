#!/usr/bin/env node

/**
 * Print a reproducible checklist progress snapshot for an execution plan.
 *
 * This is intentionally a read-only helper. It does not edit checkboxes or
 * infer product readiness from them; it only makes the remaining formal work
 * visible after each local commit.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultPlan = 'docs/GREENFIELD-NEXT-PLATFORM-EXECUTION-PLAN-2026-08-28.md';
const args = process.argv.slice(2);

function valueFor(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

const planArgument = valueFor('--plan') ?? defaultPlan;
const planPath = path.resolve(root, planArgument);
const asJson = args.includes('--json');

function parseChecklist(text) {
  const rows = [];
  let section = 'Unsectioned';
  for (const [lineNumber, line] of text.split(/\r?\n/u).entries()) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/u);
    if (heading) section = heading[1];
    const checkbox = line.match(/^\s*-\s+\[([ xX])\]\s+(.+?)\s*$/u);
    if (!checkbox) continue;
    const checked = checkbox[1].toLowerCase() === 'x';
    const id = checkbox[2].match(/`([^`]+)`/u)?.[1] ?? null;
    rows.push({ checked, id, label: checkbox[2], line: lineNumber + 1, section });
  }
  return rows;
}

function summarize(rows) {
  const checked = rows.filter((row) => row.checked).length;
  const remaining = rows.length - checked;
  const bySection = new Map();
  for (const row of rows) {
    const current = bySection.get(row.section) ?? { checked: 0, remaining: 0, total: 0 };
    current[row.checked ? 'checked' : 'remaining'] += 1;
    current.total += 1;
    bySection.set(row.section, current);
  }
  return {
    plan: path.relative(root, planPath),
    checked,
    remaining,
    total: rows.length,
    completionPercent: rows.length === 0 ? 0 : Number(((checked / rows.length) * 100).toFixed(2)),
    sections: Object.fromEntries(bySection),
  };
}

function main() {
  let text;
  try {
    text = readFileSync(planPath, 'utf8');
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
      console.log('\nBy section:');
      for (const [section, counts] of Object.entries(summary.sections)) {
        console.log(`- ${section}: ${counts.checked} checked, ${counts.remaining} remaining, ${counts.total} total`);
      }
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}

export { parseChecklist, summarize };
