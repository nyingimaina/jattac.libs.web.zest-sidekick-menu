# Features Showcase

**[< Previous: The Cookbook: Practical Examples](examples.md) | [Next: API Reference >](api.md)**

This document provides a high-level overview of the powerful features offered by the React Sidekick Menu. Each section highlights the value proposition of a feature and includes a quick code snippet, serving as a gateway to more detailed examples in the [Cookbook](examples.md).

## Table of Contents

1.  [Easy to Use API](#1-easy-to-use-api)
2.  [Built-in Search Functionality](#2-built-in-search-functionality)
3.  [Nested Sub-menus](#3-nested-sub-menus)
4.  [Conditional Item Visibility and Caching](#4-conditional-item-visibility-and-caching)
5.  [Customizable Header, Footer, and Icons](#5-customizable-header-footer-and-icons)
6.  [Accessibility Built-in](#6-accessibility-built-in)
7.  [Zero-Dependency Styling](#7-zero-dependency-styling)

---

### 1. Easy to Use API

#### Problem:
Integrating complex UI components can often be cumbersome. A straightforward method to add a feature-rich side menu to your React application is required.

#### Solution:
The `SidekickMenu` component offers an intuitive prop-based API, enabling rapid definition of menu structure and behavior.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const simpleItems = [
  { id: '1', label: 'Dashboard', path: '/dashboard' },
  { id: '2', label: 'Reports', path: '/reports' },
];

const App = () => <SidekickMenu items={simpleItems} />;
```

[Explore basic usage in the Cookbook](examples.md#1-basic-menu-setup)

---

### 2. Built-in Search Functionality

#### Problem:
As your application scales, navigating an extensive menu can become inefficient. Users require the ability to quickly locate specific sections.

#### Solution:
The menu incorporates an integrated, customizable search bar that filters menu items in real-time.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <SidekickMenu
    items={/* ... your menu items ... */}
    searchEnabled={true}
    searchPlaceholder="Find pages..."
  />
);
```

[See search customization examples in the Cookbook](examples.md#3-enabling-and-customizing-search)

---

### 3. Nested Sub-menus

#### Problem:
Organizing a large number of links in a flat menu can overwhelm users. Logical groupings are necessary for improved user experience.

#### Solution:
Multi-level nested menus can be defined easily using the `children` property within your menu item objects.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <SidekickMenu
    items={[
      {
        id: 'settings',
        label: 'Settings',
        children: [
          { id: 'profile', label: 'Profile Settings', path: '/settings/profile' },
          { id: 'security', label: 'Security', path: '/settings/security' },
        ],
      },
    ]}
  />
);
```

[Learn how to structure nested menus in the Cookbook](examples.md#2-creating-nested-sub-menus)

---

### 4. Conditional Item Visibility and Caching

#### Problem:
Menu items may need to be displayed or hidden based on user permissions, application state, or other dynamic criteria. Performance can be impacted if visibility checks are resource-intensive, especially if they are asynchronous.

#### Solution:
The `visibilityControl` property on an `ISidekickMenuItem` allows you to define how an item's visibility is determined. It contains:
*   `isVisibleResolver`: A function that returns a `Promise<boolean>`, a `boolean`, or simply a `boolean` value.
*   `isCachable`: A boolean to indicate if the `isVisibleResolver`'s result should be cached in `localStorage` for faster subsequent loads.

The menu will show a skeleton loader for items whose visibility is being resolved asynchronously.

Here are the different ways you can use `isVisibleResolver`:

**Asynchronous Function:**
Ideal for checking permissions against an API or any other async operation.

```jsx
import React from 'react';
import SidekickMenu, { ISidekickMenuItem } from 'jattac.libs.web.react-sidekick-menu';

const checkAdmin = async () => {
  // Replace with your actual async logic, e.g., an API call
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
};

const App = () => (
  <SidekickMenu
    items={[
      {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        path: '/admin',
        searchTerms: 'admin',
        icon: '👑',
        visibilityControl: {
          isVisibleResolver: checkAdmin,
          isCachable: true, // Cache the result for 24 hours (default)
        },
      },
    ]}
  />
);
```

**Synchronous Function:**
Useful for checking feature flags or other synchronous conditions.

```jsx
const isAnalyticsEnabled = () => store.getState().features.analytics;

const menuItems = [
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    searchTerms: 'analytics',
    icon: '📊',
    visibilityControl: {
      isVisibleResolver: isAnalyticsEnabled,
    },
  },
];
```

**Boolean Value:**
For static visibility or when the visibility is already known.

```jsx
const menuItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    searchTerms: 'home',
    icon: '🏠',
    visibilityControl: {
      isVisibleResolver: true,
    },
  },
];
```

[Discover advanced conditional visibility in the Cookbook](examples.md#4-implementing-conditional-item-visibility-async--cached)

---

### 5. Customizable Header, Footer, and Icons

#### Problem:
The menu should seamlessly integrate with your application's branding and design language, and display dynamic information as needed.

#### Solution:
Any `React.ReactNode` can be provided for header, footer, and icon props, offering full flexibility for custom components, images, or icon libraries.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';
import { FaUser } from 'react-icons/fa';

const CustomHeader = () => <div>My Brand</div>;
const CustomIcon = () => <FaUser />;

const App = () => (
  <SidekickMenu
    items={[{ id: 'user', label: 'My Account', icon: <CustomIcon />, path: '/account' }]}
    headerContent={<CustomHeader />}
  />
);
```

[Find examples for custom content in the Cookbook](examples.md#5-adding-custom-header-footer-and-icons)

---

### 6. Accessibility Built-in

#### Problem:
Ensuring UI components are accessible to all users, including those utilizing assistive technologies, is a critical requirement.

#### Solution:
The `SidekickMenu` is developed with accessibility best practices, incorporating keyboard navigation (ArrowUp, ArrowDown, Enter, Escape) and focus management to enhance usability for all.

```jsx
// No specific code snippet needed; this is an inherent feature.
// Simply use the component, and accessibility is handled.
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <SidekickMenu items={/* ... */ } />
);
```

[While there isn't a specific "accessibility recipe" in the Cookbook, its benefits are demonstrated across all interactive examples.](examples.md)

---

### 7. Zero-Dependency Styling

#### Problem:
Integrating third-party components can frequently lead to styling conflicts or demand intricate setup for CSS.

#### Solution:
The component employs CSS Modules, and all necessary styles are bundled directly with the JavaScript. No external CSS imports are required, ensuring clean and isolated styling.

```jsx
// No code changes needed in your app.
// The component manages its own styles internally.
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <SidekickMenu items={/* ... */ } />
);
```

[For more details on styling considerations, refer to the Styling section in the API Reference.](api.md#styling)

---
**[< Previous: The Cookbook: Practical Examples](examples.md) | [Next: API Reference >](api.md)**
