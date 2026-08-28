# W04 lifecycle evidence — 28 августа 2026

## Result

Development lifecycle scenario **PASS**. Optional broker and observability
containers were started explicitly, then the canonical `pnpm down` removed all
five optional-profile containers. The six unrelated containers present on the
host were byte-for-byte unchanged. No durable volume was removed.

After the normal down, the canonical `pnpm run dev` launcher started cleanly.
Learner progress for the server-owned `sergey` profile retained the same stable
projection hash (`502dbf32…bd6f85c`) and 81 capability rows. Web, Questions,
Learning API, Question Brain, Task Runtime and the shared Trace Explorer all
returned HTTP 200.

## Scope boundary

This closes the development evidence for W04-019 (optional profiles stop),
W04-025 (restart preserves data) and W04-027 (clean start after normal down).
It does not claim production-package restart, exact-digest rollback, or signed
SBOM/provenance; those remain explicit W04/W18 work.

Machine-readable details: `lifecycle-2026-08-28.json`.
