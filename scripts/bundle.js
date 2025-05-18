const { rollup } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const path = require('path');
const fs = require('fs');

async function build() {
  // Ensure directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  const bundle = await rollup({
    input: 'src/index.ts',
    plugins: [
      resolve({
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
    external: ['cross-fetch'],
  });

  // Write ESM bundle
  await bundle.write({
    file: 'dist/index.mjs',
    format: 'esm',
    sourcemap: true,
  });

  // Copy types from esm to dist root for compatibility
  if (fs.existsSync('dist/esm/index.d.ts')) {
    fs.copyFileSync('dist/esm/index.d.ts', 'dist/index.d.ts');
  }

  console.log('Build completed successfully!');
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
