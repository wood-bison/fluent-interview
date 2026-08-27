#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
DEVELOPER="$(cd -- "$ROOT/.." && pwd -P)"

required_repositories=(
  fluent-engineering-lab
  fluent-engineering-vue
  fluent-question-brain
  fluent-task-runtime
  fluent-question-vault
)

for repository in "${required_repositories[@]}"; do
  path="$ROOT/$repository"
  if [[ ! -d "$path/.git" ]]; then
    printf 'layout: missing independent Git repository: %s\n' "$path" >&2
    exit 1
  fi
done

sibling_projects=()
while IFS= read -r sibling; do
  sibling_projects+=("$sibling")
done < <(
  find "$DEVELOPER" -mindepth 1 -maxdepth 1 -type d -name 'fluent-*' ! -path "$ROOT" -print
)
if ((${#sibling_projects[@]} > 0)); then
  printf 'layout: stale fluent-* siblings found outside %s:\n' "$ROOT" >&2
  printf '  %s\n' "${sibling_projects[@]}" >&2
  exit 1
fi

printf 'layout: OK — %d independent Git repositories under %s\n' "${#required_repositories[@]}" "$ROOT"
