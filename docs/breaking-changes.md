# Breaking Changes & Migration

**[< Previous: Contributor's Guide](development.md) | [Next: README.md >](../README.md)**

This document outlines any breaking changes introduced in new versions of the React Sidekick Menu and provides instructions on how to migrate your existing codebase. Our goal is to minimize disruptions, but sometimes changes are necessary to improve the component.

## Table of Contents

1.  [v1.0.5](#v105)

---

### v1.0.5

*   **Release Date:** February 18, 2026
*   **Summary:** This version includes a significant internal refactoring of the `SidekickMenu` component from a class-based architecture to a functional component utilizing React Hooks and a modular structure. This change was primarily an internal architectural improvement aimed at enhancing maintainability, testability, and adherence to modern React practices.
*   **Breaking Changes:** None. This release was carefully executed to maintain **full backward compatibility** with the public API (`SidekickMenuProps`, `ISidekickMenuItem` interface, `clearSidekickMenuCache` utility, and styling integration).
*   **Migration Instructions:** No action is required from consumers of the library to upgrade from previous versions (e.g., v1.0.4) to v1.0.5. Your existing code should continue to function as expected.

---

### v1.0.10

*   **Release Date:** February 19, 2026
*   **Summary:** This version introduces enhanced flexibility for conditional menu item visibility and refactors internal state management using React Context.
*   **Breaking Changes:**
    *   **`ISidekickMenuItem` Interface Update:** The `visibilityControl` object on the `ISidekickMenuItem` interface has been removed. Its functionality is now replaced by two top-level properties:
        *   `isVisible?: (() => Promise<boolean> | boolean) | boolean;`
        *   `isCachable?: boolean;`
    *   **Migration Instructions:** If you were previously using `visibilityControl` to manage item visibility, you must update your `ISidekickMenuItem` definitions.

        **Old way:**
        ```typescript
        {
          id: 'item-id',
          label: 'Old Item',
          path: '/old-item',
          visibilityControl: {
            isVisibleResolver: async () => true,
            isCachable: true,
          },
        }
        ```

        **New way:**
        ```typescript
        {
          id: 'item-id',
          label: 'New Item',
          path: '/new-item',
          isVisible: async () => true, // Or a synchronous function, or a direct boolean
          isCachable: true,
        }
        ```
*   **Other Changes:**
    *   Internal refactoring to use React Context for improved maintainability and reduced prop drilling. This does not affect the public API of the `SidekickMenu` component.

---
**[< Previous: Contributor's Guide](development.md) | [Next: README.md >](../README.md)**
