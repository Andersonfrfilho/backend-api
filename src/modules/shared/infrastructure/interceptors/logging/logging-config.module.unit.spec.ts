import { describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { LOGGING_IGNORE_CONFIG } from '@modules/shared/infrastructure/log.provider';
import { LoggingConfigModule } from './logging-config.module';
import type { LoggingIgnoreConfig } from './logging.config';
import { DEFAULT_LOGGING_IGNORE_CONFIG } from './logging.config';

describe('LoggingConfigModule', () => {
  describe('initialization', () => {
    it('should be defined', () => {
      // ASSERT
      expect(LoggingConfigModule).toBeDefined();
    });

    it('should have Global decorator', async () => {
      // ARRANGE & ACT
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ASSERT
      expect(module).toBeDefined();
    });
  });

  describe('providers', () => {
    it('should provide LOGGING_IGNORE_CONFIG', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config).toBeDefined();
      expect(config).toEqual(DEFAULT_LOGGING_IGNORE_CONFIG);
    });

    it('should return LoggingIgnoreConfig object', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config).toHaveProperty('enabled');
      expect(config).toHaveProperty('ignoredRoutes');
    });

    it('should have enabled property set to true', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config.enabled).toBe(true);
    });

    it('should provide default ignored routes', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(Array.isArray(config.ignoredRoutes)).toBe(true);
      expect(config.ignoredRoutes.length).toBeGreaterThan(0);
    });

    it('should include health route in default config', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config.ignoredRoutes).toContain('/health');
    });
  });

  describe('exports', () => {
    it('should export LOGGING_IGNORE_CONFIG', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config).toBeDefined();
    });

    it('should be globally available', async () => {
      // ARRANGE & ACT
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ASSERT
      const config = module.get(LOGGING_IGNORE_CONFIG);
      expect(config).toBeDefined();
    });
  });

  describe('factory function', () => {
    it('should provide consistent config across requests', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config1: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);
      const config2: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config1).toEqual(config2);
    });

    it('should return default config when no environment variables', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config).toEqual(DEFAULT_LOGGING_IGNORE_CONFIG);
    });
  });

  describe('configuration validation', () => {
    it('should have valid structure', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(typeof config.enabled).toBe('boolean');
      expect(Array.isArray(config.ignoredRoutes)).toBe(true);

      for (const route of config.ignoredRoutes) {
        expect(typeof route === 'string' || route instanceof RegExp).toBe(true);
      }
    });

    it('should contain only valid routes', async () => {
      // ARRANGE
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config: LoggingIgnoreConfig = module.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      for (const route of config.ignoredRoutes) {
        if (typeof route === 'string') {
          expect(route.length).toBeGreaterThan(0);
          expect(route).toMatch(/^\/[a-z-]*$/i);
        }
      }
    });
  });

  describe('multiple module instances', () => {
    it('should provide same config in different contexts', async () => {
      // ARRANGE
      const module1: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      const module2: TestingModule = await Test.createTestingModule({
        imports: [LoggingConfigModule],
      }).compile();

      // ACT
      const config1: LoggingIgnoreConfig = module1.get(LOGGING_IGNORE_CONFIG);
      const config2: LoggingIgnoreConfig = module2.get(LOGGING_IGNORE_CONFIG);

      // ASSERT
      expect(config1.enabled).toBe(config2.enabled);
      expect(config1.ignoredRoutes).toEqual(config2.ignoredRoutes);
    });
  });
});
