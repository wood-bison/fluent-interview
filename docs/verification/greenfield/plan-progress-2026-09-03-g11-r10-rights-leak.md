# Greenfield plan progress — 2026-09-03 — G11-R10

Снимок выполнен после локального target-коммита
`0e5f970` (`gate(g11): revalidate public rights boundary`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`.

## Что закрыто

- `G11-R10` отмечен как `PASS`: public release bundle и повторно декодированная
  learner projection не содержат авторских/приватных полей, hidden evaluator
  данных, credentials или небезопасных source URLs.
- Проверка пересобирает bundle из текущего catalog, парсит ровно те же байты,
  проверяет allowlist и rights boundary на обеих поверхностях, а затем меняет
  порядок входных коллекций. Bundle остаётся byte-identical и deterministic.
- Текущий release: `6` records, `12` translations, `10` placements, `40` roles,
  `6` supporting prompts, `7` activities, `3` graph edges; обе поверхности —
  `32,945` bytes и SHA-256 `0d7683c3…`; findings по обеим поверхностям `0`.
- Focused regression `2/2`, full target `pnpm check`, `pnpm boundary:check`,
  `pnpm toolchain:check` и post-commit `pnpm architecture:evidence-schema` —
  `PASS`; target `main` clean.

## Что именно проверяет gate

1. Политику allowlist публичного bundle.
2. Отсутствие запрещённых имён полей (`provenance`, `review`, source bodies,
   hidden tests, credentials и т. п.).
3. Отсутствие high-confidence credential/secret patterns.
4. Только HTTPS source URLs без user/password в URL.
5. Повторный decode exact transport bytes через learner decoder.
6. Deterministic serialization/hash при перестановке catalog.
7. Metadata-only authority boundary: `0` DB/Docker/serving/release/push writes.

Gate не делает semantic originality/copyright review, не импортирует bundle в
serving и не активирует release. Эти границы остаются отдельными human и
production gates.

## Reproducible progress

`pnpm plan:progress:json` из umbrella workspace после обновления чекбокса:

| Срез | Checked | Remaining | Total | Completion |
| --- | ---: | ---: | ---: | ---: |
| Формальный master-plan | 663 | 471 | 1 134 | 58,47% |
| Исполнимые gates/checks | 663 | 279 | 942 | 70,38% |
| Неразрушающее закрытие продукта | 663 | 129 | 792 | 83,71% |
| Product closure | 663 | 74 | 737 | 89,96% |
| Requalification + independent review | 0 | 55 | 55 | 0% |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 | 0% |

`G11-R10` закрывает только rights-leak boundary для текущего release. Он не
подменяет G11 breadth, corpus classification/reviewer decisions,
language/runtime packs, G11-R07…R09/R11…R14, G12.5 или independent review.
Старые репозитории, сущности, Docker containers/volumes и данные не удалялись;
push не выполнялся из-за ограничения CI.

Дата: 3 сентября 2026
