const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)',
    '<rootDir>/tests/unit/**/*.(test|spec).(ts|tsx|js|jsx)',
    '<rootDir>/tests/integration/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  moduleNameMapper: {
    '^@vizualni/application$': '<rootDir>/packages/application/src/index.ts',
    '^@vizualni/application/(.*)$': '<rootDir>/packages/application/src/$1',
    '^@vizualni/charts$': '<rootDir>/packages/charts/src/index.ts',
    '^@vizualni/charts/(.*)$': '<rootDir>/packages/charts/src/$1',
    '^@vizualni/data$': '<rootDir>/packages/data/src/index.ts',
    '^@vizualni/datagov-client$':
      '<rootDir>/packages/infrastructure/datagov-client/src/index.ts',
    '^@vizualni/datagov-client/(.*)$':
      '<rootDir>/packages/infrastructure/datagov-client/src/$1',
    '^@vizualni/shared-kernel$':
      '<rootDir>/packages/shared-kernel/src/index.ts',
    '^@vizualni/shared-kernel/(.*)$': '<rootDir>/packages/shared-kernel/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/packages/',
    '<rootDir>/tests/ai/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/e2e/',
  ],
};

module.exports = createJestConfig(customJestConfig);
