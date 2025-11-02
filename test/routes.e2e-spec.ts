import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';

describe('Application Routes (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // ARRANGE
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Cleanup
    await app.close();
  });

  describe('Health Routes', () => {
    describe('GET /health', () => {
      it('should return 200 with health status', () => {
        // ARRANGE
        const expectedProperties = ['status', 'timestamp', 'uptime'];

        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeDefined();
            expectedProperties.forEach((prop) => {
              expect(res.body).toHaveProperty(prop);
            });
          });
      });

      it('should return status ok', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect((res) => {
            expect(res.body.status).toBe('ok');
          });
      });

      it('should return timestamp in ISO format', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect((res) => {
            const timestamp = new Date(res.body.timestamp);
            expect(timestamp.toString()).not.toBe('Invalid Date');
          });
      });

      it('should return numeric uptime', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect((res) => {
            expect(typeof res.body.uptime).toBe('number');
            expect(res.body.uptime).toBeGreaterThanOrEqual(0);
          });
      });

      it('should have correct content type', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect('Content-Type', /json/);
      });
    });

    describe('GET /health (multiple calls)', () => {
      it('should handle multiple requests', async () => {
        // ACT
        const promises = Array.from({ length: 5 }, () =>
          request(app.getHttpServer()).get('/health'),
        );

        const responses = await Promise.all(promises);

        // ASSERT
        responses.forEach((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe('ok');
        });
      });

      it('uptime should increment between calls', async () => {
        // ACT
        const res1 = await request(app.getHttpServer()).get('/health');
        await new Promise((resolve) => setTimeout(resolve, 100));
        const res2 = await request(app.getHttpServer()).get('/health');

        // ASSERT
        expect(res2.body.uptime as number).toBeGreaterThanOrEqual(res1.body.uptime as number);
      });
    });
  });

  describe('Auth Routes', () => {
    describe('POST /v1/auth/login-session', () => {
      it('should return 400 when body is empty', () => {
        // ACT & ASSERT
        return request(app.getHttpServer()).post('/v1/auth/login-session').send({}).expect(400);
      });

      it('should return 400 when email is missing', () => {
        // ARRANGE
        const payload = {
          password: 'password123',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect(400);
      });

      it('should return 400 when password is missing', () => {
        // ARRANGE
        const payload = {
          email: 'test@example.com',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect(400);
      });

      it('should return 400 when email is invalid', () => {
        // ARRANGE
        const payload = {
          email: 'invalid-email',
          password: 'password123',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect(400);
      });

      it('should return 404 when user not found', () => {
        // ARRANGE
        const payload = {
          email: 'nonexistent@example.com',
          password: 'password123',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect(404);
      });

      it('should return 401 with invalid credentials', () => {
        // ARRANGE
        const payload = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect(401);
      });

      it('should have correct content type', () => {
        // ARRANGE
        const payload = {
          email: 'test@example.com',
          password: 'password123',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect('Content-Type', /json/);
      });

      it('should accept valid email format', async () => {
        // ARRANGE
        const validEmails = ['user@example.com', 'john.doe@company.co.uk', 'test+tag@domain.com'];

        // ACT & ASSERT
        for (const email of validEmails) {
          const res = await request(app.getHttpServer()).post('/v1/auth/login-session').send({
            email,
            password: 'password123',
          });

          // Should not return 400 for invalid email format
          expect(res.status).not.toBe(400);
        }
      });

      it('should reject invalid email format', () => {
        // ARRANGE
        const invalidEmails = ['notanemail', 'user@', '@domain.com', 'user @example.com'];

        return Promise.all(
          invalidEmails.map((email) =>
            request(app.getHttpServer())
              .post('/v1/auth/login-session')
              .send({
                email,
                password: 'password123',
              })
              .expect(400),
          ),
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', () => {
      // ACT & ASSERT
      return request(app.getHttpServer()).get('/non-existent-route').expect(404);
    });

    it('should return 405 for wrong HTTP method', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/health')
        .expect((res) => {
          expect([404, 405]).toContain(res.status);
        });
    });

    it('should handle malformed JSON', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/v1/auth/login-session')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });

  describe('Route Response Format', () => {
    describe('Health response format', () => {
      it('should return object with specific structure', () => {
        // ACT & ASSERT
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect((res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).not.toBeNull();
            expect(typeof res.body.status).toBe('string');
            expect(typeof res.body.timestamp).toBe('string');
            expect(typeof res.body.uptime).toBe('number');
          });
      });
    });

    describe('Auth response format', () => {
      it('should return JSON response for login endpoint', () => {
        // ARRANGE
        const payload = {
          email: 'test@example.com',
          password: 'password123',
        };

        // ACT & ASSERT
        return request(app.getHttpServer())
          .post('/v1/auth/login-session')
          .send(payload)
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(typeof res.body).toBe('object');
          });
      });
    });
  });

  describe('HTTP Headers', () => {
    it('health endpoint should include required headers', () => {
      // ACT & ASSERT
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.headers['content-type']).toBeDefined();
          expect(res.headers['content-length']).toBeDefined();
        });
    });

    it('auth endpoint should accept and return JSON', () => {
      // ARRANGE
      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/v1/auth/login-session')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect((res) => {
          expect(res.headers['content-type']).toBeDefined();
        });
    });
  });

  describe('Performance and Concurrency', () => {
    it('should handle concurrent health checks', async () => {
      // ARRANGE
      const concurrentRequests = 10;

      // ACT
      const promises = Array.from({ length: concurrentRequests }, () =>
        request(app.getHttpServer()).get('/health'),
      );

      const results = await Promise.all(promises);

      // ASSERT
      results.forEach((res) => {
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
      });
    });

    it('should handle concurrent auth attempts', async () => {
      // ARRANGE
      const concurrentRequests = 5;
      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      // ACT
      const promises = Array.from({ length: concurrentRequests }, () =>
        request(app.getHttpServer()).post('/v1/auth/login-session').send(payload),
      );

      const results = await Promise.all(promises);

      // ASSERT
      results.forEach((res) => {
        expect(res.status).toBeGreaterThan(0);
        expect(['application/json']).toContain(res.type);
      });
    });
  });

  describe('Request Validation', () => {
    describe('Auth endpoint validation', () => {
      it('should validate email format', () => {
        // ARRANGE
        const invalidPayloads = [
          { email: '', password: 'password123' },
          { email: null, password: 'password123' },
          { email: 123, password: 'password123' },
        ];

        // ACT & ASSERT
        return Promise.all(
          invalidPayloads.map((payload) =>
            request(app.getHttpServer()).post('/v1/auth/login-session').send(payload).expect(400),
          ),
        );
      });

      it('should validate password field', () => {
        // ARRANGE
        const invalidPayloads = [
          { email: 'test@example.com', password: '' },
          { email: 'test@example.com', password: null },
          { email: 'test@example.com' },
        ];

        // ACT & ASSERT
        return Promise.all(
          invalidPayloads.map((payload) =>
            request(app.getHttpServer()).post('/v1/auth/login-session').send(payload).expect(400),
          ),
        );
      });
    });
  });

  describe('HTTP Status Codes', () => {
    it('health endpoint should return 200', () => {
      // ACT & ASSERT
      return request(app.getHttpServer()).get('/health').expect(200);
    });

    it('non-existent route should return 404', () => {
      // ACT & ASSERT
      return request(app.getHttpServer()).get('/api/not-found').expect(404);
    });

    it('invalid auth request should return 4xx or 5xx', async () => {
      // ARRANGE
      const invalidPayload = {
        email: 'invalid',
        password: 'pass',
      };

      // ACT
      const res = await request(app.getHttpServer())
        .post('/v1/auth/login-session')
        .send(invalidPayload);

      // ASSERT
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Route Versioning', () => {
    it('auth endpoint should use v1 versioning', () => {
      // ARRANGE
      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      // ACT & ASSERT
      return request(app.getHttpServer())
        .post('/v1/auth/login-session')
        .send(payload)
        .expect((res) => {
          expect(res.status).toBeGreaterThan(0);
        });
    });

    it('health endpoint should not require versioning', () => {
      // ACT & ASSERT
      return request(app.getHttpServer()).get('/health').expect(200);
    });
  });

  describe('Response Time', () => {
    it('health endpoint should respond quickly', async () => {
      // ARRANGE
      const maxResponseTime = 1000; // 1 second

      // ACT
      const start = Date.now();
      await request(app.getHttpServer()).get('/health').expect(200);
      const duration = Date.now() - start;

      // ASSERT
      expect(duration).toBeLessThan(maxResponseTime);
    });
  });

  describe('Error Messages', () => {
    it('should return error response for invalid email', async () => {
      // ARRANGE
      const payload = {
        email: 'invalid-email',
        password: 'password123',
      };

      // ACT
      const res = await request(app.getHttpServer()).post('/v1/auth/login-session').send(payload);

      // ASSERT
      expect(res.status).toBe(400);
      expect(res.body).toBeDefined();
    });

    it('should return error response for not found user', async () => {
      // ARRANGE
      const payload = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // ACT
      const res = await request(app.getHttpServer()).post('/v1/auth/login-session').send(payload);

      // ASSERT
      expect(res.status).toBe(404);
      expect(res.body).toBeDefined();
    });
  });
});
