# DevTeam adoption baseline

DevTeam 0.56.254 · 2026-10-29 20:24

## What was found

- Library (an npm package, TypeScript): in `.`. Its scripts: build, test, test:watch, prepublishOnly.
- Features live in: `UI`.
- Shared code lives in: `Styles`, `utils`.

## Quick checks

- Type check (library and tests): **passed**
- Tests, with coverage: **later** (the slower proof, run with: devteam verify)
- Build (CommonJS, ES modules, type definitions): **later** (the slower proof, run with: devteam verify)
- Package check (attw and publint): **not set up**
- What would be published: **later** (the slower proof, run with: devteam verify)
- Publish dry run (everything npm checks, nothing is uploaded): **later** (the slower proof, run with: devteam verify)
- Size budget: **not set up**
- Install and import the packed library: **not set up**
- Documentation is complete: **not set up**

## Not set up in this project

- Package check (attw and publint): attw and publint are not installed, so nothing checks that the package works for everyone who installs it.
- Install and import the packed library: Nothing installs the packed library into a scratch project and imports it (no scripts/consumer-smoke.mjs).
- Size budget: The project has no .size-limit.json, so this check has nothing to run.
- Documentation is complete: The project has no scripts/check-docs.mjs, so this check has nothing to run.

These stay out of the readiness verdict as **not proven**. The developer is told to add tests where it changes code; nothing is added to your project unless a feature asks for it.

## How to make more checks work

Nothing is stopping a check right now.

## Survey

Done; the notes were added to what every role reads (`.devteam/adoption/survey.md`).

## Next:

1. `devteam verify` for the slow proof (full tests, coverage, starting the app).
2. `devteam run "describe the feature you want"`. It is built on its own branch; nothing is merged for you.
3. Changed your mind? `devteam unadopt` removes only the `.devteam` folder.
