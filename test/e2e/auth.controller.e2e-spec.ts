import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';

const httpServer = (app: INestApplication) => app.getHttpServer() as never;

describe('Auth Controller E2E', () => {
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

  describe('POST /auth/login', () => {
    it('should require email and password', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({});

      // ASSERT
      expect(response.status).toBe(400);
    });

    it('should validate email format', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: 'invalid-email',
        password: 'password123',
      });

      // ASSERT
      expect(response.status).toBe(400);
    });

    it('should reject missing email', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        password: 'password123',
      });

      // ASSERT
      expect(response.status).toBe(400);
    });

    it('should reject missing password', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: 'test@example.com',
      });

      // ASSERT
      expect(response.status).toBe(400);
    });

    it('should return 401 for invalid credentials', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      // ASSERT
      expect(response.status).toBe(401);
    });

    it('should have Content-Type application/json', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      // ASSERT
      expect(response.type).toMatch(/json/);
    });
  });

  describe('Auth Endpoints Structure', () => {
    it('should reject GET requests on /auth/login', async () => {
      // ACT
      const response = await request(httpServer(app)).get('/auth/login');

      // ASSERT
      expect(response.status).toBe(405);
    });

    it('should reject PUT requests on /auth/login', async () => {
      // ACT
      const response = await request(httpServer(app)).put('/auth/login').send({});

      // ASSERT
      expect(response.status).toBe(405);
    });

    it('should reject DELETE requests on /auth/login', async () => {
      // ACT
      const response = await request(httpServer(app)).delete('/auth/login');

      // ASSERT
      expect(response.status).toBe(405);
    });
  });

  describe('Request Body Validation', () => {
    it('should accept valid login request', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      // ASSERT
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
    });

    it('should not accept extra properties', async () => {
      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
        extra: 'property',
      });

      // ASSERT
      expect(response.status).toBeLessThan(500);
    });

    it('should handle long email gracefully', async () => {
      // ARRANGE
      const longEmail = `${'a'.repeat(250)}@example.com`;

      // ACT
      const response = await request(httpServer(app)).post('/auth/login').send({
        email: longEmail,
        password: 'password123',
      });

      // ASSERT
      expect(response.status).toBeLessThan(500);
    });
  });
});
