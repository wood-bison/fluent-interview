# M4 counter drill-down gate

- Status: **PASS**
- API: `http://127.0.0.1:49301`
- Counters checked: **12/12**
- Policy: every counter has an owner, formula, release/snapshot provenance and a reachable public drill-down route.

| Counter | Value | Owner | Drill-down |
| --- | ---: | --- | --- |
| `programCount` | 1 | inventory-compiler | `/api/program/current` |
| `pathCount` | 9 | program-map | `/api/program/map` |
| `areaCount` | 15 | program-map | `/api/program/map` |
| `stationCount` | 81 | program-map | `/api/program/map` |
| `questionCardCount` | 1591 | question-brain | `/api/questions/summary` |
| `topicGroupCount` | 135 | question-brain | `/api/questions/summary` |
| `capabilityCount` | 68 | program-map | `/api/program/map` |
| `taskFamilyCount` | 15 | task-runtime | `/api/runtime/task-families` |
| `taskRevisionCount` | 19 | task-runtime | `/api/runtime/task-families` |
| `runnableStationCount` | 27 | learner-progress | `/api/progress` |
| `stationBoundCardCount` | 6 | question-brain | `/api/program/coverage` |
| `evidenceCount` | 0 | learner-progress | `/api/curriculum/progress` |

No failures.
