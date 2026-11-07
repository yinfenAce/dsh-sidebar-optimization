# Development

## Requirements

- Node.js 22+
- DSH 0.2.x
- DSHBox 1.5.x with `dsh-mobile-adapt` enabled

## Local install

```sh
git clone https://github.com/yinfenAce/dsh-sidebar-optimization
dsh plugin --profile web add file:/absolute/path/to/dsh-sidebar-optimization
```

Then fully stop and restart DSHBox. A page refresh alone does not reload the client bundle because the plugin keeps a one-time install guard.

## Checks

```sh
npm run check   # node --check on host and client entry
npm test        # node:test contract + smoke tests
npm pack --dry-run
```

## Debugging

- Open the settings card and confirm the version.
- If the plugin does not apply, inspect `window.__dshTweaksLastError`.
- If old code is still running, the WebView kept the previous bundle; restart DSHBox.

## Release flow

1. Update `package.json` version and `lib/client.js` `VERSION`.
2. Update `CHANGELOG.md`.
3. Run `npm test` and `npm pack --dry-run`.
4. Commit, tag `vX.Y.Z`, create a GitHub Release, attach the npm tarball.
5. Keep only the latest public release; historical releases are hidden.

You can also run `scripts/release.sh` after bumping the version; it checks, packs, tags, pushes and creates the release. A tag-triggered `release.yml` workflow is prepared for the same flow.

## Scope

Keep changes client-only. Do not add arbitrary redirect URLs, host services, or hidden network calls. If a new feature needs a host API, document it and keep a graceful fallback.
