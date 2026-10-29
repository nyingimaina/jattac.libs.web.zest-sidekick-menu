# Verification report

Run `20261029-205228` · pack `react-component-library` · 50.3s · no agent worked and nothing was changed

## Ready to ship?

**Not ready: something is still broken.**

| Status | What was checked | Evidence |
| --- | --- | --- |
| Not proven | The packed library installs and imports | The installed-library check could not run here (it is not set up in this project yet, or there is no internet connection to install into a scratch project), so the library has not been proven to work for the people who install it. |
| Blocked | Automated tests and checks pass | These failed: lib-tests; rule-USR-001-2 (6 matches, first at UI/SidekickMenu/components/DrilldownMenuItem.tsx:64); rule-USR-001-5 (3 matches, first at UI/SidekickMenu/components/TabSwitcher.tsx:27); rule-USR-001-6. |
| Ready | The tests run the code (Library) | 87% of lines run by the tests; up 0 points since the last build. |
| Ready | Nothing was skipped | Every check that applies was run. |

_DevTeam 0.56.254_

## Checks

| Check | What happened | Time |
| --- | --- | --- |
| No secrets in code | Passed | 0.1s |
| No debugging leftovers | Passed | 0.1s |
| Type check (library and tests) | Passed | 0s |
| Tests, with coverage | FAILED | 39.4s |
| Build (CommonJS, ES modules, type definitions) | Passed | 0s |
| Package check (attw and publint) | Not run | 0.2s |
| What would be published | Passed | 0s |
| Publish dry run (everything npm checks, nothing is uploaded) | Passed | 0s |
| Size budget | Not run | 0.2s |
| Install and import the packed library | Not run | 0.2s |
| Documentation is complete | Not run | 0.2s |
| No third-party component libraries | Passed | 0.1s |
| No native buttons | FAILED | 0.1s |
| No native inputs | Passed | 0.1s |
| No native tables | Passed | 0.1s |
| No hand-rolled tab widgets | FAILED | 0.1s |
| Required Zest packages are declared | FAILED | 0.5s |
| Mobile-first media queries only | Passed | 0.1s |
| Font sizes scale with user settings | Passed | 0.3s |
| Touch targets at least 44px | Passed | 0.1s |
| No fixed numeric inline dimensions | Passed | 0.1s |
| Tablet breakpoint exists | Passed | 0s |
| No unsafe HTML injection | Passed | 0.2s |
| No dynamic code execution | Passed | 0.3s |
| No blocking busy-wait loops | Passed | 0.2s |
| No JSON stringify deep-clone | Passed | 0.2s |
| Event listeners are cleaned up | Passed | 0s |
| Colours come from theme tokens | Passed | 0.2s |
| No inline font families | Passed | 0.4s |
| No positive tabIndex | Passed | 0.3s |
| Animation honours reduced-motion | Passed | 0s |

### Tests, with coverage: failed

```
Failed twice in a row, so this is not a one-off.
…
     [90m 124 |[39m           [32m"count). Migrate to the default \"drilldown\" navigation style when convenient."[39m[0m

      at warn (UI/SidekickMenu/SidekickMenu.tsx:121:15)
      at Object.react_stack_bottom_frame (node_modules/react-dom/cjs/react-dom-client.development.js:23953:20)
      at runWithFiberInDEV (node_modules/react-dom/cjs/react-dom-client.development.js:1522:13)
      at commitHookEffectListMount (node_modules/react-dom/cjs/react-dom-client.development.js:11905:29)
      at commitHookPassiveMountEffects (node_modules/react-dom/cjs/react-dom-client.development.js:12028:11)
      at commitPassiveMountOnFiber (node_modules/react-dom/cjs/react-dom-client.development.js:13841:13)
      at recursivelyTraversePassiveMountEffects (node_modules/react-dom/cjs/react-dom-client.development.js:13815:11)
      at commitPassiveMountOnFiber (node_modules/react-dom/cjs/react-dom-client.development.js:13853:11)
      at flushPassiveEffects (node_modules/react-dom/cjs/react-dom-client.development.js:15737:9)
      at node_modules/react-dom/cjs/react-dom-client.development.js:15379:15
      at flushActQueue (node_modules/react/cjs/react.development.js:566:34)
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:860:10)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:189:26)
      at render (node_modules/@testing-library/react/dist/pure.js:291:10)
      at Object.<anonymous> (UI/SidekickMenu/SidekickMenu.test.tsx:324:11)


Summary of all failing tests
FAIL Styles/SidekickMenu.theme.test.ts (8.358 s)
  ● SidekickMenu.module.css — mobile-first touch targets, desktop-refined › tightens the breadcrumb/tab/pin controls back down for desktop pointer precision

    expect(received).toBeDefined()

    Received: undefined

    [0m [90m 178 |[39m       (b) [33m=>[39m b[33m.[39mincludes([32m'.breadcrumbCrumb'[39m) [33m||[39m b[33m.[39mincludes([32m'.tabButton'[39m) [33m||[39m b[33m.[39mincludes([32m'.pinToggle'[39m)
     [90m 179 |[39m     )[33m;[39m
    [31m[1m>[22m[39m[90m 180 |[39m     expect(covering)[33m.[39mtoBeDefined()[33m;[39m
     [90m     |[39m                      [31m[1m^[22m[39m
     [90m 181 |[39m     expect(covering)[33m.[39mtoMatch([35m/min-height:\s*0/[39m)[33m;[39m
     [90m 182 |[39m    …(truncated)
```

### Package check (attw and publint): not run

```
Not set up in this project: attw and publint are not installed, so nothing checks that the package works for everyone who installs it.
```

### Size budget: not run

```
Not set up in this project: The project has no .size-limit.json, so this check has nothing to run.
```

### Install and import the packed library: not run

```
Not set up in this project: Nothing installs the packed library into a scratch project and imports it  no scripts/consumer-smoke.mjs .
```

### Documentation is complete: not run

```
Not set up in this project: The project has no scripts/check-docs.mjs, so this check has nothing to run.
```

### No native buttons: failed

```
6 match(es):
UI/SidekickMenu/components/DrilldownMenuItem.tsx:64: <button
UI/SidekickMenu/components/MenuBreadcrumb.tsx:22: <button type="button" className={styles.breadcrumbBack} onClick={onBack} aria-label="Back">
UI/SidekickMenu/components/MenuBreadcrumb.tsx:25: <button
UI/SidekickMenu/components/MenuBreadcrumb.tsx:46: <button type="button" className={styles.breadcrumbCrumb} onClick={() => onNavigate(index)}>
UI/SidekickMenu/components/TabSwitcher.tsx:33: <button
UI/SidekickMenu/components/TabSwitcher.tsx:43: <button
```

### No hand-rolled tab widgets: failed

```
3 match(es):
UI/SidekickMenu/components/TabSwitcher.tsx:27: role="tablist"
UI/SidekickMenu/components/TabSwitcher.tsx:35: role="tab"
UI/SidekickMenu/components/TabSwitcher.tsx:45: role="tab"
```

### Required Zest packages are declared: failed

```
Failed twice in a row, so this is not a one-off.
Missing required packages: jattac.libs.web.zest-responsive-layout, jattac.libs.web.zest-file-upload, jattac.libs.web.zest-tabs, jattac.libs.web.responsive-table, jattac.libs.web.zest-textbox, jattac.libs.web.zest-button, jattac.libs.web.overflow-menu, jattac-web-poller
```

## Browser journeys

**Not run:** you chose not to run them for this run. A real browser was not used on this build.

## Checks not run again

These checks passed earlier on files that are exactly the same now (compared by content), so they were not run again. The start-up proof and the pattern checks always run.

| Check | Passed in run | When |
| --- | --- | --- |
| Type check (library and tests) | 20261029-204815 | 3 min ago |
| Build (CommonJS, ES modules, type definitions) | 20261029-204815 | 3 min ago |
| What would be published | 20261029-204815 | 3 min ago |
| Publish dry run (everything npm checks, nothing is uploaded) | 20261029-204815 | 3 min ago |
| Tablet breakpoint exists | 20261029-204815 | 3 min ago |
| Event listeners are cleaned up | 20261029-204815 | 3 min ago |
| Animation honours reduced-motion | 20261029-204815 | 3 min ago |

To run every check regardless: `devteam merge --full-verify`.

