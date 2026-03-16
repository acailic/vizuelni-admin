import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@vizualni/shared-kernel/serbian/transliteration': new URL(
        '../shared-kernel/src/serbian/transliteration.ts',
        import.meta.url
      ).pathname,
      '@vizualni/shared-kernel/serbian/collation': new URL(
        '../shared-kernel/src/serbian/collation.ts',
        import.meta.url
      ).pathname,
      '@vizualni/shared-kernel/types/filter': new URL(
        '../shared-kernel/src/types/filter.ts',
        import.meta.url
      ).pathname,
      '@vizualni/shared-kernel': new URL(
        '../shared-kernel/src/index.ts',
        import.meta.url
      ).pathname,
    },
  },
});
