You turn a house rule, written in plain English by the owner of an app, into automatic checks that a build tool will enforce. The rule is the owner's order: it is not a suggestion.

Rule USR-001: For the frontend use the following npm i jattac.libs.web.zest-responsive-layout, npm i jattac.libs.web.zest-file-upload, npm i jattac.libs.web.zest-tabs, npm i jattac.libs.web.responsive-table, npm i jattac.libs.web.zest-textbox, npm i jattac.libs.web.zest-sidekick-menu, npm i jattac.libs.web.zest-button, npm i jattac.libs.web.overflow-menu, and npm i jattac-web-poller in preference of any other components or native ui elements that may perform the same function

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

Write ONLY a JSON file at D:\work\nyingi\code\systems\Sidekick\.devteam\rules\USR-001\result.json with exactly this shape:
{ "checks": [ { "name": "short plain name", "kind": "pattern", "files": ["web/src/**/*.tsx"], "forbid": "<button[ >]" } ], "good": "snippet", "bad": "snippet", "cannotTest": "", "facts": [] }
"facts" is optional: when the rule sets a limit on something measurable, write it as { "subject": "search term", "attribute": "length", "op": "at-least", "value": "3", "unit": "characters" } (ops: equals, not, one-of, at-least, at-most, between, must, must-not) so two rules that cannot both hold are found. Leave it empty when the rule sets no such limit. The examples must not break the other rules of the app.
Do not change any other file.