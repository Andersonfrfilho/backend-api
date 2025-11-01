# 🔐 Auth Module

Módulo de autenticação responsável por gerenciar login de sessão de usuários e geração de tokens de acesso.

---

## 📋 Visão Geral

O módulo Auth implementa **Clean Architecture** com separação clara de responsabilidades em 3 camadas:

- **Domain**: Contratos puros sem dependências externas
- **Application**: Lógica de negócio (Use Cases)
- **Infrastructure**: Implementações e orquestração

---

## 🏗️ Arquitetura

### Domain Layer (`domain/`)

Define os contratos puros do módulo:

```typescript
// auth.login-session.interface.ts
export interface AuthLoginSessionUseCaseInterface {
  execute(params: AuthLoginSessionUseCaseParams): Promise<AuthLoginSessionUseCaseResponse>;
}

export interface AuthLoginSessionServiceInterface {
  execute(params: AuthLoginSessionServiceParams): Promise<AuthLoginSessionServiceResponse>;
}
```

**Responsabilidades**:

- Define interfaces do UseCase e Service
- Garante contrato claro entre camadas
- Sem dependências de frameworks

**Arquivos**:

- `auth.login-session.interface.ts` - Interfaces do caso de uso
- `exceptions.ts` - Exceções de domínio

---

### Application Layer (`application/`)

Contém a lógica de negócio pura e Use Cases:

```typescript
// use-cases/auth-login-session.use-case.ts
@Injectable()
export class AuthLoginSessionUseCase implements AuthLoginSessionUseCaseInterface {
  execute(params: AuthLoginSessionUseCaseParamsDto): Promise<AuthLoginSessionUseCaseResponseDto> {
    // Lógica pura: gera tokens, sem logs, sem dependências
    return {
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
    };
  }
}
```

**Responsabilidades**:

- Implementa lógica de negócio pura
- Sem logs, sem HTTP, sem banco de dados
- Fácil de testar (sem dependências externas)

**Arquivos**:

- `use-cases/auth-login-session.use-case.ts` - UseCase de login
- `use-cases/auth-login-session.use-case.spec.ts` - Testes unitários
- `auth.use-cases.module.ts` - Módulo NestJS dos UseCases

---

### Infrastructure Layer (`infrastructure/`)

Adaptadores, orquestração e implementações:

```typescript
// service/auth-login-session.service.ts
@Injectable()
export class AuthLoginSessionService implements AuthLoginSessionServiceInterface {
  constructor(
    @Inject(LOG_PROVIDER) private readonly loggerProvider: LogProviderInterface,
    @Inject(AUTH_LOGIN_SESSION_USE_CASE_PROVIDE)
    private readonly authLoginSessionUseCase: AuthLoginSessionUseCaseInterface,
  ) {}

  async execute(params: AuthLoginSessionServiceParams): Promise<AuthLoginSessionServiceResponse> {
    // Orquestra UseCase + Logs
    this.loggerProvider.info({
      context: 'AuthLoginSessionService - execute',
      params,
    });
    return this.authLoginSessionUseCase.execute(params);
  }
}
```

**Responsabilidades**:

- Orquestra Use Cases
- Adiciona logs e observabilidade
- Conecta com banco de dados (quando necessário)
- Gerencia dependências

**Arquivos**:

- `service/auth-login-session.service.ts` - Service orquestradora
- `service/auth.service.module.ts` - Módulo NestJS do Service
- `auth.provider.ts` - Tokens de provider (injeção de dependência)

---

### Shared Layer (`shared/`)

DTOs compartilhados entre camadas com validação:

```typescript
// dtos/auth-login-session-request.dto.ts
export class AuthLoginSessionRequestDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'SecurePassword123!',
  })
  @IsStrongPassword()
  password: string;
}
```

**Responsabilidades**:

- DTOs base com decoradores de validação (`@IsEmail`, `@IsStrongPassword`)
- Compartilhados entre Controller, Service e UseCase
- Reutilizáveis sem duplicação

**Arquivos**:

- `dtos/auth-login-session-request.dto.ts` - DTO de request com validação
- `dtos/auth-login-session-response.dto.ts` - DTO de response
- `dtos/index.ts` - Exports centralizados

---

## 🔄 Fluxo de Execução

```
┌─────────────────────────────────────────────────────────────┐
│                      HTTP REQUEST                            │
│              POST /v1/auth/login-session                     │
│           Body: { email, password }                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   VALIDATION PIPE            │
        │  - @IsEmail()                │
        │  - @IsStrongPassword()       │
        └──────────────┬───────────────┘
                       │ (DTO validado)
                       ▼
        ┌──────────────────────────────────────┐
        │   CONTROLLER                         │
        │  - Recebe AuthLoginSessionRequestDto │
        │  - Chama Service.execute(params)     │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │   SERVICE (Orquestra)                │
        │  - Adiciona logs                     │
        │  - Chama UseCase.execute(params)     │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │   USE CASE (Lógica Pura)             │
        │  - Valida credenciais                │
        │  - Gera tokens                       │
        │  - Retorna Response                  │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │   HTTP RESPONSE 200 OK               │
        │  {                                   │
        │    "accessToken": "jwt...",          │
        │    "refreshToken": "jwt..."          │
        │  }                                   │
        └──────────────────────────────────────┘
```

---

## 🚀 Como Usar

### 1. Chamada de Login

```bash
curl -X POST http://localhost:3333/v1/auth/login-session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### 2. Resposta Bem-Sucedida (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Erros de Validação (400 Bad Request)

```json
{
  "statusCode": 400,
  "timestamp": "2025-11-01T12:00:00Z",
  "path": "/v1/auth/login-session",
  "message": "Validation failed",
  "details": {
    "email": {
      "isEmail": "email must be an email"
    },
    "password": {
      "isStrongPassword": "password is not strong enough"
    }
  }
}
```

---

## 📦 DTOs

### AuthLoginSessionRequestDto (Request)

```typescript
{
  "email": "user@example.com",      // @IsEmail() - Validado
  "password": "SecurePass123!"      // @IsStrongPassword() - Validado
}
```

**Validações**:

- `email`: Deve ser um email válido
- `password`: Deve ter comprimento mínimo, incluir maiúsculas, minúsculas, números e caracteres especiais

---

### AuthLoginSessionResponseDto (Response)

```typescript
{
  "accessToken": "jwt_token_string",    // Token JWT de acesso
  "refreshToken": "jwt_token_string"    // Token JWT para renovação
}
```

---

## 🧪 Testes

### Executar Testes do UseCase

```bash
npm run test -- auth-login-session.use-case.spec.ts
```

### Executar Todos os Testes do Módulo

```bash
npm run test -- src/modules/auth
```

### Cobertura de Testes

```bash
npm run test:cov -- src/modules/auth
```

---

## 🔌 Injeção de Dependência

### Usar no Controller

```typescript
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';
import type { AuthLoginSessionServiceInterface } from '@modules/auth/domain/auth.login-session.interface';

@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(AUTH_LOGIN_SESSION_SERVICE_PROVIDE)
    private readonly authService: AuthLoginSessionServiceInterface,
  ) {}

  @Post('/login-session')
  async loginSession(@Body() params: AuthLoginSessionRequestDto) {
    return this.authService.execute(params);
  }
}
```

### Usar em Outro Módulo

```typescript
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  // ...
})
export class YourModule {}
```

---

## 🛠️ Estrutura de Arquivos

```
src/modules/auth/
├── domain/
│   ├── auth.login-session.interface.ts  # Interfaces puras
│   └── exceptions.ts                    # Exceções de domínio
│
├── application/
│   ├── auth.use-cases.module.ts         # Módulo de UseCases
│   └── use-cases/
│       ├── auth-login-session.use-case.ts
│       └── auth-login-session.use-case.spec.ts
│
├── infrastructure/
│   ├── auth.provider.ts                 # Provider tokens
│   └── service/
│       ├── auth.service.module.ts       # Módulo de Services
│       └── auth-login-session.service.ts
│
├── shared/
│   └── dtos/
│       ├── auth-login-session-request.dto.ts
│       ├── auth-login-session-response.dto.ts
│       └── index.ts
│
├── auth.controller.ts                   # HTTP Endpoint
├── auth.module.ts                       # Módulo Principal
└── README.md                            # Este arquivo
```

---

## 🔐 Segurança

### Validação de Senha

A senha deve atender aos seguintes critérios:

- ✅ Mínimo de 8 caracteres
- ✅ Pelo menos uma letra maiúscula
- ✅ Pelo menos uma letra minúscula
- ✅ Pelo menos um número
- ✅ Pelo menos um caractere especial (!@#$%^&\*)

### Validação de Email

O email é validado usando padrão RFC 5322 através do decorador `@IsEmail()`.

---

## 🚀 Próximas Melhorias

- [ ] Implementar persistência de usuários (UserRepository)
- [ ] Implementar JWT Provider para geração de tokens reais
- [ ] Implementar refresh token rotation logic
- [ ] Adicionar integração com banco de dados (PostgreSQL/MongoDB)
- [ ] Implementar logout (invalidar tokens)
- [ ] Adicionar 2FA (Two-Factor Authentication)
- [ ] Implementar rate limiting de tentativas de login
- [ ] Adicionar auditoria de logins

---

## 📚 Referências

- **Clean Architecture**: [The Clean Code Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- **NestJS Documentation**: [docs.nestjs.com](https://docs.nestjs.com)
- **class-validator**: [github.com/typestack/class-validator](https://github.com/typestack/class-validator)
- **JWT Tokens**: [jwt.io](https://jwt.io)

---

## 👥 Contribuindo

Para adicionar novas funcionalidades ao módulo Auth:

1. **Crie o UseCase** em `application/use-cases/`
2. **Defina a interface** em `domain/`
3. **Implemente o Service** em `infrastructure/service/`
4. **Adicione o endpoint** em `auth.controller.ts`
5. **Escreva testes** no `.spec.ts`
6. **Atualize este README**

---

## 📝 Versionamento

- **v1.0.0** - Login Session (Atual)
- **v1.1.0** - Planejado: Logout
- **v1.2.0** - Planejado: Refresh Token
- **v2.0.0** - Planejado: 2FA

---

**Última atualização**: 01 de Novembro de 2025  
**Mantido por**: Backend Team
