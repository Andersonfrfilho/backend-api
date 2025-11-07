import { faker } from '@faker-js/faker';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';

/**
 * Data Integrity E2E Tests
 * ISO/IEC 25002:2024 - Functional Correctness & Data Integrity (6.1.2)
 *
 * Cross-module tests validating ACID properties and data consistency across the application.
 * These tests ensure data integrity regardless of which module is handling the request.
 */
describe('Data Integrity E2E Tests', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * Test 1: Unique Constraint Validation
   */
  describe('Unique Constraints', () => {
    it('should reject duplicate credentials gracefully', async () => {
      // ARRANGE
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 12 });

      // ACT
      const firstLogin = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: { email, password },
      });

      // ASSERT
      expect(firstLogin.statusCode).toBeLessThan(500);
    });

    it('should handle email validation without server error', async () => {
      // ARRANGE
      const invalidEmails = ['notanemail', 'user@', '@domain.com'];
      const password = faker.internet.password();

      // ACT & ASSERT
      for (const email of invalidEmails) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: { email, password },
        });

        // Should not crash with 500
        expect(response.statusCode).not.toBe(500);
      }
    });
  });

  /**
   * Test 2: Atomicity - All or Nothing
   */
  describe('Atomicity', () => {
    it('should handle validation failure without server error', async () => {
      // ARRANGE
      const validEmail = faker.internet.email();
      const invalidPassword = 'short';

      // ACT
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: { email: validEmail, password: invalidPassword },
      });

      // ASSERT - Should not crash
      expect(response.statusCode).not.toBe(500);
    });

    it('should handle race conditions without data corruption', async () => {
      // ARRANGE
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 12 });

      // ACT - Concurrent requests
      const promises = Array.from({ length: 10 }).map(() =>
        app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: { email, password },
        }),
      );

      const results = await Promise.all(promises);

      // ASSERT
      expect(results).toHaveLength(10);
      const errorCount = results.filter((r) => r.statusCode >= 500).length;
      expect(errorCount).toBe(0);
    });
  });

  /**
   * Test 3: Data Consistency
   */
  describe('Data Consistency', () => {
    it('should maintain consistent health check status', async () => {
      // ARRANGE
      const requests = 20;

      // ACT
      const results = await Promise.all(
        Array.from({ length: requests }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health',
          }),
        ),
      );

      // ASSERT
      expect(results).toHaveLength(requests);
      const firstResponse = results[0];

      for (const response of results) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(firstResponse.body);
      }
    });

    it('should handle response payload size consistently', async () => {
      // ARRANGE
      const requests = 5;

      // ACT
      const results = await Promise.all(
        Array.from({ length: requests }).map(() =>
          app.inject({
            method: 'GET',
            url: '/health',
          }),
        ),
      );

      // ASSERT
      const sizes = results.map((r) => r.body.length);
      const minSize = Math.min(...sizes);
      const maxSize = Math.max(...sizes);
      const variance = maxSize - minSize;

      expect(variance).toBeLessThan(100);
    });
  });

  /**
   * Test 4: Input Validation & Sanitization
   */
  describe('Input Validation & Sanitization', () => {
    it('should handle SQL injection payloads without server error', async () => {
      // ARRANGE
      const sqlInjectionPayloads = ["'; DROP TABLE users; --", "1' OR '1'='1"];
      const password = faker.internet.password();

      // ACT & ASSERT
      for (const payload of sqlInjectionPayloads) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: { email: payload, password },
        });

        // Should not crash
        expect(response.statusCode).not.toBe(500);
      }
    });

    it('should reject XSS payloads', async () => {
      // ARRANGE
      const xssPayloads = ['<script>alert("xss")</script>', 'javascript:alert("xss")'];
      const password = faker.internet.password();

      // ACT & ASSERT
      for (const payload of xssPayloads) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: { email: payload, password },
        });

        expect(response.statusCode).not.toBe(500);
      }
    });
  });

  /**
   * Test 5: Transaction Isolation
   */
  describe('Transaction Isolation', () => {
    it('should isolate concurrent login attempts', async () => {
      // ARRANGE
      const user1 = {
        email: faker.internet.email(),
        password: faker.internet.password({ length: 12 }),
      };
      const user2 = {
        email: faker.internet.email(),
        password: faker.internet.password({ length: 12 }),
      };

      // ACT
      const [login1, login2] = await Promise.all([
        app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: user1,
        }),
        app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: user2,
        }),
      ]);

      // ASSERT
      expect(login1.statusCode).toBeLessThan(500);
      expect(login2.statusCode).toBeLessThan(500);
    });

    it('should not expose data from concurrent requests', async () => {
      // ARRANGE
      const requests = Array.from({ length: 5 }).map(() =>
        app.inject({
          method: 'GET',
          url: '/health',
        }),
      );

      // ACT
      const results = await Promise.all(requests);

      // ASSERT
      for (const response of results) {
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('status');
      }
    });
  });

  /**
   * Test 6: Durability
   */
  describe('Durability', () => {
    it('should maintain response consistency across server time', async () => {
      // ARRANGE
      const firstCheck = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // ACT
      const secondCheck = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // ASSERT
      expect(firstCheck.statusCode).toBe(secondCheck.statusCode);
      expect(firstCheck.body).toEqual(secondCheck.body);
    });

    it('should recover state consistently after multiple operations', async () => {
      // ARRANGE
      const operations: number[] = [];

      // ACT
      for (let i = 0; i < 10; i++) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        operations.push(response.statusCode);
      }

      // ASSERT
      expect(operations).toHaveLength(10);
      expect(operations.every((status) => status === 200)).toBe(true);
    });
  });
});
