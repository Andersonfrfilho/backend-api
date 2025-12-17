# Naming Conventions - Padrão Completo do Projeto

## Regra Geral

### Padrão de Nomenclatura de Arquivos

```
[module]-[layer]-[feature].[suffix].ts
```

**Exemplo:**

- `user-infrastructure.controller.ts` - Controller do módulo user na camada infrastructure
- `user-application.service.ts` - Serviço do módulo user na camada application
- `auth-infrastructure.repository.ts` - Repositório do módulo auth na camada infrastructure

### Sufixos Padrão (em kebab-case)

| Camada             | Tipo              | Sufixo            | Exemplo                         |
| ------------------ | ----------------- | ----------------- | ------------------------------- |
| **Domain**         | Interface         | `.interface.ts`   | `user.repository.interface.ts`  |
| **Domain**         | Entity            | `.entity.ts`      | `user.entity.ts`                |
| **Domain**         | Exception/Error   | `.error.ts`       | `app.error.ts`                  |
| **Domain**         | Constant          | `.constant.ts`    | `log.constant.ts`               |
| **Domain**         | Enum              | `.enum.ts`        | `log.enum.ts`                   |
| **Application**    | Use Case          | `.use-case.ts`    | `create-user.use-case.ts`       |
| **Application**    | Interface/Service | `.interface.ts`   | `user-service.interface.ts`     |
| **Application**    | DTO               | `.dto.ts`         | `create-user.dto.ts`            |
| **Infrastructure** | Controller        | `.controller.ts`  | `user.controller.ts`            |
| **Infrastructure** | Service           | `.service.ts`     | `user.service.ts`               |
| **Infrastructure** | Repository        | `.repository.ts`  | `user.repository.ts`            |
| **Infrastructure** | Module            | `.module.ts`      | `user.module.ts`                |
| **Infrastructure** | Token (DI)        | `.token.ts`       | `user.token.ts`                 |
| **Infrastructure** | Guard             | `.guard.ts`       | `auth.guard.ts`                 |
| **Infrastructure** | Interceptor       | `.interceptor.ts` | `transform-body.interceptor.ts` |
| **Infrastructure** | Middleware        | `.middleware.ts`  | `cors.middleware.ts`            |
| **Infrastructure** | Filter            | `.ts`             | `error-filter.ts`               |
| **Shared**         | Helper/Utility    | `.ts`             | `logger.ts`                     |

---

## Estrutura de Pastas (Clean Architecture)

```
src/modules/
├── [module-name]/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── [module].entity.ts
│   │   ├── repositories/
│   │   │   └── [module].repository.interface.ts
│   │   ├── exceptions/
│   │   │   └── [module].exceptions.ts
│   │   └── types/
│   │       └── [module].types.ts
│   │
│   ├── application/
│   │   ├── use-cases/
│   │   │   └── [feature].use-case.ts
│   │   ├── dtos/
│   │   │   └── [feature].dto.ts
│   │   └── interfaces/
│   │       └── [feature].interface.ts
│   │
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── [module].repository.ts
│   │   ├── [module].controller.ts
│   │   ├── [module].service.ts
│   │   ├── [module].token.ts
│   │   ├── [module].module.ts
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── strategies/
│   │
│   ├── shared/
│   │   └── dtos/
│   │       └── [feature].dto.ts
│   │
│   └── [module].module.ts (root module)
```

---

## Convenções por Módulo

### ✅ USER Module

```
user/
├── domain/
│   ├── entities/ → user.entity.ts
│   ├── repositories/ → user.repository.interface.ts
│   └── types/ → user.types.ts
├── application/
│   ├── use-cases/ → create-user.use-case.ts
│   ├── dtos/ → (empty, use shared)
│   └── interfaces/ → create-user.interface.ts
├── infrastructure/
│   ├── repositories/ → user.repository.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.token.ts
│   └── user.module.ts
├── shared/
│   └── dtos/
│       ├── create-user-request.dto.ts
│       └── create-user-response.dto.ts
└── user.module.ts
```

### ✅ AUTH Module

```
auth/
├── domain/
│   ├── auth.exceptions.ts
│   ├── auth.login-session.interface.ts
│   └── types/ (if needed)
├── application/
│   ├── use-cases/ → auth-login-session.use-case.ts
│   └── interfaces/ → auth-login-session.interface.ts
├── infrastructure/
│   ├── auth.controller.ts
│   ├── services/ → auth-login-session.service.ts
│   ├── guards/ → jwt-auth.guard.ts, roles.guard.ts
│   ├── strategies/ → mock-jwt.strategy.ts
│   ├── decorators/ → roles.decorator.ts
│   ├── auth.token.ts
│   └── auth.module.ts
├── shared/
│   └── dtos/
│       ├── login-session-request.dto.ts
│       └── login-session-response.dto.ts
└── auth.module.ts
```

### ✅ HEALTH Module

```
health/
├── domain/
│   └── health.get.interface.ts
├── application/
│   ├── use-cases/ → health.get.use-case.ts
│   └── interfaces/ → (health.get.interface.ts in domain)
├── infrastructure/
│   ├── services/ → health.service.ts
│   ├── health.controller.ts
│   ├── health.token.ts
│   └── health.module.ts
├── shared/
│   └── dtos/ → health.dto.ts
└── health.module.ts
```

### ✅ ERROR Module

```
error/
├── domain/
│   └── app.error.ts
├── application/
│   └── app.error.factory.ts
├── infrastructure/
│   ├── filters/ → error-filter.ts
│   └── error.module.ts
├── dtos/ → errors.dto.ts
└── error.module.ts
```

### ✅ SHARED Module

```
shared/
├── domain/
│   ├── entities/ → *.entity.ts
│   ├── interfaces/ → *.interface.ts
│   ├── enums/ → *.enum.ts
│   └── constants/ → *.constant.ts
├── infrastructure/
│   ├── providers/
│   │   ├── database/ → postgres.provider.ts
│   │   └── log/ → log.provider.ts
│   ├── interceptors/ → *.interceptor.ts
│   ├── middleware/ → *.middleware.ts
│   └── shared.module.ts
└── shared.module.ts
```

---

## Resumo das Mudanças NECESSÁRIAS

### ✅ PADRONIZAÇÃO CONCLUÍDA!

Renomeações executadas:

- ✅ `user-infrastructure.service.ts` → `user.service.ts` (agora sem prefixo redundante)
- ✅ Imports atualizados em 2 arquivos
- ✅ `app.error.ts` (não `AppError.ts`)
- ✅ `create-user.use-case.ts`
- ✅ `user.repository.ts`
- ✅ `user.controller.ts`
- ✅ `user.token.ts`
- ✅ `health.get.use-case.ts`
- ✅ `login-session-request.dto.ts`
- ✅ `login-session-response.dto.ts`
- ✅ Todos em kebab-case ✓

**Padrão Final Adotado: OPÇÃO A (SEM PREFIXO)**

- Arquivos em `/infrastructure` não têm prefixo "infrastructure"
- Interfaces em `/domain` têm sufixo `.interface.ts`
- Locais de armazenagem deixam explícita a camada

---

## Imports Padrão

```typescript
// ✅ CORRETO - usar @modules alias
import { User } from '@modules/shared/domain/entities/user.entity';
import { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';

// ❌ ERRADO - não usar caminhos relativos
import { User } from '../../../shared/domain/entities/user.entity';
```

---

## Conclusão

O projeto **JÁ ESTÁ PADRONIZADO CORRETAMENTE**. Nenhuma mudança necessária!
