import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthLoginSessionService } from '@app/modules/auth/infrastructure/service/auth.login-session.service';

import { AppModule } from '../src/app.module';

describe('TodoModule', () => {
  let app: INestApplication;

  const mockTodoService = {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    markAsInActive: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthLoginSessionService)
      .useValue(mockTodoService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET: todo/:id', () => {
    beforeEach(() => {
      jest.spyOn(mockTodoService, 'get');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).get('/todo/1').expect(200, {});
    });
  });

  describe('GET: todo/all', () => {
    beforeEach(() => {
      jest.spyOn(mockTodoService, 'getAll');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).get('/todo/all').expect(200, {});
    });
  });

  describe('POST: todo', () => {
    beforeEach(() => {
      jest.spyOn(mockTodoService, 'create');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).post('/todo').expect(201, {});
    });
  });

  describe('PUT: todo', () => {
    beforeEach(() => {
      jest.spyOn(mockTodoService, 'update');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).put('/todo').expect(200, {});
    });
  });

  describe('PUT: todo/inactive/:id', () => {
    beforeEach(() => {
      jest.spyOn(mockTodoService, 'update');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).put('/todo/inactive/:id').expect(200, {});
    });
  });

  describe('DELETE: todo/:id', () => {
    beforeEach(() => {
      jest.spyOn(mockTodoService, 'delete');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).delete('/todo/:id').expect(200, {});
    });
  });
});
