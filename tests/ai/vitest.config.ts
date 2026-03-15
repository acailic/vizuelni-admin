import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test file patterns
    include: ['tests/ai/**/*.spec.ts'],

    // Timeout settings (AI tests need longer timeouts)
    testTimeout: 120000,
    hookTimeout: 60000,

    // Run tests sequentially (browser tests can conflict in parallel)
    pool: 'threads',
    isolate: false,

    // Global test setup
    globals: true,

    // Reporter
    reporters: ['verbose', 'html'],
    outputFile: {
      html: 'test-results/ai-tests/report.html',
    },

    // Setup files
    setupFiles: ['./tests/ai/setup.ts'],
  },
});
