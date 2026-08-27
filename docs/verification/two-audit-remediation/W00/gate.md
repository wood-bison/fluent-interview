# W00 gate — PASS с объявленным production provenance blocker

## Решение

`W00` закрыт для перехода к W01. Baseline, ownership inventory, live health,
Brain backup/restore и development release verification имеют воспроизводимые
evidence.

## Evidence

- `baseline.json` — Git/Compose/release snapshot.
- `commands.jsonl` — выполненные read-only команды и результаты.
- `tests.json` — machine-readable gate result.
- Brain backup/restore: `dump_bytes=126951879`, `restored_questions=6012`.
- `pnpm release:verify:dev`: `valid=true`, все executable steps PASS.

## Важная граница

Это не production promotion. `productionPromotable=false` ожидаемо, потому что
Vue не имеет remote, а product roots имеют dirty working trees. Внешний
`spearad-test-stack` и чужие контейнеры зафиксированы как не-owned и не
затрагивались.

## Следующая волна

`W01` начинается с remote-backed Vue, exact revision pins, frozen bootstrap и
fresh-clone verification. Нельзя обходить этот blocker ручными абсолютными
путями или синтетическим `clean` флагом.
