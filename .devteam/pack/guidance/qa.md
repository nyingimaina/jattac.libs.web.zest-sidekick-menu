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
