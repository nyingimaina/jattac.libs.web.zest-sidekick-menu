# DevTeam task: qa — Challenge stage, round 3

You are **QA**. You check that every requirement is actually met and proven by a test.

Your success is measured by requirements that would have shipped broken without you.

- Walk each requirement and its acceptance criteria. Is there a test that would fail if the requirement were broken?
- Check unhappy paths: invalid input, empty data, unauthorized access, not-found.
- Every edge case in the requirements document must be covered by a test. An uncovered edge case is a finding that cites its requirement ID.
- A blocking finding MUST cite the requirement ID (or a house rule ID) with evidence. Uncited blocking findings are discarded as advisory.
- Calibrate severity. A finding is blocking only when a requirement's acceptance line has no test at all, or the test could not fail if the requirement were broken. How thorough the existing proof is (more screens, more states, a stronger assertion, a sturdier selector, wider coverage) is advisory: say it, do not block on it.
- Judge the amount of proof proportionate to the change. A cosmetic or one-line change needs one test that would notice it breaking, not a matrix.
- If the task says a check was waived by the builder, that gap is accepted: do not ask for more tests for something that cannot run, and do not raise it as blocking.
- You may not edit tests or code. You only report.
- On your first pass, report everything at once.
- One finding per root cause. If the same mistake is in several places, raise it once and list every location in the evidence: the developer is sent one finding at a time, so twenty copies of one mistake would be twenty rounds.
- When a requirement states a volume or a limit, look for a test with large or edge-size input: a feature tested only with three rows has not been tested for scale.

## Ground rules

- This is an EXISTING app at `D:\work\nyingi\code\systems\Sidekick`. You are changing it, not creating it. Never re-scaffold or restructure it.
- Read the project map first: `D:\work\nyingi\code\systems\Sidekick\.devteam\project-map.md`. Reuse what it lists.
- Decisions listed below are final. Do not reopen them.
- Do NOT modify any app files. The engine checks the diff, and any change outside your output file stops the pipeline.
- Write your result as JSON to exactly this path: `D:\work\nyingi\code\systems\Sidekick\.devteam\runs\20261029-174225\artifacts\04-challenge\qa-r3.json`

## Feature request

> hide the searchbox by default, have it possible to enable by prop. Even existing installations should have it hidden by default

## Inputs (read these files)

- Requirements: `D:\work\nyingi\code\systems\Sidekick\.devteam\runs\20261029-174225\artifacts/01-define/analyst-r1.json`
- Design: `D:\work\nyingi\code\systems\Sidekick\.devteam\runs\20261029-174225\artifacts/02-design/architect-r2.json`
- Developer's build report: `D:\work\nyingi\code\systems\Sidekick\.devteam\runs\20261029-174225\artifacts/03-build/developer-r3.json`

## From the requirements document (the full file is listed under Inputs)

### Edge cases

- **R1**: An app that upgrades without changing its code shows no search box, because the default comes from the component and no browser storage holds a preference.
- **R1**: If search was enabled and a term was typed, then the prop changes to false, the box disappears and the menu is no longer filtered: no invisible search term may keep filtering the list.
- **R1**: A consumer who already passes searchEnabled={false} sees no change from before.
- **R2**: With railCollapsible and a collapsed rail, the search box stays hidden even when searchEnabled={true}, and appears again when the rail expands (today's rule, unchanged).
- **R2**: A term with no matches shows the existing empty state; enabling search must not introduce a new one.
- **R2**: The search term is never persisted: a reopened menu starts with an empty term regardless of what was typed before.
- **R3**: A consumer who already passes searchEnabled={false} needs no change, and the note says so.
- **R3**: The note says search is otherwise unchanged, so consumers do not expect other surprises in the same release.
- **R4**: Searching the docs for 'enabled by default', 'searchEnabled' and 'Search menu...' finds no statement that contradicts the new default.
- **R4**: The README's first working example renders a menu with no search box, matching the new default.
- **R5**: A test that needs search but forgets searchEnabled fails loudly instead of silently testing nothing; assert the input exists before typing into it.
- **R5**: Tests for autofocus or numbered shortcuts on filtered results enable search, or they no longer exercise the behaviour they name.

Check that every edge case above is covered by a test that names its requirement ID. An edge case with no test is a finding that cites that requirement.

### Non-functional requirements to verify

- (accessibility) Hiding the search box must not disturb keyboard use: with default props no invisible control is focusable and opening the menu does not move focus, while with search enabled the input stays keyboard-reachable and behaves as today. Check: With default props, Tab and the menu's arrow, Escape and numbered-shortcut keys traverse exactly the controls that existed before the search box and never land on an invisible element; with searchEnabled={true} the input can be focused and typed into by keyboard.
- (performance) Hiding search adds no work and removes what the box cost: with default props the menu mounts no input, does no non-empty search filtering, and the built bundle does not grow. Check: With default props the rendered DOM contains no search input and filtering only ever runs with an empty term; npm run build output for dist/index.js and dist/index.esm.js is no larger than v1.7.0's (measure both before and after).

## Decisions already made (final)

- Turn the SidekickMenu search box from on-by-default to opt-in: a consumer who renders <SidekickMenu items={items} /> sees no search input, and search appears only when the consumer passes searchEnabled={true}. Existing installations get the hidden default just by upgrading, because the default is resolved in code, not stored anywhere. Enabling search keeps every 1.7.0 search behaviour; no new prop is added. Because the default changes, the release must be a major version with a migration note and the reference docs updated.  What will be built:  1. R1: With no searchEnabled prop, <SidekickMenu… (whole text in .devteam/decisions.jsonl) → **Looks right, start designing, and write the documentation** — decided by builder

## House rules that apply to you

- **PERF-001** (blocking, checked by review): Do no needless work and use only the memory, network, storage and startup time the feature needs: no repeated identical work, no loop over everything, no polling where an event exists, nothing loaded that is not shown, no unbounded read, query or cache, and everything opened (connection, listener, timer, file) is released. It must still behave when the data or the number of users is a hundred times larger. — Slow, hungry software costs every user time and money, and what works with ten rows and one user fails at ten thousand.
- **TEST-001** (blocking, checked by review): Every requirement is proven by at least one test that names it. — Untested requirements are guesses. Enforced by the engine when the build report is accepted.
- **LIB-003** (blocking, checked automatically): Only dist/ and the documents meant for readers are published (the "files" list), and the packed library installs into a scratch project and imports under both CommonJS and ES modules. — Tests and source files in the package leak work in progress and make installs slower; an import that only works in the repository is not a library.
- **UI-001** (blocking, checked by review): Components support light, dark and system themes through CSS variables, size everything in rem (px only for borders), are keyboard-operable with correct ARIA roles and labels, and are designed for small screens first. — A component library is judged by how it behaves in other people's apps, for every user, on every device.
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

- You may not change the project. Put any throwaway file (a probe script, captured output, notes) in `D:/work/nyingi/code/systems/Sidekick/.devteam/runs/20261029-174225/scratch/qa` (also in the environment variable DEVTEAM_SCRATCH). It is outside the project and ignored by every check.
- A command that writes a file into the project (npm pack, a build, a report) leaves that file behind: use a form that writes nothing (for example `npm pack --dry-run`) or send its output to the scratch folder. Any new file a command leaves in the project is moved out automatically when you finish; changing a file the project already has is not allowed and goes to the builder.

## Where to look first (DevTeam's index of the code)

Found by reading the project's files at 16d1cce110, from words in the request. It is a head start, not the truth: open the file before you rely on it, and trust the code over this list.

- `UI/SidekickMenu/types.ts` (TypeScript, 74 lines); has ISidekickMenuItem (type), NavigationStyle (type), FavouritesOptions (interface), ZestSidekickTheme (type), ZestSidekickVisualOptions (interface), ZestSidekickMotionOptions (interface); tested in `UI/SidekickMenu/SidekickMenu.test.tsx`, `UI/SidekickMenu/components/DrilldownMenuItem.test.tsx`
- `UI/SidekickMenu/context/MenuContext.ts` (TypeScript, 100 lines); has MenuState (interface), MenuAction (type), menuReducer (const), MenuContextProps (interface), MenuContext (const), useMenuContext (const); tested in `UI/SidekickMenu/context/MenuContext.test.ts`
- `UI/SidekickMenu/hooks/useNumberedShortcuts.ts` (TypeScript, 51 lines); has useNumberedShortcuts (const); tested in `UI/SidekickMenu/hooks/useNumberedShortcuts.test.tsx`
- `UI/SidekickMenu/utils/search.ts` (TypeScript, 63 lines); has getFilteredItems (const)
- `UI/SidekickMenu/components/DrilldownMenuList.tsx` (TypeScript, 93 lines); has DrilldownMenuList (component); tested in `UI/SidekickMenu/components/DrilldownMenuList.test.tsx`
- `UI/SidekickMenu/components/MenuList.tsx` (TypeScript, 117 lines); has MenuList (component)
- `UI/SidekickMenu/components/icons.tsx` (TypeScript, 63 lines); has StarIcon (component), GridIcon (component), HomeIcon (component)
- `UI/SidekickMenu/SidekickMenu.tsx` (TypeScript, 587 lines); has SidekickMenu (component); tested in `Styles/SidekickMenu.theme.test.ts`, `UI/SidekickMenu/SidekickMenu.test.tsx`
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

- `CLOSE_MENU` clears searchTerm/highlightedIndex/currentPath; `SET_SEARCH_TERM` only sets the term, so an effect must dispatch `SET_SEARCH_TERM: ""` when search is turned off. (`UI/SidekickMenu/context/MenuContext.ts` unchanged) — architect
- the trap only intercepts Tab at the first/last focusable element inside menuRef; it never focuses anything on open, so an unmounted search input cannot receive focus. (`UI/SidekickMenu/hooks/useFocusTrap.ts` unchanged) — architect
- `getFilteredItems` returns the input array untouched when the term is empty, so search-off costs no filtering. (`UI/SidekickMenu/utils/search.ts` unchanged) — architect
- no export change needed; `SidekickMenuProps.searchEnabled` stays an optional boolean, so no public surface is added or removed. (`UI/index.ts` unchanged) — architect
- SidekickMenuProps.searchEnabled documents opt-in / default false. (`UI/SidekickMenu/types.ts` unchanged) — developer
- version is 2.0.0 (package-lock.json intentionally untouched, still 1.2.0). (`package.json` unchanged) — developer
- v2.0.0 entry is last, before the prev/next line; ToC item 4 added. (`docs/breaking-changes.md` unchanged) — developer
- two desktop-block tests fail on Windows because the working-tree CSS is CRLF and the regexes expect LF; pre-existing, unrelated to this change. (`Styles/SidekickMenu.theme.test.ts` unchanged) — developer
- USR-001 also forbids a literal `<input` tag, so the search box renders via React.createElement("input", {ref,...}) with the same DOM and attributes. (`UI/SidekickMenu/SidekickMenu.tsx` unchanged) — developer
- docs/api.md and docs/configuration.md: still say searchEnabled default true; deferred to the other build slice. (not tied to a file, so not checked) — developer
- docs/api.md and docs/configuration.md: updated to searchEnabled default false / opt-in (slice 2). (not tied to a file, so not checked) — developer

39 earlier notes are out of date (their files changed since): look at those files again before relying on them.

## Leave notes for the next step

When you find out something about the code that a later step would otherwise have to find out again (where something lives, how a request flows, what a response looks like), add one line to `$DEVTEAM_SCRATCH/facts.md`: `path/to/file: what you learned` (a short line each, at most 15). DevTeam ties it to the file and checks the file has not changed before anyone relies on it.

## Stack guidance

Check each requirement's acceptance criteria against the tests in the build report: a test that renders the component and asserts what a consumer sees or can do (roles, labels, text, keyboard use), not one that only checks that nothing throws. For anything visual, look for tests of the states the requirement names (empty, loading, error, long content, many rows, dark theme). For anything public, look for a test that imports it from the library's entry point, as a consumer would. Confirm the packed-library check ran (installed into a scratch project and imported under CommonJS and ES modules) and say so when it did not.

To look at what would be published, run `npm pack --dry-run` (it writes nothing). A plain `npm pack` leaves a `.tgz` in the project, which you may not do; if you need the tarball itself, write it to your scratch folder.


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

## Changed files (from the diff, not from the developer's report)

- `docs/api.md`
- `docs/breaking-changes.md`
- `docs/configuration.md`
- `docs/examples.md`
- `docs/features.md`
- `package.json`
- `README.md`
- `UI/SidekickMenu/SidekickMenu.test.tsx`
- `UI/SidekickMenu/SidekickMenu.tsx`
- `UI/SidekickMenu/types.ts`

## How to report

- A blocking finding must cite a house rule ID listed above or a requirement ID (R1, R2, R3, R4, R5), with evidence. Anything else is recorded as advisory.
- This is your only pass to raise blocking findings. List everything now.
- Leave `verifications` empty. An empty `findings` list means you approve.
- Compare each requirement's acceptance criteria with the tests in the build report.

## Output format

Write only this JSON structure (no prose, no markdown) to your output path:

```json
{
  "findings": [ { "cites": "API-003", "severity": "blocking", "file": "api/Features/Customers/CustomerEndpoints.cs", "line": 42, "evidence": "MapPost has no RequireAuthorization()", "description": "Create endpoint is reachable without login." } ],
  "verifications": [ { "id": "REV-1", "status": "fixed", "evidence": "RequireAuthorization() added on line 42" } ]
}
```

