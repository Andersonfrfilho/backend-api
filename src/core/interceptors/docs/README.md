# 📚 Documentação da API

## Estrutura de Documentação

Esta pasta contém toda a lógica de documentação da API, incluindo Swagger e ReDoc.

### 📁 Estrutura de Pastas

```
src/core/interceptors/docs/
├── redoc/
│   ├── redoc.constant.ts      # HTML constante do ReDoc
│   └── redoc.interceptor.ts   # Interceptor que serve o ReDoc
├── swagger/
│   └── swagger.interceptor.ts # Interceptor que serve o Swagger spec JSON
├── docs.factory.ts            # Factory que inicializa os interceptors
├── docs.module.ts             # Módulo NestJS para docs
├── index.ts                   # Arquivo de exportação
└── README.md                  # Este arquivo
```

### 🚀 Endpoints de Documentação

- **Swagger UI**: `http://localhost:3000/docs`
- **ReDoc**: `http://localhost:3000/re-docs`
- **Spec JSON**: `http://localhost:3000/swagger-spec`

### 📝 Como Funciona

1. **SwaggerModule** do NestJS gera o documento da API
2. **swaggerInterceptor** expõe o JSON em `/swagger-spec`
3. **redocInterceptor** expõe o HTML do ReDoc em `/re-docs`
4. **docsFactory** inicializa ambos os interceptors de forma centralizada

### 🔧 Uso

No `main.ts`:

```typescript
import { docsFactory } from '@core/interceptors/docs';

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('docs', app, document);

// Inicializa Swagger + ReDoc
docsFactory({ app, document });
```

### 🎨 Customização

#### Mudar URL do ReDoc

Edite em `redoc/redoc.constant.ts`:

```typescript
<redoc spec-url='/seu-endpoint'></redoc>
```

#### Adicionar mais opciones do ReDoc

Edite em `redoc/redoc.constant.ts`:

```typescript
<redoc
  spec-url='/swagger-spec'
  theme='{"colors": {"primary": {"main": "#dd5900"}}}'
></redoc>
```

### 📦 Dependências

- `@nestjs/swagger` - Geração de documentação Swagger
- `fastify` - Framework HTTP usado pela API
- ReDoc via CDN (sem dependência extra)
