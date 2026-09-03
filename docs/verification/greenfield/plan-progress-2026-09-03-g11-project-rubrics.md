# Plan progress — G11 project interview rubrics

Дата: 3 сентября 2026

## Закрыто

- `G11-033`: versioned system-design rubric с exact 8/8 dimensions.
- `G11-034`: versioned incident rubric с exact 6/6 dimensions.
- Additive release сохраняет исторические `.3`/v1 артефакты.
- Stale rubric revision и неполный ответ fail closed.
- Evidence не содержит learner response bodies.

Target commit: `0fb8b21 feat(g11): release complete project interview rubrics`.

## Проверено

- `pnpm learning-project-rubrics:g11` — PASS, 11/11 checks.
- `node --test tools/projects/test/*.test.mjs` — 5/5 PASS.
- `pnpm --dir apps/api test` — 67/67 PASS.
- `pnpm test:g11.5-learning-quality` — 12/12 PASS.
- `pnpm learning-quality:g11.5-readiness` — valid, `5 ready / 3 blocked`.
- `pnpm check`, `pnpm boundary:check`, `pnpm toolchain:check` — PASS.

## Остаток

- Формальный: `463` из `1 134`.
- Исполнимый: `271` из `942`.
- Исполнимый неразрушающий: `121` из `792`.

Следующий машинно исполнимый пункт — `G11-029`. Spoken/external human evidence
для `G11-035/036` остаётся owner-controlled и не синтезируется.
