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
