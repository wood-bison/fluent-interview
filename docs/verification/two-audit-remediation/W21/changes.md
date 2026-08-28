# W21 — что закрыто

Дата: **2026-08-28**

## Изменения

1. **Исправлен release verifier.** Static validation matrix теперь пишет в
   отдельный `W17/validation-matrix-static.json` и больше не перезаписывает
   live `W17/validation-matrix.json`. Поэтому development evidence сохраняет
   реальные live API/route checks.
2. **Синхронизирован workspace pin.** `workspace.yaml` указывает на текущий
   Lab commit `5c6eef80edf3ae76bd827a3e6fc75529d9bf2fd3`; все остальные четыре
   компонента также совпадают с их immutable pins.
3. **Закрыта package provenance boundary.** Старый backup был отклонён
   lifecycle-gate как устаревший. Создан новый full-local backup и выполнен
   безопасный stop → upgrade после предварительной проверки артефакта. Новый
   package readiness подтверждён на web/API/Brain/Runtime/Postgres/Redis.
4. **Обновлены evidence.** G14 hardening, G9 deviation и W02 browser/glossary
   gates записаны после live-прогона; все failures и warnings пусты.
5. **Повторён полный release цикл.** Development — `55/55 PASS`; strict —
   все функциональные шаги PASS, а production promotion остановлен только
   ожидаемым отсутствующим remote для локального Vue.

## Воспроизводимый порядок

```text
pnpm --dir fluent-engineering-lab package:local:status
DATABASE_URL=postgres://fel:fel@127.0.0.1:49302/fluent_lab \
  pnpm --dir fluent-engineering-lab g8:02:backup -- \
  --full-local --output /tmp/fel-full-local-backup-20260828-1152.json
pnpm --dir fluent-engineering-lab package:local:stop
pnpm --dir fluent-engineering-lab package:local:upgrade -- \
  --artifact /tmp/fel-full-local-backup-20260828-1152.json
pnpm release:verify:dev -- \
  --out=docs/verification/two-audit-remediation/W21/release-verify-dev-final.json
pnpm release:verify -- \
  --out=docs/verification/two-audit-remediation/W21/release-verify-strict-final.json
```

Команды не удаляют learner data и не используют destructive database reset;
backup/restore boundary и `dataPreserved` проверяются lifecycle-контрактом.

## Открытый governance пункт

Чтобы получить `valid: true` в strict production, нужно опубликовать
`fluent-engineering-vue` в доверенном remote и заменить `local-only` на его
реальный URL/commit policy. Мы не подменяем этот факт фиктивным remote и не
ослабляем strict gate.
