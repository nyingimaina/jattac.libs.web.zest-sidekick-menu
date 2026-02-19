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
*   **Summary:** This version enhances the `visibilityControl` property of `ISidekickMenuItem` to support asynchronous visibility resolution. It also includes internal refactoring for improved maintainability.
*   **Breaking Changes:** None. The `visibilityControl` object has been **restored and enhanced**, not removed. If you were using `visibilityControl.isVisibleResolver`, you can now optionally provide an asynchronous function (`Promise<boolean>`) or a direct `boolean` value.
*   **Migration Instructions:** No action is strictly required from consumers who were already using `visibilityControl`. However, you can now leverage the enhanced `isVisibleResolver` to return `Promise<boolean>` for asynchronous checks or a direct `boolean` for static visibility.

    **Example of enhanced usage:**
    ```typescript
    {
      id: 'item-id',
      label: 'Async Item',
      path: '/async',
      visibilityControl: {
        isVisibleResolver: async () => {
          // ... perform async check
          return true;
        },
        isCachable: true,
      },
    }
    ```
*   **Other Changes:**
    *   Internal refactoring to use React Context for improved maintainability and reduced prop drilling. This does not affect the public API of the `SidekickMenu` component.

---
**[< Previous: Contributor's Guide](development.md) | [Next: README.md >](../README.md)**
