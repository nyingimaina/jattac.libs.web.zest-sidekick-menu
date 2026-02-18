# 📖 The Cookbook: Practical Examples

**[< Previous: README.md](README.md) | [Next: Features Showcase >](features.md)**

This cookbook provides practical, step-by-step examples to help you leverage the full power of the React Sidekick Menu. From basic setup to advanced features like dynamic visibility and custom content, you'll find ready-to-use code snippets and explanations.

## 📚 Table of Contents

1.  [Basic Menu Setup](#1-basic-menu-setup)
2.  [Creating Nested Sub-menus](#2-creating-nested-sub-menus)
3.  [Enabling and Customizing Search](#3-enabling-and-customizing-search)
4.  [Implementing Conditional Item Visibility (Async & Cached)](#4-implementing-conditional-item-visibility-async--cached)
5.  [Adding Custom Header, Footer, and Icons](#5-adding-custom-header-footer-and-icons)
6.  [Manually Clearing the Visibility Cache](#6-manually-clearing-the-visibility-cache)

---

### 1. Basic Menu Setup

Learn how to create a simple menu with a list of navigation links.

#### Problem:
You need a straightforward side menu to navigate between different pages of your application.

#### Solution:
Provide an array of menu items, each with an `id`, `label`, `icon`, and `path`.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const BasicApp = () => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <div>
      <SidekickMenu items={menuItems} />
      <main>
        {/* Your application content */}
      </main>
    </div>
  );
};

export default BasicApp;
```

---

### 2. Creating Nested Sub-menus

Organize your menu items into hierarchical structures using sub-menus.

#### Problem:
Your application has many sections, and you want to group related pages under a parent menu item to reduce clutter.

#### Solution:
Use the `children` property in an `ISidekickMenuItem` to define sub-items.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const NestedMenuApp = () => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      children: [
        { id: 'laptops', label: 'Laptops', icon: '💻', path: '/products/laptops' },
        { id: 'phones', label: 'Phones', icon: '📱', path: '/products/phones' },
        { id: 'accessories', label: 'Accessories', icon: '🎧', path: '/products/accessories' },
      ],
    },
    {
      id: 'admin',
      label: 'Administration',
      icon: '🔒',
      children: [
        { id: 'users', label: 'Manage Users', icon: '👥', path: '/admin/users' },
        { id: 'reports', label: 'View Reports', icon: '📈', path: '/admin/reports' },
      ],
    },
  ];

  return (
    <div>
      <SidekickMenu items={menuItems} />
      <main>
        {/* Your application content */}
      </main>
    </div>
  );
};

export default NestedMenuApp;
```

---

### 3. Enabling and Customizing Search

Integrate and customize the powerful built-in search functionality.

#### Problem:
Users need to quickly find specific menu items without navigating through complex hierarchies.

#### Solution:
The search is enabled by default. You can customize its appearance and behavior using `searchPlaceholder`, `searchIcon`, and `searchAutoFocus` props.

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';
// Assuming you have custom icons or use an icon library
import { FaSearch } from 'react-icons/fa';

const SearchableMenuApp = () => {
  const menuItems = [
    { id: 'articles', label: 'Articles', searchTerms: 'news blog posts', path: '/articles' },
    { id: 'docs', label: 'Documentation', searchTerms: 'help guide manual', path: '/docs' },
    { id: 'contact', label: 'Contact Us', searchTerms: 'support helpdesk', path: '/contact' },
  ];

  return (
    <div>
      <SidekickMenu
        items={menuItems}
        searchEnabled={true}
        searchPlaceholder="Find anything in the menu..."
        searchIcon={<FaSearch />} // Custom search icon
        searchAutoFocus={true} // Focus search input on menu open
      />
      <main>
        {/* Your application content */}
      </main>
    </div>
  );
};

export default SearchableMenuApp;
```
For more details on search-related props, refer to the [API Reference](api.md#search-props).

---

### 4. Implementing Conditional Item Visibility (Async & Cached)

Control which menu items are visible to users based on custom logic, such as user roles or feature flags, with built-in caching.

#### Problem:
Certain menu items should only be visible to specific users (e.g., administrators) or under particular conditions. Re-evaluating visibility on every page load can be inefficient.

#### Solution:
Utilize the `visibilityControl` property of an `ISidekickMenuItem`. Provide an `isVisibleResolver` function that can return a boolean or a Promise. Set `isCachable: true` to store the result in `localStorage`.

```jsx
import React from 'react';
import SidekickMenu, { ISidekickMenuItem } from 'jattac.libs.web.react-sidekick-menu';

// Mock API call to check user permissions
const checkUserRole = async (role: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUserRoles = ['user']; // Simulate a logged-in user with 'user' role
      // For testing admin role, change to ['user', 'admin']
      resolve(currentUserRoles.includes(role));
    }, 500); // Simulate network latency
  });
};

const ConditionalMenuApp = () => {
  const menuItems: ISidekickMenuItem[] = [
    { id: 'general', label: 'General Info', icon: '📝', path: '/general' },
    {
      id: 'admin-panel',
      label: 'Admin Panel',
      icon: '👑',
      path: '/admin',
      visibilityControl: {
        isVisibleResolver: () => checkUserRole('admin'),
        isCachable: true, // Cache this result in localStorage
      },
    },
    {
      id: 'beta-features',
      label: 'Beta Features',
      icon: '🧪',
      path: '/beta',
      visibilityControl: {
        isVisibleResolver: async () => {
          // Simulate an instant check for a feature flag
          return Math.random() > 0.5; // Randomly visible for demo
        },
        isCachable: false, // Don't cache, re-evaluate always
      },
    },
  ];

  return (
    <div>
      {/* Cache visibility results for 1 hour (default is 24 hours) */}
      <SidekickMenu items={menuItems} cacheLifetime={1} />
      <main>
        {/* Your application content */}
      </main>
    </div>
  );
};

export default ConditionalMenuApp;
```
While `isVisibleResolver` is processing, a skeleton loader will be displayed, ensuring a smooth user experience.

---

### 5. Adding Custom Header, Footer, and Icons

Personalize the menu's appearance with your own React components.

#### Problem:
You need to integrate branding (e.g., logo, company name) or additional information (e.g., copyright, user status) directly into the menu, and use custom visual elements for icons.

#### Solution:
Pass `React.ReactNode` directly to the `headerContent`, `footerContent`, `searchIcon`, and `chevronIcon` props, or the `icon` property of individual menu items.

```jsx
import React from 'react';
import SidekickMenu, { ISidekickMenuItem } from 'jattac.libs.web.react-sidekick-menu';
// Assuming you have custom icons or use an icon library
import { FaHome, FaInfoCircle, FaCog, FaChevronDown, FaSearch } from 'react-icons/fa';

const CustomContentApp = () => {
  const MyHeader = () => (
    <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <h2 style={{ margin: 0, color: '#007bff' }}>My App</h2>
    </div>
  );

  const MyFooter = () => (
    <div style={{ padding: '1rem', borderTop: '1px solid #eee', fontSize: '0.8em', color: '#666' }}>
      <p>&copy; 2026 My Company</p>
    </div>
  );

  const menuItems: ISidekickMenuItem[] = [
    { id: 'home', label: 'Home', icon: <FaHome />, path: '/' },
    { id: 'about', label: 'About', icon: <FaInfoCircle />, path: '/about' },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FaCog />,
      children: [
        { id: 'general', label: 'General', path: '/settings/general' },
        { id: 'security', label: 'Security', path: '/settings/security' },
      ],
    },
  ];

  return (
    <div>
      <SidekickMenu
        items={menuItems}
        headerContent={<MyHeader />}
        footerContent={<MyFooter />}
        searchIcon={<FaSearch size={14} />}
        chevronIcon={<FaChevronDown size={10} />}
      />
      <main>
        {/* Your application content */}
      </main>
    </div>
  );
};

export default CustomContentApp;
```

---

### 6. Manually Clearing the Visibility Cache

Learn how to programmatically clear the stored visibility state for menu items.

#### Problem:
User permissions or other conditions change dynamically (e.g., user logs out, role is updated), and you need to force the menu to re-evaluate the visibility of `isCachable` items.

#### Solution:
Import and call the `clearSidekickMenuCache` utility function.

```jsx
import React from 'react';
import { clearSidekickMenuCache } from 'jattac.libs.web.react-sidekick-menu';

const handleLogout = () => {
  // Perform user logout logic (e.g., clear session, redirect)
  console.log('User logged out');

  // Clear the SidekickMenu's visibility cache to force re-evaluation
  clearSidekickMenuCache();

  // Redirect to login or home page
  window.location.href = '/login';
};

const LogoutButton = () => (
  <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '1em' }}>
    Logout
  </button>
);

export default LogoutButton;
```

---
**[< Previous: README.md](README.md) | [Next: Features Showcase >](features.md)**
