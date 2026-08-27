# Question coverage authoring backlog v1

Статус: **development / open** (27 августа 2026)

`PathCompletionManifest` сообщает, какие Question Brain cards попали в
learner projection без принятого capability/role. Brain остаётся единственным
владельцем вопроса и его release. Этот cross-repository manifest соединяет
только release pins и создаёт адресную очередь редакторской работы — по одному
item на пару `pathKey + questionId`.

## Что гарантирует контракт

- stable key, revision UUID и content hash сверены с одним pinned Brain
  binding release;
- canonical `question-capability-release-…` берётся из Brain verification
  report, а не вычисляется из локального файла;
- повторное использование одной карточки на нескольких путях видно через
  `repeatedAcrossPaths`, поэтому shared binding не принимается молча;
- `capability-binding` и `question-role` объединены в один item на path/card,
  чтобы один редакторский review не дублировался;
- queue answer-free: она не создаёт capability, role, prompt, lesson, answer
  или runtime task и не меняет опубликованный release;
- `wave`/`batchPosition` ограничивают batch 100 item, а `productionReady`
  всегда `false` до нового immutable Brain release и повторной Lab projection.

## Закрытие item

Item закрывается только после явного решения редактора (canonical capability и
role либо disposition), evidence/provenance и нового Question Brain release.
Lab затем обязан пересобрать `PathCompletionManifest` и его backlog. Match по
заголовку, количество карточек или локальный fallback не считаются доказательством.

## Reproduction

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm coverage:backlog
pnpm coverage:backlog:check
pnpm coverage:backlog:test
```

Generated files:

- `docs/verification/two-audit-remediation/W13/question-coverage-authoring-backlog.json`
- `docs/verification/two-audit-remediation/W13/question-coverage-authoring-backlog.md`
