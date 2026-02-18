# 🌟 Features Showcase

**[< Previous: The Cookbook: Practical Examples](examples.md) | [Next: API Reference >](api.md)**

This document provides a high-level overview of the powerful features offered by the React Sidekick Menu. Each section highlights the value proposition of a feature and includes a quick code snippet, serving as a gateway to more detailed examples in the [Cookbook](examples.md).

## 📚 Table of Contents

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
Integrating complex UI components can often be cumbersome. You need a straightforward way to add a feature-rich side menu to your React application.

#### Solution:
The `SidekickMenu` component offers an intuitive prop-based API, allowing you to quickly define your menu structure and behavior.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const simpleItems = [
  { id: '1', label: 'Dashboard', path: '/dashboard' },
  { id: '2', label: 'Reports', path: '/reports' },
];

const App = () => <SidekickMenu items={simpleItems} />;
```

[➡️ Explore basic usage in the Cookbook](examples.md#1-basic-menu-setup)

---

### 2. Built-in Search Functionality

#### Problem:
As your application grows, navigating a large menu can become tedious. Users need to quickly find specific sections.

#### Solution:
The menu includes an integrated, customizable search bar that filters menu items in real-time.

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

[➡️ See search customization examples in the Cookbook](examples.md#3-enabling-and-customizing-search)

---

### 3. Nested Sub-menus

#### Problem:
Organizing a vast number of links in a flat menu can overwhelm users. You need to create logical groupings for better user experience.

#### Solution:
Easily define multi-level nested menus using the `children` property within your menu item objects.

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

[➡️ Learn how to structure nested menus in the Cookbook](examples.md#2-creating-nested-sub-menus)

---

### 4. Conditional Item Visibility and Caching

#### Problem:
Menu items might need to be shown or hidden based on user permissions, application state, or other dynamic criteria. Performance can degrade if visibility checks are expensive.

#### Solution:
The `visibilityControl` property allows you to define asynchronous resolvers for item visibility, with an option to cache results in `localStorage` for improved performance.

```jsx
import React from 'react';
import SidekickMenu, { ISidekickMenuItem } from 'jattac.libs.web.react-sidekick-menu';

const checkAdmin = async () => /* ... async logic ... */ true;

const App = () => (
  <SidekickMenu
    items={[
      {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        path: '/admin',
        visibilityControl: {
          isVisibleResolver: checkAdmin,
          isCachable: true, // Cache result for faster loads
        },
      },
    ]}
  />
);
```

[➡️ Discover advanced conditional visibility in the Cookbook](examples.md#4-implementing-conditional-item-visibility-async--cached)

---

### 5. Customizable Header, Footer, and Icons

#### Problem:
You need the menu to seamlessly integrate with your application's branding and design language, or to display dynamic information.

#### Solution:
Provide any `React.ReactNode` for header, footer, and icon props, allowing full flexibility for custom components, images, or icon libraries.

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

[➡️ Find examples for custom content in the Cookbook](examples.md#5-adding-custom-header-footer-and-icons)

---

### 6. Accessibility Built-in

#### Problem:
Ensuring UI components are accessible to all users, including those using assistive technologies, can be challenging.

#### Solution:
The `SidekickMenu` is built with accessibility best practices in mind, including keyboard navigation (ArrowUp, ArrowDown, Enter, Escape) and focus management, enhancing usability for everyone.

```jsx
// No specific code snippet needed; this is an inherent feature.
// Just use the component, and accessibility is handled.
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <SidekickMenu items={/* ... */ } />
);
```

[➡️ While there isn't a specific "accessibility recipe" in the Cookbook, its benefits are demonstrated across all interactive examples.](examples.md)

---

### 7. Zero-Dependency Styling

#### Problem:
Integrating third-party components can often lead to styling conflicts or require complex setup for CSS.

#### Solution:
The component uses CSS Modules, and all necessary styles are bundled directly with the JavaScript. No external CSS imports are required, ensuring clean and isolated styling.

```jsx
// No code changes needed in your app.
// The component handles its own styles internally.
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => (
  <SidekickMenu items={/* ... */ } />
);
```

[➡️ For more details on styling considerations, refer to the Styling section in the API Reference.](api.md#styling)

---
**[< Previous: The Cookbook: Practical Examples](examples.md) | [Next: API Reference >](api.md)**
