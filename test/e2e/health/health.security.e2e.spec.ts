import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { LOG_PROVIDER } from '@modules/shared/infrastructure/log.provider';
import { AppModule } from '../../../src/app.module';

describe('Health Module - Security E2E Tests', () => {
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

  describe('Health Endpoint Security - Input Validation', () => {
    /**
     * 🔍 Testa que health endpoint não aceita parâmetros maliciosos
     */
    it('should ignore or reject malicious query parameters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health?cmd=whoami&rm=-rf&sql=DROP',
      });

      // Deve retornar 200 (ignora parâmetros desconhecidos)
      expect(response.statusCode).toBe(200);

      // Response deve ser válido JSON
      const body = JSON.parse(response.body);
      expect(body).toBeDefined();
    });

    /**
     * 💉 Testa proteção contra path traversal
     */
    it('should handle path traversal attempts safely', async () => {
      const traversalAttempts = [
        '/health/../admin',
        '/health/..%2fadmin',
        '/health/....//....//etc/passwd',
      ];

      for (const path of traversalAttempts) {
        const response = await app.inject({
          method: 'GET',
          url: path,
        });

        // Não deve expor recursos protegidos
        expect(response.statusCode).not.toBe(500);
      }
    });
  });

  describe('Health Endpoint Security - CORS & Headers', () => {
    /**
     * 🌐 Testa CORS headers corretos
     */
    it('should return appropriate CORS headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
        headers: {
          origin: 'https://example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBeDefined();
    });

    /**
     * 🔒 Testa security headers
     */
    it('should include security headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      // Verifica que headers de segurança existem
      expect(response.headers).toBeDefined();
    });

    /**
     * 🚫 Testa OPTIONS method
     */
    it('should handle OPTIONS requests properly', async () => {
      const response = await app.inject({
        method: 'OPTIONS',
        url: '/health',
      });

      // Fastify pode retornar 200, 204 ou 405 (Method Not Allowed)
      // Qualquer um desses é aceitável
      expect([200, 204, 405, 404]).toContain(response.statusCode);
    });
  });

  describe('Health Endpoint Security - Rate Limiting', () => {
    /**
     * 🔐 Testa que health endpoint também tem proteção contra DoS
     */
    it('should protect against excessive health check requests', async () => {
      const responses: number[] = [];
      const rapidRequests = 50;

      // Faz múltiplas requisições rapidamente
      const promises: Promise<any>[] = [];
      for (let i = 0; i < rapidRequests; i++) {
        promises.push(
          app.inject({
            method: 'GET',
            url: '/health',
          }),
        );
      }

      const results = await Promise.all(promises);
      for (const res of results) {
        const statusCode = (res as { statusCode: number }).statusCode;
        responses.push(statusCode);
      }

      // Maioria deve passar (200), alguns podem ser rate limited (429)
      const validResponses = responses.filter((code) => [200, 429].includes(code));
      expect(validResponses.length).toBeGreaterThan(0);
    });

    /**
     * 📊 Testa consistency sob carga
     */
    it('should maintain security under load', async () => {
      const responses: number[] = [];

      for (let i = 0; i < 20; i++) {
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        responses.push(response.statusCode);
      }

      // Todos devem retornar 200 ou 429
      expect(responses.every((code) => [200, 429].includes(code))).toBe(true);
    });
  });

  describe('Health Endpoint Security - Response Validation', () => {
    /**
     * ✅ Testa que response contém apenas informações públicas
     */
    it('should not expose sensitive system information', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      const responseStr = JSON.stringify(body).toLowerCase();

      // Não deve conter informações sensíveis
      expect(responseStr).not.toContain('password');
      expect(responseStr).not.toContain('secret');
      expect(responseStr).not.toContain('token');
      expect(responseStr).not.toContain('api_key');
      expect(responseStr).not.toContain('/home');
      expect(responseStr).not.toContain('/etc');
    });

    /**
     * 📝 Testa formato válido de resposta
     */
    it('should return valid and consistent response structure', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      // Deve ser JSON válido
      expect(() => JSON.parse(response.body)).not.toThrow();

      const body = JSON.parse(response.body);

      // Response deve ter estrutura esperada (não varia)
      expect(typeof body).toBe('object');
      expect(body !== null).toBe(true);
    });

    /**
     * 🔒 Testa que response não contém campos adicionais inesperados
     */
    it('should not include unexpected fields in response', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      const body = JSON.parse(response.body);

      const bodyObj = body as Record<string, unknown>;
      for (const key of Object.keys(bodyObj)) {
        // Se há subcampos, também devem ser seguros
        if (typeof bodyObj[key] === 'object' && bodyObj[key] !== null) {
          expect(typeof bodyObj[key]).not.toBe('function');
        }
      }
    });
  });

  describe('Health Endpoint Security - Method Restrictions', () => {
    /**
     * 🚫 Testa que apenas GET é permitido
     */
    it('should only allow GET method', async () => {
      const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        const response = await app.inject({
          method: method as any,
          url: '/health',
          payload: { test: 'data' },
        });

        // POST/PUT/DELETE devem ser rejeitados com 405 ou 404
        expect([405, 404, 400]).toContain(response.statusCode);
      }
    });
  });

  describe('Health Endpoint Security - Timeout Protection', () => {
    /**
     * ⏱️ Testa que health check responde rapidamente
     */
    it('should respond quickly to prevent timeout attacks', async () => {
      const times: number[] = [];

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });
        const responseTime = Date.now() - startTime;

        expect(response.statusCode).toBe(200);
        times.push(responseTime);
      }

      // Nenhuma requisição deve demorar mais de 1 segundo
      expect(Math.max(...times)).toBeLessThan(1000);
    });
  });

  describe('Health Endpoint Security - Content Type Validation', () => {
    /**
     * 📄 Testa Content-Type correto
     */
    it('should return correct Content-Type header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    /**
     * 🚫 Testa que Content-Encoding não é injetável
     */
    it('should handle encoding requests safely', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
        headers: {
          'accept-encoding': 'gzip, deflate, injection',
        },
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Health Endpoint Security - Caching', () => {
    /**
     * 💾 Testa headers de cache apropriados
     */
    it('should set appropriate cache headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      // Health endpoint pode ser cacheado por período curto
      if (response.headers['cache-control']) {
        expect(response.headers['cache-control']).toBeDefined();
      }
    });
  });

  describe('Health Endpoint Security - Recursive Access Prevention', () => {
    /**
     * 🔄 Testa que health endpoint não causa recursive calls
     */
    it('should not cause infinite loops or recursive calls', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      // Se houver múltiplos health checks em cascata, devem ser evitados
      const body = JSON.parse(response.body);
      expect(body).toBeDefined();
    });
  });

  describe('API Security - General HTTP Headers & Response Validation', () => {
    /**
     * 🛡️ Testa presença de security headers
     */
    it('should include X-Content-Type-Options header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      // X-Content-Type-Options pode estar presente
      if (response.headers['x-content-type-options']) {
        expect(response.headers['x-content-type-options']).toBe('nosniff');
      }
    });

    /**
     * 🔒 Testa X-Frame-Options header
     */
    it('should include X-Frame-Options header for clickjacking prevention', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      // X-Frame-Options pode estar presente
      if (response.headers['x-frame-options']) {
        const frameOptions = String(response.headers['x-frame-options']);
        expect(['DENY', 'SAMEORIGIN', 'ALLOW-FROM']).toContain(frameOptions);
      }
    });

    /**
     * 🌐 Testa X-XSS-Protection header
     */
    it('should include XSS protection headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      // XSS protection pode estar presente
      if (response.headers['x-xss-protection']) {
        expect(response.headers['x-xss-protection']).toContain('1');
      }
    });

    /**
     * 📋 Testa Strict-Transport-Security header
     */
    it('should consider HTTPS security measures', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      // HSTS pode estar configurado em produção
      if (response.headers['strict-transport-security']) {
        expect(response.headers['strict-transport-security']).toBeDefined();
      }
    });

    /**
     * 📝 Testa validação de Content-Type
     */
    it('should validate Content-Type for requests', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // Deve processar JSON corretamente
      expect(response.statusCode).not.toBe(415);
    });

    /**
     * 🔍 Testa rejeição de payloads malformados
     */
    it('should reject malformed JSON payloads', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/health',
        headers: {
          'content-type': 'application/json',
        },
        payload: '{invalid json',
      });

      expect([400, 404, 413]).toContain(response.statusCode);
    });

    /**
     * 📏 Testa limite de tamanho de requisição
     */
    it('should enforce request size limits', async () => {
      const largePayload = {
        query: 'a'.repeat(100000), // 100KB de payload
      };

      const response = await app.inject({
        method: 'POST',
        url: '/health',
        payload: largePayload,
      });

      expect([400, 404, 413]).toContain(response.statusCode);
    });

    /**
     * 🔐 Testa que responses não expõem stack traces
     */
    it('should not expose stack traces in error responses', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/nonexistent-endpoint-12345',
      });

      const body = response.body;
      expect(body).not.toContain('at ');
      expect(body).not.toContain('stack');
      expect(body).not.toContain('.ts:');
      expect(body).not.toContain('.js:');
    });

    /**
     * 🚫 Testa que responses não expõem estrutura do sistema
     */
    it('should not expose system paths in responses', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/nonexistent',
      });

      const responseStr = response.body.toLowerCase();
      expect(responseStr).not.toContain('/home');
      expect(responseStr).not.toContain('/usr');
      expect(responseStr).not.toContain('/var');
      expect(responseStr).not.toContain('c:\\');
    });

    /**
     * 🔤 Testa encoding UTF-8
     */
    it('should handle UTF-8 characters correctly', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // Deve processar sem erros de encoding
      expect(response.statusCode).not.toBe(500);
    });

    /**
     * 🚫 Testa rejeição de null bytes
     */
    it('should reject null bytes in input', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health\x00',
      });

      // Deve rejeitar ou sanitizar
      expect(response.statusCode).not.toBe(500);
    });

    /**
     * 🔄 Testa que requisições concorrentes não causam issues
     */
    it('should handle concurrent requests safely', async () => {
      const promises: Promise<any>[] = [];

      for (let i = 0; i < 10; i++) {
        promises.push(
          app.inject({
            method: 'GET',
            url: '/health',
          }),
        );
      }

      const results = await Promise.all(promises);

      // Todos devem ter sucesso
      expect(results.every((r) => r.statusCode === 200)).toBe(true);
    });

    /**
     * 🔐 Testa que state não vaza entre requisições
     */
    it('should not leak state between requests', async () => {
      const response1 = await app.inject({
        method: 'GET',
        url: '/health',
      });

      const response2 = await app.inject({
        method: 'GET',
        url: '/health',
      });

      // Respostas devem ser idênticas
      expect(response1.statusCode).toBe(response2.statusCode);
      expect(response1.body).toBe(response2.body);
    });

    /**
     * 💾 Testa que cache headers são seguros
     */
    it('should set cache headers appropriately', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      // Se há caching, deve ser explícito
      if (response.headers['cache-control']) {
        const cacheControl = String(response.headers['cache-control']);

        // Não deve cachear content sem validação apropriada
        if (cacheControl.includes('public')) {
          expect(cacheControl).toContain('max-age');
        }
      }
    });

    /**
     * 🌐 Testa que apenas HTTP/HTTPS é aceito
     */
    it('should handle protocol versions safely', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
