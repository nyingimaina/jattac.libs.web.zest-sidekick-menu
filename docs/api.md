# 🛠️ API Reference

**[< Previous: Features Showcase](features.md) | [Next: Configuration Guide >](configuration.md)**

This document serves as the comprehensive technical blueprint for the React Sidekick Menu, detailing all public-facing props, interfaces, and utility functions.

## 📚 Table of Contents

1.  [SidekickMenu Props](#1-sidekickmenu-props)
2.  [ISidekickMenuItem Interface](#2-isidekickmenuitem-interface)
    *   [Common Properties](#common-properties)
    *   [Item Variants](#item-variants)
3.  [Utility Functions](#3-utility-functions)
    *   [clearSidekickMenuCache](#clearsidekickmenucache)
4.  [Styling](#4-styling)

---

### 1. SidekickMenu Props

The `SidekickMenu` component accepts the following props:

| Prop                      | Type                                    | Default                   | Description                                                                                                                                              |
| :------------------------ | :-------------------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                   | `ISidekickMenuItem[]`                   | `[]`                      | An array of menu item objects to display in the menu. This defines the structure and content of your menu.                                               |
| `cacheLifetime`           | `number`                                | `24`                      | The lifetime of the visibility cache in hours for items with `visibilityControl.isCachable: true`. After this duration, cached visibility is re-evaluated. |
| `searchEnabled`           | `boolean`                               | `true`                    | If `false`, the search input will not be rendered.                                                                                                       |
| `searchAutoFocus`         | `boolean`                               | `true`                    | If `true`, the search input will automatically receive focus when the menu is opened.                                                                    |
| `searchPlaceholder`       | `string`                                | `"Search menu..."`        | The placeholder text displayed in the search input field.                                                                                              |
| `alwaysShowUnsearchableItems` | `boolean`                           | `true`                    | If `true`, menu items without `searchTerms` defined will always be visible, even when a search term is active. If `false`, only searchable items or matching children will appear. |
| `openOnDesktop`           | `boolean`                               | `false`                   | If `true`, the menu will be open by default on desktop screen sizes (width >= 768px).                                                                    |
| `searchIcon`              | `React.ReactNode`                       | `🔍` (magnifying glass)   | A custom React Node to use as the search icon. Can be an SVG, an image, or an icon from a library.                                                       |
| `chevronIcon`             | `React.ReactNode`                       | `▼` (down arrow)          | A custom React Node to use as the chevron icon for sub-menu toggles.                                                                                     |
| `headerContent`           | `React.ReactNode`                       | `null`                    | Custom content to display at the very top of the menu, above the search bar.                                                                             |
| `footerContent`           | `React.ReactNode`                       | `null`                    | Custom content to display at the very bottom of the menu.                                                                                                |

---

### 2. ISidekickMenuItem Interface

The `items` prop expects an array of objects conforming to the `ISidekickMenuItem` interface. This interface defines the structure for each entry in your menu.

```typescript
type ISidekickMenuItem = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  searchTerms?: string;
  visibilityControl?: {
    isVisibleResolver?: () => boolean | Promise<boolean>;
    isCachable?: boolean;
  };
} & (
  | { path: string; onClick?: never; children?: never }
  | { path?: never; onClick: () => void; children?: never }
  | { path?: never; onClick?: never; children: ISidekickMenuItem[] }
);
```

#### Common Properties

All menu item variants share these core properties:

| Property            | Type                                                | Description                                                                                                                                                                                                                                                                                                                                                         |
| :------------------ | :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                | `string`                                            | **Required.** A unique and stable identifier for the menu item. This is crucial for React's `key` prop, internal state management (e.g., open sub-menus, visibility caching), and ensuring consistent behavior.                                                                                                                                                       |
| `label`             | `React.ReactNode`                                   | The primary content to display for the menu item. This can be a simple string, a custom React component, or any valid `React.ReactNode`.                                                                                                                                                                                                                        |
| `icon`              | `React.ReactNode`                                   | An optional icon to display next to the `label`. Can be a string (e.g., an emoji), an SVG, an image, or an icon from a library.                                                                                                                                                                                                                                       |
| `searchTerms`       | `string`                                            | An optional string of keywords that will be used when searching the menu. If omitted, the `label`'s text content will be used for search. Provides an explicit way to define searchable terms that might not be in the visible label.                                                                                                                                      |
| `visibilityControl` | `{ isVisibleResolver: () => boolean \| Promise<boolean>; isCachable?: boolean; }` | An optional object to control the visibility of the menu item dynamically. <br/> - `isVisibleResolver`: A function that returns a `boolean` or a `Promise<boolean>`. If it resolves to `false`, the item is hidden. <br/> - `isCachable`: If `true`, the result of `isVisibleResolver` is stored in `localStorage` for `cacheLifetime` hours to avoid repeated calls. |

#### Item Variants

A menu item must be one of three mutually exclusive types:

1.  **Link Item:** Navigates to a new page.
    *   Requires: `path: string`
    *   Must NOT have: `onClick`, `children`
    ```javascript
    {
      id: 'dashboard-link',
      label: 'Go to Dashboard',
      path: '/dashboard'
    }
    ```

2.  **Button Item:** Triggers an action.
    *   Requires: `onClick: () => void`
    *   Must NOT have: `path`, `children`
    ```javascript
    {
      id: 'logout-button',
      label: 'Logout',
      icon: '🚪',
      onClick: () => alert('Logging out...')
    }
    ```

3.  **Sub-menu Item:** Contains nested menu items.
    *   Requires: `children: ISidekickMenuItem[]`
    *   Must NOT have: `path`, `onClick`
    ```javascript
    {
      id: 'tools-submenu',
      label: 'Tools',
      icon: '🔧',
      children: [
        { id: 'tool-a', label: 'Tool A', path: '/tools/a' },
        { id: 'tool-b', label: 'Tool B', path: '/tools/b' }
      ]
    }
    ```

---

### 3. Utility Functions

#### clearSidekickMenuCache

`clearSidekickMenuCache(): void`

This function allows you to manually clear the entire visibility cache stored in `localStorage` by the `SidekickMenu` component. It's useful in scenarios where user permissions change, or a user logs out, and you need to force a re-evaluation of all cached menu item visibilities on the next render.

```javascript
import { clearSidekickMenuCache } from 'jattac.libs.web.react-sidekick-menu';

// Call this function when a user logs out or permissions change
clearSidekickMenuCache();
```

---

### 4. Styling

The `SidekickMenu` component uses CSS Modules for its internal styling, which are bundled directly with the JavaScript. This ensures that the component's styles are isolated and do not clash with your application's global CSS.

**Customization:**
Currently, direct CSS customization via props is not exposed. For deep styling changes, you would need to adjust the CSS Module files directly by forking the repository.

**Mobile Safe Areas:**
The menu is designed to respect safe areas on mobile devices. For correct rendering, ensure your application's `viewport` meta tag includes `viewport-fit=cover`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---
**[< Previous: Features Showcase](features.md) | [Next: Configuration Guide >](configuration.md)**
