# 📊 Benchmark Module

Módulo completo para benchmark de **3 estratégias de geração de IDs** em banco de dados.

## 📁 Estrutura

```
src/modules/benchmark/
├── benchmark.module.ts                          # Módulo principal
├── domain/
│   └── entities/
│       └── benchmark.entities.ts               # 3 entities (UUID v7, Nanoid, Snowflake)
├── application/
│   └── services/
│       └── id-strategy-benchmark.service.ts    # Lógica dos benchmarks
├── infrastructure/
│   └── services/
│       └── snowflake-id-generator.service.ts   # Gerador de Snowflake IDs
└── presentation/
    └── controllers/
        └── id-strategy-benchmark.controller.ts # Endpoints HTTP
```

## 🚀 Endpoints Disponíveis

### 1. Teste INSERT (10k registros)

```bash
curl -X POST http://localhost:3000/benchmark/insert?count=10000
```

Resultado: Qual ID strategy insere mais rápido?

### 2. Teste SELECT (1000 limit)

```bash
curl -X POST http://localhost:3000/benchmark/select?limit=1000
```

Resultado: Qual ID strategy consulta mais rápido?

### 3. Teste UPDATE (1k registros)

```bash
curl -X POST http://localhost:3000/benchmark/update?count=1000
```

Resultado: Qual ID strategy atualiza mais rápido?

### 4. Teste INDEX SEARCH (100 buscas)

```bash
curl -X POST http://localhost:3000/benchmark/index-search?iterations=100
```

Resultado: Qual ID strategy busca por índice mais rápido?

### 5. Disco (Tamanho das tabelas)

```bash
curl -X GET http://localhost:3000/benchmark/disk-usage
```

Resultado: Qual ID strategy usa menos espaço em disco?

### 6. Benchmark Completo (Todos os testes)

```bash
curl -X GET "http://localhost:3000/benchmark/all?insertCount=5000"
```

Resultado: Recomendações finais sobre qual estratégia é melhor

### 7. Limpar Dados

```bash
curl -X POST http://localhost:3000/benchmark/cleanup
```

Remove todos os dados das tabelas de benchmark.

## 📊 Estrutura das Tabelas

3 tabelas idênticas, cada uma com um tipo de ID diferente:

| Coluna     | UUID v7         | Nanoid          | Snowflake       |
| ---------- | --------------- | --------------- | --------------- |
| id         | uuid (36)       | varchar(21)     | bigint (19)     |
| name       | varchar(255)    | varchar(255)    | varchar(255)    |
| email      | varchar(255) \* | varchar(255) \* | varchar(255) \* |
| age        | integer         | integer         | integer         |
| city       | varchar(100) \* | varchar(100) \* | varchar(100) \* |
| data       | jsonb           | jsonb           | jsonb           |
| created_at | timestamp       | timestamp       | timestamp       |
| updated_at | timestamp       | timestamp       | timestamp       |

`*` = Coluna com índice

## 🔧 Configuração

### Variáveis de Ambiente (para Snowflake)

```env
WORKER_ID=1        # 0-31
DATACENTER_ID=1    # 0-31
```

## 📈 Exemplo de Resposta

```json
{
  "message": "Insertados 10000 registros em cada tabela",
  "results": {
    "uuidV7": {
      "duration": 2450,
      "recordsPerSecond": 4081,
      "avgTimePerRecord": 0.25
    },
    "nanoid": {
      "duration": 3120,
      "recordsPerSecond": 3205,
      "avgTimePerRecord": 0.31
    },
    "snowflake": {
      "duration": 2890,
      "recordsPerSecond": 3460,
      "avgTimePerRecord": 0.29
    }
  },
  "winner": "uuidV7 foi 4081 registros/s"
}
```

## 🎯 Recomendações

### ✅ UUID v7 (Recomendado)

- Melhor para INSERT (gerado pelo BD)
- Sortable por timestamp
- Padrão RFC 4122
- **Mantenha para backend-api**

### 📌 Nanoid

- URLs curtas (21 chars vs 36)
- Melhor se precisar publicar IDs em URLs
- Ex: `https://app.com/user/V1StGXR_Z5j3eK7t4w9z`

### 🚀 Snowflake

- Para múltiplos datacenters
- Economiza ~27% disco vs UUID v7
- Ideal se escalar globalmente

## 🔄 Fluxo de Uso Típico

1. Inicie o servidor: `npm run start:dev`
2. Rode teste INSERT: `curl -X POST http://localhost:3000/benchmark/insert?count=5000`
3. Rode teste SELECT: `curl -X POST http://localhost:3000/benchmark/select`
4. Rode teste DISK: `curl -X GET http://localhost:3000/benchmark/disk-usage`
5. Rode benchmark completo: `curl -X GET http://localhost:3000/benchmark/all`
6. Limpe dados: `curl -X POST http://localhost:3000/benchmark/cleanup`

## 📝 Notas

- ⚠️ Benchmark completo demora ~5-10 minutos
- 💾 Tabelas ocupam ~150MB total
- 🔒 Use apenas em **development**, nunca em produção
- 📊 Customize com `?count=`, `?limit=`, `?iterations=`

## 📖 Para Mais Detalhes

Consulte: `/docs/ID_PERFORMANCE_BENCHMARK_GUIDE.md`
