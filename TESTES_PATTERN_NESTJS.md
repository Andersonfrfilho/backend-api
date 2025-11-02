# 🧪 Padrão de Testes NestJS - Test.createTestingModule

**Data:** 01 de Novembro de 2025  
**Status:** ✅ Implementado com sucesso

---

## 📋 Resumo da Mudança

Refatorei os testes dos controllers para usar a **abordagem oficial do NestJS** com `Test.createTestingModule`, que é mais robusta, segue o padrão recomendado e permite um melhor isolamento de dependências.

---

## 🔄 Antes vs. Depois

### ❌ ANTES (Abordagem Simplificada)

```typescript
describe('HealthController', () => {
  let controller: HealthController;
  let mockService: HealthCheckServiceInterface;

  beforeEach(() => {
    // Instanciar manualmente sem módulo
    mockService = {
      execute: jest.fn().mockReturnValue(...)
    } as any;

    controller = new HealthController(mockService);
  });

  // Testes...
});
```

**Problemas:**
- ❌ Não utiliza o módulo NestJS
- ❌ Injeção manual de dependências
- ❌ Não simula o ambiente real
- ❌ Sem validação de providers

### ✅ DEPOIS (Abordagem Oficial NestJS)

```typescript
describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthCheckServiceInterface;

  beforeEach(async () => {
    const mockService = {
      execute: jest.fn().mockReturnValue(...)
    } as unknown as HealthCheckServiceInterface;

    // Usar Test.createTestingModule
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_CHECK_SERVICE_PROVIDER,
          useValue: mockService,
        },
      ],
    }).compile();

    // Injetar via módulo (como em produção)
    controller = moduleRef.get<HealthController>(HealthController);
    service = moduleRef.get<HealthCheckServiceInterface>(HEALTH_CHECK_SERVICE_PROVIDER);
  });

  // Testes...
});
```

**Benefícios:**
- ✅ Usa `Test.createTestingModule` oficial do NestJS
- ✅ Simula ambiente real com módulo
- ✅ Injeção via DI (como em produção)
- ✅ Validação de providers
- ✅ Melhor controle de dependências
- ✅ Padrão recomendado na documentação do NestJS

---

## 🏗️ Estrutura do Padrão

### 1. Criar Mock do Service/Provider

```typescript
const mockService = {
  execute: jest.fn().mockResolvedValue({
    accessToken: 'mocked-token',
    refreshToken: 'mocked-refresh',
  }),
} as unknown as AuthLoginSessionServiceInterface;
```

### 2. Criar Módulo de Teste

```typescript
const moduleRef: TestingModule = await Test.createTestingModule({
  controllers: [AuthController],          // Controllers a testar
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,  // Token do provider
      useValue: mockService,                         // Mock
    },
  ],
}).compile();                              // Compilar módulo
```

### 3. Obter Instâncias do Módulo

```typescript
// Pegar controller do módulo compilado
controller = moduleRef.get<AuthController>(AuthController);

// Pegar service injetado (para assertions)
service = moduleRef.get<AuthLoginSessionServiceInterface>(
  AUTH_LOGIN_SESSION_SERVICE_PROVIDE
);
```

### 4. Usar nos Testes

```typescript
it('should call service.execute with request dto', async () => {
  const input: AuthLoginSessionRequestDto = {
    email: 'test@example.com',
    password: 'Test@1234',
  };

  await controller.loginSession(input);

  // Verificar chamada via mock
  const mockExecute = service.execute as jest.Mock;
  expect(mockExecute).toHaveBeenCalledWith(input);
});
```

---

## 📚 Padrão Completo - Health Controller

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HEALTH_CHECK_SERVICE_PROVIDER } from './infrastructure/health.provider';
import type { HealthCheckServiceInterface } from './domain/health.get.interface';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthCheckServiceInterface;

  beforeEach(async () => {
    // 1. Criar mock
    const mockService = {
      execute: jest.fn().mockReturnValue({
        status: true,
        message: 'Health check passed',
      }),
    } as unknown as HealthCheckServiceInterface;

    // 2. Criar módulo de teste
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_CHECK_SERVICE_PROVIDER,
          useValue: mockService,
        },
      ],
    }).compile();

    // 3. Obter instâncias
    controller = moduleRef.get<HealthController>(HealthController);
    service = moduleRef.get<HealthCheckServiceInterface>(
      HEALTH_CHECK_SERVICE_PROVIDER
    );
  });

  describe('check', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call service.execute', () => {
      controller.check();

      const mockExecute = service.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should return health check response', () => {
      const result = controller.check();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result.status).toBe(true);
    });
  });
});
```

---

## 🔧 Tipos de Providers Mock

### 1. **useValue** - Valor estático

```typescript
{
  provide: HEALTH_CHECK_SERVICE_PROVIDER,
  useValue: mockService,  // Valor direto
}
```

### 2. **useClass** - Classe mock

```typescript
class MockHealthCheckService implements HealthCheckServiceInterface {
  execute() {
    return { status: true, message: 'Healthy' };
  }
}

{
  provide: HEALTH_CHECK_SERVICE_PROVIDER,
  useClass: MockHealthCheckService,
}
```

### 3. **useFactory** - Factory function

```typescript
{
  provide: HEALTH_CHECK_SERVICE_PROVIDER,
  useFactory: () => ({
    execute: jest.fn().mockReturnValue(...)
  }),
}
```

---

## 🎯 Vantagens da Abordagem NestJS

| Aspecto | Anterior | NestJS (Atual) |
|---------|----------|----------------|
| **Módulo** | Manual | ✅ Test.createTestingModule |
| **Injeção** | Manual | ✅ Via DI |
| **Providers** | Ad-hoc | ✅ Registrados |
| **Simulação** | Limitada | ✅ Realista |
| **Documentação** | - | ✅ Padrão oficial |
| **Type Safety** | Limitada | ✅ Completa |
| **Escalabilidade** | Ruim | ✅ Excelente |

---

## 📊 Testes Aplicados

### Health Module
```
✅ health.controller.spec.ts (usando Test.createTestingModule)
✅ health.check.service.spec.ts (5 testes)
✅ health.get.use-case.spec.ts (5 testes)
```

### Auth Module
```
✅ auth.controller.spec.ts (usando Test.createTestingModule)
✅ auth.login-session.service.spec.ts (7 testes)
✅ auth-login-session.use-case.spec.ts (7 testes)
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Testar Chamada com Parâmetros

```typescript
it('should call service.execute with request dto', async () => {
  const input: AuthLoginSessionRequestDto = {
    email: 'test@example.com',
    password: 'Test@1234',
  };

  await controller.loginSession(input);

  const mockExecute = service.execute as jest.Mock;
  expect(mockExecute).toHaveBeenCalledWith(input);
  expect(mockExecute).toHaveBeenCalledTimes(1);
});
```

### Exemplo 2: Testar Resposta

```typescript
it('should return login session response', async () => {
  const input: AuthLoginSessionRequestDto = {
    email: 'test@example.com',
    password: 'Test@1234',
  };

  const result = await controller.loginSession(input);

  expect(result).toBeDefined();
  expect(result).toHaveProperty('accessToken');
  expect(result).toHaveProperty('refreshToken');
});
```

### Exemplo 3: Testar Erro

```typescript
it('should propagate service errors', async () => {
  const input: AuthLoginSessionRequestDto = {
    email: 'test@example.com',
    password: 'Test@1234',
  };
  const error = new Error('Service Error');
  
  const mockExecute = service.execute as jest.Mock;
  mockExecute.mockRejectedValueOnce(error);

  await expect(
    controller.loginSession(input)
  ).rejects.toThrow(error);
});
```

---

## ✅ Resultados Finais

```
Test Suites: 6 passed, 6 total       ✅
Tests:       36 passed, 36 total     ✅
Time:        ~2.3 segundos
Status:      TODOS PASSANDO
```

---

## 📖 Referências

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Test.createTestingModule API](https://docs.nestjs.com/fundamentals/testing#unit-testing)
- [Jest Mocking](https://jestjs.io/docs/mock-functions)
- [NestJS DI System](https://docs.nestjs.com/providers)

---

## 🎓 Aprendizados

### ✅ O que foi aprendido

1. **Test.createTestingModule** é o padrão oficial do NestJS
2. Permite simular o ambiente real com módulos
3. Usa o sistema de DI do NestJS
4. Melhor controle de dependências
5. Type safety completa
6. Mais escalável e manutenível

### 🚀 Próximos Passos

1. Aplicar padrão a outros módulos (error, shared)
2. Adicionar testes de integração (E2E)
3. Configurar coverage thresholds
4. Documentar patterns para novos testes

---

**Status:** ✅ IMPLEMENTADO COM SUCESSO - Todos os 36 testes passando usando padrão oficial do NestJS!
