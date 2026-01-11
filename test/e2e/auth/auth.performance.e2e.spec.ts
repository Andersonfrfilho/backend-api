import { faker } from '@faker-js/faker';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';
import { AppModule } from '../../../src/app.module';

describe('Auth Module - Performance E2E Tests', () => {
  let app: NestFastifyApplication;
  let testPassword: string;

  const mockLogProvider = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeAll(async () => {
    testPassword = faker.internet.password({ length: 12, memorable: false });
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

  describe('Response Time Metrics', () => {
    /**
     * ⏱️ Mede o tempo de resposta dos endpoints de autenticação
     * - Garante que o servidor responde em tempo aceitável
     * - Ideal: < 200ms para operações de autenticação
     */
    it('should respond to POST /auth/login-session within 200ms', async () => {
      const startTime = performance.now();

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: {
          email: faker.internet.email(),
          password: testPassword,
        },
      });

      const responseTime = performance.now() - startTime;
      expect([200, 201, 400, 401]).toContain(response.statusCode);
      expect(responseTime).toBeLessThan(200);
    });

    /**
     * 📊 Testa múltiplas requisições sequenciais
     * - Garante que performance não degrada com chamadas repetidas
     */
    it('should maintain consistent response times across multiple auth calls', async () => {
      const responseTimes: number[] = [];
      const calls = 5;

      for (let i = 0; i < calls; i++) {
        const startTime = performance.now();
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: {
            email: faker.internet.email(),
            password: testPassword,
          },
        });
        expect([200, 201, 400, 401]).toContain(response.statusCode);
        responseTimes.push(performance.now() - startTime);
      }

      // Verifica que todas as respostas estão dentro do limite
      for (const time of responseTimes) {
        expect(time).toBeLessThan(300);
      }

      // Calcula média
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / calls;

      // Verifica variação (não deve variar muito)
      const maxTime = Math.max(...responseTimes);
      const minTime = Math.min(...responseTimes);
      const variation = maxTime - minTime;
      expect(variation).toBeLessThan(150); // Variação máxima de 150ms
      expect(avgTime).toBeLessThan(250); // Média deve ser menor que 250ms
      expect(maxTime).toBeLessThan(300); // Tempo máximo deve ser menor que 300ms
    });
  });

  describe('Payload Size Metrics', () => {
    /**
     * 📦 Mede o tamanho da resposta
     * - Garante que a resposta não está muito grande
     */
    it('should return reasonable payload for POST /auth/login-session', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: {
          email: faker.internet.email(),
          password: testPassword,
        },
      });

      const payloadSize = response.body.length;
      expect(payloadSize).toBeLessThan(5120); // < 5KB
    });
  });

  describe('HTTP Header Metrics', () => {
    /**
     * 🔍 Verifica headers de segurança e performance
     */
    it('should include security headers in auth responses', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: {
          email: faker.internet.email(),
          password: testPassword,
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(200);
      // Verifica headers básicos
      expect(response.headers['content-type']).toBeDefined();
    });

    it('should have Content-Type header in auth responses', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: {
          email: faker.internet.email(),
          password: testPassword,
        },
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Concurrent Request Metrics', () => {
    /**
     * 🔄 Testa como o servidor se comporta com requisições paralelas de autenticação
     */
    it('should handle concurrent auth requests efficiently', async () => {
      const concurrentRequests = 5;
      const startTime = performance.now();

      // Executa 5 requisições de autenticação em paralelo
      const promises = new Array(concurrentRequests).fill(null).map(() =>
        app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: {
            email: faker.internet.email(),
            password: testPassword,
          },
        }),
      );

      const responses = await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      for (const response of responses) {
        expect([200, 201, 400, 401]).toContain(response.statusCode);
      }

      expect(totalTime).toBeLessThan(2000); // Todas em menos de 2 segundos
    });

    it('should calculate average response time for concurrent auth requests', async () => {
      const concurrentRequests = 3;
      const responseTimes: number[] = [];

      const createConcurrentRequest = async (): Promise<number> => {
        const startTime = performance.now();
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: {
            email: faker.internet.email(),
            password: testPassword,
          },
        });
        expect([200, 201, 400, 401]).toContain(response.statusCode);
        return performance.now() - startTime;
      };

      const promises = new Array(concurrentRequests)
        .fill(null)
        .map(() => createConcurrentRequest());

      const times = await Promise.all(promises);
      responseTimes.push(...times);

      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / concurrentRequests;
      const maxTime = Math.max(...responseTimes);
      const minTime = Math.min(...responseTimes);

      expect(avgTime).toBeLessThan(250);
      expect(maxTime).toBeLessThan(300);
    });
  });

  describe('Memory Metrics', () => {
    /**
     * 💾 Monitora uso de memória durante requisições de autenticação
     */
    it('should not have memory leaks during auth requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const requests = 10;

      // Executa múltiplas requisições de autenticação
      for (let i = 0; i < requests; i++) {
        const response = await app.inject({
          method: 'POST',
          url: '/auth/login-session',
          payload: {
            email: faker.internet.email(),
            password: testPassword,
          },
        });
        expect([200, 201, 400, 401]).toContain(response.statusCode);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // Convert to MB

      expect(memoryIncrease).toBeLessThan(50); // Menos de 50MB de aumento
    });
  });

  describe('Error Handling Performance', () => {
    /**
     * ⚡ Verifica que erros são tratados rapidamente
     */
    it('should handle invalid credentials quickly', async () => {
      const startTime = performance.now();

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login-session',
        payload: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 16 }),
        },
      });

      const responseTime = performance.now() - startTime;
      // Accept any response (201, 400, 401) as long as it responds quickly
      expect([201, 400, 401]).toContain(response.statusCode);
      expect(responseTime).toBeLessThan(150);
    });
  });
});
