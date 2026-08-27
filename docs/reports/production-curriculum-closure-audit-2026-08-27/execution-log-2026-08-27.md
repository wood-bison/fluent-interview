# Исполнительный журнал production-closure — 27 августа 2026

Статус этого журнала: **обновлён после bounded wave; продукт ещё не
production-ready**.

## Что принято

| Владелец | Commit | Результат |
| --- | --- | --- |
| Question Brain | `060b834708bd04875ebd122401e4319812d2f976` | release-pinned capability coverage target, migration `0022`, fail-closed binding contract |
| Task Runtime | `cbcb8085ecbcb5d1b0bc01ab788dd5a9adc5c668` | `TaskPortfolioManifest` 168 families / 456 revisions target и portfolio validator |
| Task Runtime | `31faf9355fcacd40cafc016d374ef5847598666f` | deterministic answer-free backlog: 153 family + 437 revision work items, six bounded waves |
| Task Runtime | `59ee13fee149cdbeaeeb67f70284fe458b63ee02` | sandbox hardening: immutable image verification, learner-diagnostic redaction, and bounded cleanup of timed-out containers |
| Task Runtime | `e0a794a7ac9268089f9b216b2a3d17756c4a80e8` | consolidated task release hardening, image-manifest check, language task descriptors and CI verification |
| Fluent Lab | `8786016502cb5d6949eade1e967743bbe985ef92` | quality/evidence gates, learning-module release и coverage operational finish |
| Fluent Lab | `44cb5d1709257a8e8e2b64dd6cfd9884e913903d` | deterministic path-completion authoring backlog |
| Fluent Lab | `ac7488d4255597ff109e50ce0f49f22ff703a452` | deterministic ordering of path backlog waves |
| Fluent Lab | `83b3dea5ad79ce47a5f209663d1d72d0f41e02ab` | canonical Brain binding release pin in PathCompletionManifest (removed file-digest identity drift) |
| Fluent Lab | `2dd4d39d7bc60717d7e4f60f8d8a9e5537a9df6f` | consolidated curriculum projection, runtime binding, route, accessibility, desktop and production-gate hardening |
| Fluent Lab | `708a3ce9f58ef9d5cf4dce3a67ee5c14d54a3f6a` | current live gate evidence refreshed after clean-child release rehearsal |
| Fluent Lab | `c8f73c37c642a65a42127b9696022f9fbd59e4d8` | final live evidence refresh after runtime/Jaeger operational repair |
| Fluent Lab | `957e15ef5d58b9c2d6c809c714b330afac112e6e` | owner-boundary/glossary evidence refreshed during verifier parser repair |
| Fluent Lab | `a82696b79ddd05116c71ca4d8f2efb1f28b6de7c` | deterministic verifier evidence captured after the final clean-child rehearsal |
| Fluent Lab | `9ac8b11372cebe28ed9082469a796e893338e8a0` | joined capability binding release `question-capability-release-e7d6f9ad743d4f43`; path projection/backlog refreshed |
| Vue learner | `1ddcc83f2c6a920a3d3e49c9a2fdc4075a8f8cc4` | consolidated route/runtime parity, reusable UI runtime picker and E2E/visual matrix |
| Question Brain | `0baa8ef5a3dcc0fcf848831833e585824ec57fcb` | domain-separated graph release, evidence guards, migrations and graph-release audit |
| Question Brain | `d45c6966979f62a1cd9178a9543ff40d6ac2f53` | auditable integrity-remediation endpoint for revoking an invalid accepted capability proposal |
| Question Brain | `79ffe30effb9fd0881921768991f87129e6b1cac` | event-loop binding wave evidence: ten reviewed placements and immutable release `e7d6f9ad743d4f43` |
| Workspace | `f7ff0a3` + current wave | pin Lab/Runtime revisions и deterministic release verifier с path/backlog gates |
| Workspace | `c2238894ac5ac7c8ea7476758f602b7a66fd64da` | cross-repo Question Brain authoring queue: 1572 exact path/card items, canonical release joins |
| Workspace | current wave | Brain/Lab pins, release-verifier defaults, and W13 coverage evidence now point to immutable release `e7d6f9ad743d4f43` |

Root `workspace.yaml` закрепляет текущие child SHAs; Vue и Question Vault
остаются на своих проверенных revision. Remote push намеренно не выполнялся:
`publish_authorized=false` в исполняемом плане.

## Доказанные проверки

Команда `pnpm release:verify:dev` после последней волны завершилась с exit 0.
Все следующие шаги имеют `PASS`:

- Question Brain, Task Runtime и Lab readiness;
- `lab-check`, `vue-check`, schema/canonical route/observability;
- graph release, learning-module release, TrackView isolation;
- path completion и path-completion backlog;
- Task Runtime portfolio backlog (`590` open items: `153` families + `437` revisions);
- cross-repo Question Brain coverage backlog (`1563` exact path/card items,
  16 bounded waves; all currently `theory_only` and intentionally unbound);
- activity corpus, runtime bindings, route actions и EN/RU funnels;
- catalog integrity, accessibility, desktop visual/regression и Vue E2E;
- runtime boundary negative test и failure matrix.

После того прогона failure matrix отдельно поймала operational-регрессию: Jaeger
зависал на поиске trace после серии timeout-run, а Docker оставлял живые
`audit-failure-timeout` контейнеры. Они были удалены точечно (9 контейнеров),
Jaeger перезапущен, runtime пересобран с `59ee13f`. Повторная live-матрица
завершилась `valid=true`: pass/fail/compile/timeout, redaction,
resource-policy и `trace-evidence-identity` прошли; после неё namespace
`fluent-runtime-task-*` пуст.

В финальном development-прогоне предупреждений нет: `package-provenance-plan`
прошёл с `executable=true` и `sourceClean=true` после фиксации всех child
evidence. Строгий production-профиль по-прежнему отдельно требует
`publish_authorized=true` и закрытия нормативного контентного разрыва.

## Текущая projection и честный разрыв

`fluent-engineering-lab/docs/manifests/path-completion-development-2026-08-27.json`
остаётся `productionReady=false`, потому что опубликованный slice содержит
1591 primary placement, 0 supporting prompts, 33 activities и 0 checkpoints,
а learner contract требует 1601/699/464/51. Перечень разрывов по путям и
точные question IDs остаются в этом manifest.

Новая очередь
`fluent-engineering-lab/docs/manifests/path-completion-backlog-2026-08-27.json`
содержит 3636 стабильных открытых items:

- 1563 `capability-binding` review;
- 699 `supporting-prompt` authoring;
- 431 `activity` authoring/binding;
- 334 missing `primary-question` slots;
- 307 excess-primary target-selection reviews;
- 233 `lesson` slots;
- 51 `checkpoint` slots;
- 18 `module` registry slots.

Backlog не генерирует вопросы и ответы, не удаляет discovery-карточки и не
публикует runtime revisions. Python остаётся нулевым learner target preview и
не превращается в destructive reclassification queue.

Task Runtime backlog соблюдает тот же принцип: это не runnable-каталог и не
filler-контент. Он адресует exact compatibility gaps у известных семейств и
новые family/revision пары, а release допускается только после immutable
starter/hidden-test/hash и deterministic pass/fail/error evidence.

Question coverage backlog (`docs/verification/two-audit-remediation/W13`) не
пытается «угадать» capability по prompt. Он сверяет все 1563 unresolved IDs с
Brain revision/hash и canonical binding report, объединяет capability/role
issues в один path/card item и требует новый immutable Brain release перед
пересборкой Lab projection. Десять event-loop items удалены из очереди только
после explicit accepted review и нового Brain release.

Дополнительный cross-repository fix устранил identity drift: Lab больше не
вычисляет `binding-manifest:<file-digest>` как release ID. Он проверяет
подписанный Brain verification report, сверяет question release и число
entries, и публикует canonical `question-capability-release-…`.

Финальный прогон от `2026-08-27T22:07:17.174Z` завершился `valid=true`:
51/51 шагов (`lab-check`, `vue-check`, readiness, graph/path/content gates,
runtime failure matrix, accessibility, desktop visual/regression и Vue E2E)
прошли с новым Brain/Lab release tuple. `productionPromotable=false` является ожидаемым результатом режима
`--dev`, а не ошибкой проверки.

## Следующая волна

1. Взять максимум 100 items из очереди с owner/reviewer и wave-contract.
2. Сначала закрыть `capability-binding`/`question-role` в Brain; затем
   выпустить новый immutable Question Brain release.
3. После него создать reviewed Lessons и placements в Lab; повторить
   `PathCompletionManifest` и backlog, не переиспользуя старый digest.
4. Для activity items принять disposition (`runtime|design|incident|spoken|
   project|brief|reject`); только runtime получает exact compatible
   TaskRevision из Task Runtime.
5. Обновить root pin отдельным integration commit и повторить полный
   `pnpm release:verify:dev` плюс deliberate failure injection.

До закрытия всех mandatory targets нельзя объявлять `big-tech-complete` или
Learner mastered. Разработка не заморожена: каждый новый gap превращается в
следующий bounded item с evidence.
