# Source intake recheck — Brain/Vault → G11 PREP_ONLY (3 сентября 2026)

## Цель и границы

Выполнена повторная read-only сверка внешнего Brain/Vault-источника с
зафиксированной G11 PREP_ONLY-очередью. Проверка отвечает только на вопрос
«не изменился ли intake и не потеряли ли мы записи/идентификаторы»; она не
считает записи опубликованными и не заменяет human authoring, semantic review,
provenance или owner revalidation. Тексты вопросов, ответы, решения, код и
исходные формулировки в target не копировались.

Источники:

- Vault: `/Users/sergeyzhechko/developer/fluent-interview/fluent-question-vault`
- Brain mapping:
  `/Users/sergeyzhechko/developer/fluent-interview/fluent-question-brain/releases/curriculum-mapping-2026-08-27-domain-separated.json`
- Target: `/Users/sergeyzhechko/developer/fluent-interview-platform`
- policy: `content/curriculum/research-authoring-policy.v1.json`

## Воспроизводимый прогон

Все JSON-результаты для прогона были записаны во временный каталог вне
репозитория. Команды не меняют serving, release pointer, learner state, БД или
Docker resources:

```text
node tools/content-compiler/inventory-vault.mjs <vault> <mapping> <inventory.json>
node tools/content-compiler/quality-inventory.mjs <vault> <mapping> <quality.json>
node tools/content-compiler/authoring-queue.mjs <quality.json> <queue.json> 0 100 10
node tools/content-compiler/research-authoring-pack.mjs <quality.json> <research.json> \
  content/curriculum/research-authoring-policy.v1.json 0 100 10
node tools/content-compiler/prep-only-batch.mjs <queue.json> <research.json> <batch.json>
```

Первый попытанный вызов `prep-only-batch` был остановлен валидатором, потому
что исторический research pack имел `autoPromotion=true`. Это fail-closed
поведение ожидаемо. Повтор с policy `metadataOnly=true,
autoPromotion=false` прошёл; старый артефакт не переписывался.

## Результат intake

| Метрика | Текущее значение | Ожидаемый закреплённый срез |
| --- | ---: | ---: |
| Markdown records | 1 597 | 1 597 |
| stable IDs | 1 594 | 1 594 |
| RU/EN prompts | 1 594 / 1 594 | 1 594 / 1 594 |
| accepted Brain mapping | 1 591 | 1 591 |
| unmapped/quarantine | 6 | 6 |
| candidate for editorial review | 0 | 0 |
| records requiring authoring | 1 591 | 1 591 |
| target release matches | 0 | 0 |

Распределение по path осталось прежним: `path.nodejs-typescript` — 294,
`path.java-spring` — 191, `path.frontend` — 161, `path.go` — 130,
`path.behavioral` — 103, `path.system-design` — 568,
`path.dotnet-csharp` — 75, `path.algorithms` — 52, `path.python` — 17,
`unknown` — 6.

Ключевые quality-фасеты по-прежнему показывают реальные пробелы: answer/solution
есть у 56 записей, task — у 227, mechanism — у 0, sources — у 0,
follow-ups — у 903, code — у 1 229. Это очередь authoring, а не готовый
учебный контент.

## Hash и PREP_ONLY reconciliation

| Артефакт | Hash/ID после recheck | Сверка |
| --- | --- | --- |
| inventory metadata | `b4bff1612440ab13e283ad4f9a83419b80c04ccb0efab8d27a193f2d40b5f4a9` | совпадает с G11 source inventory |
| quality content | `85e28bf497972f2bb7cc2f5dc7ff4ac78b0e37a55b21c82e91c11c92c6bba168` | совпадает с manifest/index |
| authoring queue | `e1c5bae785c2af8572498205888e89225ef41e9e25783772ac43b7c5ac940806` | совпадает с manifest/index |
| research pack | `research-authoring-b955a7c16bdc20fc` | non-promoting, 100-record batch |
| research pack state | `995c28edd030875ad9012d360aae851694dc93a320f3c9870c062b6b87f08a51` | совпадает с canonical batch |
| PREP_ONLY batch | `0352e39507705585a0d59a5428fcc94d535c4c4b38a176cb2cc0c95ffb1e345b` | совпадает с `G11/prep-only-batch-2026-09-02.json` |

Итог: **source drift не обнаружен**. 1 597/1 597 записей присутствуют в
инвентаризации, 80/80 bounded-пакетов и 1 597/1 597 record refs остаются
согласованы с worksheet index.

Политика batch остаётся fail-closed: `metadataOnly=true`,
`autoPromotion=false`, `servingWrites=false`, `releasePointerWrites=false`,
`reviewerRequired=true`, максимум 100 записей на batch. Никакого implicit
promotion из quality-флагов не произошло.

## Что это закрывает и что нет

Закрыто только доказательство стабильности входного intake и отсутствие
потерянных ссылок. Не закрыты:

1. G10S-246 current-main owner revalidation (reviewed head старше текущего
   target `main`);
2. human mapping/authoring/review первого пакета `G11-P001` и последующих
   пакетов;
3. answer/mechanism/sources/task/follow-ups/provenance для записей, которым
   эти фасеты нужны;
4. проверка path/role/domain relevance и release promotion;
5. G12.2/G12.3/G12.5 и independent sign-off.

Старые репозитории, сущности, Docker containers, volumes и caches **не
удалялись**. Push не выполнялся согласно ограничению CI Actions minutes.

## Следующий безопасный порядок

`G10S-246 exact current-main revalidation` → human `G11-P001` mapping and
authoring → reviewer decision/evidence commit → G11.2–G11.6 revalidation →
G12 release gates → human requalification и independent sign-off. Любая
попытка обойти owner snapshot или автоматически продвинуть запись должна
завершаться ошибкой.
