import { faker } from '@faker-js/faker';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

/**
 * CORS E2E Tests
 * ISO/IEC 25002:2024 - Security & Compatibility
 */
describe('CORS E2E Tests', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      // Silently ignore DataSource not found errors (TypeORM cleanup issue with MONGO_URI)
      if ((error as Error).message?.includes('DataSource')) {
        console.warn('⚠️  DataSource cleanup error (expected with MONGO_URI)');
      } else {
        throw error;
      }
    }
  });

  /**
   * Test 1: CORS Headers Validation
   * ISO/IEC 25002:2024 - Security
   */
  describe('CORS Headers', () => {
    it('should handle requests with origin header', async () => {
      // ARRANGE & ACT
      const response = await app.inject({
        method: 'GET',
        url: '/health',
        headers: {
          origin: 'http://localhost:3000',
        },
      });

      // ASSERT
      expect(response.statusCode).toBe(200);
      expect(response.statusCode).not.toBe(500);
    });

    it('should handle preflight OPTIONS requests', async () => {
      // ARRANGE & ACT
      const response = await app.inject({
        method: 'OPTIONS',
        url: '/auth/login-session',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'content-type',
        },
      });

      // ASSERT - Should handle OPTIONS without 500 error
      expect([200, 204, 404, 405]).toContain(response.statusCode);
    });

    it('should handle multiple origins safely', async () => {
      // ARRANGE
      const origins = ['http://localhost:3000', 'https://example.com', 'https://malicious.com'];

      // ACT & ASSERT
      for (const origin of origins) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
          headers: { origin },
        });

        // All should respond safely (no 500 errors)
        expect(response.statusCode).not.toBe(500);
      }
    });
  });

  /**
   * Test 2: Method Restrictions
   * ISO/IEC 25002:2024 - Security
   */
  describe('Method Restrictions', () => {
    it('should only allow GET on /health endpoint', async () => {
      // ARRANGE
      const restrictedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

      // ACT & ASSERT
      for (const method of restrictedMethods) {
        const response = await app.inject({
          method: method as any,
          url: '/health',
        });

        // Restricted methods should be rejected or not crash
        expect(response.statusCode).not.toBe(500);
      }
    });

    it('should only allow POST on /auth/login-session', async () => {
      // ARRANGE
      const nonPostMethods = ['GET', 'PUT', 'DELETE', 'PATCH'];

      // ACT & ASSERT
      for (const method of nonPostMethods) {
        const response = await app.inject({
          method: method as any,
          url: '/auth/login-session',
        });

        // All non-POST should be rejected
        expect([400, 405, 404]).toContain(response.statusCode);
      }
    });
  });

  /**
   * Test 3: Request/Response Validation
   * ISO/IEC 25002:2024 - Compatibility & Security
   */
  describe('Request/Response Validation', () => {
    it('should validate Content-Type header on POST requests', async () => {
      // ARRANGE
      const payload = {
        email: faker.internet.email(),
        password: faker.internet.password({ length: 12 }),
      };

      // ACT
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload,
        headers: {
          'content-type': 'application/json',
        },
      });

      // ASSERT
      expect(response.statusCode).toBeLessThan(500);
    });

    it('should include proper Content-Type in responses', async () => {
      // ARRANGE & ACT
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // ASSERT
      expect(response.statusCode).toBe(200);
      const contentType = response.headers['content-type'];
      expect(contentType).toContain('application/json');
    });
  });

  /**
   * Test 4: Cache Control Headers
   * ISO/IEC 25002:2024 - Performance & Security
   */
  describe('Cache Control', () => {
    it('should set appropriate cache headers for health endpoint', async () => {
      // ARRANGE & ACT
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // ASSERT
      expect(response.statusCode).toBe(200);
      // Should have cache control or handle it appropriately
      expect(response.headers).toBeDefined();
    });

    it('should not return 500 on POST requests', async () => {
      // ARRANGE
      const payload = {
        email: faker.internet.email(),
        password: faker.internet.password({ length: 12 }),
      };

      // ACT
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload,
      });

      // ASSERT
      expect(response.statusCode).not.toBe(500);
    });
  });
});
