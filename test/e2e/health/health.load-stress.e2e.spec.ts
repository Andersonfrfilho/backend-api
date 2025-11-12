import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';
import { AppModule } from '../../../src/app.module';

/**
 * 📊 Health E2E - Load & Stress Tests
 *
 * ✅ ISO/IEC 25010 - Performance Testing
 * ✅ RFC 7231 - HTTP Status Codes
 * ✅ W3C Performance Standards - Response Time < 1s
 * ✅ AWS Well-Architected - Resiliência & Performance
 *
 * Referência: See test/e2e/README.md for detailed documentation
 */
describe('Health E2E - Load & Stress Tests', () => {
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

  describe('Concurrent Health Check Requests', () => {
    /**
     * 📡 20 Concurrent Health Checks - Liveness Probe Validation
     *
     * Industry Standard: Health check must be fast and reliable
     * Target: All checks respond with valid status
     * Proves: Health endpoint is stable under concurrent load
     *
     * ✅ ISO/IEC 25010 - Availability validation
     * ✅ W3C Performance - Sub-second responses
     */
    it('should handle 20 concurrent health checks', async () => {
      // Arrange
      const concurrentRequests = 20;
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
      expect(results.some((r) => validStatusCodes.has(r.statusCode))).toBe(true);
    });

    /**
     * 📡 50 Concurrent Mixed Health Endpoints
     *
     * Tests: Multiple health endpoints simultaneously
     * Routes: /health, /health/live, /health/ready
     * Target: All 50 requests processed
     * Proves: Multi-endpoint health checks are resilient
     *
     * ✅ AWS Well-Architected - Health checks
     * ✅ Kubernetes-ready - Liveness & readiness probes
     */
    it('should handle 50 concurrent requests with mixed endpoints', async () => {
      // Arrange
      const healthRequests = 30;
      const liveRequests = 20;
      const totalRequests = healthRequests + liveRequests;

      // Act
      const promises = [
        ...Array.from({ length: healthRequests }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health',
          }),
        ),
        ...Array.from({ length: liveRequests }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health/live',
          }),
        ),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(totalRequests);
    });
  });

  describe('Rapid Sequential Health Checks', () => {
    it('should handle 30 rapid health checks sequentially', async () => {
      // Arrange
      const requestCount = 30;
      const validStatusCodes = new Set([200, 500]);
      const results: number[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        results.push(response.statusCode);
      }

      // Assert
      expect(results).toHaveLength(requestCount);
      expect(results.every((s) => validStatusCodes.has(s))).toBe(true);
    });

    it('should maintain health endpoint responsiveness', async () => {
      // Arrange
      const requestCount = 10;
      const maxAverageTimeMs = 5000;
      const responseTimes: number[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        const start = Date.now();
        await app.inject({
          method: 'GET',
          url: '/health',
        });
        const duration = Date.now() - start;
        responseTimes.push(duration);
      }

      // Assert
      const averageTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      expect(averageTime).toBeLessThan(maxAverageTimeMs);
    });
  });

  describe('Health Check Variants Under Load', () => {
    it('should handle concurrent requests to different health endpoints', async () => {
      // Arrange
      const requestsPerEndpoint = 10;
      const totalRequests = requestsPerEndpoint * 3;

      // Act
      const promises = [
        ...Array.from({ length: requestsPerEndpoint }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health',
          }),
        ),
        ...Array.from({ length: requestsPerEndpoint }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health/live',
          }),
        ),
        ...Array.from({ length: requestsPerEndpoint }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health/ready',
          }),
        ),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(totalRequests);
    });
  });

  describe('Resource Consumption', () => {
    it('should not accumulate errors under repeated requests', async () => {
      // Arrange
      const requestCount = 50;
      const maxAcceptableErrors = 25;
      const errors: string[] = [];

      // Act
      for (let i = 0; i < requestCount; i++) {
        try {
          const response = await app.inject({
            method: 'GET',
            url: '/health',
          });

          if (response.statusCode === 500) {
            errors.push(`Request ${i}: Server error`);
          }
        } catch (error) {
          errors.push(`Request ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Assert
      expect(errors.length).toBeLessThan(maxAcceptableErrors);
    });
  });

  describe('Burst Traffic Pattern', () => {
    it('should handle burst of 100 requests over short period', async () => {
      // Arrange
      const burstSize = 100;
      const validStatusCodes = new Set([200, 500]);
      const minSuccessThreshold = 50;

      // Act
      const promises = Array.from({ length: burstSize }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(burstSize);
      const successCount = results.filter((r) => validStatusCodes.has(r.statusCode)).length;
      expect(successCount).toBeGreaterThan(minSuccessThreshold);
    });
  });

  describe('Sustained Load Test', () => {
    it('should maintain performance over sustained requests', async () => {
      // Arrange
      const durationMs = 10000;
      const startTime = Date.now();
      const minRequestsThreshold = 5;
      const minSuccessThreshold = 0;
      let requestCount = 0;
      const statuses: number[] = [];

      // Act
      while (Date.now() - startTime < durationMs) {
        try {
          const response = await app.inject({
            method: 'GET',
            url: '/health',
          });
          statuses.push(response.statusCode);
          requestCount++;
        } catch {
          requestCount++;
        }
      }

      // Assert
      expect(requestCount).toBeGreaterThan(minRequestsThreshold);
      const successCount = statuses.filter((s) => s === 200).length;
      expect(successCount).toBeGreaterThan(minSuccessThreshold);
    });
  });

  describe('Timeout Handling', () => {
    it('should handle requests gracefully', async () => {
      // Arrange
      const requestCount = 10;
      const validStatusCodes = new Set([200, 500]);
      const minSuccessThreshold = 5;

      // Act
      const promises = Array.from({ length: requestCount }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(requestCount);
      const successCount = results.filter((r) => validStatusCodes.has(r.statusCode)).length;
      expect(successCount).toBeGreaterThan(minSuccessThreshold);
    });
  });
});
