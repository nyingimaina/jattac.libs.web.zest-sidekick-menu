Wrote `reviewer-r3.json` with 3 findings (1 blocking, 2 advisory) and left `facts.md` in the scratch folder.

Key evidence:
- **PERF-001 (blocking)** — rebuilt both revisions in scratch copies with the project's rollup config: v1.7.0 `dist/index.js` 122706 / `index.esm.js` 122244 vs working tree 123360 / 122892 (+654/+648). The new off-state effect (`SidekickMenu.tsx:340-344`) and the unrelated `MenuButton` helper (`:42-43`) cause it; the NFR requires no growth.
- **UI-001 (advisory)** — the new off-state effect drops the search term but not `highlightedIndex`, unlike `handleSearchChange:285-286`, so a stale highlight can point at a different item after the prop flips off.
- **R5 (advisory)** — `npx jest`: 214 passed, 2 failed (pre-existing CRLF regexes in the untouched `Styles/SidekickMenu.theme.test.ts`); no search test deleted or skipped.

Docs, version, breaking-changes entry, exports and accessibility behaviour all check out.