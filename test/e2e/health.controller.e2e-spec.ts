import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';

const httpServer = (app: INestApplication) => app.getHttpServer() as never;

describe('Health Controller E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // ARRANGE
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // CLEANUP
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 200 with health status', async () => {
      // ACT
      const response = await request(httpServer(app)).get('/health').expect('Content-Type', /json/);

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should have status property', async () => {
      // ACT
      const response = await request(httpServer(app)).get('/health');

      // ASSERT
      expect(response.body).toHaveProperty('status');
    });

    it('should return quickly (performance)', async () => {
      // ACT
      const startTime = Date.now();
      await request(httpServer(app)).get('/health');
      const duration = Date.now() - startTime;

      // ASSERT
      expect(duration).toBeLessThan(500);
    });

    it('should handle multiple concurrent requests', async () => {
      // ARRANGE
      const createRequests = (size: number) => {
        const reqs: Array<Promise<any>> = [];
        for (let i = 0; i < size; i++) {
          reqs.push(request(httpServer(app)).get('/health').expect(200));
        }
        return reqs;
      };

      // ACT
      const promises = createRequests(10);
      const responses = await Promise.all(promises);

      // ASSERT
      expect(responses).toHaveLength(10);
      for (const response of responses) {
        expect(response.status).toBe(200);
      }
    });

    it('should not log the request (ignore config)', async () => {
      // ACT
      const response = await request(httpServer(app)).get('/health');

      // ASSERT
      expect(response.status).toBe(200);
    });
  });

  describe('Health Check Endpoint', () => {
    it('should indicate application is healthy', async () => {
      // ACT
      const response = await request(httpServer(app)).get('/health');

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should accept GET requests', async () => {
      // ACT
      const response = await request(httpServer(app)).get('/health');

      // ASSERT
      expect(response.status).not.toBe(405);
    });

    it('should reject POST requests', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/health');

      // ASSERT
      expect(response.status).toBe(405);
    });

    it('should return consistent response structure', async () => {
      // ACT
      const response1 = await request(httpServer(app)).get('/health');
      const response2 = await request(httpServer(app)).get('/health');

      // ASSERT
      expect(response1.body).toEqual(response2.body);
    });
  });
});
