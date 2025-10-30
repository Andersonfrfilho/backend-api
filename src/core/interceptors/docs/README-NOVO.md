# 📚 Documentação da API

## Estrutura de Documentação

Esta pasta contém toda a lógica de documentação da API, incluindo Swagger e ReDoc com tema customizável.

### 📁 Estrutura de Pastas

```
src/core/interceptors/docs/
├── redoc/
│   ├── redoc.theme.ts         # Configuração de cores e tipografia
│   ├── redoc.config.ts        # Interfaces de configuração
│   ├── redoc.factory.ts       # Factory que gera o HTML do ReDoc
│   ├── redoc.constant.ts      # Constante HTML (legado)
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
3. **generateReDocHtml** cria HTML customizado com tema
4. **redocInterceptor** expõe o HTML do ReDoc em `/re-docs`
5. **docsFactory** inicializa ambos de forma centralizada

### 🔧 Uso Básico

No `main.ts`:

```typescript
import { docsFactory } from '@core/interceptors/docs';

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('docs', app, document);

// Inicializa Swagger + ReDoc com tema padrão
docsFactory({ app, document });
```

### 🎨 Customização do Tema

#### Com cores personalizadas:

```typescript
import { docsFactory, ReDocThemeConfig } from '@core/interceptors/docs';

const customTheme: ReDocThemeConfig = {
  primaryColor: '#1976d2', // Azul
  secondaryColor: '#42a5f5', // Azul claro
  accentColor: '#1976d2', // Azul
};

docsFactory({
  app,
  document,
  redoc: {
    theme: customTheme,
    title: 'Minha API - Documentação',
  },
});
```

#### Temas pré-configurados (exemplos):

```typescript
// Tema Verde (Sucesso)
{
  primaryColor: '#4caf50',
  secondaryColor: '#81c784',
  accentColor: '#4caf50',
}

// Tema Vermelho (Erro/Atenção)
{
  primaryColor: '#f44336',
  secondaryColor: '#ef5350',
  accentColor: '#f44336',
}

// Tema Roxo (Premium)
{
  primaryColor: '#9c27b0',
  secondaryColor: '#ba68c8',
  accentColor: '#9c27b0',
}
```

### 🌐 Propriedades do Tema

```typescript
interface ReDocThemeConfig {
  primaryColor?: string; // Cor principal (links, botões)
  secondaryColor?: string; // Cor secundária (hover, light)
  accentColor?: string; // Cor de destaque
  backgroundColor?: string; // Fundo da página
  textColor?: string; // Cor do texto principal
  borderColor?: string; // Cor das bordas
  logoUrl?: string; // URL do logo
  logoAltText?: string; // Texto alternativo do logo
}
```

### 📦 Dependências

- `@nestjs/swagger` - Geração de documentação Swagger
- `fastify` - Framework HTTP usado pela API
- ReDoc via CDN - Sem dependência extra de npm

### 🎯 Próximas Funcionalidades

- [ ] Adicionar autenticação para rotas de docs
- [ ] Suporte a múltiplas versões de API
- [ ] Exportar documentação em PDF
- [ ] Dark mode automático
