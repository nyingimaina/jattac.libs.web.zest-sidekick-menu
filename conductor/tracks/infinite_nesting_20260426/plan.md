# Implementation Plan: Implement infinite sub-menu nesting support

## Phase 1: Foundation & Types
- [x] Task: Define recursive TypeScript interfaces for menu items [checkpoint: 749e7ef]
    - [x] Update `MenuItem` type to allow `children` of type `MenuItem[]`
    - [x] Ensure all utility functions (search, visibility) support recursive structures
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Types' (Protocol in workflow.md)

## Phase 2: Recursive Rendering Logic
- [x] Task: Refactor `MenuList` to render recursively [checkpoint: 749e7ef]
    - [x] Write tests for recursive rendering of nested children
    - [x] Update `MenuList.tsx` to call itself or a sub-component for items with children
- [x] Task: Update `MenuItem` to handle expansion state for nested children [checkpoint: 749e7ef]
    - [x] Write tests for sub-menu expansion/collapsing
    - [x] Implement toggle logic and visual indicators for nested items
- [x] Task: Conductor - User Manual Verification 'Phase 2: Recursive Rendering Logic' (Protocol in workflow.md)

## Phase 3: Search & Visibility Logic
- [~] Task: Update search utility for recursive filtering
    - [ ] Write tests for searching items at deep levels
    - [ ] Refactor `search.ts` to traverse the full tree and return a filtered recursive structure
- [~] Task: Update visibility/moderation logic for recursive trees
    - [ ] Write tests for conditional visibility in nested items
    - [ ] Ensure parents are hidden if all children are hidden, and vice versa if appropriate
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Search & Visibility Logic' (Protocol in workflow.md)

## Phase 4: Accessibility & Final Verification
- [ ] Task: Audit and fix keyboard navigation for deep nesting
    - [ ] Write tests for focus management in nested sub-menus
    - [ ] Ensure `useKeyboardNavigation` handles deep hierarchies correctly
- [ ] Task: ARIA roles and screen reader verification
    - [ ] Verify `aria-expanded`, `aria-haspopup`, and nesting levels
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Accessibility & Final Verification' (Protocol in workflow.md)
