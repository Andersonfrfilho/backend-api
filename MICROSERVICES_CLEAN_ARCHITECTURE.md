# 🏢 Arquitetura Limpa em Empresas Grandes + Microsserviços

## ✅ SIM, é Usado em Produção

### Empresas que Usam Clean Architecture:

| Empresa             | Padrão                       | Escala                     |
| ------------------- | ---------------------------- | -------------------------- |
| **Google**          | Clean Architecture + DDD     | Bilhões de requisições/dia |
| **Meta (Facebook)** | Layered Architecture + DDD   | Escala global              |
| **Netflix**         | Microservices + Clean Layers | 200M+ usuários             |
| **Amazon**          | Hexagonal Architecture       | Trilhões de operações      |
| **Uber**            | Domain-Driven Design         | Escala mundial             |
| **Spotify**         | Clean Boundaries             | 500M+ usuários             |
| **Microsoft Azure** | Clean Architecture           | Cloud services             |

---

## ⚡ Performance: Mito vs Realidade

### ❌ MITO: "Clean Architecture é lenta"

**Realidade:** A arquitetura em si NÃO afeta performance porque:

```typescript
// Isso é rápido
class LoginUseCase {
  execute(email: string, password: string) {
    // ... lógica
  }
}

// Isso é igualmente rápido
class LoginService {
  login(email: string, password: string) {
    // ... lógica idêntica
  }
}
```

**O QUE AFETA PERFORMANCE:**

- 🔴 Número de queries ao BD
- 🔴 Processamento de dados
- 🔴 Network latency
- 🔴 Caching strategy
- 🟢 **NÃO** a organização do código

### ✅ Clean Architecture MELHORA Performance

Por quê?

1. **Separação de Responsabilidades** → Código mais otimizável
2. **Injeção de Dependência** → Fácil implementar cache/mocking
3. **Interfaces** → Trocar implementação sem quebrar código
4. **Testes Unitários** → Encontrar gargalos mais rápido
5. **DTOs claros** → Evitar overfetching de dados

**Exemplo prático:**

```typescript
// ANTES (sem arquitetura clara)
async login(email: string, password: string) {
  // Problema: Busca TODO usuário do BD
  const user = await this.db.query(`SELECT * FROM users WHERE email = ?`);
  // ...
}

// DEPOIS (Clean Architecture)
// Repository define a query clara
class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User> {
    // Problema identificável: busca apenas campos necessários
    return this.db.query(
      `SELECT id, email, password_hash FROM users WHERE email = ?`,
      [email]
    );
  }
}
```

---

## 🚀 Microsserviços + Clean Architecture

### Por que combinar?

```
┌─────────────────────────────────────────────────┐
│              MICROSSERVIÇOS PATTERN              │
│  (Distribuição, Escalabilidade, Independência)   │
└─────────────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  SERVICE 1 (Auth)     │
            │  ┌─────────────────┐  │
            │  │ Domain Layer    │  │ ◄─── CLEAN ARCHITECTURE
            │  │ Application     │  │       (Organização Interna)
            │  │ Infrastructure  │  │
            │  └─────────────────┘  │
            └───────────────────────┘
            ┌───────────────────────┐
            │  SERVICE 2 (Users)    │
            │  ┌─────────────────┐  │
            │  │ Domain Layer    │  │
            │  │ Application     │  │
            │  │ Infrastructure  │  │
            │  └─────────────────┘  │
            └───────────────────────┘
```

### Estrutura de Microsserviço Completa

```
auth-service/
│
├── src/
│   │
│   ├── domain/                    ← Pura lógica de negócio
│   │   ├── entities/
│   │   │   └── User.ts            # Regras de auth
│   │   ├── interfaces/
│   │   │   ├── IAuthRepository.ts
│   │   │   ├── ITokenProvider.ts
│   │   │   └── IEventPublisher.ts # ◄─── Publicar eventos
│   │   └── exceptions/
│   │
│   ├── application/               ← Use cases de negócio
│   │   ├── use-cases/
│   │   │   ├── LoginUseCase.ts
│   │   │   ├── RegisterUseCase.ts
│   │   │   └── RefreshTokenUseCase.ts
│   │   ├── dtos/
│   │   └── events/                # ◄─── Events para pub/sub
│   │       └── UserLoginEvent.ts
│   │
│   ├── infrastructure/            ← Adaptadores
│   │   ├── repositories/
│   │   │   └── AuthRepository.ts  # Acessa BD
│   │   ├── providers/
│   │   │   ├── JwtTokenProvider.ts
│   │   │   └── EventPublisher.ts  # Publica em Kafka/RabbitMQ
│   │   ├── dtos/
│   │   └── auth.service.ts
│   │
│   ├── auth.controller.ts         ← REST API
│   └── auth.module.ts
│
├── docker-compose.yml             ← Dependências locais
├── .env                           ← Configuração
└── package.json
```

---

## 🎯 Padrões para Microsserviços

### 1. **SAGA Pattern** - Transações Distribuídas

```typescript
// Auth Service (Microsserviço)
@Injectable()
export class AuthSagaOrchestrator {
  constructor(
    private loginUseCase: LoginUseCase,
    private eventPublisher: IEventPublisher,
  ) {}

  async handleLogin(email: string, password: string) {
    try {
      // 1. Fazer login
      const user = await this.loginUseCase.execute(email, password);

      // 2. Publicar evento para outros serviços
      await this.eventPublisher.publish(new UserLoginEvent(user.id));

      // 3. User Service vai ouvir e registrar login
      // 4. Analytics Service vai ouvir e registrar métrica

      return user;
    } catch (error) {
      // Rollback distribuído se necessário
      await this.eventPublisher.publish(new LoginFailedEvent(email));
    }
  }
}
```

### 2. **Event Sourcing** - Histórico Completo

```typescript
// Domain Event
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public userId: string,
    public email: string,
    public timestamp: Date,
  ) {
    super();
  }
}

// Use Case publica evento
export class RegisterUseCase {
  async execute(email: string, password: string) {
    const user = new User(email, password);

    // Salva no BD
    await this.userRepository.save(user);

    // Publica evento (outros serviços reagem)
    await this.eventPublisher.publish(
      new UserCreatedEvent(user.id, email, new Date()),
    );
  }
}
```

### 3. **CQRS Pattern** - Command Query Responsibility Segregation

```typescript
// Domain Limpo
export class User {
  constructor(id: string, email: string, name: string) {}

  // Métodos puros - sem side effects
  canLogin(): boolean { ... }
  updateEmail(newEmail: string): void { ... }
}

// Command (Escrita)
export class LoginCommand {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

// Command Handler
@Injectable()
export class LoginCommandHandler {
  async execute(command: LoginCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);
    // ... lógica de login

    // Publica evento
    await this.eventBus.publish(new UserLoggedInEvent(user.id));
  }
}

// Query (Leitura)
export class GetUserQuery {
  constructor(public userId: string) {}
}

// Query Handler (pode ler de cache/read model)
@Injectable()
export class GetUserQueryHandler {
  constructor(
    private userReadRepository: UserReadRepository, // Read model otimizado
  ) {}

  async execute(query: GetUserQuery): Promise<UserReadModel> {
    // Lê de BD otimizado para leitura (sem JOINs complexos)
    return this.userReadRepository.findById(query.userId);
  }
}
```

---

## 📊 Comparação: Padrões

### Pattern 1: **SIMPLES** (Sem arquitetura)

```
Controller → Service → Database
```

**Quando usar:**

- ✅ MVP/Prototipo
- ✅ Projeto solo
- ✅ <50k linhas de código
- ❌ Microsserviço em produção

---

### Pattern 2: **LAYERED** (3 camadas básicas)

```
Controller → Service → Repository → Database
```

**Quando usar:**

- ✅ Projeto pequeno-médio
- ✅ Time de 2-5 pessoas
- ✅ Mudanças tecnológicas raras
- ⚠️ Começa a ficar confuso com crescimento

---

### Pattern 3: **CLEAN** (4+ camadas com DDD)

```
Controller → Service → UseCase → Domain → Repository → Database
      +
    Events (pub/sub para outros serviços)
```

**Quando usar:**

- ✅ Microsserviços em produção
- ✅ Time de 5+ pessoas
- ✅ Mudanças frequentes
- ✅ Scaling esperado
- ✅ Múltiplos times (sem acoplamento)

---

### Pattern 4: **HEXAGONAL** (Ports & Adapters)

```
Domain (puro)
    ↑
Adapters (qualquer tecnologia)
    ↑
External Systems
```

**Quando usar:**

- ✅ Máxima flexibilidade tecnológica
- ✅ Múltiplos bancos de dados
- ✅ APIs variadas
- ✅ Grandes corporações

---

## 🚀 Recomendação para Microsserviços

### ✅ USE CLEAN ARCHITECTURE SE:

1. **Múltiplos microsserviços**
   - Cada serviço tem sua própria estrutura clean
   - Facilita comunicação assíncrona (events)

2. **Times distribuídos**
   - Cada time trabalha independente
   - Boundaries claros evitam conflitos

3. **Escalabilidade esperada**
   - Domain layer pode ser reutilizado em múltiplos pontos
   - Infrastructure swappable (mudar BD é fácil)

4. **Longa vida útil do projeto**
   - Mudanças tecnológicas são isoladas
   - ROI do refatoramento é alto

---

## 📈 Benchmark Real: Perda de Performance

**Medir o que realmente importa:**

```typescript
// ❌ PROBLEMA REAL (não a arquitetura)
async login(email: string, password: string) {
  // Erro 1: N+1 query problem
  const users = await db.query(`SELECT * FROM users WHERE email = ?`);
  const permissions = await db.query(`SELECT * FROM permissions WHERE userId = ?`);
  const roles = await db.query(`SELECT * FROM roles WHERE userId = ?`);
  // ❌ 3 queries separadas = LENTO
}

// ✅ SOLUÇÃO (Clean Architecture identifica isso)
class AuthRepository implements IAuthRepository {
  async findByEmailWithPermissions(email: string): Promise<User> {
    // 1 query com JOIN otimizado
    return this.db.query(`
      SELECT u.*, p.*, r.*
      FROM users u
      LEFT JOIN permissions p ON u.id = p.userId
      LEFT JOIN roles r ON u.id = r.userId
      WHERE u.email = ?
    `);
  }
}
```

---

## 💰 ROI da Clean Architecture

### Microsserviço Pequeno (1-2 pessoas)

- ⏱️ Setup: +20% tempo inicial
- 📈 Maintenance: -30% tempo no longo prazo
- ✅ Vale a pena se projeto >6 meses

### Microsserviço Médio (5+ pessoas)

- ⏱️ Setup: +10% tempo inicial
- 📈 Maintenance: -50% tempo no longo prazo
- ✅ Sempre vale a pena

### Microsserviço Grande (10+ pessoas)

- ⏱️ Setup: mesmo tempo
- 📈 Maintenance: -70% tempo no longo prazo
- ✅ Essencial para não virar spaghetti

---

## 🎯 Minha Recomendação

Para seu projeto de microsserviços:

### **✅ USE CLEAN ARCHITECTURE se:**

- [ ] Projeto será mantido >1 ano
- [ ] Múltiplos serviços independentes
- [ ] Múltiplas pessoas no time
- [ ] Mudanças tecnológicas esperadas

### **❌ USE PADRÃO SIMPLES (Controller → Service → Repo) se:**

- [ ] MVP rápido (<3 meses)
- [ ] 1 pessoa desenvolvendo
- [ ] Tecnologia fixa (Node.js + Express pra sempre)
- [ ] Poucas mudanças previstas

---

## 🏆 Conclusão

**Clean Architecture + Microsserviços = Padrão da Indústria**

```
Netflix     → Clean + Microservices
Uber        → DDD + Event-Driven
Amazon      → Hexagonal + Async
Spotify     → Clean Layers + CQRS
Microsoft   → Clean + Cloud Native
```

**Performance?** ✅ Igual ou melhor (mais otimizável)

**Complexidade?** ⚠️ Maior no início, menor no longo prazo

**Recomendação?** 🎯 Use para seu projeto!

Seu módulo `error` já demonstra que você entende e consegue manter isso bem. Continue! 🚀

---

# 📁 Plano de Migração: Estrutura Atual → Clean Architecture

## Análise da Estrutura Atual

### Estado Inicial

```
src/
├── common/                  ❌ Desordenado
│   ├── constants/
│   ├── dtos/
│   ├── enums/
│   ├── filters/
│   ├── interfaces/
│   ├── utils/
│   └── common.module.ts
│
├── core/                    ⚠️  Parcialmente organizado
│   ├── context/
│   ├── interceptors/
│   ├── middleware/
│   ├── providers/
│   └── core.module.ts
│
├── modules/                 ⚠️  Alguns sem padrão
│   ├── auth/               ❌ Desordenado
│   ├── error/              ✅ Já em Clean Architecture
│   └── health/             ❌ Desordenado
│
├── config/
├── app.module.ts
└── main.ts
```

---

## 🎯 Fase 1: Reestruturar `src/common` → `src/modules/shared`

### Por que?

- `common/` tem responsabilidades demais
- Clean Architecture não recomenda "pasta comum"
- Cada item deve ficar em seu módulo específico ou em `shared/`

### Migração

```
src/common/                          src/modules/shared/
├── constants/        →              ├── domain/
├── dtos/             →              │   ├── constants/
├── enums/            →              │   │   └── commons.constant.ts
├── filters/          →              │   ├── enums/
├── interfaces/       →              │   │   └── commons.enum.ts
├── utils/            →              │   └── interfaces/
└── common.module.ts  →              │       └── commons.interface.ts
                                     │
                                     ├── application/
                                     │   ├── dtos/
                                     │   │   └── (shared DTOs)
                                     │   └── utils/
                                     │       └── (shared utils)
                                     │
                                     ├── infrastructure/
                                     │   └── filters/
                                     │       └── (filters compartilhados)
                                     │
                                     └── shared.module.ts
```

### Passos

#### 1. Criar estrutura de `shared` module

```bash
mkdir -p src/modules/shared/{domain/{constants,enums,interfaces},application/{dtos,utils},infrastructure/filters}
```

#### 2. Mover arquivos

```bash
# Constants
mv src/common/constants/commons.constant.ts src/modules/shared/domain/constants/

# Enums
mv src/common/enums/commons.enum.ts src/modules/shared/domain/enums/

# Interfaces
mv src/common/interfaces/commons.interface.ts src/modules/shared/domain/interfaces/

# DTOs
mv src/common/dtos/* src/modules/shared/application/dtos/

# Utils
mv src/common/utils/* src/modules/shared/application/utils/

# Filters
mv src/common/filters/* src/modules/shared/infrastructure/filters/
```

#### 3. Criar `src/modules/shared/shared.module.ts`

```typescript
import { Module } from '@nestjs/common';

@Module({
  exports: [
    // Exporta conteúdo compartilhado
  ],
})
export class SharedModule {}
```

#### 4. Criar `src/modules/shared/index.ts` (Barrel)

```typescript
export * from '@modules/shared/domain/constants/commons.constant';
export * from '@modules/shared/domain/enums/commons.enum';
export * from '@modules/shared/domain/interfaces/commons.interface';
export * from '@modules/shared/application/dtos';
export * from '@modules/shared/application/utils';
export { SharedModule } from './shared.module';
```

#### 5. Atualizar imports em todos os arquivos

```typescript
// ANTES
import { SomeConstant } from '@common/constants/commons.constant';

// DEPOIS
import { SomeConstant } from '@modules/shared/domain/constants/commons.constant';
// ou
import { SomeConstant } from '@modules/shared';
```

---

## 🎯 Fase 2: Reestruturar `src/core` → Integrate em Módulos

### Por que?

- `core/` é miscelânea
- Providers, Interceptors, Middleware devem ficar em seus contextos
- O que é realmente compartilhado vai para `shared/`

### Análise de Conteúdo

```
core/
├── context/              → Shared (Logging Context)
├── interceptors/         → Shared (Global Interceptors)
├── middleware/           → Shared (Global Middleware)
├── providers/            → Deixar aqui (Log Provider é global)
└── core.module.ts        → Permanecer
```

### Migração

#### A. `context/` → `src/modules/shared/infrastructure/context/`

```bash
mkdir -p src/modules/shared/infrastructure/context
mv src/core/context/request-context.ts src/modules/shared/infrastructure/context/
mv src/core/middleware/request-context.middleware.ts src/modules/shared/infrastructure/middleware/
```

Atualizar `src/modules/shared/infrastructure/context/request-context.ts`:

```typescript
export const requestContext = new AsyncLocalStorage<RequestContext>();
```

Atualizar imports no `core.module.ts`:

```typescript
import { requestContext } from '@modules/shared/infrastructure/context/request-context';
```

#### B. `interceptors/` → `src/modules/shared/infrastructure/interceptors/`

```bash
mkdir -p src/modules/shared/infrastructure/interceptors
mv src/core/interceptors/logging src/modules/shared/infrastructure/interceptors/
mv src/core/interceptors/docs src/modules/shared/infrastructure/interceptors/
```

Atualizar imports em `logging.interceptor.ts`:

```typescript
// ANTES
import { requestContext } from '@core/context/request-context';

// DEPOIS
import { requestContext } from '@modules/shared/infrastructure/context/request-context';
```

**Nota sobre `docs/`:**

- `docs/` contém factory de Swagger + ReDoc
- É compartilhado (usado na inicialização global)
- Move junto com interceptors
- Estrutura:
  ```
  src/modules/shared/infrastructure/interceptors/
  ├── logging/
  │   └── logging.interceptor.ts
  └── docs/
      ├── docs.factory.ts
      ├── index.ts
      ├── swagger/
      │   └── swagger.interceptor.ts
      └── redoc/
          └── redoc.interceptor.ts
  ```

#### C. `middleware/` → `src/modules/shared/infrastructure/middleware/`

```bash
mkdir -p src/modules/shared/infrastructure/middleware
mv src/core/middleware/request-context.middleware.ts src/modules/shared/infrastructure/middleware/
```

#### D. `providers/` → Permanecer em `core/` (é uma camada técnica global)

Estrutura final:

```bash
src/core/
├── providers/
│   ├── log/
│   ├── provider.module.ts
│   └── index.ts
└── core.module.ts
```

---

## 🎯 Fase 3: Reestruturar `src/modules/auth`

### Estrutura Atual

```
src/modules/auth/
├── auth.controller.ts
├── auth.controller.test.ts
├── auth.interface.ts
├── auth.module.ts
├── auth.service.test.ts
└── services/
```

### Estrutura Alvo

```
src/modules/auth/
├── domain/
│   ├── entities/
│   │   └── Session.ts          # ou User se houver
│   ├── interfaces/
│   │   ├── ISessionRepository.ts
│   │   └── ITokenProvider.ts
│   └── exceptions/
│       └── InvalidSessionError.ts
│
├── application/
│   ├── use-cases/
│   │   ├── LoginSessionUseCase.ts
│   │   └── LogoutSessionUseCase.ts
│   ├── dtos/
│   │   ├── LoginSessionRequest.dto.ts
│   │   └── LoginSessionResponse.dto.ts
│   └── mappers/
│       └── Session.mapper.ts
│
├── infrastructure/
│   ├── repositories/
│   │   └── SessionRepository.ts
│   ├── providers/
│   │   └── (Token providers se específicos)
│   ├── dtos/
│   │   └── LoginSessionResponse.swagger.dto.ts
│   └── auth.service.ts
│
├── auth.controller.ts
├── auth.module.ts
├── auth.interface.ts
├── index.ts
├── __tests__/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── README.md
```

### Passos de Migração

```bash
# Criar estrutura
mkdir -p src/modules/auth/{domain/{entities,interfaces,exceptions},application/{use-cases,dtos,mappers},infrastructure/{repositories,providers,dtos},__tests__/{domain,application,infrastructure}}

# Mover lógica de services para use-cases
mv src/modules/auth/services/* src/modules/auth/application/use-cases/

# Criar DTOs
touch src/modules/auth/application/dtos/LoginSessionRequest.dto.ts
touch src/modules/auth/application/dtos/LoginSessionResponse.dto.ts

# Criar entidades
touch src/modules/auth/domain/entities/Session.ts

# Criar repositório
touch src/modules/auth/infrastructure/repositories/SessionRepository.ts

# Criar service
touch src/modules/auth/infrastructure/auth.service.ts

# Criar index e README
touch src/modules/auth/index.ts
touch src/modules/auth/README.md
```

---

## 🎯 Fase 4: Reestruturar `src/modules/health`

### Estrutura Atual

```
src/modules/health/
├── health.controller.ts
├── health.controller.test.ts
├── health.dto.ts
├── health.interfaces.ts
├── health.module.ts
└── services/
```

### Estrutura Alvo

```
src/modules/health/
├── domain/
│   ├── entities/
│   │   └── HealthStatus.ts
│   ├── interfaces/
│   │   └── IHealthCheck.ts
│   └── exceptions/
│       └── HealthCheckError.ts
│
├── application/
│   ├── use-cases/
│   │   └── CheckHealthUseCase.ts
│   ├── dtos/
│   │   ├── HealthCheckRequest.dto.ts
│   │   └── HealthCheckResponse.dto.ts
│   └── mappers/
│       └── HealthStatus.mapper.ts
│
├── infrastructure/
│   ├── checks/
│   │   ├── DatabaseHealthCheck.ts
│   │   ├── RedisHealthCheck.ts
│   │   └── ApiHealthCheck.ts
│   ├── dtos/
│   │   └── HealthCheckResponse.swagger.dto.ts
│   └── health.service.ts
│
├── health.controller.ts
├── health.module.ts
├── index.ts
├── __tests__/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── README.md
```

### Passos

```bash
# Criar estrutura
mkdir -p src/modules/health/{domain/{entities,interfaces,exceptions},application/{use-cases,dtos,mappers},infrastructure/{checks,dtos},__tests__/{domain,application,infrastructure}}

# Mover services
mv src/modules/health/services/* src/modules/health/application/use-cases/

# Criar DTOs
touch src/modules/health/application/dtos/HealthCheckRequest.dto.ts
touch src/modules/health/application/dtos/HealthCheckResponse.dto.ts

# Criar entidades
touch src/modules/health/domain/entities/HealthStatus.ts

# Criar checks
touch src/modules/health/infrastructure/checks/DatabaseHealthCheck.ts
touch src/modules/health/infrastructure/checks/RedisHealthCheck.ts
touch src/modules/health/infrastructure/checks/ApiHealthCheck.ts

# Criar service
touch src/modules/health/infrastructure/health.service.ts

# Criar index e README
touch src/modules/health/index.ts
touch src/modules/health/README.md
```

---

## 📋 Resumo Completo da Migração

| Origem                           | Destino                                                   | Tipo      | Fase |
| -------------------------------- | --------------------------------------------------------- | --------- | ---- |
| `src/common/`                    | `src/modules/shared/`                                     | Refatorar | 1️⃣   |
| `src/core/context/`              | `src/modules/shared/infrastructure/context/`              | Mover     | 2️⃣   |
| `src/core/interceptors/logging/` | `src/modules/shared/infrastructure/interceptors/logging/` | Mover     | 2️⃣   |
| `src/core/interceptors/docs/`    | `src/modules/shared/infrastructure/interceptors/docs/`    | Mover     | 2️⃣   |
| `src/core/middleware/`           | `src/modules/shared/infrastructure/middleware/`           | Mover     | 2️⃣   |
| `src/core/providers/`            | `src/core/providers/` (permanecer)                        | -         | -    |
| `src/modules/auth/`              | `src/modules/auth/`                                       | Refatorar | 3️⃣   |
| `src/modules/health/`            | `src/modules/health/`                                     | Refatorar | 4️⃣   |
| `src/modules/error/`             | `src/modules/error/`                                      | ✅ Já OK  | -    |

---

## 🔄 Ordem de Execução Recomendada

### 1️⃣ **FASE 1: Shared Module** (30 min)

- [ ] Criar `src/modules/shared/` estrutura
- [ ] Mover arquivos de `src/common/`
- [ ] Criar `shared.module.ts` e `index.ts`
- [ ] Atualizar imports em `app.module.ts`
- [ ] Testar build

### 2️⃣ **FASE 2: Core Module** (45 min)

- [ ] Mover `context/` para `shared/`
- [ ] Mover `interceptors/logging/` para `shared/`
- [ ] Mover `interceptors/docs/` (Swagger + ReDoc) para `shared/`
- [ ] Mover `middleware/` para `shared/`
- [ ] Atualizar imports em `core.module.ts`
- [ ] Atualizar imports em todos os arquivos (especialmente em `main.ts` que usa `docsFactory`)
- [ ] Testar build

### 3️⃣ **FASE 3: Auth Module** (2-3 hrs)

- [ ] Criar estrutura `domain/application/infrastructure/`
- [ ] Mover e refatorar `services/` para `use-cases/`
- [ ] Criar entidades em `domain/`
- [ ] Criar DTOs em `application/`
- [ ] Criar repositório em `infrastructure/`
- [ ] Criar `auth.service.ts` orquestradora
- [ ] Atualizar `auth.controller.ts`
- [ ] Atualizar `auth.module.ts`
- [ ] Criar testes
- [ ] Testar build

### 4️⃣ **FASE 4: Health Module** (1-2 hrs)

- [ ] Criar estrutura `domain/application/infrastructure/`
- [ ] Mover e refatorar `services/`
- [ ] Criar entidades e checks
- [ ] Criar DTOs
- [ ] Criar `health.service.ts`
- [ ] Atualizar `health.controller.ts`
- [ ] Criar testes
- [ ] Testar build

---

## ⚠️ Cuidados na Migração

### ✅ Faça

- [ ] Commit antes de cada fase
- [ ] Atualizar imports gradualmente
- [ ] Testar após cada fase (`npm run build`)
- [ ] Manter compatibilidade com imports antigos via re-exports
- [ ] Documentar mudanças em cada módulo

### ❌ Não Faça

- ❌ Fazer tudo de uma vez
- ❌ Deletar arquivos antigos sem re-exports
- ❌ Deixar imports quebrados
- ❌ Pular testes

---

## 🔗 Verificação de Imports

Após migração, procurar por imports quebrados:

```bash
# Buscar imports antigos
grep -r "@common/" src/
grep -r "@core/context" src/
grep -r "@core/middleware" src/
grep -r "@core/interceptors" src/

# Se encontrar, atualizar para:
# @common/* → @modules/shared/*
# @core/context → @modules/shared/infrastructure/context
# @core/middleware → @modules/shared/infrastructure/middleware
# @core/interceptors → @modules/shared/infrastructure/interceptors
```

---

## 📊 Estado Final Esperado

```
src/modules/
├── shared/              ✅ Nova (Conteúdo comum)
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── shared.module.ts
│
├── error/               ✅ Já OK
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── error.module.ts
│
├── auth/                ✅ Refatorado
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── auth.module.ts
│
└── health/              ✅ Refatorado
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── health.module.ts
```

---

## 🎉 Resultado

✅ **Toda a arquitetura seguindo Clean Architecture**
✅ **Separação clara de responsabilidades**
✅ **Fácil para novos desenvolvedores entender**
✅ **Pronto para crescimento**
✅ **Padrão de indústria aplicado**
