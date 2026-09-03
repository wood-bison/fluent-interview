# Greenfield plan progress — 2026-09-03 — G11-R09 overlay reuse guard

Снимок выполнен после target commit `158945bf1579c1a6fdcb422c67d9b7cea7473798`
(`gate(g11): add overlay reuse revalidation`) в
`/Users/sergeyzhechko/developer/fluent-interview-platform`. Commit локальный;
push не выполнялся из-за ограничения GitHub Actions. Удаление старых
репозиториев, сущностей, контейнеров, volumes и данных не выполнялось.

## Что сделано

- Добавлена политика `overlay-reuse-policy.v1.json` для Algorithms, System
  Design и Behavioral: metadata-only, разрешённые scopes, explicit shared key
  для generic reuse и ожидаемые capability/activity targets.
- Добавлен PREP_ONLY manifest с пустыми placement rows. Автоматическая
  promotion, import/release pointer, database/Docker и learner-progress writes
  явно запрещены.
- Добавлен fail-closed `G11-R09` guard. Он проверяет overlay set, source queue,
  Question IDs, canonical semantic keys, track/scope, duplicate reuse,
  released-catalog join, порядок и metadata boundary; тела вопросов/ответов не
  читаются и не создаются.
- Evidence JSON/Markdown сохранены в target G11; historical evidence index
  пересобран штатным генератором.

## Честный текущий результат

| Метрика | Значение |
| --- | ---: |
| Ожидаемые overlays | 3 (`algorithms`, `behavioral`, `system-design`) |
| Оценённые overlays | 0 |
| Blocked overlays | 3 |
| Failed overlays | 0 |
| Source queue records | 723 (`52` / `103` / `568`) |
| Current release placements | 0 |
| Generic/native placements | 0 / 0 |
| Duplicate canonical placements | 0 |

Итоговый статус — `PASS_WITH_GAPS`, `valid: true`; state hash
`6b77beb9a2ec797ed89064bd31e91e375da060ea2c8b77c5e8194581cf3d06d4`.
Структурные checks (`expectedOverlaySet`, `sourceQueueCoverage`, `sharedReuse`,
`canonicalDeduplication`, `releaseCoverage`, `deterministicOrdering`,
`metadataBoundary`) проходят либо честно фиксируют gap. Checkbox `G11-R09`
остаётся открытым: пустые placement rows не превращаются в production content.

## Проверки и воспроизводимость

- `node --test tools/content-compiler/test/g11-overlay-reuse-revalidation.test.mjs` — **4/4 PASS**;
- `pnpm content:gates` — **PASS**;
- `pnpm check` — **PASS**;
- `pnpm boundary:check` — **PASS**;
- `pnpm toolchain:check` — **PASS**;
- `pnpm architecture:evidence-schema` после commit — **PASS**, target clean;
- evidence index — `703/703` entries verified, `rewritesDetected=0`;
- `origin/main...main = 0 529` (push не выполнялся).

## Следующая очередь

1. Создать reviewed metadata/placement packs для трёх overlays, не смешивая
   generic reuse с native content и не дублируя canonical Question.
2. Повторить R09 после цельного pack batch; только `PASS` может закрыть gate,
   `PASS_WITH_GAPS` остаётся открытым.
3. Затем закрыть R12–R14, G12.5 requalification и independent review.

Формальные счётчики не менялись, потому что текущий PREP_ONLY guard не
доказывает production closure:

| Срез | Checked | Remaining | Total | Completion |
| --- | ---: | ---: | ---: | ---: |
| Формальный master-plan | 664 | 470 | 1 134 | 58,55% |
| Исполнимые gates/checks | 664 | 278 | 942 | 70,49% |
| Неразрушающее закрытие продукта | 664 | 128 | 792 | 83,84% |
| Product closure | 664 | 73 | 737 | 90,09% |
| Requalification + independent review | 0 | 55 | 55 | 0% |
| G13 decommission (отложен владельцем) | 0 | 150 | 150 | 0% |

Дата: 3 сентября 2026
