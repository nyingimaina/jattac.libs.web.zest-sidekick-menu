---
title: Contributor's Guide
covers: UI/, Styles/, jest.config.js, jest.setup.ts, rollup.config.js, package.json, tsconfig.json
covers-hash: fa26fbb81f0522c548b0
---

# Contributor's Guide

**[< Previous: Configuration Guide](configuration.md) | [Next: Best Practices >](best-practices.md)**

This guide is for developers interested in contributing to the React Sidekick Menu, understanding its internal workings, or extending its functionality.

## Table of Contents

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

*   **`UI/SidekickMenu/SidekickMenu.tsx`**: The main functional component. It owns the menu state (`useReducer` with the reducer from `context/MenuContext.ts`), wires the hooks below, computes the search-filtered list for the current level with `getFilteredItems`, and renders the panel, hamburger and sub-components. Since 2.0.0 `searchEnabled` defaults to `false`, so the search input is mounted only when it is `true` and the rail is not collapsed.
*   **`UI/SidekickMenu/context/MenuContext.ts`**: `MenuState`, the `MenuAction` union, `menuReducer` (search term, highlighted index, breadcrumb path, active tab, rail state), the context itself and `useMenuContext`.
*   **`UI/SidekickMenu/components/`**: The rendering pieces:
    *   `MenuList.tsx`: Renders an accordion level; filters with `getFilteredItems` and recurses into open sub-menus.
    *   `DrilldownMenuList.tsx`: Renders one drilldown level; filters, hides `HIDDEN` items and shows skeletons while visibility resolves.
    *   `DrilldownMenuItem.tsx`, `MenuItem.tsx`, `MenuItemSkeleton.tsx`: A single item, its accordion counterpart, and the placeholder shown while visibility is pending.
    *   `FavouritesList.tsx`, `MenuBreadcrumb.tsx`, `TabSwitcher.tsx`, `icons.tsx`: The Favourites tab, the breadcrumb trail, the All/Favourites tabs and the inline icons.
*   **`UI/SidekickMenu/hooks/`**: Stateful logic — `useItemVisibility` (resolves and caches item visibility), `useFocusTrap`, `useKeyboardNavigation` and `useDrilldownKeyboardNavigation`, `useNumberedShortcuts`, `useFavourites`, `useSwipeGesture`.
*   **`UI/SidekickMenu/utils/`**: Pure helpers — `cache.ts` (`CACHE_KEY`, `clearSidekickMenuCache`), `search.ts` (`getFilteredItems`), `validation.ts` (`validateItemIds`, `validateDescriptions`), `breadcrumb.ts`, `lastPosition.ts`, `favouritesStorage.ts` (`clearSidekickMenuUsageStats`), `namespace.ts`, `description.ts`.
*   **`UI/SidekickMenu/types.ts`**: Centralizes the public TypeScript types (`ISidekickMenuItem`, `SidekickMenuProps`, `NavigationStyle`, `FavouritesOptions` and the Zest theme/motion/visual types).

This modular design promotes clear responsibilities and makes it easier to understand, test, and extend specific parts of the component.

---

### 2. Local Development Setup

To set up your local development environment for the React Sidekick Menu:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd jattac.libs.web.zest-sidekick-menu
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

The project utilizes `rollup` for its build process and Jest for its tests. These are the scripts defined in `package.json`:

*   `npm run build`: Compiles the TypeScript source code and bundles the component for production. This operation generates output files in the `dist/` directory, encompassing CommonJS (`dist/index.js`), ES Module (`dist/index.esm.js`) and TypeScript declaration files.
*   `npm test`: Runs the Jest suite once.
*   `npm run test:watch`: Runs Jest in watch mode.
*   `npm run prepublishOnly`: This script automatically executes `npm run build` prior to publishing the package to npm, thereby ensuring that the latest compiled code is always distributed.

---

### 4. Styling and Theming

The component's styling is managed internally using CSS Modules (`SidekickMenu.module.css`). These styles are bundled directly with the JavaScript output, eliminating the need to import any separate CSS files into your application.

For styling customization:
*   Use the `zest` prop (or a `ZestSidekickConfigProvider` default) for theme, motion and surface. See [Theme Configuration](configuration.md#6-theme-configuration).
*   The stylesheet defines `--zest-*` custom properties (`--zest-color-*`, `--zest-radius-*`, `--zest-shadow-*`, `--zest-ease-*`, `--zest-motion-*`) that you can override in your own CSS.
*   Direct changes to the CSS Module classes still require forking the repository and editing the `.css` file.

For more general styling guidance, including considerations for mobile safe areas, refer to the [API Reference](api.md#4-styling).

---

### 5. Testing Guidelines

Tests use Jest with React Testing Library (`jest.config.js`, `jest.setup.ts`) and live next to the code they cover, for example `UI/SidekickMenu/SidekickMenu.test.tsx`.

*   **Run everything:** `npm test`.
*   **Run one file:** `npx jest --runTestsByPath UI/SidekickMenu/SidekickMenu.test.tsx`. The explicit path matters because Jest's default file matching scans the whole repository.
*   **Build before trusting the bundle-size check:** the PERF-001 test in `SidekickMenu.test.tsx` reads `dist/index.js` and `dist/index.esm.js` from the repo root and compares their byte sizes with the v1.7.0 ceiling. Those files exist only after `npm run build`, so the meaningful order is `npm run build && npm test`.
*   **When you add or change behaviour**, add tests beside the existing ones. Search tests must pass `searchEnabled` explicitly, because the prop now defaults to `false`: render with the prop, assert the input exists, then type into it.

The built bundle is checked against the v1.7.0 size because the search default change is not allowed to grow it, so a change that adds markup or verbose comments can fail the suite even when behaviour is correct.

---

### 6. Contributing Guidelines

Contributions are welcome! If you are interested in enhancing the React Sidekick Menu:

*   **Report Bugs:** Should you identify a bug, please open an issue on the [GitHub repository](https://github.com/your-username/jattac.libs.web.zest-sidekick-menu) (link to be added).
*   **Suggest Features:** If you have an idea for a new feature or enhancement, please open an issue to initiate a discussion.
*   **Submit Pull Requests:** If you have implemented a fix or a new feature, please submit a pull request. Ensure your code adheres to the existing style, includes appropriate tests (if applicable), and updates documentation where necessary.

## See also

- [API Reference](api.md) — the public surface you must keep stable.
- [Configuration Guide](configuration.md) — the behaviour this code implements.
- [Search (opt-in)](search.md) — the feature added in 2.0.0 and its tests.
- [Breaking Changes & Migration](breaking-changes.md) — what counts as a breaking change here.

---
**[< Previous: Configuration Guide](configuration.md) | [Next: Best Practices >](best-practices.md)**
