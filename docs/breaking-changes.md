# ⚠️ Breaking Changes & Migration

**[< Previous: Contributor's Guide](development.md) | [Next: README.md >](../README.md)**

This document outlines any breaking changes introduced in new versions of the React Sidekick Menu and provides instructions on how to migrate your existing codebase. Our goal is to minimize disruptions, but sometimes changes are necessary to improve the component.

## 📚 Table of Contents

1.  [v1.0.5](#v105)

---

### v1.0.5

*   **Release Date:** February 18, 2026
*   **Summary:** This version includes a significant internal refactoring of the `SidekickMenu` component from a class-based architecture to a functional component utilizing React Hooks and a modular structure. This change was primarily an internal architectural improvement aimed at enhancing maintainability, testability, and adherence to modern React practices.
*   **Breaking Changes:** None. This release was carefully executed to maintain **full backward compatibility** with the public API (`SidekickMenuProps`, `ISidekickMenuItem` interface, `clearSidekickMenuCache` utility, and styling integration).
*   **Migration Instructions:** No action is required from consumers of the library to upgrade from previous versions (e.g., v1.0.4) to v1.0.5. Your existing code should continue to function as expected.

---
**[< Previous: Contributor's Guide](development.md) | [Next: README.md >](../README.md)**
