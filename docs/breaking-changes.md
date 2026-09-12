# Breaking Changes & Migration

**[< Previous: Best Practices](best-practices.md) | [Next: README.md >](../README.md)**

This document outlines any breaking changes introduced in new versions of the React Sidekick Menu and provides instructions on how to migrate your existing codebase. Our goal is to minimize disruptions, but sometimes changes are necessary to improve the component.

## Table of Contents

1.  [v1.0.5](#v105)
2.  [v1.0.10](#v1010)
3.  [v1.4.0 — Deprecation notice: `navigationStyle="accordion"`](#v140--deprecation-notice-navigationstyleaccordion)

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

### v1.4.0 — Deprecation notice: `navigationStyle="accordion"`

*   **Release Date:** (this release)
*   **Summary:** `1.4.0` introduces drilldown navigation (one level at a time, with a breadcrumb) as the new default `navigationStyle`. The previous in-place-expand behavior is still fully supported via `navigationStyle="accordion"`, byte-for-byte unchanged — but it is now **deprecated**: it will receive no new features going forward, and passing it explicitly triggers a development-mode console warning.
*   **Breaking Changes:** None yet. This is a forward-looking deprecation notice, not a removal. Existing consumers who don't touch `navigationStyle` get the new drilldown default (a behavior change, not an API break — see [Look & Feel / Interaction Update](features.md#9-drilldown-navigation--favourites-v140)); existing consumers who explicitly set `navigationStyle="accordion"` see no change in behavior at all, only the new dev-mode warning.
*   **Deprecation tracking:** `navigationStyle="accordion"` is scheduled for full removal after **25 published releases** from this one (any patch/minor/major bump counts as one release toward the count). Current count: **1 / 25** (this release). This count will be updated in each subsequent release's entry (or a running note added here) until removal.
*   **Migration Instructions:** None required now. When the code path is eventually removed (at release 25 of the count above), this entry will be updated with concrete migration guidance — but since `navigationStyle="drilldown"` has been the default since this release, most consumers will already be unaffected by the time that happens. If you are deliberately using `navigationStyle="accordion"`, plan to migrate to the default drilldown navigation before the count is exhausted.

---
**[< Previous: Best Practices](best-practices.md) | [Next: README.md >](../README.md)**
