# Technology Stack: React Sidekick Menu

## Core Technologies
- **Language:** [TypeScript](https://www.typescriptlang.org/) (v5.3.3) - Ensuring robust type safety and excellent developer experience.
- **Library:** [React](https://reactjs.org/) (>=16.8.0) - Leveraging Hooks and a component-based architecture.

## Build & Development
- **Bundler:** [Rollup](https://rollupjs.org/) (v4.9.6) - Optimized for bundling libraries with support for ESM and CommonJS.
- **Compiler:** [TypeScript Compiler (tsc)](https://www.typescriptlang.org/docs/handbook/compiler-options.html) - Integrated via `rollup-plugin-typescript2`.
- **CSS Processing:** [PostCSS](https://postcss.org/) - Handled via `rollup-plugin-postcss` to support CSS Modules and modern CSS features.

## Styling & UI
- **Styling Strategy:** [CSS Modules](https://github.com/css-modules/css-modules) - Providing scoped and maintainable styles.
- **Theme Support:** Native implementation for Dark/Light/System themes using CSS Variables and media queries.

## Key Dependencies
- `react`, `react-dom` (Peer Dependencies)
- Rollup plugins for node resolve, commonjs, and peer dependencies exclusion.
