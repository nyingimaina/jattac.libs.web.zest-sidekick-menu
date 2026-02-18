# 🤝 Contributor's Guide

**[< Previous: Configuration Guide](configuration.md) | [Next: Breaking Changes & Migration >](breaking-changes.md)**

This guide is for developers interested in contributing to the React Sidekick Menu, understanding its internal workings, or extending its functionality.

## 📚 Table of Contents

1.  [Internal Architecture Overview](#1-internal-architecture-overview)
2.  [Local Development Setup](#2-local-development-setup)
3.  [Available Development Scripts](#3-available-development-scripts)
4.  [Styling and Theming](#4-styling-and-theming)
5.  [Testing Guidelines](#5-testing-guidelines)
6.  [Contributing Guidelines](#6-contributing-guidelines)

---

### 1. Internal Architecture Overview

The `SidekickMenu` component has been refactored from a monolithic class component into a modern, functional React component, leveraging hooks and smaller, atomic units for better maintainability, testability, and separation of concerns.

**Core Structure:**

*   **`UI/SidekickMenu/SidekickMenu.tsx`**: The main functional component that orchestrates all other parts. It composes the various hooks and UI sub-components.
*   **`UI/SidekickMenu/components/`**: Contains small, focused, and reusable UI components:
    *   `MenuItem.tsx`: Renders a single menu item, including its label, icon, and handles click events.
    *   `MenuItemSkeleton.tsx`: A placeholder for items whose visibility is being asynchronously resolved.
    *   `MenuList.tsx`: Manages the rendering of a list of `MenuItem` components, including recursive rendering for sub-menus and applying search filtering.
*   **`UI/SidekickMenu/hooks/`**: Encapsulates reusable stateful logic:
    *   `useItemVisibility.ts`: Manages the asynchronous resolution and caching of menu item visibility, providing the `itemVisibility` map.
    *   `useFocusTrap.ts`: Implements keyboard focus trapping within the menu for accessibility.
    *   `useKeyboardNavigation.ts`: Handles keyboard interactions (Arrow keys, Enter, Escape) for navigating and interacting with menu items.
*   **`UI/SidekickMenu/utils/`**: Houses pure helper functions:
    *   `cache.ts`: Exports `CACHE_KEY` and the `clearSidekickMenuCache` utility.
    *   `search.ts`: Contains the `getFilteredItems` logic for filtering menu items based on search terms and visibility.
    *   `validation.ts`: Includes `validateItemIds` for ensuring unique `id` props in development.
*   **`UI/SidekickMenu/types.ts`**: Centralizes all TypeScript type definitions (`ISidekickMenuItem`, `SidekickMenuProps`, etc.).

This modular design promotes clear responsibilities and makes it easier to understand, test, and extend specific parts of the component.

---

### 2. Local Development Setup

To set up your local development environment for the React Sidekick Menu:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd jattac.libs.web.react-sidekick-menu
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```
    This will compile the TypeScript code and bundle the component into the `dist/` directory.

---

### 3. Available Development Scripts

The project uses `rollup` for building. Here are the commonly used scripts:

*   `npm run build`: Compiles the TypeScript source code and bundles the component for production. This generates output files in the `dist/` directory, including CommonJS, ES Module, and TypeScript declaration files.
*   `npm run prepublishOnly`: This script runs `npm run build` automatically before publishing the package to npm, ensuring that the latest compiled code is always published.

---

### 4. Styling and Theming

The component's styling is handled internally using CSS Modules (`SidekickMenu.module.css`). These styles are bundled directly with the JavaScript output, meaning you do not need to import any separate CSS files into your application.

For extensive styling customization:
*   Currently, there are no exposed props or theming contexts for direct style overrides.
*   The recommended approach for deep visual modifications is to fork the repository and adjust the `.css` module files directly.

For more general styling advice, including mobile safe areas, refer to the [API Reference](api.md#styling).

---

### 5. Testing Guidelines

Currently, the project does not include dedicated unit or integration tests within the repository.

*   **When contributing new features or fixing bugs**, please consider adding corresponding tests to ensure the reliability and correctness of your changes.
*   Tests should ideally cover edge cases and ensure that the component behaves as expected under various conditions.
*   Future enhancements will include setting up a testing framework (e.g., Jest, React Testing Library).

---

### 6. Contributing Guidelines

We welcome contributions! If you're interested in improving the React Sidekick Menu:

*   **Report Bugs:** If you find a bug, please open an issue on the [GitHub repository](https://github.com/your-username/jattac.libs.web.react-sidekick-menu) (link to be added).
*   **Suggest Features:** Have an idea for a new feature or enhancement? Open an issue to discuss it.
*   **Submit Pull Requests:** If you've implemented a fix or a new feature, please submit a pull request. Ensure your code adheres to the existing style, includes appropriate tests (if applicable), and updates documentation where necessary.

---
**[< Previous: Configuration Guide](configuration.md) | [Next: Breaking Changes & Migration >](breaking-changes.md)**
