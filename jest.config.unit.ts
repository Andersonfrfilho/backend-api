import type { Config } from '@jest/types';

/**
 * Jest Configuration for Unit Tests
 *
 * Runs all tests with .unit.spec.ts extension
 * These are isolated unit tests with mocked dependencies
 *
 * Usage: npm run test:unit
 * Usage (watch): npm run test:unit:watch
 * Usage (coverage): npm run test:unit:cov
 */
const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  // Only run .unit.spec.ts files
  testRegex: String.raw`.*\.unit\.spec\.ts$`,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@faker-js))',
    '<rootDir>/dist/',
    '<rootDir>/.history/',
    '<rootDir>/logs/',
    '<rootDir>/coverage/',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.history/', '/logs/', '/coverage/'],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.history/**',
    '!**/coverage/**',
    '!**/logs/**',
    '!**/*.constant.**(ts|js)',
    '!**/index.**(ts|js)',
    '!**/*.enum.(ts|js)',
    '!**/*.interface.(ts|js)',
    '!**/*.module.(ts|js)',
    '!**/*.dto.(ts|js)',
    '!**/*.test.ts',
    '!**/*.types.(ts|js)',
    '!**/*.type.(ts|js)',
    '!**/types/**',
    '!**/type/**',
    // Exclude database migrations from coverage
    '!**/migrations/**',
    // Exclude files not covered by unit tests
    '!src/main.ts',
    '!src/config/**',
    '!src/modules/shared/infrastructure/context/middleware/**',
    '!src/modules/shared/infrastructure/interceptors/docs/**',
    '!src/modules/shared/infrastructure/providers/log/implementations/**',
    '!src/modules/error/application/app.error.factory.ts',
    '!src/modules/error/domain/AppError.ts',
    '!src/modules/auth/domain/exceptions.ts',
    '!src/modules/error/infrastructure/filters/error-filter.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/.history/', '/coverage/', '/logs/'],
  coverageDirectory: './coverage/unit',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      // Unit tests coverage thresholds
      // Adjusted based on current coverage, will be increased gradually
      branches: 0,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  coverageProvider: 'v8',
  displayName: '🧪 Unit Tests',
};

export default config;
