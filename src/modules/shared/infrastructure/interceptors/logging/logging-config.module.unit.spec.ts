import { describe, expect, it } from '@jest/globals';

import type { LoggingIgnoreConfig } from './logging.config';
import { DEFAULT_LOGGING_IGNORE_CONFIG } from './logging.config';

describe('LoggingConfigModule Configuration', () => {
  describe('DEFAULT_LOGGING_IGNORE_CONFIG constant', () => {
    it('should be defined', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG).toBeDefined();
    });

    it('should be a valid configuration object', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG).toHaveProperty('enabled');
      expect(DEFAULT_LOGGING_IGNORE_CONFIG).toHaveProperty('ignoredRoutes');
    });

    it('should have enabled property as boolean', () => {
      // ASSERT
      expect(typeof DEFAULT_LOGGING_IGNORE_CONFIG.enabled).toBe('boolean');
    });

    it('should have ignoredRoutes as array', () => {
      // ASSERT
      expect(Array.isArray(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes)).toBe(true);
    });

    it('should have at least one ignored route', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes.length).toBeGreaterThan(0);
    });

    it('should contain /health route', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/health');
    });

    it('should have enabled set to true', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.enabled).toBe(true);
    });

    it('should return consistent value on multiple accesses', () => {
      // ACT
      const config1 = DEFAULT_LOGGING_IGNORE_CONFIG;
      const config2 = DEFAULT_LOGGING_IGNORE_CONFIG;

      // ASSERT
      expect(config1).toBe(config2);
      expect(config1).toEqual(config2);
    });

    it('should validate routes have proper format', () => {
      // ASSERT
      for (const route of DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes) {
        if (typeof route === 'string') {
          expect(route.length).toBeGreaterThan(0);
          expect(route.startsWith('/')).toBe(true);
        } else if (route instanceof RegExp) {
          expect(route).toBeInstanceOf(RegExp);
        }
      }
    });

    it('should contain valid LoggingIgnoreConfig shape', () => {
      // ASSERT
      const keys = Object.keys(DEFAULT_LOGGING_IGNORE_CONFIG).sort((a, b) => a.localeCompare(b));
      const expectedKeys = ['enabled', 'ignoredRoutes'].sort((a, b) => a.localeCompare(b));
      expect(keys).toEqual(expectedKeys);
    });
  });

  describe('LoggingIgnoreConfig interface', () => {
    it('should create valid config instance from default', () => {
      // ACT
      const config: LoggingIgnoreConfig = { ...DEFAULT_LOGGING_IGNORE_CONFIG };

      // ASSERT
      expect(config).toHaveProperty('enabled');
      expect(config).toHaveProperty('ignoredRoutes');
      expect(typeof config.enabled).toBe('boolean');
      expect(Array.isArray(config.ignoredRoutes)).toBe(true);
    });

    it('should allow creating custom configuration', () => {
      // ACT
      const customConfig: LoggingIgnoreConfig = {
        enabled: false,
        ignoredRoutes: ['/custom'],
      };

      // ASSERT
      expect(customConfig.enabled).toBe(false);
      expect(customConfig.ignoredRoutes).toContain('/custom');
    });

    it('should support regex patterns in ignoredRoutes', () => {
      // ACT
      const config: LoggingIgnoreConfig = {
        enabled: true,
        ignoredRoutes: [/^\/swagger.*/],
      };

      // ASSERT
      expect(config.ignoredRoutes[0]).toBeInstanceOf(RegExp);
    });

    it('should allow string routes in ignoredRoutes', () => {
      // ACT
      const config: LoggingIgnoreConfig = {
        enabled: true,
        ignoredRoutes: ['/health'],
      };

      // ASSERT
      expect(config.ignoredRoutes[0]).toBe('/health');
    });
  });

  describe('configuration immutability', () => {
    it('should maintain structure consistency', () => {
      // ASSERT
      const config1 = DEFAULT_LOGGING_IGNORE_CONFIG;
      const config2 = DEFAULT_LOGGING_IGNORE_CONFIG;

      // Verify same reference
      expect(config1).toBe(config2);
    });

    it('should have correct default routes', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/health');
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/metrics');
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/docs');
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/api-docs');
    });
  });
});
