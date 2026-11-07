# 侧边栏优化 · dsh-sidebar-optimization

Sidebar optimization for [DSHBox](https://github.com/WSK-build/DSHBox) / DeepSeek Harness (DSH).

A small, client-only layer on top of the bundled `@local/dsh-mobile-adapt` plugin. It does not replace
that plugin; it only overrides a few mobile-specific styles and adds a couple of interactions.

## What it does

- **Adjustable half-screen sidebar** — default 60% of the viewport. Open the sidebar and tap **「主页排版设置」** above Settings; a card opens with a live preview, 50% / 60% / 70% presets and a custom 45%–80% slider. The choice is remembered.
- **Tap the blank area to close** — the backdrop is forced visible (the bundled plugin hides it with an
  inline `display:none`), so tapping the right-hand blank strip closes the drawer.
- **Free single scroll** — panels, the session list and the footer scroll as one column, instead of the
  session list scrolling inside a squeezed box.
- **Sticky footer** — settings/footer stay reachable while browsing a long session list.
- **Long-chat performance** — `content-visibility: auto` on chat turns; off-screen messages are skipped
  during the reflow caused by the on-screen keyboard.
- **Keyboard follow** — `visualViewport` resizes the root immediately when the keyboard opens/closes,
  instead of waiting for `100dvh` to be recalculated.
- **Swipe gestures (experimental)** — swipe right anywhere on the chat to open, swipe left to close. If it does not trigger on your device, the ☰ button still works; it can be turned off in the settings card.
- **Session tap closes the drawer** — after selecting a session, the drawer collapses automatically
  (unless DSH already closed it).
- **Open reveals the active session** — opening the drawer scrolls the current session into view.
- **No blue focus ring on tap** — touch interactions no longer leave a square focus outline; keyboard focus rings are preserved.
- **Copy that actually works** — a textarea/`execCommand` fallback backs the Clipboard API, and every code block gets a visible “复制” button.
- **View-switch transition** — switching the top view/trajectory tab fades and lifts the new content in instead of snapping.
- **Touch polish** — 42px panel rows, vertical-only panning inside the drawer, safe-area bottom padding.

## Requirements

- DSHBox **v1.5.1** (the bundled `@local/dsh-mobile-adapt` plugin must be enabled).
- DSH **0.2.1-rc.5** (declared compatible; the upstream plugin's DOM classes are version-sensitive).
- Viewport width ≤ 1024px (phone/tablet). Desktop layouts are untouched.

## Install

From npm (once published):

```sh
dsh plugin --profile web add dsh-sidebar-optimization
```

From source:

```sh
dsh plugin --profile web add github:yinfenAce/dsh-sidebar-optimization
```

Then restart DSH (or reload the DSH page) so the client bundle is served.

## Turn it off

The tweaks follow the **Mobile adaptation** switch in DSHBox: when `@local/dsh-mobile-adapt` is turned
off, this plugin's style is disabled too.

To remove the plugin:

```sh
dsh plugin --profile web remove dsh-sidebar-optimization
```

## Caveats

- This is an **overlay on the bundled plugin's DOM/CSS**. A DSHBox update that changes
  `dsh-mobile-adapt`'s class names or drawer structure can break parts of it.
- Only mobile widths are affected; the desktop layout is deliberately left alone.
- No background services, no data collection, no network calls.

## License

MIT. See [LICENSE](LICENSE).
