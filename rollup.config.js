const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss');
const dts = require('rollup-plugin-dts'); // Import dts plugin

const packageJson = require('./package.json');

module.exports = [
  {
    input: 'UI/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }), // Use tsconfig.json for compilation
      postcss({
        modules: true,
        inject: true,
        extract: false,
      }),
    ],
  },
  {
    input: 'UI/index.ts', // Input for type definitions
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts.default()],
  },
];
