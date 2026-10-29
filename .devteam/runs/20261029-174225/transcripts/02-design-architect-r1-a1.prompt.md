# DevTeam task: architect — Design stage, round 1

You are the **Architect**. You decide how the requested change fits into the existing app.

Your success is measured by how little the app has to bend. Reuse beats new code; existing patterns beat new patterns.

- Read the project map first. List what the change touches, what it reuses, and what it adds.
- Declare `scope`: glob patterns of every file the developer may change. Anything outside scope will be blocked automatically, so be complete but tight.
- Every requirement ID must be covered by at least one component. Every component must name the requirements it serves.
- Follow the stack's layout conventions and the template's patterns. Do not introduce new frameworks, libraries or architectural styles.
- Design for scale: say how the change behaves when the data grows a hundred times (paging, indexes, caching, bounded work), following the stack guidance.
- Design for low resource use: say what the change costs in work, memory, network, storage and startup time, and choose the cheaper design when the result is the same.

## Ground rules

- This is an EXISTING app at `D:\work\nyingi\code\systems\Sidekick`. You are changing it, not creating it. Never re-scaffold or restructure it.
- Read the project map first: `D:\work\nyingi\code\systems\Sidekick\.devteam\project-map.md`. Reuse what it lists.
- Decisions listed below are final. Do not reopen them.
- Do NOT modify any app files. The engine checks the diff, and any change outside your output file stops the pipeline.
- Write your result as JSON to exactly this path: `D:\work\nyingi\code\systems\Sidekick\.devteam\runs\20261029-174225\artifacts\02-design\architect-r1.json`

## Feature request

> hide the searchbox by default, have it possible to enable by prop. Even existing installations should have it hidden by default

## Inputs (read these files)

- Requirements: `D:\work\nyingi\code\systems\Sidekick\.devteam\runs\20261029-174225\artifacts/01-define/analyst-r1.json`

## From the requirements document (the full file is listed under Inputs)

### Who uses it

- Library consumer (developer): installs jattac.libs.web.zest-sidekick-menu and chooses whether the search box appears by passing the existing searchEnabled prop.
- End user of a consumer app: sees no search box unless the developer turned it on; gets today's search when it is on.

### Out of scope

- A visible toggle, button or '/' shortcut that reveals search at runtime; only the prop turns it on.
- A global searchEnabled option on ZestSidekickConfigProvider.
- Changing search matching (searchTerms, label matching) or result ordering.
- Storing a per-user or per-app preference for search in localStorage or sessionStorage.
- Changing the search input's markup, accessible name or styling beyond hiding it by default.

### Assumptions made on the builder's behalf

- Search stays controlled only by the existing per-instance searchEnabled prop: no global config-provider switch, no runtime button and no keyboard shortcut to reveal it.
- When search is off, any active search term is dropped so the menu is never left filtered by a term the user can no longer see, and no empty-results state is shown while search is hidden.
- Enabling search keeps 1.7.0's look and behaviour exactly: default placeholder 'Search menu...', autofocus default true, custom icon, filtering, and numbered shortcuts over the filtered list.

### Non-functional requirements

- (accessibility) Hiding the search box must not disturb keyboard use: with default props no invisible control is focusable and opening the menu does not move focus, while with search enabled the input stays keyboard-reachable and behaves as today. Check: With default props, Tab and the menu's arrow, Escape and numbered-shortcut keys traverse exactly the controls that existed before the search box and never land on an invisible element; with searchEnabled={true} the input can be focused and typed into by keyboard.
- (performance) Hiding search adds no work and removes what the box cost: with default props the menu mounts no input, does no non-empty search filtering, and the built bundle does not grow. Check: With default props the rendered DOM contains no search input and filtering only ever runs with an empty term; npm run build output for dist/index.js and dist/index.esm.js is no larger than v1.7.0's (measure both before and after).

### Risks

- Existing consumers lose the search box on upgrade with no code change; that is the request, but it must be a major release with a clear note or it will look like a bug.
- Several docs pages currently claim search is enabled by default, so one missed page leaves the docs contradicting each other.
- Existing tests query the search input by placeholder without enabling search, so the suite will go red until they are updated deliberately.
- searchAutoFocus still defaults to true; when the input is absent the focus effect must do nothing rather than error or move focus elsewhere.
- The README feature list still advertises built-in search, which reads as on-by-default to a new consumer.

## Decisions already made (final)

- Turn the SidekickMenu search box from on-by-default to opt-in: a consumer who renders <SidekickMenu items={items} /> sees no search input, and search appears only when the consumer passes searchEnabled={true}. Existing installations get the hidden default just by upgrading, because the default is resolved in code, not stored anywhere. Enabling search keeps every 1.7.0 search behaviour; no new prop is added. Because the default changes, the release must be a major version with a migration note and the reference docs updated.  What will be built:  1. R1: With no searchEnabled prop, <SidekickMenu… (whole text in .devteam/decisions.jsonl) → **Looks right, start designing, and write the documentation** — decided by builder

## House rules that apply to you

- **PERF-001** (blocking, checked by review): Do no needless work and use only the memory, network, storage and startup time the feature needs: no repeated identical work, no loop over everything, no polling where an event exists, nothing loaded that is not shown, no unbounded read, query or cache, and everything opened (connection, listener, timer, file) is released. It must still behave when the data or the number of users is a hundred times larger. — Slow, hungry software costs every user time and money, and what works with ten rows and one user fails at ten thousand.
- **SCOPE-001** (blocking, checked by review): Only files inside the design's declared scope may change. — Unplanned changes are where regressions hide. Enforced by the engine on the diff.
- **LIB-001** (blocking, checked by review): What the library exports (UI/index.ts) changes only when the design says so. A removed or changed export, prop or type is a breaking change: it is listed in docs/breaking-changes.md and the version is bumped to match. — Everyone who installed the library depends on its public surface; an accidental change breaks their apps on the next update.
- **LIB-002** (blocking, checked automatically): package.json has an "exports" map with "types", "import" and "require" entries for the files in dist/, and the types resolve under both module systems (proven by attw and publint). — A library can build and pass its own tests and still be broken for the people who install it: the wrong file loads, or there are no types.
- **LIB-004** (blocking, checked automatically): react, react-dom and every other peer dependency are external to the bundle (including react/jsx-runtime), declared in peerDependencies with a range, and never in dependencies. — A second copy of React inside the library breaks hooks in the app that uses it; a bundled JSX runtime breaks apps on another React version.
- **LIB-005** (blocking, checked automatically): The built bundle starts with "use client" and the package is marked free of side effects ("sideEffects": false, or a list of the CSS files), so Next.js App Router apps can import it and bundlers can drop what is unused. — Without the banner, a component that uses state fails to import in a server component; without the flag, apps carry the whole library.
- **EFF-001** (blocking, checked automatically): The built library stays within its size budget (.size-limit.json). Raising the budget is a decision recorded with the change, never done to make a check pass. — Every kilobyte is paid by every app that installs the library, on every page load.
- **EFF-002** (blocking, checked by review): Build for data that grows a hundred times: no work in render that scales with the data (sorting, filtering, mapping huge arrays) without memoization; lists that can be long are paged or virtualized; effects and listeners clean up; no state that grows without bound. — Libraries are used on data the author never imagined. A component that is fine with ten rows and unusable with ten thousand is a bug in the library.
- **DEP-001** (blocking, checked by review): Adding, removing or upgrading a dependency, a peer dependency or a tool version is a decision with a reason recorded in the design. Prefer no new dependency; if one is needed, prefer a small one that can be a peer. — Dependencies are the library's weight and risk, and they are inherited by every app that installs it.
- **UI-001** (blocking, checked by review): Components support light, dark and system themes through CSS variables, size everything in rem (px only for borders), are keyboard-operable with correct ARIA roles and labels, and are designed for small screens first. — A component library is judged by how it behaves in other people's apps, for every user, on every device.
- **DOC-001** (blocking, checked automatically): Every feature, prop and breaking change is documented where readers look: README.md (a first working example), docs/examples.md (recipes), docs/features.md, docs/api.md, docs/configuration.md, docs/development.md and docs/breaking-changes.md, each linking to the previous and next page. — A library nobody can figure out does not get used; documentation that lags the code is wrong documentation.
- **USR-001** (blocking, checked by review): For the frontend use the following npm i jattac.libs.web.zest-responsive-layout, npm i jattac.libs.web.zest-file-upload, npm i jattac.libs.web.zest-tabs, npm i jattac.libs.web.responsive-table, npm i jattac.libs.web.zest-textbox, npm i jattac.libs.web.zest-sidekick-menu, npm i jattac.libs.web.zest-button, npm i jattac.libs.web.overflow-menu, and npm i jattac-web-poller in preference of any other components or native ui elements that may perform the same function — Your own rule for every app.
- **USR-002** (blocking, checked by review): For mobile and web apps when building screens and components or widgets, they must be mobile first but desktop aware and also should optimize for tablets as well. It is imperative that our ui while remaining DRY look custom-made for whatever screen it is rendering on, and take into account user interactions such as vsibility, font sizing and hit area — Your own rule for every app.
- **USR-003** (blocking, checked by review): we must never take shortcuts when it comes to performance, code quality, and security, such that we introduce technicl debt, code duplications, security vulnerabilities, slow inefficient code, or resource hogs and shitty bugs like memory leaks. Always assume deployment environments are lowest spec possible our app can run on, so we must always optimize for low resource usage and high performance — Your own rule for every app.
- **USR-004** (blocking, checked by review): when editing code that has already been merged into master, even in branches that have master as an ancestor, characterization tests must first be created to validate existing behaviour if what we are doing is meant to add onto existing behaviour so that we don't break code already deployed to production — Your own rule for every app.
- **USR-005** (blocking, checked by review): # UI/UX, Form Intelligence, and Design System Standards — Your own rule for every app.
- **USR-006** (blocking, checked by review): ## 1. User-Centred Interface Design

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

**Leitprinzip (guiding principle):** Make the right action easy, the complex understandable, and the entire experience cohesive—without treating users as anything less than capable adults. — Your own rule for every app.

## Scratch files

- You may not change the project. Put any throwaway file (a probe script, captured output, notes) in `D:/work/nyingi/code/systems/Sidekick/.devteam/runs/20261029-174225/scratch/architect` (also in the environment variable DEVTEAM_SCRATCH). It is outside the project and ignored by every check.
- A command that writes a file into the project (npm pack, a build, a report) leaves that file behind: use a form that writes nothing (for example `npm pack --dry-run`) or send its output to the scratch folder. Any new file a command leaves in the project is moved out automatically when you finish; changing a file the project already has is not allowed and goes to the builder.

## Where to look first (DevTeam's index of the code)

Found by reading the project's files at 16d1cce110, from words in the request. It is a head start, not the truth: open the file before you rely on it, and trust the code over this list.

- `UI/SidekickMenu/types.ts` (TypeScript, 72 lines); has ISidekickMenuItem (type), NavigationStyle (type), FavouritesOptions (interface), ZestSidekickTheme (type), ZestSidekickVisualOptions (interface), ZestSidekickMotionOptions (interface); tested in `UI/SidekickMenu/SidekickMenu.test.tsx`, `UI/SidekickMenu/components/DrilldownMenuItem.test.tsx`
- `UI/SidekickMenu/context/MenuContext.ts` (TypeScript, 100 lines); has MenuState (interface), MenuAction (type), menuReducer (const), MenuContextProps (interface), MenuContext (const), useMenuContext (const); tested in `UI/SidekickMenu/context/MenuContext.test.ts`
- `UI/SidekickMenu/hooks/useNumberedShortcuts.ts` (TypeScript, 51 lines); has useNumberedShortcuts (const); tested in `UI/SidekickMenu/hooks/useNumberedShortcuts.test.tsx`
- `UI/SidekickMenu/utils/search.ts` (TypeScript, 63 lines); has getFilteredItems (const)
- `UI/SidekickMenu/components/DrilldownMenuList.tsx` (TypeScript, 93 lines); has DrilldownMenuList (component); tested in `UI/SidekickMenu/components/DrilldownMenuList.test.tsx`
- `UI/SidekickMenu/components/MenuList.tsx` (TypeScript, 117 lines); has MenuList (component)
- `UI/SidekickMenu/components/icons.tsx` (TypeScript, 63 lines); has StarIcon (component), GridIcon (component), HomeIcon (component)
- `UI/SidekickMenu/SidekickMenu.tsx` (TypeScript, 576 lines); has SidekickMenu (component); tested in `Styles/SidekickMenu.theme.test.ts`, `UI/SidekickMenu/SidekickMenu.test.tsx`
- Next to these (they use or are used by them): `UI/SidekickMenu/SidekickMenu.test.tsx`, `UI/SidekickMenu/components/DrilldownMenuItem.test.tsx`, `UI/SidekickMenu/components/DrilldownMenuItem.tsx`, `UI/SidekickMenu/components/DrilldownMenuList.test.tsx`, `UI/SidekickMenu/components/FavouritesList.test.tsx`, `UI/SidekickMenu/components/FavouritesList.tsx`, `UI/SidekickMenu/components/MenuBreadcrumb.test.tsx`, `UI/SidekickMenu/components/MenuBreadcrumb.tsx`

## Libraries that may already do part of this

From the packages this project already uses (names only, read from their metadata). Check before writing something a library already offers.

- rollup-plugin-dts 6.2.3: default (export)
- rollup 4.52.3: ExistingDecodedSourceMap (interface)
- rollup 4.52.3: ExistingRawSourceMap (interface)
- rollup 4.52.3: LogHandlerWithDefault (type)
- rollup 4.52.3: WarningHandlerWithDefault (type)

## What earlier steps of this run learned

Written down by the steps before you. Each is tied to the file it is about, and DevTeam checked that file has not changed since. Use them to start where they stopped; if one looks wrong, trust the code and say so.

- searchEnabled defaults to true at line 48; the input is rendered at lines 505-519 only when searchEnabled && !effectiveRailCollapsed; the autofocus effect at lines 329-333 focuses searchInputRef when isOpen && searchAutoFocus. (`UI/SidekickMenu/SidekickMenu.tsx` unchanged) — analyst
- SidekickMenuProps declares searchEnabled?: boolean at line 49; no other search toggle exists. (`UI/SidekickMenu/types.ts` unchanged) — analyst
- four tests find the search input by the 'Search menu...' placeholder without passing searchEnabled (approx. lines 127, 268, 292, 615) and will need to opt in after the default flips. (`UI/SidekickMenu/SidekickMenu.test.tsx` unchanged) — analyst
- line 27 documents searchEnabled with default `true` and says `false` stops the input rendering. (`docs/api.md` unchanged) — analyst
- lines 31 and 104-108 show searchEnabled: true as the default and searchEnabled={false} as the opt-out example. (`docs/configuration.md` unchanged) — analyst
- line 116 says "The search feature is enabled by default"; the recipe at line 135 already passes searchEnabled={true}. (`docs/examples.md` unchanged) — analyst
- line 61 already shows searchEnabled={true} in the built-in search example. (`docs/features.md` unchanged) — analyst
- the basic example (lines 25-47) omits searchEnabled, and the feature bullet at line 8 advertises built-in search. (`README.md` unchanged) — analyst
- entries run oldest to newest (v1.0.5, v1.0.10, v1.4.0) above the closing prev/next links, so a v2.0.0 entry is appended last. (`docs/breaking-changes.md` unchanged) — analyst
- version is 1.7.0; scripts are build, test, test:watch, prepublishOnly. (`package.json` unchanged) — analyst

## Leave notes for the next step

When you find out something about the code that a later step would otherwise have to find out again (where something lives, how a request flows, what a response looks like), add one line to `$DEVTEAM_SCRATCH/facts.md`: `path/to/file: what you learned` (a short line each, at most 15). DevTeam ties it to the file and checks the file has not changed before anyone relies on it.

## Stack guidance

Stack: a React component library (TypeScript, Rollup, CSS Modules, Vitest). Layout: components in `UI/components/<Component>/` (the component, its `.module.css`, its types), shared helpers, hooks and styles in `UI/shared/`, tests in `tests/` (never inside the folders the build compiles), documentation in `docs/`, release scripts in `scripts/`.

- Name the public surface in the design: every export that is added, changed or removed from `UI/index.ts`, with its prop types. Anything not exported is private and may change freely.
- Say what each component costs: the dependencies it needs (prefer none; a new one must be a peer dependency or tiny, with the reason recorded), whether it keeps state, and how it behaves with a hundred times more data (paging, virtualization, memoization). Name the budget in `.size-limit.json` if the change could move it.
- Peer dependencies (`react`, `react-dom`, and any UI library the components wrap) are listed in `peerDependencies` with a range and are external in the Rollup config, including `react/jsx-runtime`. Never put them in `dependencies`.
- Styles are CSS Modules injected into the bundle (consumers import no CSS). Themes use CSS variables with light, dark and system values; sizes in `rem`; mobile first.
- The package output is dual: `dist/index.cjs` and `dist/index.mjs` with `index.d.ts` and `index.d.mts`, a `"use client"` banner, `"sideEffects": false`, and an `exports` map with `types` first. Do not change the build output layout without a decision.
- Scope must include the documentation pages the change touches and `docs/breaking-changes.md` for a breaking change. Changing `package.json` dependencies is allowed only when the design names the change and the reason.


## About this existing project

This is an existing project that was not created by DevTeam. Extend it; never recreate or restructure it. Follow the conventions already in its code, and reuse what is already there.

- Library (an npm package, TypeScript): in `.`. Its scripts: build, test, test:watch, prepublishOnly.
- Features live in: `UI`.
- Shared code lives in: `Styles`, `utils`.

Not set up in this project (so nothing proves these yet):
- Package check (attw and publint): attw and publint are not installed, so nothing checks that the package works for everyone who installs it.
- Install and import the packed library: Nothing installs the packed library into a scratch project and imports it (no scripts/consumer-smoke.mjs).
- Size budget: The project has no .size-limit.json, so this check has nothing to run.
- Documentation is complete: The project has no scripts/check-docs.mjs, so this check has nothing to run.
Where you touch code, add automated tests for it (write the test for the existing behaviour first, then change the code). Do not create the missing scaffolding unless the request asks for it.

Notes from a survey of the project:

# Sidekick – developer survey

## What it is
- npm library `jattac.libs.web.zest-sidekick-menu` (v1.7.0, see package.json): a React side-menu/sidebar component. Not an app; no server, no API, no database.
- Peer deps: react / react-dom >=16.8. Consumers import the default `SidekickMenu` and pass an `items` tree (`ISidekickMenuItem`: id, label, icon, searchTerms, and one of path | onClick | children).
- Public surface is only what `UI/index.ts` exports: `SidekickMenu` (default), `clearSidekickMenuCache`, `clearSidekickMenuUsageStats`, `ZestSidekickConfigProvider`, `useZestSidekickConfig`, plus types.
- Features (props in `UI/SidekickMenu/types.ts`): search, drilldown or accordion navigation, favourites tab (usage-based), swipe gestures, numbered shortcuts, rail collapse, light/dark/system theme, async item visibility with caching, "remember last position".

## Layout
- `UI/SidekickMenu/SidekickMenu.tsx` (~575 lines): orchestrator; composes hooks and components.
- `UI/SidekickMenu/components/` presentational pieces (MenuList, DrilldownMenuList, MenuBreadcrumb, TabSwitcher, FavouritesList, ...). `context/MenuContext.ts` holds a reducer + context.
- `UI/SidekickMenu/hooks/` stateful logic (useFavourites, useItemVisibility, useFocusTrap, keyboard nav, swipe, numbered shortcuts). `utils/` holds pure helpers (search, breadcrumb, cache, namespace, favouritesStorage, lastPosition, validation, description).
- `UI/context/` + `UI/hooks/useZestConfig.ts`: global config provider (theme/visual/motion) merged with the per-instance `zest` prop. `useThemeDetection.ts` resolves "system" theme.
- `Styles/SidekickMenu.module.css`: all styling (CSS Modules, injected into the JS bundle). `utils/reactNodeUtils.tsx`: extracts text from ReactNodes for search.
- `docs/` (api, configuration, features, breaking-changes, ...) and README are consumer-facing docs.
- `dist/` is build output, git-ignored.

## Build / test / run
- Install: `npm install`. Build: `npm run build` (rollup -c -> `dist/index.js` cjs, `dist/index.esm.js`, `dist/index.d.ts`). `prepublishOnly` runs the build.
- Test: `npm test` (jest 30, ts-jest, jsdom, React Testing Library; CSS mapped to identity-obj-proxy; setup in `jest.setup.ts`). Watch: `npm run test:watch`.
- Tests sit next to the source as `*.test.ts(x)`. Note `docs/development.md` claims there are no tests; that is stale.
- No dev server, demo app, linter or formatter config: not found. No CI config: not found.
- Release steps are in `.llm-directives/release_git_steps.md`: work on `develop`, merge to `master`, tag `vX.Y.Z` from package.json version, push with tags. Recent history is on `master` and each feature commit bumps the version in the message, e.g. "(v1.7.0)". Whether the bump is also in package.json each time: check before releasing.
- Publishing to npm: only `prepublishOnly` is defined; the actual publish command/registry is not found.

## Conventions
- TypeScript, functional components and hooks, default export per component, named exports for hooks/utils. Component files are PascalCase, hooks `useXxx.ts`, utils camelCase.
- New feature pattern: add an optional prop in `types.ts`, then logic in a hook or util with a sibling test, wire it in `SidekickMenu.tsx`, export any new public type from `UI/index.ts`, and document it in `docs/`.
- `conductor/` (product, tech-stack, workflow, style guides, tracks/plan) describes a TDD workflow: failing test first, >80% coverage, commits as `feat(ui): ...`, git notes. `.llm-directives/project_memos.md`: delete temp files (e.g. commit_message.txt) after use.
- Errors: no error-handling framework. Storage access is wrapped in try/catch with `console.error` (see `cache.ts`); dev-only warnings use `console.warn` guarded by `process.env.NODE_ENV !== "production"` (namespace, id validation).
- Data access: browser storage only. All keys go through `getStorageKey(kind, storageNamespace)` in `utils/namespace.ts`. Kinds: visibilityCache, usageStats, railState, activeTab, lastPosition.

## Fragile / surprising
- Storage key scheme: without `storageNamespace` the legacy keys (`sidekickMenuVisibilityCache`, ...) are used; with one, `sidekickMenu:<ns>:<kind>`. Changing these strings orphans users' saved favourites. Two instances without distinct namespaces share (and corrupt) data; a dev-only warning covers this.
- `CACHE_KEY` in `cache.ts` is computed once at import with no namespace, so it only reflects the default key.
- Storage is localStorage, except lastPosition which uses sessionStorage (per tab). All code must stay SSR-safe (`typeof window` guards exist); keep that.
- tsconfig targets ES5 with libs up to es2017: avoid newer built-ins/syntax that need polyfills. `jsx: "react"` means `import React` is required in every TSX file.
- `ISidekickMenuItem` is a union: an item has exactly one of path / onClick / children (the other two are `never`).
- Item ids must be unique (validated in dev); favourites, breadcrumbs and last position are keyed by id, so renaming ids loses saved data.
- `SidekickMenu.tsx` is large and coordinates many hooks; edits there can break drilldown, accordion and favourites at once. Run the full suite after changes.
- `docs/development.md` is outdated (says no tests, old repo name); don't trust it over the code.
- `.devteam/` is untracked tooling output, not part of the project.

## Requirements to design for

- **R1**: With no searchEnabled prop, <SidekickMenu items={items} /> renders no search input; the search box exists only when the consumer passes searchEnabled={true}.
- **R2**: Passing searchEnabled={true} gives the consumer the full 1.7.0 search experience: the box shows, typing filters, clearing restores the previous section, searchPlaceholder, searchIcon and searchAutoFocus still apply, and arrow keys and numbered shortcuts act on the filtered list.
- **R3**: The changed default ships as a major version 2.0.0 with an entry in docs/breaking-changes.md that names searchEnabled, states the new default and shows searchEnabled={true} as the migration.
- **R4**: Every doc page that presents search as on by default is updated to present it as opt-in: README.md, docs/features.md, docs/examples.md, docs/api.md and docs/configuration.md.
- **R5**: Tests prove the new default and keep proving the old search behaviour: a test asserts no input is rendered when the prop is omitted, and every existing search test opts in with searchEnabled={true} instead of relying on the old default.

## Output format

Write only this JSON structure (no prose, no markdown) to your output path:

```json
{
  "summary": "How the change fits into the existing app.",
  "impact": { "touches": ["existing files or features changed"], "reuses": ["existing shared code reused"], "adds": ["new things created"] },
  "scope": ["api/Features/Customers/**", "web/app/customers/**"],
  "components": [ { "name": "CustomerEndpoints", "path": "api/Features/Customers/CustomerEndpoints.cs", "requirements": ["R1"] } ]
}
```

