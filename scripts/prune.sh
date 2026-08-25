#!/usr/bin/env bash
set -Eeuo pipefail

# Workspace-owned, recoverable cleanup. This intentionally does not run
# `docker system prune` or delete durable volumes. It removes only legacy
# Fluent Lab Compose names that are no longer referenced by docker-compose.yml
# and stopped containers from this workspace's Compose project.

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
remove_build_cache=false

for arg in "$@"; do
  case "$arg" in
    --build-cache) remove_build_cache=true ;;
    -h|--help)
      cat <<'USAGE'
Usage: pnpm prune:workspace [--build-cache]

Removes only stale Fluent Lab Compose resources from this workspace.
Durable Postgres/Redis and current observability volumes are preserved.
--build-cache additionally removes Docker builder cache older than 7 days.
USAGE
      exit 0
      ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

command -v docker >/dev/null 2>&1 || { echo 'Missing command: docker' >&2; exit 1; }
docker info >/dev/null 2>&1 || { echo 'Docker Desktop is not running.' >&2; exit 1; }

legacy_volumes=(
  fluent-engineering-lab_fel-tempo-data
  fluent-engineering-lab_fel-grafana-data
  fluent-engineering-lab_fel-prometheus-data
  fluent-engineering-lab_fel-loki-data
  fluent-engineering-lab_fel-pgdata
)

removed=0
for volume in "${legacy_volumes[@]}"; do
  if ! docker volume inspect "$volume" >/dev/null 2>&1; then
    continue
  fi
  containers="$(docker volume inspect --format '{{json .Containers}}' "$volume")"
  if [[ "$containers" != '{}' && "$containers" != 'null' ]]; then
    echo "Preserving mounted legacy volume: $volume"
    continue
  fi
  docker volume rm "$volume" >/dev/null
  echo "Removed legacy volume: $volume"
  removed=$((removed + 1))
done

stopped_project_containers="$(docker ps -aq \
  --filter 'status=exited' \
  --filter 'label=com.docker.compose.project=fluent-engineering-lab')"
if [[ -n "$stopped_project_containers" ]]; then
  docker rm $stopped_project_containers >/dev/null
  echo 'Removed stopped Fluent Lab project containers.'
fi

if [[ "$remove_build_cache" == true ]]; then
  docker builder prune --force --filter until=168h >/dev/null
  echo 'Removed Docker builder cache older than 7 days.'
fi

echo "Workspace cleanup complete (legacy volumes removed: $removed)."
docker system df
