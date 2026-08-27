#!/usr/bin/env bash
set -Eeuo pipefail

# Workspace-owned, recoverable cleanup. This intentionally does not run
# `docker system prune` or delete durable volumes. It removes only legacy
# Fluent Lab Compose names that are no longer referenced by docker-compose.yml
# and stopped containers from this workspace's Compose project.

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
remove_build_cache=false
plan_only=false

for arg in "$@"; do
  case "$arg" in
    --build-cache) remove_build_cache=true ;;
    --plan) plan_only=true ;;
    -h|--help)
      cat <<'USAGE'
Usage: pnpm prune:workspace [--plan] [--build-cache]

Removes only stale Fluent Lab Compose resources from this workspace.
Durable Postgres/Redis and current observability volumes are preserved.
--plan prints the exact owned resources that would be considered and makes no
changes. It is the required first step before any cleanup.
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

if [[ "$plan_only" == true ]]; then
  echo 'Workspace prune plan (read-only)'
  echo 'Owned Compose project: fluent-engineering-lab'
  echo 'Durable volumes are never cleanup targets:'
  echo '  fluent-engineering-lab-postgres, fluent-engineering-lab-redis'
  echo 'Legacy volume candidates:'
  for volume in "${legacy_volumes[@]}"; do
    if ! docker volume inspect "$volume" >/dev/null 2>&1; then
      echo "  $volume  absent"
      continue
    fi
    containers="$(docker volume inspect --format '{{json .Containers}}' "$volume")"
    if [[ "$containers" != '{}' && "$containers" != 'null' ]]; then
      echo "  $volume  mounted; preserve; containers=$containers"
    else
      echo "  $volume  unmounted; removable"
    fi
  done
  echo 'Stopped owned project containers:'
  stopped_plan="$(docker ps -a --format '{{.Names}}\t{{.Status}}' \
    --filter 'status=exited' \
    --filter 'label=com.docker.compose.project=fluent-engineering-lab')"
  if [[ -n "$stopped_plan" ]]; then
    printf '%s\n' "$stopped_plan" | sed 's/^/  /'
  else
    echo '  none'
  fi
  if [[ "$remove_build_cache" == true ]]; then
    if docker buildx inspect fluent-interview-builder >/dev/null 2>&1; then
      echo 'Dedicated builder fluent-interview-builder: present; cache older than 7d would be eligible.'
    else
      echo 'Dedicated builder fluent-interview-builder: absent; cache cleanup would be skipped.'
    fi
  else
    echo 'Builder cache: unchanged (pass --build-cache to inspect dedicated builder only).'
  fi
  echo 'No Docker resources were changed.'
  exit 0
fi

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
  # Never prune the default/global builder: it can contain unrelated user
  # projects. The workspace must opt into its own named builder first.
  if ! docker buildx inspect fluent-interview-builder >/dev/null 2>&1; then
    echo 'No dedicated fluent-interview-builder found; build-cache cleanup skipped.' >&2
    echo 'Create it explicitly with: docker buildx create --name fluent-interview-builder --use' >&2
  else
    docker buildx prune --builder fluent-interview-builder --force --filter until=168h >/dev/null
    echo 'Removed Fluent Interview builder cache older than 7 days.'
  fi
fi

echo "Workspace cleanup complete (legacy volumes removed: $removed)."
docker system df
