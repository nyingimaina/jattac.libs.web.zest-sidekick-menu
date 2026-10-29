Ruled `resolved` / route `challenge`, closing REV-1.

Verified: a fresh scratch build of the current tree is 122639 / 122171 bytes vs v1.7.0's 122706 / 122244 (smaller), `SidekickMenu.tsx:42` is `const h = React.createElement` (no MenuButton helper), and the PERF-001 test at `SidekickMenu.test.tsx:911` enforces the ceiling. Output written to `artifacts/03-build/arbiter-r5.json`.