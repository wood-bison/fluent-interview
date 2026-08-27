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
| Fluent Lab | `8786016502cb5d6949eade1e967743bbe985ef92` | quality/evidence gates, learning-module release и coverage operational finish |
| Fluent Lab | `44cb5d1709257a8e8e2b64dd6cfd9884e913903d` | deterministic path-completion authoring backlog |
| Fluent Lab | `ac7488d4255597ff109e50ce0f49f22ff703a452` | deterministic ordering of path backlog waves |
| Fluent Lab | `83b3dea5ad79ce47a5f209663d1d72d0f41e02ab` | canonical Brain binding release pin in PathCompletionManifest (removed file-digest identity drift) |
| Workspace | `5fe61a5` + current wave | pin Lab/Runtime revisions и release verifier с path/backlog gates |
| Workspace | `c2238894ac5ac7c8ea7476758f602b7a66fd64da` | cross-repo Question Brain authoring queue: 1572 exact path/card items, canonical release joins |

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
- cross-repo Question Brain coverage backlog (`1572` exact path/card items,
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

Единственное предупреждение development-профиля —
`package-provenance-plan (executable=false)`: пять рабочих деревьев содержат
локальные изменения, поэтому строгий package gate правильно не называет их
production package.

## Текущая projection и честный разрыв

`fluent-engineering-lab/docs/manifests/path-completion-development-2026-08-27.json`
остаётся `productionReady=false`, потому что опубликованный slice содержит
1591 primary placement, 0 supporting prompts, 33 activities и 0 checkpoints,
а learner contract требует 1601/699/464/51. Перечень разрывов по путям и
точные question IDs остаются в этом manifest.

Новая очередь
`fluent-engineering-lab/docs/manifests/path-completion-backlog-2026-08-27.json`
содержит 3645 стабильных открытых items:

- 1572 `capability-binding` review;
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
пытается «угадать» capability по prompt. Он сверяет все 1572 unresolved IDs с
Brain revision/hash и canonical binding report, объединяет capability/role
issues в один path/card item и требует новый immutable Brain release перед
пересборкой Lab projection.

Дополнительный cross-repository fix устранил identity drift: Lab больше не
вычисляет `binding-manifest:<file-digest>` как release ID. Он проверяет
подписанный Brain verification report, сверяет question release и число
entries, и публикует canonical `question-capability-release-…`.

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
