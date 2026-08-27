# Gate W16 — PASS WITH EXPLICIT COLLECTOR/ANALYTICS WARNINGS

The observability contract and privacy boundary are green. Required live
health/metrics probes and the Studio-only redaction boundary pass against the
current development stack. AI telemetry now carries an internal conversation
join and bounded latency/TTFT aggregates without exposing prompt, output,
profile, source or hidden-test data. Learner funnel events use a finite
vocabulary, and time-to-first-run is measured from a validated browser session
marker only after the first persisted run.

The wave is not a production promotion: Prometheus/Loki/Grafana are optional
and were enabled explicitly for this live run. Fifteen live checks passed,
including Runtime and Brain metrics, Prometheus target inventory, Loki query,
Grafana health/dashboard projection and Jaeger service discovery. The
disposable journey evidence also proves route → Lab run → Task Runtime trace
continuity, first-run timing and unchanged Sergey progress. The remaining
observability contract item is W16-003 (the full route → question → family →
revision → attempt join); it is kept explicit rather than inferred from a
correlation-only sample.

Evidence: `observability.json`, `tests.json`, `commands.jsonl`, and the
source/unit-test output captured by the gate.
