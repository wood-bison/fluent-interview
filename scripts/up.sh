#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
QUESTION_BRAIN="$ROOT/fluent-question-brain"
TASK_RUNTIME="$ROOT/fluent-task-runtime"
LAB="$ROOT/fluent-engineering-lab"

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

require_command docker
require_command curl
require_command pnpm

if ! docker info >/dev/null 2>&1; then
  echo 'Docker Desktop is not running.' >&2
  exit 1
fi

test -d "$QUESTION_BRAIN" || { echo "Missing repository: $QUESTION_BRAIN" >&2; exit 1; }
test -d "$TASK_RUNTIME" || { echo "Missing repository: $TASK_RUNTIME" >&2; exit 1; }
test -d "$LAB" || { echo "Missing repository: $LAB" >&2; exit 1; }

echo 'Fluent Interview workspace'
echo "root: $ROOT"
echo '1/2  Question Brain'
"${compose_question_brain[@]}" up -d "${build_args[@]}"
wait_for 'Question Brain' 'http://127.0.0.1:48127/health/ready'

echo '2/2  Task Runtime'
RUNTIME_HOST_WORK_ROOT="$TASK_RUNTIME/.runtime-work" \
  "${compose_task_runtime[@]}" up -d "${build_args[@]}"
wait_for 'Task Runtime' 'http://127.0.0.1:48227/v1/health/ready'

echo
mkdir -p "$ROOT/.workspace"
app_pid_file="$ROOT/.workspace/fluent-lab.pid"

if [[ "$mode" == 'production' ]]; then
  echo 'Starting packaged Fluent Lab (http://localhost:4300/onboarding)'
  pnpm --dir "$LAB" package:local &
else
  echo 'Starting Fluent Lab development (http://localhost:47300/)'
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
