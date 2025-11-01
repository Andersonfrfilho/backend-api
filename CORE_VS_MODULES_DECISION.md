# 🎯 Por que Log Fica em `core/` e Não em `modules/`?

## A Dúvida

> "Se logging é um bounded context, por que não fica em `src/modules/log/`?"

Ótima pergunta! A resposta está na **diferença entre camadas globais e domínios de negócio**.

---

## 📍 Diferença: `core/` vs `modules/`

### `core/` - Infraestrutura Global

```
src/core/
├── providers/          ← Serviços técnicos globais
│   ├── log/           # Logging (precisa estar disponível PARA TUDO)
│   └── cache/         # Cache (se houvesse)
├── interceptors/      # Interceptors globais
├── middleware/        # Middleware global
└── core.module.ts
```

**Características:**

- ✅ Precisa estar disponível para **TODOS** os módulos
- ✅ É infraestrutura técnica, não domínio de negócio
- ✅ Carregado ANTES de qualquer módulo
- ✅ Sem dependências de módulos de negócio
- ✅ Máquina (técnico) ↔ Negócio (lógica)

### `modules/` - Domínios de Negócio

```
src/modules/
├── auth/              # Domínio: Autenticação
├── health/            # Domínio: Saúde do serviço
├── error/             # Domínio: Tratamento de erros
├── users/             # Domínio: Gestão de usuários
├── payments/          # Domínio: Pagamentos
└── shared/            # Compartilhado entre domínios
```

**Características:**

- ✅ Contextos delimitados (DDD)
- ✅ Lógica de negócio
- ✅ Independentes entre si
- ✅ Podem depender de `core/`
- ✅ NÃO podem depender um do outro

---

## 🔗 Dependências

### ❌ ERRADO: Log em modules/

```
modules/auth/ (domínio)
    ↓ depende
modules/log/ (outro domínio)
    ↓ depende
modules/error/ (outro domínio)
```

**Problema:** Circular dependency!

- Auth não deve depender de Log
- Error não deve depender de Log
- Criaria acoplamento entre domínios

### ✅ CORRETO: Log em core/

```
core/log/ (infraestrutura global)
    ↑
    | usado por TODOS
    |
modules/auth/ + modules/error/ + modules/health/ + modules/users/
```

**Vantagem:**

- Log é fornecedor de serviço
- Não depende de ninguém
- Todos podem usar sem acoplamento

---

## 🏛️ Padrão de Camadas

```
┌─────────────────────────────────────────────────┐
│            Application Layer (HTTP)              │
│        (Controllers, Middleware, Pipes)          │
└─────────────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────────────┐
│          Modules/Domains Layer                   │
│  auth/ | users/ | payments/ | health/ | error/  │
│          (Business Logic - DDD)                  │
└─────────────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────────────┐
│           Core/Infrastructure Layer              │
│  providers/ | interceptors/ | middleware/        │
│     (Log, Cache, Config - Técnico)               │
└─────────────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────────────┐
│             External Layer                       │
│  Database | APIs | Files | Message Queues       │
└─────────────────────────────────────────────────┘
```

**Regra:** Camadas superiores podem depender de camadas inferiores, nunca o contrário!

---

## 📊 Analogia Real

### Pense em uma Empresa

```
Diretoria (Core - Infraestrutura)
├── Recursos Humanos (HR)
├── Contabilidade (Financeiro)
├── TI (Logging, Backups, Segurança)
└── Facilidades (Prédio, Internet)

          ↓↓↓ servem ↓↓↓

Departamentos (Modules - Domínios)
├── Vendas
├── Engenharia
├── Marketing
└── Operações
```

**Logging é como "Segurança da Empresa":**

- Não é departamento de negócio
- Serve a todos os departamentos
- Não pode estar subordinado a nenhum deles

---

## 🎯 Quando Algo Deve Ficar em `core/`

### ✅ Coloque em `core/` se:

1. **Precisa estar disponível PARA TODOS**

   ```typescript
   // Auth usa
   this.logProvider.info(...);

   // Health usa
   this.logProvider.info(...);

   // Error usa
   this.logProvider.error(...);
   ```

2. **É infraestrutura técnica, não negócio**

   ```
   Log          ✅ Técnico (core/)
   JWT Token    ✅ Técnico (core/)
   Cache        ✅ Técnico (core/)
   Config       ✅ Técnico (core/)

   User         ❌ Negócio (modules/)
   Payment      ❌ Negócio (modules/)
   ```

3. **NÃO depende de módulos de negócio**

   ```typescript
   // ✅ OK
   LogProvider depende de Winston
   LogProvider depende de Config

   // ❌ ERRADO
   LogProvider depende de UserModule
   LogProvider depende de PaymentModule
   ```

4. **Precisa ser carregado ANTES dos módulos**
   ```typescript
   // app.module.ts
   @Module({
     imports: [
       CoreModule,      // ← Carrega primeiro
       // ... depois os domínios
       AuthModule,
       HealthModule,
     ],
   })
   ```

---

## ❌ Quando NÃO Colocar em `core/`

### ❌ NÃO coloque em `core/` se:

1. **É específico de um domínio**

   ```
   ❌ AUTH_MANAGER em core/
   ❌ PAYMENT_PROCESSOR em core/
   ❌ EMAIL_SENDER em core/ (se usado só por notifications)

   ✅ Coloque em seu módulo específico
   ```

2. **Depende de lógica de negócio**

   ```
   ❌ UserService em core/
   ❌ PaymentStrategy em core/
   ```

3. **Pode variar por módulo**
   ```
   ❌ REPOSITORY_PATTERN em core/
   ✅ Cada módulo define seu próprio repository
   ```

---

## 🚀 Estrutura Proposta (Corrigida)

### Mantém Log em `core/` Mas Reorganizado

```
src/core/
├── providers/
│   └── log/                          ← AQUI (infraestrutura global)
│       ├── domain/
│       │   ├── entities/
│       │   ├── interfaces/
│       │   └── enums/
│       ├── application/
│       │   └── dtos/
│       ├── infrastructure/
│       │   ├── providers/
│       │   │   └── winston.provider.ts
│       │   ├── interceptors/
│       │   │   └── logging.interceptor.ts
│       │   ├── middleware/
│       │   │   └── request-logging.middleware.ts
│       │   └── utils/
│       ├── log.module.ts
│       └── index.ts
│
├── config/                          ← Config também é técnico
├── core.module.ts
└── index.ts

src/modules/
├── auth/                            ← Domínio de negócio
├── health/
├── error/                           ← Tratamento é técnico MAS específico de app
├── shared/                          ← Compartilhado entre domínios
└── (futuros domínios de negócio)
```

---

## 📚 Comparação com Frameworks

### Spring Boot (Java)

```
spring-boot
├── spring-core          ← Core (Infrastructure)
├── spring-logging       ← Logging (Core)
└── spring-security      ← Security (Core)

app-modules
├── user-service         ← User Domain
├── payment-service      ← Payment Domain
```

### NestJS Padrão

```
core/
├── guards/
├── interceptors/
├── middleware/
└── providers/           ← Log aqui

modules/
├── auth/
├── users/
```

### Enterprise Apps (Arquitetura Limpa)

```
infrastructure/
├── logging/             ← Log aqui (infraestrutura)
├── database/
├── cache/
└── messaging/

application/
├── auth-use-cases/
├── payment-use-cases/
└── user-use-cases/
```

---

## ✅ Conclusão

**Log DEVE ficar em `core/`** porque:

1. ✅ **É infraestrutura técnica**, não domínio
2. ✅ **Serve a todos** os módulos
3. ✅ **Carregado primeiro**, antes dos domínios
4. ✅ **NÃO depende** de lógica de negócio
5. ✅ **Padrão da indústria** (Spring, .NET, etc)

---

## 📋 Resumo

| Aspecto          | Log em `core/` | Log em `modules/` |
| ---------------- | -------------- | ----------------- |
| Disponibilidade  | ✅ Todos       | ❌ Apenas alguns  |
| Acoplamento      | ✅ Zero        | ❌ Alto           |
| Carregamento     | ✅ Primeiro    | ❌ Último         |
| Padrão Indústria | ✅ Sim         | ❌ Não            |
| Reutilização     | ✅ 100%        | ❌ 0%             |
| DDD Compliance   | ✅ Sim         | ❌ Não            |

**Resposta curta:** Log é infraestrutura, não negócio. Infraestrutura fica em `core/`. 🎯
