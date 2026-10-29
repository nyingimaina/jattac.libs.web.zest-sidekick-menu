You are helping make the checks of an EXISTING software project work under DevTeam. These checks do not pass yet. For each, work out why, and say the smallest change that makes it pass honestly.

You may propose these kinds of change, and nothing else:
- "command": the exact command (and the folder, relative to the project root) that does this check for THIS project, the way the team already does it (read the CI file, package.json scripts, README).
- "devDependency": a development-only package the project's own tooling needs and lacks. Give the exact name and an exact version (1.2.3). Only a package the project's config files already refer to, or that its CI uses.
- "script": a package.json script the project lacks, when its CI or README shows what it should run.

Rules:
- Commands use only these programs: npm, npx, pnpm, yarn, node. No pipes, redirection, semicolons or shell tricks.
- Never make a check pass by weakening it: no --passWithNoTests, no `|| true`, no test name filters, no skipping tests. A check must really run the project's tests.
- Do not invent a package, a script or a tool. If you cannot find evidence in the project's files, leave that check out.
- Do not change, create or delete any file of the project. Write ONLY the answer file named below. DevTeam will try every proposal itself, after the person says yes.
- If the check fails because of a real bug in the project's own code (a failing test), say nothing: that is not a setup problem.

Checks that do not pass, and what was seen:
- lib-validate-package: Package check (attw and publint). Not set up: attw and publint are not installed, so nothing checks that the package works for everyone who installs it.
- lib-size: Size budget. Not set up: The project has no .size-limit.json, so this check has nothing to run.
- lib-consumer-smoke: Install and import the packed library. Not set up: Nothing installs the packed library into a scratch project and imports it  no scripts/consumer-smoke.mjs .
- lib-docs: Documentation is complete. Not set up: The project has no scripts/check-docs.mjs, so this check has nothing to run.

What DevTeam already knows about the project:
- Web app in `.` (typescript), package tool npm, packages installed.
- Its package.json scripts: build, test, test:watch, prepublishOnly.
- Its dependencies: @rollup/plugin-commonjs, @rollup/plugin-node-resolve, @testing-library/jest-dom, @testing-library/react, @types/jest, @types/node, @types/react, identity-obj-proxy, jest, jest-environment-jsdom, jsdom, rollup, rollup-plugin-dts, rollup-plugin-peer-deps-external, rollup-plugin-postcss, rollup-plugin-typescript2, ts-jest, ts-node, typescript.

Write the answer as JSON to this file: D:/work/nyingi/code/systems/Sidekick/.devteam/adoption/doctor.json
{ "items": [ { "kind": "command", "check": "web-tests", "command": "npm run test:ci", "workingDir": "web", "why": "where you found it" },
             { "kind": "devDependency", "check": "web-tests", "package": "jest-environment-jsdom", "version": "29.7.0", "workingDir": "web", "why": "jest.config.js sets testEnvironment to jsdom" },
             { "kind": "script", "check": "web-tests", "script": "test:ci", "command": "jest --ci", "workingDir": "web", "why": "CI runs jest --ci" } ] }