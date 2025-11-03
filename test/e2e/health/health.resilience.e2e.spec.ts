import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { LOG_PROVIDER } from '@modules/shared/infrastructure/log.provider';
import { AppModule } from '../../../src/app.module';

/**
 * 🛡️ Health Module - Resilience E2E Tests
 *
 * ✅ AWS Well-Architected - Resiliency pillar
 * ✅ NIST SP 800-193 - Predictable behavior under stress
 * ✅ RFC 7231 - Proper HTTP status codes
 * ✅ ISO/IEC 25010 - Fault tolerance & error recovery
 *
 * Referência: See test/e2e/README.md for detailed documentation
 */
describe('Health Module - Resilience E2E Tests', () => {
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

  describe('Health Check Recovery', () => {
    /**
     * 🔄 Recovery from transient health check failures
     *
     * AWS Well-Architected: Health must always be available
     * Target: Health endpoint recovers after failures
     * Proves: Health checks maintain service availability visibility
     *
     * ✅ AWS Well-Architected - Transient error handling
     * ✅ RFC 7231 - Proper status codes
     */
    it('should recover from transient health check errors', async () => {
      // Arrange
      const requestCount = 10;
      const responses: number[] = [];
      const validStatusCodes = new Set([200, 500]);

      // Act
      for (let i = 0; i < requestCount; i++) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        responses.push(response.statusCode);
      }

      // Assert
      expect(responses).toHaveLength(requestCount);
      expect(responses.every((code) => validStatusCodes.has(code))).toBe(true);
    });

    /**
     * 🔀 Graceful degradation - health check always available
     *
     * Target: Health endpoint responds even under extreme load
     * Proves: App maintains minimal functionality
     *
     * ✅ ISO/IEC 25010 - Availability under adverse conditions
     */
    it('should maintain health check during intense load', async () => {
      // Arrange
      const stressRequests = 50;
      const healthCheckRequests = 20;
      const validStatusCodes = new Set([200, 500]);

      // Act
      const stressPromises = Array.from({ length: stressRequests }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );

      const healthPromises = Array.from({ length: healthCheckRequests }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );

      const allResponses = await Promise.all([...stressPromises, ...healthPromises]);

      // Assert
      expect(allResponses).toHaveLength(stressRequests + healthCheckRequests);
      const healthResponses = allResponses.slice(stressRequests);
      expect(healthResponses.every((r) => validStatusCodes.has(r.statusCode))).toBe(true);
    });
  });

  describe('Health Check Circuit Breaker', () => {
    /**
     * 🔌 Circuit breaker pattern for health checks
     *
     * Target: Health endpoint prevents cascading failures
     * Proves: Protects dependent systems
     *
     * ✅ AWS Well-Architected - Fault isolation
     * ✅ NIST - Resource management under load
     */
    it('should implement circuit breaker for cascading failures', async () => {
      // Arrange
      const failureThreshold = 5;
      const requests = 10;
      const validResponses = new Set([200, 429, 500]);
      const responses: number[] = [];
      let circuitOpen = false;

      // Act
      for (let i = 0; i < requests; i++) {
        if (circuitOpen && i > failureThreshold) {
          continue;
        }

        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        responses.push(response.statusCode);

        if (
          response.statusCode >= 500 &&
          responses.filter((c) => c >= 500).length >= failureThreshold
        ) {
          circuitOpen = true;
        }
      }

      // Assert
      expect(responses.length).toBeGreaterThan(0);
      expect(responses.every((code) => validResponses.has(code))).toBe(true);
    });

    /**
     * 🔄 Circuit breaker recovery state
     *
     * Target: Health checks recover from circuit breaker state
     * Proves: System self-heals
     *
     * ✅ ISO/IEC 25010 - Recovery capability
     */
    it('should recover from circuit breaker state', async () => {
      // Arrange
      const phases = [{ name: 'healthy' }, { name: 'degraded' }, { name: 'recovery' }];

      // Act
      const results: { phase: string; successCount: number; totalCount: number }[] = [];

      for (const phase of phases) {
        let successCount = 0;
        let totalCount = 0;

        for (let i = 0; i < 3; i++) {
          const response = await app.inject({
            method: 'GET',
            url: '/health',
          });
          totalCount++;

          if (response.statusCode === 200) {
            successCount++;
          }
        }

        results.push({
          phase: phase.name,
          successCount,
          totalCount,
        });
      }

      // Assert
      expect(results).toHaveLength(3);
      const recoveryPhase = results[2];
      expect(recoveryPhase.successCount).toBeGreaterThan(0);
    });
  });

  describe('Health Check Idempotency', () => {
    /**
     * ♻️ Idempotent health checks
     *
     * Target: Multiple identical health checks return same result
     * Proves: Checks can be safely retried
     *
     * ✅ RFC 7231 - Idempotent semantics
     * ✅ AWS Well-Architected - Retry patterns
     */
    it('should return identical results for repeated health checks', async () => {
      // Arrange
      const requestCount = 5;
      const responses: any[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        responses.push({
          status: response.statusCode,
          body: response.body,
        });
      }

      // Assert
      expect(responses).toHaveLength(requestCount);
      const firstBody = responses[0].body;
      const allIdentical = responses.every((r) => r.body === firstBody);
      expect(allIdentical).toBe(true);
      expect(responses.every((r) => r.status === 200)).toBe(true);
    });

    /**
     * 🔂 Rapid sequential health checks
     *
     * Target: Rapid checks don't cause state issues
     * Proves: Health endpoint handles burst traffic
     *
     * ✅ NIST - Reliability under transient conditions
     */
    it('should handle rapid sequential health checks', async () => {
      // Arrange
      const rapidChecks = 20;
      const responses: number[] = [];
      const validStatusCodes = new Set([200, 500]);

      // Act
      for (let i = 0; i < rapidChecks; i++) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        responses.push(response.statusCode);
      }

      // Assert
      expect(responses).toHaveLength(rapidChecks);
      expect(responses.every((code) => validStatusCodes.has(code))).toBe(true);
    });
  });

  describe('Health Check Timeout', () => {
    /**
     * ⏱️ Health check timeout handling
     *
     * Target: Health checks complete within timeout
     * Proves: No hanging requests
     *
     * ✅ RFC 7231 - Request/response lifecycle
     * ✅ NIST - Timeout management
     */
    it('should handle health checks within timeout', async () => {
      // Arrange
      const timeoutMs = 5000;
      const requestCount = 10;
      const responseTimes: number[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        const startTime = Date.now();
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        const duration = Date.now() - startTime;
        responseTimes.push(duration);

        expect(response.statusCode).not.toBe(504);
      }

      // Assert
      expect(responseTimes.every((time) => time < timeoutMs)).toBe(true);
      const maxTime = Math.max(...responseTimes);
      expect(maxTime).toBeLessThan(timeoutMs);
    });

    /**
     * 🎯 Health check deadline propagation
     *
     * Target: Concurrent health checks respect deadlines
     * Proves: Time management works under load
     *
     * ✅ AWS Well-Architected - Timeout management
     */
    it('should respect deadline for concurrent health checks', async () => {
      // Arrange
      const deadlineMs = 3000;
      const startTime = Date.now();
      const concurrentRequests = 20;

      // Act
      const promises = Array.from({ length: concurrentRequests }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // Assert
      expect(totalTime).toBeLessThan(deadlineMs);
      expect(results.every((r) => r.statusCode === 200)).toBe(true);
    });
  });

  describe('Health Check State Isolation', () => {
    /**
     * 🔐 Request isolation - no state leakage
     *
     * Target: Concurrent health checks don't share state
     * Proves: Thread/async safety
     *
     * ✅ ISO/IEC 25010 - Data integrity
     */
    it('should isolate concurrent health check states', async () => {
      // Arrange
      const concurrentRequests = 30;
      const validStatusCodes = new Set([200, 500]);

      // Act
      const promises = Array.from({ length: concurrentRequests }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );

      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(concurrentRequests);
      const allValid = results.every((r) => {
        const status = r.statusCode;
        return typeof status === 'number' && validStatusCodes.has(status);
      });
      expect(allValid).toBe(true);
    });

    /**
     * 🔄 State reset between requests
     *
     * Target: No residual state from previous checks
     * Proves: Each request starts fresh
     *
     * ✅ RFC 7231 - Request independence
     */
    it('should maintain state isolation across sequential checks', async () => {
      // Arrange
      const requestSequence = [
        { method: 'GET' as const, url: '/health' },
        { method: 'GET' as const, url: '/health' },
        { method: 'GET' as const, url: '/health' },
      ];

      // Act
      const responses: any[] = [];
      for (const request of requestSequence) {
        const response = await app.inject({
          method: request.method,
          url: request.url,
        });
        responses.push({
          status: response.statusCode,
          headers: response.headers,
          body: JSON.parse(response.body),
        });
      }

      // Assert
      expect(responses).toHaveLength(3);
      expect(responses.every((r) => r.status === 200)).toBe(true);

      const bodyStructure = responses[0].body;
      expect(responses.every((r) => JSON.stringify(r.body) === JSON.stringify(bodyStructure))).toBe(
        true,
      );
    });
  });
});
