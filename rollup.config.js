const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      module: 'ESNext',
    }),
    terser(),
  ],
  external: ['cross-fetch', 'crypto'],
};
