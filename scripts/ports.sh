#!/usr/bin/env bash
set -Eeuo pipefail

# Host-facing ports owned by the workspace. Container-internal ports stay
# standard; only these loopback/publication ports need collision protection.
ports=(
  47000 47300
  48127 48128 48227
  49300 49301 49302 49303 49304 49305 49306 49307 49308 49312
  14317 14318 54317 54318 55437 56686 56687
)

declare -A seen=()
for port in "${ports[@]}"; do
  if [[ -n "${seen[$port]:-}" ]]; then
    echo "Duplicate workspace host port: $port" >&2
    exit 1
  fi
  seen[$port]=1
done

printf 'Host port registry: %d unique dedicated ports (no standard app binds)\n' "${#ports[@]}"
printf '  Lab dev      web 47300 · API 47000\n'
printf '  Lab package  web 49300 · API 49301 · Postgres 49302 · Redis 49303\n'
printf '  Lab telemetry Grafana 49304 · Prometheus 49305 · Loki 49306 · Tempo 49307/49308 · Kafka 49312\n'
printf '  Question Brain API 48127 · CMS 48128 · Postgres 55437 · Jaeger 56686\n'
printf '  Task Runtime API 48227 · Jaeger 56687\n'
