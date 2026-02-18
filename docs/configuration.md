# ⚙️ Configuration Guide

**[< Previous: API Reference](api.md) | [Next: Contributor's Guide >](development.md)**

This guide provides a deep dive into configuring the React Sidekick Menu, covering how to adjust its behavior and appearance to fit your application's specific needs.

## 📚 Table of Contents

1.  [Understanding Default Props](#1-understanding-default-props)
2.  [Controlling Cache Lifetime](#2-controlling-cache-lifetime)
3.  [Desktop Open Behavior](#3-desktop-open-behavior)
4.  [Fine-tuning Search Behavior](#4-fine-tuning-search-behavior)
5.  [Global Styling Considerations](#5-global-styling-considerations)

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
Menu item visibility, especially for `isCachable: true` items, is stored in `localStorage` to avoid repeatedly calling `isVisibleResolver`. You need to control how long this cached data remains valid.

#### Solution:
Use the `cacheLifetime` prop (in hours) on the `<SidekickMenu>` component.

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
A `cacheLifetime` of `0` or a negative number would effectively disable caching by always expiring immediately, forcing re-evaluation. A very large number would cache indefinitely. The default is `24` hours.

---

### 3. Desktop Open Behavior

#### Problem:
On larger screens, you might prefer the side menu to be open by default, providing immediate access to navigation without requiring user interaction to open it.

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
The menu will automatically detect screen width and apply this behavior. On smaller screens, it will remain closed by default, requiring the user to toggle it open.

---

### 4. Fine-tuning Search Behavior

The menu's integrated search can be configured to best suit your application's needs.

#### `searchEnabled: boolean`
Controls whether the search input field is rendered at all.

```jsx
<SidekickMenu items={/* ... */} searchEnabled={false} /> // Hide the search bar
```

#### `searchAutoFocus: boolean`
Determines if the search input should automatically receive focus when the menu is opened. This can improve user flow if search is a primary interaction.

```jsx
<SidekickMenu items={/* ... */} searchAutoFocus={false} /> // Prevent auto-focus
```

#### `searchPlaceholder: string`
Customizes the hint text displayed in the search input field before the user types.

```jsx
<SidekickMenu items={/* ... */} searchPlaceholder="Search all sections..." />
```

#### `alwaysShowUnsearchableItems: boolean`
This prop affects how items without `searchTerms` are handled when a search is active.
*   If `true` (default), items that do not have `searchTerms` defined will always be displayed, regardless of the active search query.
*   If `false`, such items will only be displayed if they are part of a sub-menu whose parent matches the search, or if the `label` itself matches the search (if `searchTerms` is not provided).

```jsx
<SidekickMenu items={/* ... */} alwaysShowUnsearchableItems={false} />
```

---

### 5. Global Styling Considerations

While the component is styled using CSS Modules internally, you might have global styling rules that could indirectly affect its appearance. The component's classes are designed to be specific to minimize conflicts.

Remember to correctly configure the `viewport` meta tag for mobile safe areas if you are experiencing unexpected layout issues on mobile devices.
Refer to the [API Reference](api.md#styling) for more details on styling.

---
**[< Previous: API Reference](api.md) | [Next: Contributor's Guide >](development.md)**
