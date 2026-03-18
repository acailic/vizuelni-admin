import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@vizualni/shared-kernel': new URL(
        '../shared-kernel/src/index.ts',
        import.meta.url
      ).pathname,
      '@vizualni/data': new URL('../data/src/index.ts', import.meta.url)
        .pathname,
    },
  },
});
