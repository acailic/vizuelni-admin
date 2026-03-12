import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tsParser from '@typescript-eslint/parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // Ignore patterns
  {
    ignores: [
      'app/public/dist/**',
      'app/graphql/resolver-types.ts',
      'app/graphql/query-hooks.ts',
      'app/graphql/urql-compat.d.ts',
      'app/graphql/urql-core-compat.d.ts',
      'app/dist/**',
      'app/out/**',
      'app/public/static/**',
      'app/node_modules/**',
      'app/.next/**',
      '.next/**',
      'node_modules/**',
      'dist/**',
      '**/*.config.js',
      '**/*.config.mjs',
      'app/public/storybook/**',
      'benchmarks/**',
      'utils/**',
    ],
  },

  // Shared plugins and rules for all app files
  {
    files: ['app/**/*.{js,jsx,ts,tsx}', 'src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImportsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-duplicate-case': 'error',
      'unused-imports/no-unused-imports': 'warn',
    },
  },

  // TypeScript-specific parser configuration
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },
];
