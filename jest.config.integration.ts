import type { Config } from '@jest/types';

/**
 * Jest Configuration for Integration Tests
 *
 * Runs all tests with .integration.spec.ts extension
 * These tests run with multiple layers and real dependencies
 *
 * Usage: npm run test:integration
 * Usage (watch): npm run test:integration:watch
 */
const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  // Only run .integration.spec.ts files
  testRegex: String.raw`.*\.integration\.spec\.ts$`,
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
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/.history/', '/coverage/', '/logs/'],
  coverageDirectory: './coverage/integration',
  collectCoverage: false, // Usually disabled for integration tests - too slow
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  coverageProvider: 'v8',
  displayName: '🔗 Integration Tests',
  // Increase timeout for integration tests
  testTimeout: 30000,
};

export default config;
