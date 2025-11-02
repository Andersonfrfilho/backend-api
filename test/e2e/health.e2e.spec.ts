import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Health Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return 200', (done) => {
    request(app.getHttpServer()).get('/health').expect(200).end(done);
  });

  it('GET /health should return JSON content type', (done) => {
    request(app.getHttpServer()).get('/health').expect('Content-Type', /json/).end(done);
  });

  it('GET /health should have status property', (done) => {
    request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe(true);
      })
      .end(done);
  });
});
