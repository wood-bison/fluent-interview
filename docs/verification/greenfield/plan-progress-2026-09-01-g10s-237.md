# Master-plan progress — G10S-237

Дата snapshot: 1 сентября 2026

После закрытия G10S-237 master plan содержит **649 checked / 485 remaining /
1134 total (57.23%)**. Счётчик получен read-only командой
`pnpm plan:progress:json` после обновления чеклиста; формальный процент не
является утверждением о production readiness.

Закрытый slice: G10S-237 clean archive independence. Target implementation
начат коммитом `21ab02c`; clean-room corrections — `836d438`, `996f180`,
`9c11d85`, `3c729a1`; evidence marker — `1604224`. Один executable gate
прошёл за 130.4 s без push из-за Actions quota.

Проверено в hermetic archive и свежем clone: target main clean и ancestry к
G10S-236 (`e7040fa`) подтверждена; нет `.git`, symlink и nested Git; ровно один
tracked lockfile; source references/env — `0/false`; install, build, check,
detached dev, C098 export/import/journey и scoped cleanup завершились с exit
`0`. C098 journey имеет `PASS_WITH_LIMITATIONS` для человеческой spoken
части, но machine status `PASS`; persistent cleanup `0→0`, durable volumes
сохранены. Evidence остаётся metadata-only: тела контента, stdout/stderr и
секреты исключены.

Во время прогона исправлены три воспроизводимых проблемы: порядок clean-clone
check (content projections строятся до content tests), устаревший G10S-227
release manifest (6 записей, policy `.2`) и отсутствие семи исторических
screenshots, перечисленных immutable G10S-226 index. Индекс не переписывался.

Следующий executable пункт: **G10S-238** — commit-slice discipline и
доказуемая последовательность `docs → workspace → DB → domain → Studio →
corpus → adapter → C098 → retirement`. Следующие G10S-239…246 остаются
открытыми и требуют независимой проверки до разблокировки G11 breadth.

Локальный push намеренно не выполнялся: действует ограничение GitHub Actions
quota. Remote attestation остаётся открытой до разрешения владельца.
