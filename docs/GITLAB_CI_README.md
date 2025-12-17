# GitLab CI/CD Configuration

Este documento explica como configurar e usar o pipeline de CI/CD do GitLab para este projeto.

## Visão Geral

O pipeline está configurado para:

- ✅ Rodar testes unitários e e2e
- ✅ Fazer build da aplicação
- ✅ Deploy para staging e produção
- ✅ Usar banco PostgreSQL isolado para testes
- ✅ Limpar recursos após execução

## Configuração do Banco de Dados

### Variáveis de Ambiente

O pipeline usa as seguintes variáveis definidas no `.env.example`:

```bash
# Banco de produção/desenvolvimento
DATABASE_POSTGRES_HOST=database_postgres
DATABASE_POSTGRES_PORT=5432
DATABASE_POSTGRES_NAME=backend_db
DATABASE_POSTGRES_USER=postgres
DATABASE_POSTGRES_PASSWORD=postgres1234

# Banco de testes e2e (usado no CI)
DATABASE_POSTGRES_TEST_E2E_HOST=localhost
DATABASE_POSTGRES_TEST_E2E_PORT=5432
DATABASE_POSTGRES_TEST_E2E_NAME=backend_db_test_e2e
DATABASE_POSTGRES_TEST_E2E_USER=postgres
DATABASE_POSTGRES_TEST_E2E_PASSWORD=postgres1234
```

### Como Funciona no CI

1. **Setup**: O GitLab CI inicia um container PostgreSQL
2. **Database Creation**: Script `setup-test-db.sh` cria o banco `backend_db_test_e2e`
3. **Migrations**: Roda as migrations no banco de teste
4. **Tests**: Executa testes unitários e e2e
5. **Cleanup**: Remove o banco de teste

### Scripts Utilizados

- `scripts/setup-test-db.sh`: Cria o banco de teste
- `scripts/cleanup-test-db.sh`: Remove o banco de teste
- `npm run migration:run`: Roda migrations (usa NODE_ENV=test)

## Stages do Pipeline

### 1. Test

- **Imagem**: `node:18-alpine`
- **Serviços**: PostgreSQL 18
- **Comandos**:
  - Instala dependências
  - Cria banco de teste
  - Roda migrations
  - Executa testes unitários
  - Executa testes e2e
  - Remove banco de teste

### 2. Build

- **Imagem**: `node:18-alpine`
- **Artefatos**: Pasta `dist/`
- **Comandos**:
  - Instala dependências
  - Faz build da aplicação

### 3. Deploy

- **Staging**: Branch `develop` (manual)
- **Produção**: Branch `main` (manual)

## Como Usar Localmente

Para testar o pipeline localmente:

```bash
# 1. Instalar dependências
npm ci

# 2. Rodar apenas testes unitários
npm run test:unit

# 3. Rodar apenas testes e2e (com banco local)
npm run test:e2e

# 4. Rodar todos os testes
npm run test:all
```

## Configuração do GitLab

### Variáveis de CI/CD (se necessário)

No GitLab, vá em **Settings > CI/CD > Variables** e adicione:

- `SONAR_TOKEN`: Token do SonarQube (opcional)
- `FORTIFY_SSC_TOKEN`: Token do Fortify (opcional)

### Branches Protegidas

Configure branches protegidas:

- `main`: Apenas merge requests
- `develop`: Apenas merge requests

## Troubleshooting

### Erro: "Database does not exist"

- Verifique se o script `setup-test-db.sh` está sendo executado
- Confirme se as variáveis `DATABASE_POSTGRES_TEST_E2E_*` estão corretas

### Erro: "Migration failed"

- Verifique se o banco foi criado antes das migrations
- Confirme se as credenciais estão corretas

### Erro: "Tests timeout"

- Aumente o `timeout` no `jest.config.e2e.ts`
- Verifique se o PostgreSQL está respondendo

## Estrutura dos Arquivos

```
├── .gitlab-ci.yml          # Configuração do pipeline
├── scripts/
│   ├── setup-test-db.sh    # Cria banco de teste
│   └── cleanup-test-db.sh  # Remove banco de teste
├── .env.example            # Variáveis de exemplo
└── package.json            # Scripts npm
```
