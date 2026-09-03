# G10S‑222 scoped cleanup rehearsal — 3 сентября 2026

## Результат

Команда target:

```text
pnpm architecture:scoped-cleanup
```

создала уникальный disposable Compose project `fluent-g10s-222-mtljo21d`
(`webPort=47590`) и завершилась **`status=PASS`**. Evidence hash:
`83abade5748065d8f4991bf36a718a0127775a0aad4a532834f110a985a53944`.

- initial `pnpm dev --detached --json`: `ready`, 7 сервисов;
- optional observability profile: exit code `0`;
- первый и финальный `pnpm down --json`: exit code `0`;
- после обоих down: **0 контейнеров, 0 сетей**;
- после обоих down: **3 durable volumes сохранены** с той же identity
  (`otel-data`, `platform-events`, `postgres-data`);
- migration ledger до restart и после restart: **18/18**;
- volume-delete flags (`-v`, `--volumes`): **не использовались**;
- cleanup был ограничен изолированным Compose project.

После завершения проверено через Docker inventory: контейнеров и сетей с этим
stack id нет; три именованных durable volumes оставлены намеренно. Рабочий
stack пользователя на `47350`, другие проекты, данные и кэши не затрагивались.

## Граница доказательства

Гейт подтверждает scoped local Compose cleanup и сохранение named volumes. Он
не доказывает garbage collection на production host или remote backup. Это не
owner acceptance, не content promotion и не разрешение на G13 cleanup.
