You turn a house rule, written in plain English by the owner of an app, into automatic checks that a build tool will enforce. The rule is the owner's order: it is not a suggestion.

Rule USR-006: ## 1. User-Centred Interface Design

All applications with a user interface, including web and native applications, must provide a modern, friendly, helpful, intuitive, and professionally polished experience.

Design for users who may be unfamiliar with computers or inefficient at navigating interfaces, without assuming they lack intelligence. Interfaces must anticipate user needs, guide users through tasks, reduce unnecessary effort, and explain complexity when needed without being condescending or patronising.

## 2. Intelligent Form Design

All forms must actively guide users through data entry while preserving their autonomy and control.

### 2.1. Form Usability and Guidance

Apply established form-design best practices, including:

- Logical field ordering and clear visual hierarchy.
- Appropriate input types, sensible defaults, and contextual placeholders where useful.
- Automatic focus on the most logical control when a form appears.
- Efficient keyboard navigation and predictable focus behaviour.
- Inline validation, actionable error messages, and clear indications of required fields.
- Automatic population of values when reliable predictions are available.
- Contextual guidance that reduces uncertainty without cluttering the interface.
- Support for both keyboard-driven and pointer-driven workflows.

Provide tooltips for controls requiring additional explanation, using them selectively rather than indiscriminately. Tooltips must work on both desktop and touch interfaces, with accessible alternatives for keyboard and assistive-technology users.

### 2.2. Adaptive Prediction and Auto-Population

Implement an adaptive prediction engine that learns from user behaviour and updates its learned patterns with every relevant form entry.

For each eligible control, calculate a confidence score for the proposed value and apply the following rules:

- **Confidence above 80%:** Automatically populate the predicted value.
- **Confidence above 50% and up to and including 80%:** Display a small, clickable suggestion in the lower-right area of the control. When the control receives focus, the suggestion must be reachable through Tab navigation and applicable using Enter. Clicking the suggestion must also populate the value.
- **Confidence of 50% or below:** Do not display a prediction.

Apply these thresholds consistently across the application. Predictions must account for relevant context, such as the current form, field, user, and previously entered values, where applicable.

Additional requirements:

- Never silently overwrite an explicitly entered or modified value with a prediction.
- Allow users to accept, reject, or replace suggested values naturally.
- Update learned patterns as new entries are made, including corrections and changes where relevant.
- Avoid learning invalid, incomplete, or otherwise unsuitable values as reliable patterns.
- Ensure suggestions do not interfere with ordinary typing, keyboard navigation, accessibility, or form submission.
- Provide appropriate fallbacks when insufficient historical data exists.
- Make prediction behaviour deterministic and testable wherever practical.

Confidence scores must be meaningfully calibrated against prediction correctness, rather than treated as arbitrary estimates. The engine must not claim high confidence merely because a value occurs frequently if the surrounding context makes that value inappropriate.

## 3. Prediction Engine Architecture

Implement the prediction engine as a reusable, extensible system built around a shared kernel and specialised adapters.

### 3.1. Shared Prediction Kernel

The kernel must own the reusable core functionality, including:

- Prediction orchestration and common prediction logic.
- Learned-pattern management and updates.
- Context evaluation and confidence scoring.
- Application of the shared confidence thresholds.
- Standard prediction and suggestion contracts.
- Common handling of historical entries, corrections, and relevant feedback.

Keep the kernel independent of specific UI frameworks wherever practical so it can be reused across forms, controls, projects, and application platforms.

The kernel must provide a consistent foundation without requiring every form or control to implement its own prediction logic.

### 3.2. Adapters and Specialised Behaviour

Forms or controls requiring specialised behaviour must be able to extend the engine through adapters without duplicating or modifying the kernel's core logic.

Adapters may customise:

- Extraction and normalisation of values.
- Construction of prediction context.
- Control-specific or form-specific prediction strategies.
- Interpretation and application of predicted values.
- Eligibility rules and validation.
- Suggestion presentation requirements and specialised interaction behaviour.
- Learning rules for domain-specific data.

Define clear adapter interfaces and predictable resolution rules when multiple adapters could apply. Provide a standard implementation whenever no specialised adapter is registered.

Keep UI rendering, focus management, keyboard interaction, and suggestion presentation in the appropriate UI integration layer rather than coupling them to the prediction kernel.

Adapters must follow the shared confidence thresholds, learning contracts, accessibility requirements, and user-control principles unless an explicit, documented configuration permits an override.

### 3.3. Extensibility, Reuse, and Maintainability

- Build the kernel once and reuse it across the application ecosystem.
- Prefer adapters over kernel modifications for new specialised requirements.
- Keep the kernel small, cohesive, independently testable, and stable.
- Define versioned or otherwise maintainable contracts where compatibility between independently developed adapters and the kernel matters.
- Ensure predictions remain isolated to the appropriate user, tenant, and context wherever applicable.
- Protect sensitive form data and avoid retaining or sharing personal information unnecessarily.
- Test confidence thresholds, learning updates, adapter resolution, keyboard accessibility, and protection against unintended overwrites.

**Architectural principle:** Centralise shared intelligence in the kernel and isolate specialised behaviour in adapters. Extend the system without compromising consistency, testability, portability, or user control.

## 4. Unified Application Design System

Every project with a user interface must use a cohesive design system covering web and native applications.

### 4.1. Theme Selection and Definition

- Use an existing, idiomatic theme supported by the application's framework and language ecosystem when it meets the product's requirements.
- If no suitable theme exists, create a custom theme aligned with the application's purpose, brand, audience, and intended experience.
- Define the theme centrally and apply it consistently throughout the application.
- Avoid isolated styling decisions, inconsistent component appearances, and duplicated design tokens.

The design system must establish consistent rules for:

- Colours and semantic colour roles.
- Typography and text hierarchy.
- Spacing, sizing, alignment, and layout.
- Component appearance and interaction states.
- Forms, inputs, buttons, navigation, and feedback.
- Icons, illustrations, and other visual assets.
- Borders, elevation, and visual grouping.
- Animation, transitions, and interaction feedback.
- Responsive layouts and accessibility.

Components must consume the shared design system rather than independently inventing their own styling.

### 4.2. Guided Theme-Creation Wizard

When a suitable theme does not already exist, provide a guided wizard that helps users define a complete, professional design system, even when they lack design expertise.

The wizard must:

1. Ask for the information necessary to establish the application's visual identity, purpose, audience, and design requirements.
2. Recommend sensible values for subsequent choices based on previous answers.
3. Use coherent defaults and established design principles to prevent users from making inconsistent choices.
4. Explain non-obvious decisions when useful, without overwhelming the user with unnecessary technical detail.
5. Preview the resulting theme through representative components and interface examples.
6. Validate combinations for readability, contrast, consistency, and practical usability.
7. Generate a reusable theme and associated design tokens that can be applied throughout the application.
8. Support iterative refinement without requiring users to start from scratch.
9. Apply the same principles to native applications, respecting the conventions and capabilities of their respective platforms.

The wizard must do more than collect colours and fonts: it must help users establish a coherent visual language with appropriate component styles, typography, spacing, interaction states, and other essential design decisions.

### 4.3. Visual Quality and User Engagement

The resulting interface should combine corporate polish, clarity, warmth, and carefully considered moments of delight.

- Use restrained, purposeful animation and transitions to communicate state changes and improve perceived responsiveness.
- Provide clear, immediate feedback for meaningful user actions.
- Use visual hierarchy to make important actions and information easy to identify.
- Make interfaces feel approachable without sacrificing professionalism.
- Avoid gratuitous decoration, distracting motion, inconsistent styling, and manipulative engagement techniques.
- Prioritise accessibility, usability, and functional clarity over aesthetic novelty.

The goal is a world-class interface that feels thoughtfully designed, even when its creator has limited design experience.

## 5. Governing Principles

1. **Design for technical unfamiliarity, not intellectual inferiority.** Guide users without patronising them.
2. **Anticipate rather than burden.** Use sensible defaults, contextual guidance, and reliable predictions to minimise unnecessary work.
3. **Preserve user control.** Automation must assist users, not silently override their intentions.
4. **Reuse before reinventing.** Centralise shared functionality and visual conventions.
5. **Extend without duplicating.** Use adapters for specialised prediction behaviour rather than fragmenting the shared kernel.
6. **Maintain consistency.** Apply common interaction rules, confidence thresholds, and design tokens throughout the application ecosystem.
7. **Make quality the default.** Users should not need specialist technical or design knowledge to achieve a polished, usable result.
8. **Treat accessibility as a requirement.** Support keyboard, pointer, touch, and assistive technologies wherever applicable.
9. **Prefer measurable correctness over assumptions.** Validate prediction confidence, usability, and visual consistency through testing.

**Leitprinzip (guiding principle):** Make the right action easy, the complex understandable, and the entire experience cohesive—without treating users as anything less than capable adults.

What the app looks like (a sample of its files, and its package.json when it has one):
- .gitignore
- .llm-directives/how-to-document.md
- .llm-directives/index.md
- .llm-directives/inferences/1.md
- .llm-directives/inferences/2.md
- .llm-directives/inferences/3.md
- .llm-directives/inferences/4.md
- .llm-directives/inferences/5.md
- .llm-directives/inferences/6.md
- .llm-directives/inferences/7.md
- .llm-directives/inferences/8.md
- .llm-directives/project_memos.md
- .llm-directives/release_git_steps.md
- .npmignore
- README.md
- Styles/SidekickMenu.module.css
- Styles/SidekickMenu.theme.test.ts
- UI/SidekickMenu/SidekickMenu.test.tsx
- UI/SidekickMenu/SidekickMenu.tsx
- UI/SidekickMenu/components/DrilldownMenuItem.test.tsx
- UI/SidekickMenu/components/DrilldownMenuItem.tsx
- UI/SidekickMenu/components/DrilldownMenuList.test.tsx
- UI/SidekickMenu/components/DrilldownMenuList.tsx
- UI/SidekickMenu/components/FavouritesList.test.tsx
- UI/SidekickMenu/components/FavouritesList.tsx
- UI/SidekickMenu/components/MenuBreadcrumb.test.tsx
- UI/SidekickMenu/components/MenuBreadcrumb.tsx
- UI/SidekickMenu/components/MenuItem.tsx
- UI/SidekickMenu/components/MenuItemSkeleton.tsx
- UI/SidekickMenu/components/MenuList.tsx
- UI/SidekickMenu/components/TabSwitcher.test.tsx
- UI/SidekickMenu/components/TabSwitcher.tsx
- UI/SidekickMenu/components/icons.tsx
- UI/SidekickMenu/context/MenuContext.test.ts
- UI/SidekickMenu/context/MenuContext.ts
- UI/SidekickMenu/hooks/useDrilldownKeyboardNavigation.ts
- UI/SidekickMenu/hooks/useFavourites.test.ts
- UI/SidekickMenu/hooks/useFavourites.ts
- UI/SidekickMenu/hooks/useFocusTrap.ts
- UI/SidekickMenu/hooks/useItemVisibility.test.ts
- UI/SidekickMenu/hooks/useItemVisibility.ts
- UI/SidekickMenu/hooks/useKeyboardNavigation.ts
- UI/SidekickMenu/hooks/useNumberedShortcuts.test.tsx
- UI/SidekickMenu/hooks/useNumberedShortcuts.ts
- UI/SidekickMenu/hooks/useSwipeGesture.test.ts
- UI/SidekickMenu/hooks/useSwipeGesture.ts
- UI/SidekickMenu/types.ts
- UI/SidekickMenu/utils/breadcrumb.test.ts
- UI/SidekickMenu/utils/breadcrumb.ts
- UI/SidekickMenu/utils/cache.test.ts
- UI/SidekickMenu/utils/cache.ts
- UI/SidekickMenu/utils/description.test.ts
- UI/SidekickMenu/utils/description.ts
- UI/SidekickMenu/utils/favouritesStorage.test.ts
- UI/SidekickMenu/utils/favouritesStorage.ts
- UI/SidekickMenu/utils/lastPosition.test.ts
- UI/SidekickMenu/utils/lastPosition.ts
- UI/SidekickMenu/utils/namespace.test.ts
- UI/SidekickMenu/utils/namespace.ts
- UI/SidekickMenu/utils/search.ts
- UI/SidekickMenu/utils/validation.test.ts
- UI/SidekickMenu/utils/validation.ts
- UI/context/ZestSidekickConfigContext.test.tsx
- UI/context/ZestSidekickConfigContext.ts
- UI/context/ZestSidekickConfigProvider.tsx
- UI/hooks/useThemeDetection.test.ts
- UI/hooks/useThemeDetection.ts
- UI/hooks/useZestConfig.test.tsx
- UI/hooks/useZestConfig.ts
- UI/index.ts
- conductor/code_styleguides/html-css.md
- conductor/code_styleguides/javascript.md
- conductor/code_styleguides/typescript.md
- conductor/index.md
- conductor/product-guidelines.md
- conductor/product.md
- conductor/tech-stack.md
- conductor/tracks.md
- conductor/tracks/infinite_nesting_20260426/index.md
- conductor/tracks/infinite_nesting_20260426/metadata.json
- conductor/tracks/infinite_nesting_20260426/plan.md
- conductor/tracks/infinite_nesting_20260426/spec.md
- conductor/workflow.md
- declarations.d.ts
- docs/api.md
- docs/best-practices.md
- docs/breaking-changes.md
- docs/configuration.md
- docs/development.md
- docs/examples.md
- docs/features.md
- jest.config.js
- jest.setup.ts
- package-lock.json
- package.json
- rollup.config.js
- tsconfig.json
- utils/reactNodeUtils.d.ts
- utils/reactNodeUtils.tsx

package.json:
{
  "name": "jattac.libs.web.zest-sidekick-menu",
  "version": "1.7.0",
  "description": "A flexible and reusable side menu component for React.",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "test": "jest",
    "test:watch": "jest --watch",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/jest": "^30.0.0",
    "@types/node": "^24.5.2",
    "@types/react": ">=16.8.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^30.3.0",
    "jest-environment-jsdom": "^30.3.0",
    "jsdom": "^27.0.1",
    "rollup": "^4.9.6",
    "rollup-plugin-dts": "^6.1.0",
    "rollup-plugin-peer-deps-external": "^2.2.4",
    "rollup-plugin-postcss": "^4.0.2",
    "rollup-plugin-typescript2": "^0.36.0",
    "ts-jest": "^29.4.9",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "files": [
    "dist"
  ],
  "keywords": [
    "react",
    "menu",
    "sidebar",
    "sidetray",
    "component",
    "ui"
  ]
}



Write checks of these kinds only:
- "pattern": looks line by line in every file matching the "files" patterns (paths relative to the app folder, forward slashes, ** and * allowed) and FAILS if the regular expression in "forbid" matches a line. Use this to forbid what the rule forbids (for example a native element or an import the rule says not to use).
- "command": runs a shell command in "workingDir" (relative to the app folder) and FAILS if it exits with a non-zero code. Use it only when no pattern can decide the rule (for example a dependency that must be present). The owner is shown the command before anything is saved.

Also give two short snippets: "good" (code that follows the rule) and "bad" (code that breaks it). Every pattern check is tested against them: the pattern checks together must match the bad example, and none may match the good example. If the rule has parts no check can decide, say what in "cannotTest" (a reviewer will judge those). If NO check can decide the rule at all, answer with an empty "checks" list and explain in "cannotTest".

Be precise: a check must not fire on code that follows the rule. Prefer few, reliable checks (at most 6). Never write a check that matches every line.

Write ONLY a JSON file at D:\work\nyingi\code\systems\Sidekick\.devteam\rules\USR-006\result.json with exactly this shape:
{ "checks": [ { "name": "short plain name", "kind": "pattern", "files": ["web/src/**/*.tsx"], "forbid": "<button[ >]" } ], "good": "snippet", "bad": "snippet", "cannotTest": "", "facts": [] }
"facts" is optional: when the rule sets a limit on something measurable, write it as { "subject": "search term", "attribute": "length", "op": "at-least", "value": "3", "unit": "characters" } (ops: equals, not, one-of, at-least, at-most, between, must, must-not) so two rules that cannot both hold are found. Leave it empty when the rule sets no such limit. The examples must not break the other rules of the app.
Do not change any other file.