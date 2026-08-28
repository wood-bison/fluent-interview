# W15 — Vue performance gate

Снимок: 2026-08-27T23:57:04.031Z
Статус: **pass**

| Boundary | Result |
| --- | --- |
| Initial JS | 299.1 KiB raw / 92.8 KiB gzip (budget 342 KiB) |
| Initial CSS | 47.3 KiB raw / 9.3 KiB gzip |
| xterm | 323.5 KiB lazy; initial=not loaded |
| Question list | bounded cursor pagination |

The report is a loading-boundary check, not a claim that all route interactions are fast; interaction budgets and visual performance remain in W17.
