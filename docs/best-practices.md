# 💡 Best Practices & Developer Insights

**[< Previous: Contributor's Guide](development.md) | [Next: Breaking Changes & Migration >](breaking-changes.md)**

A collection of practical guidance and gotchas for getting the most out of `SidekickMenu`, gathered as the component has grown.

---

## `theme: 'system'` (the default) follows the OS, not your app

This is the single most common source of "the menu is the wrong theme" reports. `system` reads `prefers-color-scheme` directly — it has no idea what your app's own light/dark state is. If your app's theme isn't itself driven by the OS setting (a manual toggle, a fixed default, anything custom), the menu can end up visibly disagreeing with the rest of your UI: app in light mode, OS set to dark, menu renders dark. Nothing is broken — `system` did exactly what it says — but it's rarely what you want in that setup.

If your app manages its own theme, feed it in explicitly rather than relying on `system`. See [Syncing Sidekick's theme with your app's own theme](configuration.md#syncing-sidekicks-theme-with-your-apps-own-theme) for the pattern (wire your app's current theme into `ZestSidekickConfigProvider`'s `config`, or pass `zest={{ theme }}` per-instance).

## `ZestSidekickConfigProvider` nesting does not merge

Only the **nearest** `ZestSidekickConfigProvider` above a `<SidekickMenu>` in the tree is read. If you nest providers expecting their `config` objects to merge (e.g. an outer provider setting `theme` and an inner one setting `motionOptions`), the inner provider's config is used in full and the outer one is ignored for that subtree.

```jsx
<ZestSidekickConfigProvider config={{ defaultProps: { theme: 'dark' } }}>
  <ZestSidekickConfigProvider config={{ defaultProps: { motionOptions: { intensity: 'subtle' } } }}>
    {/* This SidekickMenu does NOT inherit theme: 'dark' from the outer provider. */}
    <SidekickMenu items={items} />
  </ZestSidekickConfigProvider>
</ZestSidekickConfigProvider>
```

If you need both, set both fields on the innermost provider's `config`.

## If you ever portal menu content, theme attributes need to travel with it

Today, `SidekickMenu`'s hamburger button and panel are both plain descendants of the same root element, so a single `data-theme` attribute on that root is enough for the whole component to theme correctly. If you fork or extend this component to render any part of it through `ReactDOM.createPortal` (for example, to solve a stacking-context issue), remember that a portaled subtree renders **outside** the root element's DOM subtree — CSS custom properties won't inherit into it, so the `data-theme`/`data-motion` attributes would need to be applied to the portaled root as well.

## Legacy `.dark` ancestor-class support is deprecated

Before theming via `zest`/`data-theme` was introduced, the only way to get a dark appearance was to ensure an ancestor element (e.g. `<body>`) carried a `dark` class — the stylesheet still contains `:global(.dark) ...` rules for this. That mechanism still works and always will for existing installs, but it is now considered **legacy**: prefer the `theme` prop (or a `ZestSidekickConfigProvider` default) going forward. The `:global(.dark)` rules may be removed in a future major version, which would be called out as a breaking change with migration guidance at that time.

## Motion respects `prefers-reduced-motion` regardless of `motionOptions.intensity`

Even if you (or your users) have opted into `motionOptions.intensity: 'playful'`, a user's OS-level "reduce motion" accessibility setting always wins — animations and transform-based transitions are suppressed. You don't need to detect this yourself.

## Mounting more than one `SidekickMenu`? Set `storageNamespace`

By default, `SidekickMenu` uses a single, unnamespaced set of `localStorage` keys for visibility caching and Favourites — correct and zero-config for the common case of one menu per app. If you mount two distinct `SidekickMenu` instances on the same origin (e.g. a primary nav and a separate settings-panel nav), give each a distinct `storageNamespace` string so their caches and favourites don't bleed into each other:

```jsx
<SidekickMenu items={primaryNavItems} storageNamespace="primary-nav" />
<SidekickMenu items={settingsNavItems} storageNamespace="settings-nav" />
```

If you forget, a development-mode console warning tells you two instances are sharing storage. Two instances that happen to render the exact same `items` reference (e.g. a responsive mobile/desktop duplicate of the same logical menu) are not a collision — sharing state between them is correct, and no warning fires.

## Only leaf items accrue Favourites usage

Clicking into a submenu (an item with `children`) never counts toward Favourites ranking — only items with `path`/`onClick` do, at the moment their action actually fires. This is deliberate: "opening a folder" isn't the destination a user wants resurfaced.

## Numbered shortcuts never land on an auto-ranked Favourite

Auto-ranked Favourites reorder over time as usage shifts, so binding a `1`–`9` shortcut to one would silently break muscle memory. Only root-level items (in drilldown's root view) and **pinned** Favourites — which have a stable, user-chosen order — are eligible for a number badge.

## The translucent panel surface has a real contrast cost

`zest.visualOptions.surface: 'translucent'` looks good over predictable backgrounds, but `backdrop-filter` blur can reduce text contrast unpredictably against arbitrary page content, and has a real (if usually small) rendering cost. It's off by default for these reasons — test it against your actual page content before shipping it, and keep the click-outside scrim enabled (it dims the page behind the panel, which helps contrast when translucent).

---
**[< Previous: Contributor's Guide](development.md) | [Next: Breaking Changes & Migration >](breaking-changes.md)**
