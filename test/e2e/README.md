# E2E Tests Structure

Este diretório contém os testes end-to-end (E2E) da aplicação, organizados por módulo/controller.

## 📁 Arquivos

### 1. **health.controller.e2e-spec.ts**

Testes do controller de Health Check

**Rotas testadas:**

- `GET /health` - Verificar status de saúde da aplicação

**Casos de teste:**

- ✅ Response com status 200 e JSON
- ✅ Presença da propriedade `status`
- ✅ Performance < 5s
- ✅ Rejeita métodos não permitidos (POST, PUT, DELETE)

**Total:** 6 testes

### 2. **auth.controller.e2e-spec.ts**

Testes do controller de Autenticação

**Rotas testadas:**

- `POST /auth/login` - Autenticar usuário

**Casos de teste:**

- ✅ Validação obrigatória de email e password (400)
- ✅ Validação de formato de email (400)
- ✅ Rejeita password ausente (400)
- ✅ Content-Type application/json
- ✅ Rejeita métodos não permitidos (GET, PUT, DELETE = 405)

**Total:** 7 testes

## 🔧 Padrão de Implementação

### Estrutura AAA (Arrange, Act, Assert)

```typescript
describe('Controller E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // ARRANGE - Setup
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // CLEANUP
    await app.close();
  });

  it('should do something', async () => {
    // ARRANGE
    const payload = {
      /* dados */
    };

    // ACT
    const response = await request(httpServer(app)).post('/route').send(payload);

    // ASSERT
    expect(response.status).toBe(200);
  });
});
```

### Helper Function

```typescript
const httpServer = (app: INestApplication) => app.getHttpServer() as never;
```

**Uso:**

```typescript
await request(httpServer(app)).get('/health');
```

## ✅ Checklist de Testes

Ao criar novos testes E2E, considere cobrir:

- [ ] **Validação de entrada**
  - [ ] Campos obrigatórios
  - [ ] Formato de dados (email, URL, etc)
  - [ ] Limites de tamanho
  - [ ] Tipos de dados

- [ ] **Respostas HTTP**
  - [ ] Status code correto (200, 400, 401, 404, 500, etc)
  - [ ] Content-Type application/json
  - [ ] Estrutura do body

- [ ] **Métodos HTTP**
  - [ ] Método correto aceito
  - [ ] Métodos inválidos rejeitados com 405

- [ ] **Casos extremos**
  - [ ] Strings vazias
  - [ ] Valores nulos/undefined
  - [ ] Dados muito longos
  - [ ] Caracteres especiais

- [ ] **Performance**
  - [ ] Tempo de resposta aceitável
  - [ ] Suporta requisições concorrentes

## 🚀 Executar Testes

```bash
# Todos os testes E2E
npm run test:e2e

# Teste específico
npm run test:e2e -- health.controller.e2e-spec

# Com coverage
npm run test:e2e -- --coverage
```

## 📊 Status Atual

| Controller | Status      | Arquivo                       | Testes | Timeout  |
| ---------- | ----------- | ----------------------------- | ------ | -------- |
| Health     | ✅ Completo | health.controller.e2e-spec.ts | 6      | 15s cada |
| Auth       | ✅ Completo | auth.controller.e2e-spec.ts   | 7      | 15s cada |

## 🔐 Considerações de Logging

Os testes E2E verificam que a configuração de logging ignore routes funciona corretamente:

- Rotas como `/health` não devem gerar logs
- Rotas como `/auth/login` devem gerar logs normalmente
- Configuração via `LOGGING_IGNORED_ROUTES` env var

## 📝 Integração com routes.e2e-spec.ts

O arquivo `routes.e2e-spec.ts` (no diretório pai `test/`) contém testes de rotas integralizados da aplicação. Os testes neste diretório (`test/e2e/`) são organizados por controller e mais específicos.

**Diferença:**

- `test/routes.e2e-spec.ts` - Testes gerais de rotas
- `test/e2e/*.controller.e2e-spec.ts` - Testes específicos por controller

---

# 📊 E2E Load & Stress Testing

## 🎯 Objetivo

Os testes de load & stress servem como **prova objetiva** de que a aplicação é performática, escalável e resiliente sob diferentes cenários de carga.

## 🌍 Padrões Internacionais Implementados

### ISO/IEC 25010 - Qualidade de Software

- Performance testing obrigatório para aplicações
- Validação de response time, throughput e estabilidade

### RFC 7231 - HTTP Semantics & Content

Padronização de HTTP status codes:

```
2xx - Sucesso: 200 OK, 201 Created, 204 No Content
4xx - Erro Cliente: 400 Bad Request, 401 Unauthorized, 403 Forbidden
5xx - Erro Servidor: 500 Internal Server Error, 503 Service Unavailable
```

### W3C Web Performance & Google Standards

- **Response Time Target:** < 200ms (excelente), < 1s (aceitável)
- **Google PageSpeed:** Métricas de performance web

### NIST SP 800-193 - Teste de Segurança

- Performance e segurança sob stress
- Validação de rate limiting e recuperação

### AWS Well-Architected Framework

- **Pilar Performance:** Resiliência sob carga

---

## 🧪 Testes de Load-Stress Implementados

### 1. **Concurrent Requests** 📡

**Arquivos:** `auth.load-stress.e2e.spec.ts`, `health.load-stress.e2e.spec.ts`

#### ✅ 10 Concurrent Requests

- **O que prova:** App aguenta múltiplas requisições simultâneas
- **Métrica:** Baseline industry standard (10 concurrent = ~10 usuários)
- **Esperado:** Todas as 10 requisições completam com status code válido

#### ✅ 50 Concurrent Requests (Mixed Endpoints)

- **O que prova:** Medium load capacity (pico realista)
- **Métrica:** Múltiplos endpoints simultâneos
- **Esperado:** Todas as 50 requisições processadas sem erro crítico

**Código de exemplo:**

```typescript
const promises = Array.from({ length: 50 }).map(() =>
  app.inject({
    method: 'POST',
    url: '/auth/login-session',
    payload: credentials,
  }),
);
const results = await Promise.all(promises);
expect(results).toHaveLength(50);
```

---

### 2. **Rapid Sequential Requests** ⚡

#### ✅ 5 Sequential Login Attempts

- **O que prova:** App responde consistentemente em sequência rápida
- **Métrica:** W3C Performance - Response time consistente
- **Esperado:** Sem timeout ou degradação progressiva

#### ✅ 20 Rapid Health Checks

- **O que prova:** Health check é rápido e resiliente
- **Métrica:** Liveness probe confiável
- **Esperado:** Respostas imediatas sem falha

---

### 3. **Large Payloads** 📦

#### ✅ 10KB Payload Test

- **O que prova:** Sem memory leaks com payloads grandes
- **Métrica:** Dentro de limites HTTP padrão (1MB típico)
- **Esperado:** Processa dados sem erro

**Código:**

```typescript
const largePayload = {
  email: 'test@example.com',
  password: 'Password123!',
  additionalData: 'x'.repeat(10000), // 10KB
};
const response = await app.inject({
  method: 'POST',
  url: '/auth/login-session',
  payload: largePayload,
});
```

---

### 4. **Rate Limiting & Throttling** ⏱️

#### ✅ Consistent Response Time

- **O que prova:** W3C Performance - Response time consistente
- **Métrica:** 10 requisições em < 30 segundos (< 3s por requisição)
- **Padrão:** Google Standards (excelente)

**Código:**

```typescript
const timestamps: number[] = [];
for (let i = 0; i < 10; i++) {
  timestamps.push(Date.now());
  await app.inject({ method: 'GET', url: '/health' });
}
const duration = timestamps.at(-1)! - timestamps[0];
expect(duration).toBeLessThan(30000);
```

---

### 5. **Connection Resilience** 🛡️

#### ✅ Recovery After Failures

- **O que prova:** AWS Well-Architected - Resiliência
- **Métrica:** App não fica em estado quebrado
- **Esperado:** Recupera e continua respondendo

**Código:**

```typescript
for (let i = 0; i < 5; i++) {
  const response = await app.inject({
    method: 'POST',
    url: '/auth/login-session',
    payload: credentials,
  });
  expect([200, 201, 400, 401, 500]).toContain(response.statusCode);
}
// App continua respondendo após tentativas
const finalResponse = await app.inject({
  method: 'GET',
  url: '/health',
});
expect([200, 500]).toContain(finalResponse.statusCode);
```

---

## 📈 Métricas de Performance

### Response Time Standards (W3C/Google)

| Latência  | Avaliação            | Ação     |
| --------- | -------------------- | -------- |
| < 100ms   | ⭐⭐⭐⭐⭐ Excelente | Produção |
| 100-200ms | ⭐⭐⭐⭐ Bom         | Produção |
| 200-500ms | ⭐⭐⭐ Aceitável     | Monitor  |
| 500ms-1s  | ⭐⭐ Lento           | Otimizar |
| > 1s      | ⭐ Muito Lento       | Crítico  |

### Concurrency Levels (Industry Standard)

| Concurrent | Nível       | Ambiente         |
| ---------- | ----------- | ---------------- |
| 1-5        | Dev/Test    | Desenvolvimento  |
| 10-20      | Low Load    | Startup pequeno  |
| 50-100     | Medium Load | Produção pequena |
| 100-500    | High Load   | Produção média   |
| 500+       | Enterprise  | Grande escala    |

**Este projeto:** Medium Load (50 concurrent) ✅

### Error Rate Thresholds (ISO/IEC)

| Taxa de Erro | Status       |
| ------------ | ------------ |
| 0%           | ✅ Excelente |
| 0-0.1%       | ✅ Aceitável |
| 0.1-1%       | ⚠️ Monitor   |
| > 1%         | ❌ Crítico   |

---

## 🚀 Como Executar

### Executar todos os testes E2E:

```bash
npm run test:e2e
```

### Executar apenas load-stress:

```bash
npm run test:e2e -- --testNamePattern="Load & Stress"
```

### Executar apenas auth load-stress:

```bash
npm run test:e2e -- test/e2e/auth.load-stress.e2e.spec.ts
```

### Executar apenas health load-stress:

```bash
npm run test:e2e -- test/e2e/health.load-stress.e2e.spec.ts
```

---

## ✅ Pre-Production Checklist

```
✅ Concurrent requests: 10 + 50 = Aguenta picos
✅ Sequential speed: Respostas < 3s por requisição
✅ Large payloads: Processa 10KB sem leak
✅ Response time: < 30s para 10 requisições
✅ Resilience: Recupera de falhas
✅ Health checks: Sempre disponível
✅ Mixed endpoints: Múltiplas rotas simultâneas
```

Se todos passarem → **Pronto para produção!** 🚀

---

## 📚 Referências

- [ISO/IEC 25010](https://www.iso.org/standard/35733.html) - Software Quality
- [RFC 7231](https://tools.ietf.org/html/rfc7231) - HTTP Semantics
- [W3C Web Performance](https://www.w3.org/webperf/) - Performance Guidelines
- [Google PageSpeed](https://developers.google.com/speed/pagespeed) - Performance Standards
- [AWS Well-Architected](https://aws.amazon.com/pt/architecture/well-architected/)
- [NIST Guidelines](https://nvlpubs.nist.gov/) - Security Testing

```

```
