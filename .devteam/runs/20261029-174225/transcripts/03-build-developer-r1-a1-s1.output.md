Deliverable written to `.devteam/runs/20261029-174225/artifacts/03-build/developer-r1.json`.

- Search is now opt-in (`searchEnabled = false`) with an off-state term reset; enabled search behaviour is unchanged.
- Tests updated/added for R1, R2, R5 plus metadata checks for R3/R4: 55/55 focused tests pass; `npm run build` passes.
- Full suite: 211 passed, 2 pre-existing failures in untouched `Styles/SidekickMenu.theme.test.ts` caused by CRLF line endings on Windows (not related to this change).
- `docs/api.md` and `docs/configuration.md` left untouched for the other build slice.