import type { Config } from '@jest/types';
import { config } from 'dotenv';

// Carregar variáveis de ambiente específicas para E2E
config({ path: '.env.e2e' });

// Fallback para .env se .env.e2e não existir
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
  config({ path: '.env' });
}

// Configurar NODE_ENV para test se não estiver definido
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Configurações específicas para testes E2E
process.env.JEST_WORKER_ID = process.env.JEST_WORKER_ID || '1';

// Log para debug (remover em produção)
console.log('🌐 E2E Test Environment Loaded');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   DATABASE: ${process.env.DATABASE_POSTGRES_NAME}`);

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: String.raw`.*\.e2e\.spec\.ts$`,
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
    '!**/migrations/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/.history/', '/coverage/', '/logs/'],
  coverageDirectory: './coverage/e2e',
  collectCoverage: false, // Usually disabled for E2E tests - too slow
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  coverageProvider: 'v8',
  displayName: '🌐 E2E Tests',
  testTimeout: 60000, // 60 segundos para dar tempo de inicializar aplicação
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setup-e2e.ts'],
  openHandlesTimeout: 60000,
} as Config.InitialOptions;
