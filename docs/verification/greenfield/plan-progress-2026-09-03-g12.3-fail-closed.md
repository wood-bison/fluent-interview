# Greenfield plan progress — 2026-09-03 — G12.3 fail-closed hardening

Снимок выполнен после target commits `200e47d` (`fix(g12.3): fail closed on
open dispositions`) и `e3dc5df` (`docs(g12.2): refresh readiness evidence`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commits локальные;
push не выполнялся из-за ограничения GitHub Actions. Старые репозитории,
сущности, containers/volumes и данные не удалялись.

## Что исправлено

G12.3 раньше мог принять вручную изменённую `ready`-строку, если в manifest
появилось хотя бы одно evidence, даже когда state-evidence registry всё ещё
сообщал об открытых экранных dispositions. Теперь guard:

- требует для `ready` ровно четыре обязательных evidence kind —
  `interaction`, `visual`, `semantic`, `disposition` — без дубликатов;
- требует, чтобы все четыре kind были представлены и имели разрешённый путь и
  SHA-256;
- fail-closed добавляет `ready-row-without-screen-dispositions` и
  `ready-row-without-state-evidence`, если manifest пытается перейти в ready до
  machine registry closure;
- сохраняет честный `PASS_WITH_GAPS` для текущей blocked строки, не меняя
  production/release state.

## Проверки

- `pnpm test:g12.3-port-ledger` — **6/6 PASS**, включая regression с ready-row
  при 12 открытых dispositions;
- `pnpm port-ledger:g12.3-readiness` — `PASS_WITH_GAPS`, `valid: true`,
  `1/1` blocked, state evidence `71/71`, open dispositions `12`;
- полный target `pnpm check` прошёл кодовые gates; после штатного обновления
  G10S-226 index финальные evidence-schema, evidence-inputs, boundary,
  toolchain и `git diff --check` — **PASS**;
- target clean после производного evidence commit; локальная ветка опережает
  `origin/main` на `543` commits; push не выполнялся.

Formal master-plan counters не изменены: hardening guard не закрывает 12 owner
dispositions, G11 breadth, G12.5, independent review или G13. Следующее
действие — получить и привязать все 12 owner dispositions, затем повторить
G12.3 на свежем target SHA.

Дата: 3 сентября 2026
