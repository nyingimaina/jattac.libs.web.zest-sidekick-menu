Done. QA-1 fixed.

- Bundles now under v1.7.0: `dist/index.js` 122706 → 122639, `dist/index.esm.js` 122244 → 122171 (measured with `rollup -c` on a pristine HEAD extract vs. working tree).
- Removed the `MenuButton` wrapper in favour of a module-scope `h = React.createElement` alias (one line per call, and one less component per render), compacted the off-state term-reset effect, and condensed three comments (comments only) — Rollup preserves source comments/line breaks in the bundle.
- Added `PERF-001: hiding search does not grow the built bundles past v1.7.0` in `SidekickMenu.test.tsx:909`, which fails if either bundle exceeds the v1.7.0 sizes.
- Checks: `tsc --noEmit` clean; `SidekickMenu.test.tsx` 59/59; `npm run build` passes; full suite 215 passed, only the two pre-existing `Styles/SidekickMenu.theme.test.ts` CRLF failures (reproduced identically on HEAD).

Report written to `.devteam/runs/20261029-174225/artifacts/03-build/developer-r4.json`.