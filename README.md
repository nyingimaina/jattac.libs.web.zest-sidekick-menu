# React Sidekick Menu

A flexible, searchable, and accessible side menu component for React, designed to streamline navigation in modern web applications. It empowers developers to build intuitive user interfaces with support for complex menu structures, dynamic visibility, and an optimized user experience.

## Features

*   **Effortless Navigation:** Provides a clean and intuitive interface for users to navigate through your application.
*   **Built-in Search:** Quickly filter menu items with integrated search functionality, improving user efficiency.
*   **Nested Sub-menus:** Easily create hierarchical menu structures for organizing complex application sections.
*   **Dynamic Item Visibility:** Conditionally show or hide menu items based on custom logic (e.g., user permissions, feature flags), with optional caching.
*   **Highly Customizable:** Supports custom headers, footers, and icons, allowing seamless integration with your application's design.

## Installation

Install the package via npm:

```bash
npm install jattac.libs.web.react-sidekick-menu
```

## Basic Usage (Hello World)

Here's the minimal code to get a `SidekickMenu` up and running:

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.react-sidekick-menu';

const App = () => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'HomeIcon', path: '/' },
    { id: 'about', label: 'About', icon: 'InfoIcon', path: '/about' },
  ];

  return (
    <div>
      <SidekickMenu items={menuItems} />
      <main>
        <h1>Welcome to My App</h1>
        <p>This is your main content area.</p>
      </main>
    </div>
  );
};

export default App;
```

## Next Steps

Dive deeper into the features and capabilities of the React Sidekick Menu:

*   **[The Cookbook: Practical Examples](docs/examples.md)**: Start here for step-by-step guides and recipes to implement various menu functionalities.
*   [Features Showcase](docs/features.md)
*   [API Reference](docs/api.md)
*   [Configuration Guide](docs/configuration.md)
*   [Contributor's Guide](docs/development.md)
*   [Breaking Changes & Migration](docs/breaking-changes.md)

---
[Next: The Cookbook: Practical Examples >](docs/examples.md)
