# Strata source drift revalidation — G10S-210 follow-up (3 сентября 2026)

## Результат

Повторный `pnpm architecture:source-target-reconciliation` на target `main`
`8dba70e0e0002a7b43d2bf6690cc0254ab6526ec` завершился **FAIL** только по
source-snapshot drift. Это fail-closed остановка, а не разрешение молча
переписать frozen manifest.

| Поле | Frozen snapshot | Текущее состояние |
| --- | --- | --- |
| Strata branch | `main` | `main` |
| Strata HEAD | `ec3b6804ecc1d08e3ab355be0c78930a46b34815` | `0921dd0271983244a5cc96301ba0b242369cafd2` |
| Worktree | clean | clean |
| Files in manifest | 41 | 41 |
| Missing files | 0 | 0 |
| Target transfer | 13 mappings / 28 dispositions | transfer validator PASS |
| Target migrations | contiguous 1…18 | PASS |
| PostgreSQL invariants | inherited 12/12, platform 16/16, roles 12 | PASS |

Между frozen HEAD и текущим Strata изменились только два документа:

- `docs/migration.md`: `7293 → 7865` bytes;
  `9ebcd46b…` → `21a41f5d…`;
- `docs/plan.md`: `10338 → 10942` bytes;
  `b998b691…` → `fd5456d1…`.

Commit `0921dd0` помечает Strata как migrated reference и не добавляет схем,
кода, question bodies или новых runtime inputs. Тем не менее эти изменения
нарушают exact source identity, на которой основаны G10S-210/G10S-217 и
transfer ledger.

## Почему manifest не обновлён автоматически

`source-manifest.json`, archive tag `strata-archive-2026-09-01-g10s-217` и
transfer ledger образуют immutable provenance boundary. Даже docs-only commit
нельзя подменить новым HEAD без:

1. просмотра diff и решения, остаются ли документы reference-only;
2. нового exact source snapshot (manifest + checksums + clean clone);
3. повторной проверки target transfer ledger и G10S-210 evidence;
4. current-main G10S-246 revalidation, потому что target уже изменился после
   reviewed owner packet.

Автоматическая смена `source.head` скрыла бы дрейф и позволила бы старому
owner/evidence пакету выглядеть актуальным. Поэтому текущий результат
считается `REVALIDATION_REQUIRED`.

## Воспроизведение

```text
pnpm architecture:source-target-reconciliation
```

Сводка machine report:

```text
schemaVersion=g10s-strata-target-reconciliation.v1
status=FAIL
sourceDriftCount=2
missingFileCount=0
transferValidation.valid=true
invariants.status=PASS
failures=[source HEAD differs from frozen manifest, source file bytes/SHA drifted]
```

Содержимое источника не публиковалось в отчёт: сохранены только пути,
размеры, SHA-256 и disposition metadata. Старые репозитории, архивы, Docker
resources, volumes и caches не удалялись.

## Следующее действие

Сначала owner/архитектор выбирает: (a) сохранить `ec3b680…` как immutable
reference и вернуть Strata к нему для проверки, либо (b) принять `0921dd0…` как
новый reference и пройти отдельный snapshot/revalidation. После выбранного
решения повторяются `architecture:strata-archive`,
`architecture:source-target-reconciliation` и G10S-211 golden fixtures.
До этого нельзя менять manifest/ledger, ставить G10S-210 PASS или удалять
Strata.
