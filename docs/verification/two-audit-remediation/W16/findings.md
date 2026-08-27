# W16 findings

## Passed

- Shared `observability.v1` contract, service/operation vocabulary, identity
  validation, redaction and replay bounds are present and executable.
- Learning API has correlation middleware, structured pino logging, Prometheus
  metrics and a Studio-only diagnostics/replay boundary.
- AI telemetry records provider/status/error/cancel events and now aggregates
  total latency and time-to-first-token without returning private identifiers.
- Runtime and Brain both install OTLP trace propagation with service identity;
  Brain exposes a direct Prometheus text endpoint.
- Task Runtime now exposes a bounded Prometheus endpoint at `/v1/metrics` with
  aggregate request/run counters and no task, correlation or learner labels.
- Compose contains one optional, digest-pinned observability profile with
  Prometheus, Loki, Promtail and Grafana; Jaeger is owned by the Brain stack
  and is joined through the shared host ports.
- `observability` unit tests pass, and live Lab/Runtime/Brain readiness,
  metrics and Studio redaction probes pass against the current dev stack.
- Build identity is present in the shared projections and live Runtime/Brain
  readiness responses; the currently running developer Lab process may still
  report its historical `unknown` identity until the next owned restart.
- The learner funnel has a finite event/outcome vocabulary and the first-run
  timing histogram is bounded, label-free, validated at the HTTP boundary and
  de-duplicated per browser session marker.
- Brain `/metrics` is now an explicit package-owned Prometheus target; the
  target inventory shows both Brain and Task Runtime healthy.
- A disposable released Node rate-limiter journey proved route readiness,
  family/revision binding, 4/4 runtime tests, first-run timing, and a shared
  Jaeger trace across Learning API and Task Runtime. The before/after stable
  Sergey progress projection hash is identical.

## Explicit warnings / promotion debt

- The ordinary learner-only launch does not start Prometheus, Loki or Grafana;
  this run intentionally enabled the optional profile and verified Prometheus,
  Loki query, Grafana health and Jaeger service discovery live (15 checks).
- The full route → question → family → revision → attempt join remains open as
  W16-003; this journey proves route → released family/revision → attempt and
  deliberately does not infer a question join that the public projection does
  not expose.
- The ordinary learner-only launch still does not start Prometheus, Loki or
  Grafana; the optional profile was enabled explicitly for this live gate.
