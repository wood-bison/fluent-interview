#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
QUESTION_BRAIN="$ROOT/fluent-question-brain"
TASK_RUNTIME="$ROOT/fluent-task-runtime"
LAB="$ROOT/fluent-engineering-lab"
source "$ROOT/scripts/workspace-contract.sh"
# Keep the workspace launcher pinned to the same reconciled release that the
# Runtime Compose file exposes by default.  A stale filename here makes a
# clean `pnpm dev` fail before any service can report its actual readiness.
RUNTIME_RELEASE_FILE="task-release-2026-08-25-qb-d00a1493-g9.json"
QUESTION_BRAIN_MAPPING_FILE="curriculum-mapping-2026-08-25-canonical.json"

mode="development"
build_args=(--build)
for arg in "$@"; do
  case "$arg" in
    --production) mode="production" ;;
    --no-build) build_args=() ;;
    -h|--help)
      cat <<'USAGE'
Usage: ./scripts/up.sh [--no-build] [--production]

  (default)      start Question Brain, Task Runtime, and Fluent Lab dev
  --no-build     reuse existing Compose images
  --production   start dependencies and the packaged Fluent Lab release
USAGE
      exit 0
      ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

compose_question_brain=(docker compose --project-name fluent-question-brain --file "$QUESTION_BRAIN/deploy/compose/compose.yaml")
compose_task_runtime=(docker compose --project-name fluent-task-runtime --file "$TASK_RUNTIME/deploy/compose/compose.yaml")

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing command: $1" >&2
    exit 1
  }
}

wait_for() {
  local label="$1"
  local url="$2"
  local attempts=60
  printf 'Waiting for %-16s' "$label"
  while (( attempts > 0 )); do
    if curl --silent --show-error --fail --max-time 2 "$url" >/dev/null 2>&1; then
      echo ' ready'
      return 0
    fi
    printf '.'
    attempts=$((attempts - 1))
    sleep 2
  done
  echo ' failed'
  echo "Readiness check failed: $url" >&2
  exit 1
}

stop_packaged_lab() {
  # The packaged Lab owns a long-lived process and an operation lock. A user
  # switching back to `pnpm dev` must not accidentally run two Lab releases
  # against the same durable profile. Stop only the recorded package process;
  # package:local:stop preserves learner data and Compose volumes.
  if [[ -f "$LAB/.fel/local-production/state.json" ]]; then
    echo 'Stopping existing packaged Fluent Lab'
    pnpm --dir "$LAB" package:local:stop >/dev/null 2>&1 || true
  fi
}

start_packaged_lab() {
  # A package operation can legitimately outlive the shell that started it
  # for a few seconds (for example while a previous restart is flushing its
  # state).  Do not turn that transient, recoverable lock into a failed
  # workspace start.  Retry only the explicit lock-held contract; every other
  # failure is surfaced unchanged and never bypasses the package safety
  # boundary.
  local attempt=1
  local max_attempts=20
  local log_file
  log_file="$(mktemp "${TMPDIR:-/tmp}/fluent-interview-package.XXXXXX")"
  while (( attempt <= max_attempts )); do
    if pnpm --dir "$LAB" package:local:restart >"$log_file" 2>&1; then
      cat "$log_file"
      rm -f "$log_file"
      return 0
    fi
    if grep -q '"code": "package.lock-held"' "$log_file"; then
      printf 'Packaged Lab operation lock is active; waiting (%d/%d)\n' "$attempt" "$max_attempts"
      sleep 2
      attempt=$((attempt + 1))
      continue
    fi
    cat "$log_file" >&2
    rm -f "$log_file"
    return 1
  done
  cat "$log_file" >&2
  rm -f "$log_file"
  echo 'Packaged Lab did not converge after waiting for the bounded operation lock.' >&2
  return 1
}

require_command docker
require_command curl
require_command pnpm
"$ROOT/scripts/ports.sh"

if ! docker info >/dev/null 2>&1; then
  echo 'Docker Desktop is not running.' >&2
  exit 1
fi

test -d "$QUESTION_BRAIN" || { echo "Missing repository: $QUESTION_BRAIN" >&2; exit 1; }
test -d "$TASK_RUNTIME" || { echo "Missing repository: $TASK_RUNTIME" >&2; exit 1; }
test -d "$LAB" || { echo "Missing repository: $LAB" >&2; exit 1; }
test -s "$TASK_RUNTIME/releases/$RUNTIME_RELEASE_FILE" || {
  echo "Missing reconciled runtime release: $TASK_RUNTIME/releases/$RUNTIME_RELEASE_FILE" >&2
  echo 'Generate it from the current Question Brain release before starting the workspace.' >&2
  exit 1
}
test -s "$QUESTION_BRAIN/releases/$QUESTION_BRAIN_MAPPING_FILE" || {
  echo "Missing explicit Question Brain mapping release: $QUESTION_BRAIN/releases/$QUESTION_BRAIN_MAPPING_FILE" >&2
  echo 'Generate and explicitly review the complete revision-pinned crosswalk before starting the workspace.' >&2
  exit 1
}

echo 'Fluent Interview workspace'
echo "root: $ROOT"
echo '1/2  Question Brain'
"${compose_question_brain[@]}" up -d --remove-orphans "${build_args[@]}"
wait_for 'Question Brain' "$WS_QB_READY_URL"
# Existing PostgreSQL volumes do not re-run initdb scripts. Apply the
# revision-scoped mapping migration and the checked-in explicit crosswalk on
# every start; both operations are idempotent. Never fall back to inferred
# Track/Group/Topic placement.
"$QUESTION_BRAIN/scripts/apply-curriculum-mapping-migration.sh"
echo 'Applying explicit Question Brain → Lab curriculum crosswalk'
"${compose_question_brain[@]}" exec -T api /qb-map-release \
  -database-url 'postgres://question_brain:question_brain@postgres:5432/question_brain?sslmode=disable' \
  -manifest "/opt/releases/$QUESTION_BRAIN_MAPPING_FILE" \
  -approve >/dev/null

echo '2/2  Task Runtime'
RUNTIME_HOST_WORK_ROOT="$TASK_RUNTIME/.runtime-work" \
RUNTIME_RELEASE_MANIFEST="/opt/releases/$RUNTIME_RELEASE_FILE" \
  "${compose_task_runtime[@]}" up -d --remove-orphans "${build_args[@]}"
wait_for 'Task Runtime' "$WS_RUNTIME_READY_URL"

echo
mkdir -p "$ROOT/.workspace"
app_pid_file="$ROOT/.workspace/fluent-lab.pid"

if [[ "$mode" == 'production' ]]; then
  echo "Starting packaged Fluent Lab ($WS_LAB_PACKAGE_URL)"
  # `restart` is intentionally idempotent.  The wrapper absorbs only a live
  # package.lock-held race, then lets the package contract report every other
  # failure with its normal recovery details.
  start_packaged_lab &
else
  stop_packaged_lab
  echo "Starting Fluent Lab development ($WS_LAB_DEV_URL)"
  pnpm --dir "$LAB" dev &
fi

app_pid=$!
printf '%s\n' "$app_pid" > "$app_pid_file"
stop_app() {
  kill -TERM "$app_pid" 2>/dev/null || true
}
cleanup() {
  rm -f "$app_pid_file"
}
trap stop_app INT TERM
trap cleanup EXIT
wait "$app_pid"
