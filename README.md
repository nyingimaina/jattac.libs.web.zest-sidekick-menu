'''# ⚛️ React Sidekick Menu

A flexible and reusable side menu component for React, designed to be easy to use and customize. It comes with built-in search, nested sub-menus, and a clean, modern design.

[![NPM](https://img.shields.io/npm/v/jattac.libs.web.react-sidekick-menu.svg)](https://www.npmjs.com/package/jattac.libs.web.react-sidekick-menu)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## 📚 Table of Contents

- [✨ Features](#-features)
- [DEMO](#demo)
- [🚀 Installation](#-installation)
- [Basic Usage](#basic-usage)
- [Props (API)](#props-api)
- [Menu Item Data Structure](#menu-item-data-structure)
  - [Common Properties](#common-properties)
  - [Item Variants](#item-variants)
- [Features & Examples](#features--examples)
  - [Search](#search)
  - [Sub-menus](#sub-menus)
  - [Conditional Visibility and Caching](#conditional-visibility-and-caching)
  - [Custom Header and Footer](#custom-header-and-footer)
  - [Custom Icons](#custom-icons)
- [Utility Functions](#utility-functions)
  - [clearSidekickMenuCache](#clearsidekickmenucache)
- [Styling](#styling)
- [💥 Breaking Changes and Migration Instructions](#-breaking-changes-and-migration-instructions)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Easy to use:** Get up and running with a simple and intuitive API.
- **Searchable:** Built-in search functionality to filter menu items.
- **Nested Sub-menus:** Create hierarchical menus with multiple levels of nesting.
- **Conditional Item Visibility:** Asynchronously show or hide menu items based on custom logic (e.g., user permissions).
- **Customizable:** Use custom components for the header, footer, and icons.
- **Accessible:** Built with accessibility in mind, including keyboard navigation and focus management.
- **Zero-dependency styling:** CSS is bundled with the component, so no extra CSS import is needed.

## DEMO

Check out the live demo on [CodeSandbox](https://codesandbox.io) (link to be added).

## 🚀 Installation

```bash
npm install jattac.libs.web.react-sidekick-menu
```

## Basic Usage

To use the Sidekick Menu, import the `SidekickMenu` component and provide it with an array of menu items.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';


const App = () => {
  const menuItems = [
    {
      id: '1',
      label: 'Home',
      icon: '🏠',
      path: '/',
      searchTerms: 'home dashboard',
    },
    {
      id: '2',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => alert('Settings clicked!'),
      searchTerms: 'settings options',
    },
  ];

  return (
    <div>
      <SidekickMenu items={menuItems} />
      <main>
        {/* Your main content goes here */}
      </main>
    </div>
  );
};

export default App;
```

## Props (API)

| Prop                        | Type                    | Default                   | Description                                                                                             |
| --------------------------- | ----------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `items`                     | `ISidekickMenuItem[]`   | `[]`                      | An array of menu item objects to display in the menu.                                                   |
| `cacheLifetime`             | `number`                | `24`                      | The lifetime of the visibility cache in hours.                                                          |
| `searchEnabled`             | `boolean`               | `true`                    | Whether to show the search input.                                                                       |
| `searchAutoFocus`           | `boolean`               | `true`                    | Whether to automatically focus the search input when the menu is opened.                                |
| `searchPlaceholder`         | `string`                | `"Search menu..."`        | The placeholder text for the search input.                                                              |
| `alwaysShowUnsearchableItems` | `boolean`               | `true`                    | Whether to always show items that don't have `searchTerms` defined, even when searching.               |
| `openOnDesktop`             | `boolean`               | `false`                   | Whether the menu should be open by default on desktop screens (>= 768px).                               |
| `searchIcon`                | `React.ReactNode`       | `'🔍'`                    | A custom icon for the search input.                                                                     |
| `chevronIcon`               | `React.ReactNode`       | `'▼'`                     | A custom icon for the sub-menu toggle.                                                                  |
| `headerContent`             | `React.ReactNode`       | `null`                    | Custom content to display at the top of the menu, above the search bar.                                 |
| `footerContent`             | `React.ReactNode`       | `null`                    | Custom content to display at the bottom of the menu.                                                    |

## Menu Item Data Structure

The `items` prop takes an array of `ISidekickMenuItem` objects. Each object has a common set of properties and a specific set of properties depending on the type of menu item.

### Common Properties

| Prop                | Type                                                  | Description                                                                                                                                 |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | `string`                                              | **Required.** A unique and stable identifier for the menu item. This is critical for React's `key` prop, state management, and caching to work correctly. |
| `label`             | `React.ReactNode`                                     | The text or React node to display for the menu item.                                                                                        |
| `icon`              | `React.ReactNode`                                     | The icon to display next to the label.                                                                                                      |
| `searchTerms`       | `string`                                              | A string of keywords used for searching the menu item.                                                                                      |
| `visibilityControl` | `{ isVisibleResolver, isCachable }` | An optional object to control the item's visibility. See [Conditional Visibility and Caching](#conditional-visibility-and-caching) for details. |

### Item Variants

A menu item can be one of three types: a link, a button, or a sub-menu.

#### 1. Link Item

A link item navigates to a new page when clicked. It has a `path` property and should not have `onClick` or `children`.

```js
{
  id: '1',
  label: 'Home',
  icon: '🏠',
  path: '/',
  searchTerms: 'home dashboard',
}
```

#### 2. Button Item

A button item triggers a function when clicked. It has an `onClick` property and should not have `path` or `children`.

```js
{
  id: '2',
  label: 'Settings',
  icon: '⚙️',
  onClick: () => alert('Settings clicked!'),
  searchTerms: 'settings options',
}
```

#### 3. Sub-menu Item

A sub-menu item opens a nested menu when clicked. It has a `children` property which is an array of `ISidekickMenuItem` objects. It should not have `path` or `onClick`.

```js
{
  id: '3',
  label: 'Products',
  icon: '📦',
  searchTerms: 'products items',
  children: [
    {
      id: '3-1',
      label: 'Laptops',
      icon: '💻',
      path: '/products/laptops',
      searchTerms: 'laptops computers',
    },
    {
      id: '3-2',
      label: 'Phones',
      icon: '📱',
      path: '/products/phones',
      searchTerms: 'phones mobiles',
    },
  ],
}
```

## Features & Examples

### Search

The search functionality is enabled by default. You can customize the placeholder text and the search icon.

```jsx
<SidekickMenu
  items={menuItems}
  searchPlaceholder="Find anything..."
  searchIcon={<img src="/path/to/search-icon.svg" alt="Search" />}
/>
```

### Sub-menus

Create nested menus by adding a `children` array to a menu item.

```jsx
const menuItems = [
  {
    id: '1',
    label: 'Electronics',
    icon: '🔌',
    searchTerms: 'electronics gadgets',
    children: [
      // ...
    ],
  },
];

<SidekickMenu items={menuItems} />;
```

### Conditional Visibility and Caching

You can control the visibility of menu items using the `visibilityControl` property. This is useful for scenarios like hiding admin-only links from regular users.

The `visibilityControl` object has two properties:
- `isVisibleResolver`: A function that returns a `boolean` or a `Promise<boolean>`. The menu item will only be rendered if this function resolves to `true`.
- `isCachable`: A boolean. If `true`, the result of `isVisibleResolver` will be cached in `localStorage` to avoid re-running the check on subsequent page loads.

While the `isVisibleResolver` is running, the component will render a skeleton loader as a placeholder, preventing UI stutter and layout shifts.

**Example:** Show an "Admin" link only if the user has the 'admin' role.

```jsx
import { SidekickMenu, ISidekickMenuItem } from 'jattac.libs.web.react-sidekick-menu';

// A mock function to check user permissions from an API
const checkUserRole = async (role) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  const currentUser = { roles: ['user'] }; // Mock user object
  return currentUser.roles.includes(role);
};

const menuItems: ISidekickMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    path: '/',
    searchTerms: 'home',
  },
  {
    id: 'admin-dashboard',
    label: 'Admin Dashboard',
    icon: '🛡️',
    path: '/admin',
    searchTerms: 'admin dashboard settings',
    visibilityControl: {
      isVisibleResolver: () => checkUserRole('admin'),
      isCachable: true,
    },
  },
];

const App = () => (
  // Cache results for 8 hours instead of the default 24
  <SidekickMenu items={menuItems} cacheLifetime={8} />
);
```

### Custom Header and Footer

You can add custom content to the header and footer of the menu using the `headerContent` and `footerContent` props.

```jsx
const MyHeader = () => (
  <div style={{ padding: '1rem', textAlign: 'center' }}>
    <img src="/logo.png" alt="Logo" width="80" />
    <h3>My App</h3>
  </div>
);

const MyFooter = () => (
  <div style={{ padding: '1rem', textAlign: 'center' }}>
    <p>&copy; 2025 My App</p>
  </div>
);

<SidekickMenu
  items={menuItems}
  headerContent={<MyHeader />}
  footerContent={<MyFooter />}
/>;
```

### Custom Icons

You can use any React node for the icons, including images, SVG icons from libraries like `react-icons`, or your own custom components.

```jsx
import { FaHome, FaCog } from 'react-icons/fa';

const menuItems = [
  {
    id: '1',
    label: 'Home',
    icon: <FaHome />,
    path: '/',
    searchTerms: 'home dashboard',
  },
  {
    id: '2',
    label: 'Settings',
    icon: <FaCog />,
    onClick: () => alert('Settings clicked!'),
    searchTerms: 'settings options',
  },
];

<SidekickMenu items={menuItems} />;
```

## Utility Functions

### clearSidekickMenuCache

The component exports a utility function that allows you to manually clear the visibility cache from `localStorage`. This is useful in scenarios where user permissions change, and you need to force a re-evaluation of menu item visibility.

**Example:** Clearing the cache on user logout.

```jsx
import { clearSidekickMenuCache } from 'jattac.libs.web.react-sidekick-menu';

const handleLogout = () => {
  // ... your logout logic
  clearSidekickMenuCache();
};
```

## Styling

The component uses CSS modules to avoid style conflicts. The CSS is bundled with the JavaScript, so you don't need to import any CSS files separately.

At the moment, the component does not expose a way to customize the styles directly via props. To customize the appearance, you will need to fork the repository and modify the CSS files in the `Styles` directory.

**Note on Mobile Safe Areas:** The menu is designed to respect the safe areas on mobile devices (the parts of the screen not obscured by notches or system bars). For this to work correctly, ensure your application's main HTML file includes the `viewport-fit=cover` property in the `viewport` meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

## 💥 Breaking Changes and Migration Instructions

This section documents any breaking changes between versions and provides instructions on how to migrate your code.

### v1.0.0

-   Initial release. No breaking changes.

---

**Example for future releases:**

### v2.0.0

-   **BREAKING CHANGE:** The `searchIcon` prop has been renamed to `customSearchIcon`.
    -   **Migration:** Rename the `searchIcon` prop to `customSearchIcon` in your `<SidekickMenu>` component.
    -   **Before:** `<SidekickMenu searchIcon={<MyIcon />} />`
    -   **After:** `<SidekickMenu customSearchIcon={<MyIcon />} />`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on our [GitHub repository](https://github.com/your-username/jattac.libs.web.react-sidekick-menu) (link to be added).

## License

MIT &copy; [Your Name](https://github.com/your-username) (link to be added)
''
