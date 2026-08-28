# W15 — Vue performance gate

Снимок: 2026-08-28T11:06:12.178Z
Статус: **pass**

| Boundary | Result |
| --- | --- |
| Initial JS | 299.4 KiB raw / 93.0 KiB gzip (budget 342 KiB) |
| Initial CSS | 47.4 KiB raw / 9.4 KiB gzip |
| xterm | 323.5 KiB lazy; initial=not loaded |
| Question list | bounded cursor pagination |

The report is a loading-boundary check, not a claim that all route interactions are fast; interaction budgets and visual performance remain in W17.
