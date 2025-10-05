module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/cli/(.*)$': '<rootDir>/src/cli/$1',
    '^@/parsers/(.*)$': '<rootDir>/src/parsers/$1',
    '^@/ai/(.*)$': '<rootDir>/src/ai/$1',
    '^@/generators/(.*)$': '<rootDir>/src/generators/$1',
    '^@/cache/(.*)$': '<rootDir>/src/cache/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  testTimeout: 30000,
  verbose: true
};