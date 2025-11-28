import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disabled due to type errors in non-exported files
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: [
    // Peer dependencies
    'react',
    'react-dom',
    'next',
    '@babel/runtime',
    // External dependencies that consumers should install
    '@lingui/react',
    '@lingui/core',
    'd3-format',
    'd3-time-format',
    'make-plural',
    'fp-ts',
    'io-ts'
  ],
})
