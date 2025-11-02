import { describe, expect, it } from '@jest/globals';
import {
  DEFAULT_LOGGING_IGNORE_CONFIG,
  shouldIgnoreRoute,
  type LoggingIgnoreConfig,
} from './logging.config';

describe('Logging Config', () => {
  describe('DEFAULT_LOGGING_IGNORE_CONFIG', () => {
    it('should have enabled set to true', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.enabled).toBe(true);
    });

    it('should have ignoredRoutes array', () => {
      // ASSERT
      expect(Array.isArray(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes)).toBe(true);
    });

    it('should contain health route', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/health');
    });

    it('should contain metrics route', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/metrics');
    });

    it('should contain docs route', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/docs');
    });

    it('should contain api-docs route', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes).toContain('/api-docs');
    });

    it('should have at least 4 ignored routes', () => {
      // ASSERT
      expect(DEFAULT_LOGGING_IGNORE_CONFIG.ignoredRoutes.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('shouldIgnoreRoute', () => {
    describe('with string routes', () => {
      it('should return false when ignoredRoutes is empty', () => {
        // ARRANGE
        const path = '/health';
        const ignoredRoutes: string[] = [];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should return true for exact route match', () => {
        // ARRANGE
        const path = '/health';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });

      it('should return true for nested route match', () => {
        // ARRANGE
        const path = '/health/check';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });

      it('should return false for non-matching route', () => {
        // ARRANGE
        const path = '/users';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should match multiple routes', () => {
        // ARRANGE
        const ignoredRoutes = ['/health', '/metrics', '/docs'];

        // ACT
        const result1 = shouldIgnoreRoute('/health', ignoredRoutes);
        const result2 = shouldIgnoreRoute('/metrics', ignoredRoutes);
        const result3 = shouldIgnoreRoute('/docs', ignoredRoutes);

        // ASSERT
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
      });

      it('should be case-sensitive', () => {
        // ARRANGE
        const path = '/Health';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should handle paths with query strings', () => {
        // ARRANGE
        const path = '/health?check=true';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });
    });

    describe('with RegExp routes', () => {
      it('should return true for pattern match', () => {
        // ARRANGE
        const path = '/health/check';
        const ignoredRoutes: RegExp[] = [/^\/health/];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });

      it('should return false for non-matching pattern', () => {
        // ARRANGE
        const path = '/users/123';
        const ignoredRoutes: RegExp[] = [/^\/health/];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should handle complex regex patterns', () => {
        // ARRANGE
        const ignoredRoutes: RegExp[] = [/^\/api\/(health|status|metrics)/];

        // ACT
        const result1 = shouldIgnoreRoute('/api/health', ignoredRoutes);
        const result2 = shouldIgnoreRoute('/api/status', ignoredRoutes);
        const result3 = shouldIgnoreRoute('/api/metrics', ignoredRoutes);
        const result4 = shouldIgnoreRoute('/api/users', ignoredRoutes);

        // ASSERT
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(false);
      });

      it('should handle case-insensitive patterns', () => {
        // ARRANGE
        const ignoredRoutes: RegExp[] = [/^\/health/i];

        // ACT
        const result1 = shouldIgnoreRoute('/health', ignoredRoutes);
        const result2 = shouldIgnoreRoute('/HEALTH', ignoredRoutes);
        const result3 = shouldIgnoreRoute('/Health', ignoredRoutes);

        // ASSERT
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
      });

      it('should handle pattern with wildcards', () => {
        // ARRANGE
        const ignoredRoutes: RegExp[] = [/^\/health.*/, /^\/metrics.*/];

        // ACT
        const result1 = shouldIgnoreRoute('/health/live', ignoredRoutes);
        const result2 = shouldIgnoreRoute('/health/ready', ignoredRoutes);
        const result3 = shouldIgnoreRoute('/metrics/prometheus', ignoredRoutes);

        // ASSERT
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
      });
    });

    describe('with mixed string and RegExp routes', () => {
      it('should match both string and regex patterns', () => {
        // ARRANGE
        const stringRoutes = ['/health'];
        const regexRoutes = [/^\/metrics/];
        const ignoredRoutes: (string | RegExp)[] = [...stringRoutes, ...regexRoutes];

        // ACT
        const result1 = shouldIgnoreRoute('/health', ignoredRoutes);
        const result2 = shouldIgnoreRoute('/health/check', ignoredRoutes);
        const result3 = shouldIgnoreRoute('/metrics/prometheus', ignoredRoutes);
        const result4 = shouldIgnoreRoute('/users', ignoredRoutes);

        // ASSERT
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(false);
      });

      it('should check all patterns before returning false', () => {
        // ARRANGE
        const ignoredRoutes: (string | RegExp)[] = ['/health', /^\/api\/internal/, /^\/admin/];

        // ACT
        const result1 = shouldIgnoreRoute('/api/internal/stats', ignoredRoutes);
        const result2 = shouldIgnoreRoute('/admin/users', ignoredRoutes);
        const result3 = shouldIgnoreRoute('/api/public/data', ignoredRoutes);

        // ASSERT
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle null routes array', () => {
        // ARRANGE
        const path = '/health';
        const ignoredRoutes = null as unknown as (string | RegExp)[];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should handle undefined routes array', () => {
        // ARRANGE
        const path = '/health';
        const ignoredRoutes = undefined as unknown as (string | RegExp)[];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should handle empty path', () => {
        // ARRANGE
        const path = '';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });

      it('should handle root path', () => {
        // ARRANGE
        const path = '/';
        const ignoredRoutes = ['/'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });

      it('should handle paths with trailing slashes', () => {
        // ARRANGE
        const path = '/health/';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });

      it('should not match partial route names', () => {
        // ARRANGE
        const path = '/healthcare';
        const ignoredRoutes = ['/health'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(false);
      });
    });

    describe('performance considerations', () => {
      const createLargeRouteList = (size: number) => {
        const routes: string[] = [];
        for (let i = 0; i < size; i++) {
          routes.push(`/route${i}`);
        }
        return routes;
      };

      it('should return true on first match without checking others', () => {
        // ARRANGE
        const path = '/health';
        const ignoredRoutes = ['/health', '/metrics', '/docs'];

        // ACT
        const result = shouldIgnoreRoute(path, ignoredRoutes);

        // ASSERT
        expect(result).toBe(true);
      });

      it('should handle large route lists efficiently', () => {
        // ARRANGE
        const ignoredRoutes = createLargeRouteList(100);
        const path = '/users/123';

        // ACT
        const start = performance.now();
        const result = shouldIgnoreRoute(path, ignoredRoutes);
        const duration = performance.now() - start;

        // ASSERT
        expect(result).toBe(false);
        expect(duration).toBeLessThan(10);
      });
    });
  });

  describe('LoggingIgnoreConfig interface', () => {
    it('should accept valid config object', () => {
      // ARRANGE
      const stringRoutes = ['/health'];
      const config: LoggingIgnoreConfig = {
        enabled: true,
        ignoredRoutes: stringRoutes,
      };

      // ASSERT
      expect(config.enabled).toBe(true);
      expect(config.ignoredRoutes).toHaveLength(1);
    });

    it('should accept disabled config', () => {
      // ARRANGE
      const config: LoggingIgnoreConfig = {
        enabled: false,
        ignoredRoutes: ['/health'],
      };

      // ASSERT
      expect(config.enabled).toBe(false);
    });

    it('should accept empty ignoredRoutes', () => {
      // ARRANGE
      const config: LoggingIgnoreConfig = {
        enabled: true,
        ignoredRoutes: [],
      };

      // ASSERT
      expect(config.ignoredRoutes).toEqual([]);
    });
  });
});
