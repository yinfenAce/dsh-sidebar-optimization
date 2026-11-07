# Contributing

## Reporting bugs

Include:

- DSHBox version, DSH version, Android version and WebView version;
- whether `dsh-mobile-adapt` is enabled;
- reproduction steps;
- a screenshot or short recording if possible;
- `window.__dshTweaksLastError` when relevant.

## Pull requests

- Keep the plugin client-only; do not add arbitrary redirects or background services.
- Run `npm test` and `npm run check`.
- Update `CHANGELOG.md` for user-visible changes.
- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- Avoid force-pushing a branch under review.

## Style

- Prefer small, named functions and guard clauses.
- Keep all user-visible copy in the plugin's settings card; avoid English-only UI text.
- Preserve the manual-entry priority: manual → enabled usage plugin → official platform page.
- Do not introduce a free-form URL field.
