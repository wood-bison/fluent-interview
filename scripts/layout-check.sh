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

# The greenfield target is intentionally outside the five runtime repositories
# while the migration gate is open. Keep this allowlist exact and fail closed:
# an arbitrary `fluent-*` sibling must still be classified before it can pass
# the workspace topology check.
declared_external_targets=(
  fluent-interview-platform
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
  sibling_name="$(basename -- "$sibling")"
  declared=false
  for target in "${declared_external_targets[@]}"; do
    if [[ "$sibling_name" == "$target" ]]; then
      declared=true
      # A declared target is a real repository, not a name-based exception.
      # Require the same minimum markers that make it auditable and safe to
      # reference from the greenfield execution plan.
      if [[ ! -d "$sibling/.git" || ! -f "$sibling/AGENTS.md" || ! -f "$sibling/package.json" ]]; then
        printf 'layout: declared external target is not an auditable Git repository: %s\n' "$sibling" >&2
        exit 1
      fi
      break
    fi
  done
  if [[ "$declared" == true ]]; then
    continue
  fi
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
