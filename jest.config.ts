import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/.history/',
    '<rootDir>/logs/',
    '<rootDir>/coverage/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.history/',
    '/logs/',
    '/coverage/',
  ],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.history/**', // <-- ⛔️ Exclui histórico
    '!**/coverage/**',
    '!**/logs/**',
    '!**/*.constant.**(ts|js)',
    '!**/index.**(ts|js)',
    '!**/*.enum.(ts|js)',
    '!**/*.interface.(ts|js)',
    '!**/*.module.(ts|js)',
    '!**/*.dto.(ts|js)',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.history/',
    '/coverage/',
    '/logs/',
  ],
  coverageDirectory: './coverage',
  collectCoverage: true,
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  coverageProvider: 'v8',
};

export default config;
