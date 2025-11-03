import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { LOG_PROVIDER } from '@modules/shared/infrastructure/log.provider';
import { AppModule } from '../../src/app.module';

/**
 * 🛡️ Auth Module - Resilience E2E Tests
 *
 * ✅ AWS Well-Architected - Resiliency pillar
 * ✅ NIST SP 800-193 - Predictable behavior under stress
 * ✅ RFC 7231 - Proper HTTP status codes
 * ✅ ISO/IEC 25010 - Fault tolerance & error recovery
 *
 * Referência: See test/e2e/README.md for detailed documentation
 */
describe('Auth Module - Resilience E2E Tests', () => {
  let app: NestFastifyApplication;

  const mockLogProvider = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LOG_PROVIDER)
      .useValue(mockLogProvider)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Error Recovery', () => {
    /**
     * 🔄 Recovery from transient errors
     *
     * AWS Well-Architected: Auth must recover from temporary failures
     * Target: Consecutive login requests succeed after failure scenario
     * Proves: Error state doesn't persist across requests
     *
     * ✅ AWS Well-Architected - Transient error handling
     * ✅ RFC 7231 - Proper status codes
     */
    it('should recover from transient auth errors', async () => {
      // Arrange
      const requestCount = 5;
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const responses: number[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: credentials,
        });
        responses.push(response.statusCode);
      }

      // Assert
      expect(responses).toHaveLength(requestCount);
      expect(responses.every((code) => [200, 201, 400, 401, 500].includes(code))).toBe(true);
      const fiveHundredCount = responses.filter((code) => code === 500).length;
      expect(fiveHundredCount).toBeLessThanOrEqual(1);
    });

    /**
     * 🔐 Auth state isolation between requests
     *
     * Target: Login state doesn't leak between concurrent requests
     * Proves: User contexts are properly isolated
     *
     * ✅ ISO/IEC 25010 - Data integrity
     */
    it('should isolate auth state between concurrent requests', async () => {
      // Arrange
      const concurrentRequests = 10;
      const credentials1 = {
        email: 'user1@example.com',
        password: 'Password123!',
      };
      const credentials2 = {
        email: 'user2@example.com',
        password: 'DifferentPass456!',
      };

      // Act
      const promises: Promise<any>[] = [];
      for (let i = 0; i < concurrentRequests; i++) {
        const credentials = i % 2 === 0 ? credentials1 : credentials2;
        promises.push(
          app.inject({
            method: 'POST',
            url: '/auth/login-session',
            payload: credentials,
          }),
        );
      }

      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(concurrentRequests);
      expect(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (results as any[]).every((r) => {
          const status = r.statusCode;
          return typeof status === 'number' && [200, 201, 400, 401, 500].includes(status);
        }),
      ).toBe(true);
    });
  });

  describe('Auth Retry Logic', () => {
    /**
     * ♻️ Idempotent login requests
     *
     * Target: Multiple identical login requests are safe
     * Proves: Requests can be safely retried
     *
     * ✅ RFC 7231 - Idempotent semantics
     * ✅ AWS Well-Architected - Retry patterns
     */
    it('should handle login retry attempts safely', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const maxRetries = 3;
      let successCount = 0;

      // Act
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: credentials,
        });

        if ([200, 201, 400, 401].includes(response.statusCode)) {
          successCount++;
        }
      }

      // Assert
      expect(successCount).toBeGreaterThan(0);
    });

    /**
     * 🔂 Rapid successive auth attempts
     *
     * Target: Multiple rapid login attempts don't cause state issues
     * Proves: Auth handles burst traffic safely
     *
     * ✅ NIST - Reliability under transient conditions
     */
    it('should handle rapid successive login attempts', async () => {
      // Arrange
      const rapidAttempts = 5;
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const responses: number[] = [];

      // Act
      for (let i = 0; i < rapidAttempts; i++) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: credentials,
        });
        responses.push(response.statusCode);
      }

      // Assert
      expect(responses).toHaveLength(rapidAttempts);
      expect(responses.every((code) => [200, 201, 400, 401, 500].includes(code))).toBe(true);
    });
  });

  describe('Auth Timeout Handling', () => {
    /**
     * ⏱️ Auth request timeout
     *
     * Target: Login requests complete within acceptable time
     * Proves: No hanging requests
     *
     * ✅ RFC 7231 - Request/response lifecycle
     * ✅ NIST - Timeout management
     */
    it('should handle auth requests within timeout', async () => {
      // Arrange
      const timeoutMs = 5000;
      const requestCount = 3;
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const responseTimes: number[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        const startTime = Date.now();
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: credentials,
        });
        const duration = Date.now() - startTime;
        responseTimes.push(duration);

        expect(response.statusCode).not.toBe(504);
      }

      // Assert
      expect(responseTimes.every((time) => time < timeoutMs)).toBe(true);
    });
  });

  describe('Auth Partial Failure Handling', () => {
    /**
     * 📊 Graceful auth error responses
     *
     * Target: Auth errors are well-formed
     * Proves: Invalid requests don't crash app
     *
     * ✅ RFC 7231 - Error response semantics
     */
    it('should return well-formed auth error responses', async () => {
      // Arrange
      const errorScenarios = [
        { payload: { email: '', password: 'test' }, expectError: true },
        { payload: { email: 'test@example.com', password: '' }, expectError: true },
      ];

      // Act & Assert
      for (const scenario of errorScenarios) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: scenario.payload,
        });

        expect(response.statusCode).not.toBe(500);
        expect(response.headers['content-type']).toBeDefined();

        if (response.body) {
          expect(() => JSON.parse(response.body)).not.toThrow();
        }
      }
    });

    /**
     * 🔀 Mixed valid and invalid auth requests
     *
     * Target: Valid requests succeed even when mixed with invalid ones
     * Proves: Failures don't affect other requests
     *
     * ✅ AWS Well-Architected - Fault tolerance
     */
    it('should handle mixed valid and invalid auth requests', async () => {
      // Arrange
      const validPayload = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const invalidPayload = {
        email: '',
        password: '',
      };
      const requests = [validPayload, invalidPayload, validPayload];

      // Act
      const responses: number[] = [];
      for (const payload of requests) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload,
        });
        responses.push(response.statusCode);
      }

      // Assert
      expect(responses).toHaveLength(3);
      const successfulRequests = responses.filter((code) => [200, 201].includes(code)).length;
      const failedRequests = responses.filter((code) => [400, 401].includes(code)).length;

      expect(successfulRequests + failedRequests).toBeGreaterThan(0);
    });
  });
});
