# Configuration Guide

**[< Previous: API Reference](api.md) | [Next: Contributor's Guide >](development.md)**

This guide provides a deep dive into configuring the React Sidekick Menu, covering how to adjust its behavior and appearance to fit your application's specific needs.

## Table of Contents

1.  [Understanding Default Props](#1-understanding-default-props)
2.  [Controlling Cache Lifetime](#2-controlling-cache-lifetime)
3.  [Desktop Open Behavior](#3-desktop-open-behavior)
4.  [Fine-tuning Search Behavior](#4-fine-tuning-search-behavior)
5.  [Global Styling Considerations](#5-global-styling-considerations)
6.  [Theme Configuration](#6-theme-configuration)
7.  [Global Configuration with ZestSidekickConfigProvider](#7-global-configuration-with-zestsidekickconfigprovider)
8.  [Navigation Style](#8-navigation-style)
9.  [Favourites](#9-favourites)
10. [Power-user & Premium Polish](#10-power-user--premium-polish)

---

### 1. Understanding Default Props

The `SidekickMenu` component comes with a set of sensible default values for many of its props, making it easy to get started without extensive configuration. You can easily override these defaults by simply passing new values to the component props.

Here are the default values for the configurable props:

```typescript
static defaultProps = {
  searchEnabled: true,
  searchAutoFocus: true,
  searchPlaceholder: "Search menu...",
  alwaysShowUnsearchableItems: true,
  openOnDesktop: false,
  cacheLifetime: 24, // hours
};
```

---

### 2. Controlling Cache Lifetime

#### Problem:
Menu item visibility, particularly for `isCachable: true` items, is stored in `localStorage` to avoid repeatedly invoking `isVisibleResolver`. It is necessary to control the duration for which this cached data remains valid.

#### Solution:
Utilize the `cacheLifetime` prop (specified in hours) on the `<SidekickMenu>` component.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => {
  const menuItems = [
    // ... your menu items, some with isCachable: true
  ];

  return (
    <SidekickMenu
      items={menuItems}
      cacheLifetime={1} // Cache visibility results for 1 hour
    />
  );
};
```
A `cacheLifetime` of `0` or a negative number will effectively disable caching by always expiring immediately, thereby forcing re-evaluation. A very large number will cache indefinitely. The default value is `24` hours.

---

### 3. Desktop Open Behavior

#### Problem:
On larger screens, it may be preferable for the side menu to be open by default, providing immediate access to navigation without requiring user interaction to open it.

#### Solution:
Set the `openOnDesktop` prop to `true`.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => {
  const menuItems = [
    // ...
  ];

  return (
    <SidekickMenu
      items={menuItems}
      openOnDesktop={true} // Menu will be open by default on screens >= 768px
    />
  );
};
```
The menu will automatically detect screen width and apply this behavior. On smaller screens, it will remain closed by default, necessitating user interaction to toggle it open.

---

### 4. Fine-tuning Search Behavior

The menu's integrated search functionality can be configured to best suit the requirements of your application.

#### `searchEnabled: boolean`
Controls whether the search input field is rendered.

```jsx
<SidekickMenu items={/* ... */} searchEnabled={false} /> // Hide the search bar
```

#### `searchAutoFocus: boolean`
Determines if the search input should automatically receive focus when the menu is opened. This can optimize user flow if search is a primary interaction.

```jsx
<SidekickMenu items={/* ... */} searchAutoFocus={false} /> // Prevent auto-focus
```

#### `searchPlaceholder: string`
Customizes the hint text displayed in the search input field before the user types.

```jsx
<SidekickMenu items={/* ... */} searchPlaceholder="Search all sections..." />
```

#### `alwaysShowUnsearchableItems: boolean`
This prop influences how items without `searchTerms` are managed when a search is active.
*   If `true` (default), items that do not have `searchTerms` defined will always be displayed, irrespective of the active search query.
*   If `false`, such items will only be displayed if they are part of a sub-menu whose parent matches the search, or if the `label` itself matches the search (if `searchTerms` is not provided).

```jsx
<SidekickMenu items={/* ... */} alwaysShowUnsearchableItems={false} />
```

---

### 5. Global Styling Considerations

While the component employs CSS Modules internally, global styling rules within your application might indirectly influence its appearance. The component's class names are designed to be specific to minimize potential conflicts.

Ensure the `viewport` meta tag is correctly configured for mobile safe areas if unexpected layout issues are observed on mobile devices.
Refer to the [API Reference](api.md#styling) for further details on styling.

---

### 6. Theme Configuration

#### Problem:
Your application may need to support light mode, dark mode, and following the user's OS preference automatically — and the menu's default motion (spring-eased panel, stagger-in menu items) may be more expressive than your brand wants.

#### Solution:
Pass a `zest` prop to `<SidekickMenu>`:

```jsx
<SidekickMenu
  items={menuItems}
  zest={{
    theme: 'dark',                    // 'light' | 'dark' | 'system' (default: 'system')
    motionOptions: {
      intensity: 'standard',          // 'subtle' | 'standard' | 'playful' (default: 'playful')
    },
  }}
/>
```

When `theme` is `'system'` (the default), the menu automatically follows the OS `prefers-color-scheme` setting and updates live if the user changes it. An explicit `'light'` or `'dark'` always wins over the OS preference.

The resolved theme is applied as a `data-theme` attribute on the menu's own root element, and the resolved motion intensity as `data-motion`. Both drive a set of CSS custom properties (`--zest-color-*`, `--zest-radius-*`, `--zest-shadow-*`, `--zest-ease-*`, `--zest-motion-*`) defined in the component's stylesheet, which you can override in your own CSS if you need finer control than the `zest` prop provides. Regardless of `motionOptions.intensity`, a user's OS-level "reduce motion" accessibility setting is always respected.

---

### 7. Global Configuration with `ZestSidekickConfigProvider`

#### Problem:
Setting the same `zest` prop on every `<SidekickMenu>` instance in your app is repetitive.

#### Solution:
Wrap your application (or a section of it) in `ZestSidekickConfigProvider` to set defaults once:

```jsx
import { ZestSidekickConfigProvider } from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <ZestSidekickConfigProvider config={{ defaultProps: { theme: 'dark' } }}>
    {/* every SidekickMenu here defaults to theme: 'dark' */}
    <MyLayout />
  </ZestSidekickConfigProvider>
);
```

A `zest` prop passed directly to a specific `<SidekickMenu>` instance always overrides the provider's default for that instance. Nesting multiple `ZestSidekickConfigProvider`s does not merge their configs — only the nearest provider is read.

---

### 8. Navigation Style

#### Problem:
As menus grow deeply nested, expanding branches in place (the original behavior) forces users to remember which of several branches they've opened, and long expanded lists bury the item they want.

#### Solution:
As of the release introducing this section, `SidekickMenu` defaults to **drilldown navigation**: clicking a parent item replaces the current list with just that item's children, with a breadcrumb trail (and a back button) showing where you are.

```jsx
<SidekickMenu items={menuItems} /> {/* navigationStyle defaults to "drilldown" */}
```

If your application has built UX or training around the previous in-place-expand behavior, you can opt back into it:

```jsx
<SidekickMenu items={menuItems} navigationStyle="accordion" />
```

**`navigationStyle="accordion"` is deprecated.** It will receive no new features going forward, and a development-mode console warning reminds you of this. It is scheduled for removal after 25 published releases — see [Breaking Changes & Migration](breaking-changes.md) for the running count and migration guidance when that happens. There is no rush to migrate; it will continue to work exactly as it does today until then.

---

### 9. Favourites

#### Problem:
Even with drilldown navigation, a handful of items a user reaches constantly still require repeated navigation through the hierarchy.

#### Solution:
Enable a frequency-ranked "Favourites" tab:

```jsx
<SidekickMenu
  items={menuItems}
  favouritesEnabled
  favouritesOptions={{
    maxItems: 8,       // cap on how many favourites are shown (default 8)
    minToShowTab: 3,   // don't show the tab until this many favourites exist (default 3)
    windowDays: 30,    // usage is ranked within a rolling window, in days (default 30)
  }}
/>
```

Only leaf items (those with `path`/`onClick`) accrue usage — clicking into a submenu doesn't count, since that's navigation, not a destination. The Favourites tab only appears (and the menu only defaults to opening on it) once `minToShowTab` is reached, so new users never land on an empty tab. An item that becomes hidden via `visibilityControl` is filtered out even if it has usage history.

Each favourite shows its `description` as secondary text if one is set, otherwise a breadcrumb path (e.g. "Settings › Billing") so you still know where it lives.

**Multiple menu instances:** if you mount more than one `SidekickMenu` on the same page/origin, pass a distinct `storageNamespace` to each so their visibility cache and favourites don't collide:

```jsx
<SidekickMenu items={primaryNavItems} storageNamespace="primary-nav" />
<SidekickMenu items={settingsNavItems} storageNamespace="settings-nav" />
```

You don't need to do this for a single menu per app — the default (unnamespaced) storage keys work as before. If you forget and mount two menus with different item sets under the same (or no) namespace, a development-mode console warning tells you so.

Use `clearSidekickMenuUsageStats()` (optionally with a `storageNamespace`) to reset favourites/pins — e.g. on logout, alongside `clearSidekickMenuCache()`.

---

### 10. Power-user & Premium Polish

A few opt-in features for teams that want to go further:

- **`railCollapsible`** — on desktop (`openOnDesktop`), shows a collapse toggle that shrinks the panel to an icon-only rail, persisted across reloads.
- **`swipeEnabled`** — enables edge-swipe-to-open and swipe-to-dismiss on touch devices. Off by default; the gesture-recognition thresholds are still being validated against real-world use.
- **`numberedShortcutsEnabled`** (default `true`) — lets users press `1`–`9` to jump straight to an item while the menu panel has focus. Only root-level items and *pinned* Favourites get a number (an auto-ranked favourite's position can shift, so it's never numbered). Number badges only appear once the session has seen real keyboard use, so touch-only users never see them.
- **`zest.visualOptions.surface: 'translucent'`** — an optional frosted-glass panel background (extends the existing hamburger blur treatment). Off by default: `backdrop-filter` has a real performance cost and can reduce contrast against unpredictable page content behind the panel.
- **Pinning** — once `favouritesEnabled` is on, each Favourites row has a pin toggle. Pinned items always appear first (in the order pinned), ahead of auto-ranked ones, giving you a manual override alongside the automatic ranking.

---
**[< Previous: API Reference](api.md) | [Next: Contributor's Guide >](development.md)**
