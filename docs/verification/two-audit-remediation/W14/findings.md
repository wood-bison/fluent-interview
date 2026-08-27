# W14 findings

## Passed

- 116 token names are present, including all required semantic roles, type,
  spacing, radius, elevation, glass and motion scales.
- `@theme inline` has no duplicate declarations after the audit was added.
- No raw hex/rgb/hsl colour literals were found in Vue feature or UI-package
  source outside the token source.
- Explicit light/dark themes, system dark fallback and reduced
  motion/transparency hooks are present.
- Tailwind is constrained to token-backed `@theme inline` mappings and that
  policy is documented.

## Remaining W14 debt

- Existing compatibility aliases still need an owner-by-owner removal plan;
  they are intentionally retained for the Angular-to-Vue migration.
- The primitive extraction (rail/top bar/filter/data-list/workspace) and full
  visual matrix remain separate implementation/audit slices.
- Contrast, 200% zoom and keyboard target-size evidence belongs to the
  accessibility/visual gates, not this static token check.
