# How this library differs from the house standard

These are notes, not tasks. DevTeam never changes your project because of this list, and none of it blocks a run. Fix what you want, when you want; then run `devteam adopt refresh`.

## 1. package.json has no "exports" map

Without it, newer tools and bundlers guess which file to load (and may load the wrong one: the CommonJS file for an import, or no type information).

To fix: Add an "exports" map with "types", "import" and "require" entries pointing at the files in dist/, plus "./package.json".

## 2. package.json does not say whether importing the library has side effects

Bundlers keep the whole library in an app unless it is marked free of side effects, so applications get bigger than they need to be.

To fix: Add "sideEffects": false (or a list of the files that do have side effects, such as CSS).

## 3. Nothing checks the package before it is published (attw and publint)

A library can build and pass its tests and still be broken for the people who install it (wrong types, missing files, a bad exports map).

To fix: Install @arethetypeswrong/cli and publint as dev dependencies and add a script: "validate-package": "attw --pack . && publint"

## 4. The tests do not measure coverage

DevTeam's rule that coverage may not fall can only protect a library whose tests write a coverage report.

To fix: Make the test script write one, for example "test": "jest --coverage" (or vitest run --coverage).

## 5. The build does not add "use client" to the bundle

Next.js apps using the App Router fail to import components that use state or effects unless the bundle starts with "use client".

To fix: Add banner: '"use client";' to the rollup output options.

## 6. Test files are inside the folder the build compiles

tsconfig.json includes folders that hold tests (UI/SidekickMenu/SidekickMenu.test.tsx, UI/SidekickMenu/components/DrilldownMenuItem.test.tsx) and does not exclude them, so a build can fail on test-only types, or the tests can leak into the type definitions.

To fix: Add "**/*.test.*" and "**/__tests__/**" to "exclude" in tsconfig.json (or move the tests out of the folder the build compiles).

