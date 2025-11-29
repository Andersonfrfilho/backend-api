# Arquitetura Clean Architecture - Backend API

## Fluxo de Orquestração

```
UserController (infrastructure/)
    ↓
    └→ UserInfrastructureService (infrastructure/services/)
         ↓
         └→ CreateUserUseCase (application/use-cases/)
              ↓
              └→ UserRepository (infrastructure/repositories/)
                   ↓
                   └→ User Entity (shared/domain/entities/)
```

## Estrutura por Camada

### 1. Controller (Infrastructure Layer)
**Arquivo:** `infrastructure/user.controller.ts`
- Recebe requisições HTTP
- Valida request/response
- Injeta UserInfrastructureService

**Exemplo:**
```typescript
POST /users
↓
UserController.create(CreateUserDto)
```

### 2. Infrastructure Service (Infrastructure Layer)
**Arquivo:** `infrastructure/services/user.infrastructure.service.ts`
- Orquestra múltiplos use cases
- Coordena transações
- Lida com logging e tratamento de erros
- Detalhes técnicos

**Responsabilidades:**
- Chamar CreateUserUseCase
- Coordenar SendWelcomeEmailUseCase
- Coordenar CreateUserPhoneUseCase

### 3. Use Cases (Application Layer)
**Arquivo:** `application/use-cases/user.create.use-case.ts`
- Lógica de negócio pura
- Independente de frameworks
- Valida regras de negócio
- Chama repositories

**Exemplo:**
```typescript
CreateUserUseCase
├── Valida email único
├── Hash password
├── Chama UserRepository.create()
└── Retorna User criado
```

### 4. Repository (Infrastructure Layer)
**Arquivo:** `infrastructure/repositories/user.repository.ts`
- Acesso e persistência de dados
- Implementa interface do domain
- Usa TypeORM

**Responsabilidades:**
- `create(user)` - Cria novo usuário
- `findById(id)` - Busca por ID
- `findByEmail(email)` - Busca por email
- `update(id, user)` - Atualiza usuário
- `delete(id)` - Deleta usuário

### 5. Entity (Domain Layer)
**Arquivo:** `shared/domain/entities/user.entity.ts`
- Modelo de dados
- Relacionamentos
- Lógica de entidade

## Fluxo Completo de Uma Requisição

```
1. HTTP Request (POST /users)
   ↓
2. UserController.create(CreateUserDto)
   ├─ Validação básica do DTO
   └─ Injeta UserInfrastructureService
   ↓
3. UserInfrastructureService.createUser(dto)
   ├─ Coordena transação
   ├─ Injeta CreateUserUseCase
   └─ Trata erros
   ↓
4. CreateUserUseCase.execute(dto)
   ├─ Validações de negócio
   ├─ Injeta UserRepository
   └─ Chama create()
   ↓
5. UserRepository.create(user)
   ├─ Usa TypeORM
   ├─ Persiste no PostgreSQL
   └─ Retorna User entity
   ↓
6. Response HTTP 201 Created
   └─ JSON com usuário criado
```

## Injeção de Dependências (NestJS)

```typescript
// user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserInfrastructureService,
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY_PROVIDE,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
```

## Princípios Aplicados

✅ **SOLID Principles:**
- Single Responsibility: Cada classe tem uma responsabilidade
- Open/Closed: Aberta para extensão, fechada para modificação
- Liskov Substitution: Repository implementa interface
- Interface Segregation: Interfaces específicas
- Dependency Inversion: Depende de abstrações (interfaces)

✅ **Clean Architecture:**
- Independência de frameworks
- Testabilidade alta
- Separação clara de responsabilidades
- Regras de negócio isoladas

✅ **Domain-Driven Design:**
- Entidades no domain
- Use cases representam ações de negócio
- Repository abstrai persistência
