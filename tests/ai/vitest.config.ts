import { defineConfig } from 'vitest/config';

// Load environment variables BEFORE any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });

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
    reporters: ['verbose'],

    // Setup files
    setupFiles: ['./tests/ai/setup.ts'],

    // Ensure env vars are available before loading tests
    env: {
      BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
});
