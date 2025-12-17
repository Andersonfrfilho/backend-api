import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';

import { swaggerConfig } from '@config/swagger.config';
import { docsFactory } from '@modules/shared/infrastructure/interceptors/docs';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';
import { AppModule } from '../../src/app.module';

describe('Swagger Documentation (e2e)', () => {
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

    // Initialize Swagger routes for testing
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    docsFactory({ app, document });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /swagger-spec', () => {
    it('should return swagger spec with 200 status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/swagger-spec',
      });
      expect(response.statusCode).toBe(200);
    });

    it('should return JSON content type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/swagger-spec',
      });
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return valid OpenAPI/Swagger document', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/swagger-spec',
      });
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('openapi');
      expect(body).toHaveProperty('info');
      expect(body).toHaveProperty('paths');
    });

    it('should contain API title in swagger spec', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/swagger-spec',
      });
      const body = JSON.parse(response.body);
      expect(body.info).toHaveProperty('title');
    });

    it('should contain API version in swagger spec', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/swagger-spec',
      });
      const body = JSON.parse(response.body);
      expect(body.info).toHaveProperty('version');
    });
  });

  describe('POST /swagger-spec (invalid method)', () => {
    it('should return 404 for POST /swagger-spec', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/swagger-spec',
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /swagger-spec (invalid method)', () => {
    it('should return 404 for PUT /swagger-spec', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/swagger-spec',
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /swagger-spec (invalid method)', () => {
    it('should return 404 for DELETE /swagger-spec', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/swagger-spec',
      });
      expect(response.statusCode).toBe(404);
    });
  });
});
