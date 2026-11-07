# Architecture

This package is a **client-only DSH plugin** for DSHBox's mobile WebView. The host half is intentionally a no-op; all behavior runs in the browser.

## Load path

1. The profile lists `dsh-sidebar-optimization` in `dsh.profile.bundles`.
2. `cordis.patch.yml` inserts the client row `mobile-tweaks`.
3. The client bundle is served from `lib/client.js`.
4. `apply()` injects one `<style>` element and binds DOM listeners.

## Runtime pieces

| Piece | Responsibility |
| --- | --- |
| Drawer CSS | Width, left/right side, scroll, backdrop, safe areas |
| Settings card | Width presets, live preview, swipe range, privacy/warning, manual usage entry |
| Balance | `remote.account.getBalance`, custom label, masking, low-balance warning |
| Usage action | Manual entry → enabled usage plugin → official platform page |
| ☰ | Long-press drag, snap, remembered position |
| Touch/reading | Focus-ring removal, copy fallback, view transition, keyboard follow, long-chat `content-visibility` |

## Deliberate constraints

- **No arbitrary URLs.** Manual usage entries only click navigation entries; external links are limited to the official DeepSeek platform pages.
- **No host service.** The plugin does not start processes, read files, or collect data.
- **No configuration page detection by bundle id alone.** `pluginNavigation.openBundle` opens the plugin configuration page, not its feature page; the client finds the visible feature entry instead.
- **No hot replacement.** The install guard prevents duplicate DOM/CSS. A full DSHBox restart is required after code changes.

## Selectors

The plugin targets generic DSH/mobile-adapt substrings (`sidebarCol`, `logoRow`, `footArea`, `viewArea`, `data-chat-turn`, `rightbarCol`/`detailsCol`). A DSHBox update that renames these can break individual rules; the rest of the plugin should continue to work.
