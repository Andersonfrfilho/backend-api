# 🔧 Organizar Imports: Externas Primeiro, Locais por Último

## O Padrão Correto

```typescript
// 1. Imports de bibliotecas externas (node_modules)
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as winston from 'winston';

// 2. Linha em branco

// 3. Imports locais (projeto)
import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging';
import { AppModule } from '@modules/app';
import { SharedModule } from '@modules/shared';
```

---

## ✅ Solução 1: ESLint + Plugin Import (RECOMENDADO)

### Passo 1: Instalar Dependências

```bash
npm install --save-dev eslint-plugin-import eslint-import-resolver-typescript
```

### Passo 2: Configurar `.eslintrc.json`

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "plugins": ["import", "@typescript-eslint"],
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    },
    "import/order": [
      "external",
      "builtin",
      "internal",
      "parent",
      "sibling",
      "index"
    ]
  },
  "rules": {
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@modules/**",
            "group": "internal"
          },
          {
            "pattern": "@core/**",
            "group": "internal"
          },
          {
            "pattern": "@config/**",
            "group": "internal"
          },
          {
            "pattern": "@common/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
        "alphabeticalOrder": true,
        "caseInsensitive": true,
        "newlines-between": "always"
      }
    ],
    "import/newline-after-import": ["warn", { "count": 1 }],
    "sort-imports": "off"
  }
}
```

### Passo 3: Adicionar Script no `package.json`

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

### Teste:

```bash
npm run lint:fix
```

---

## ✅ Solução 2: Prettier + Plugin (ALTERNATIVA)

Se prefere usar Prettier, instale:

```bash
npm install --save-dev @trivago/prettier-plugin-sort-imports
```

Configure `.prettierrc.json`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": [
    "^@nestjs/(.*)$",
    "^@modules/(.*)$",
    "^@core/(.*)$",
    "^@config/(.*)$",
    "^@common/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderCaseInsensitive": true
}
```

---

## ✅ Solução 3: Combinar ESLint + Prettier (MELHOR)

### Passo 1: Instalar Tudo

```bash
npm install --save-dev \
  eslint-plugin-import \
  eslint-import-resolver-typescript \
  @trivago/prettier-plugin-sort-imports \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier
```

### Passo 2: `.eslintrc.json` Completo

```json
{
  "root": true,
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "import", "prettier"],
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "rules": {
    "prettier/prettier": "warn",
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@nestjs/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@modules/**",
            "group": "internal"
          },
          {
            "pattern": "@core/**",
            "group": "internal"
          },
          {
            "pattern": "@config/**",
            "group": "internal"
          },
          {
            "pattern": "@common/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
        "alphabeticalOrder": true,
        "caseInsensitive": true,
        "newlines-between": "always"
      }
    ],
    "import/newline-after-import": ["warn", { "count": 1 }],
    "import/no-unresolved": "error",
    "sort-imports": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  },
  "overrides": [
    {
      "files": ["*.spec.ts"],
      "rules": {
        "import/order": "off"
      }
    }
  ]
}
```

### Passo 3: `.prettierrc.json` Completo

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": [
    "^node:",
    "^@nestjs/(.*)$",
    "^(fastify|express|rxjs)(.*)$",
    "^@modules/(.*)$",
    "^@core/(.*)$",
    "^@config/(.*)$",
    "^@common/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderCaseInsensitive": true,
  "importOrderSortSpecifiers": true
}
```

### Passo 4: Atualizar `.vscode/settings.json`

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "prettier.configPath": ".prettierrc.json",
  "eslint.validate": ["javascript", "typescript"]
}
```

### Passo 5: Adicionar Scripts ao `package.json`

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix && prettier --write 'src/**/*.{ts,js}'",
    "format": "prettier --write 'src/**/*.{ts,js,json}'",
    "format:check": "prettier --check 'src/**/*.{ts,js,json}'"
  }
}
}
```

---

## 📋 Exemplo Prático ANTES vs DEPOIS

### ❌ ANTES (Desorganizado)

```typescript
import { SharedModule } from '@modules/shared';
import * as winston from 'winston';
import { Observable } from 'rxjs';
import { AppModule } from '@modules/app';
import { Injectable } from '@nestjs/common';
import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging';
```

### ✅ DEPOIS (Organizado com ESLint + Prettier)

```typescript
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as winston from 'winston';

import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging';
import { SharedModule } from '@modules/shared';
import { AppModule } from '@modules/app';
```

**Padrão:**

1. ✅ `@nestjs` (externo NestJS)
2. ✅ `rxjs`, `winston` (externos)
3. ✅ Linha em branco
4. ✅ `@modules/*` (locais - alfabético)

---

## 🎯 Grupos de Import Explicados

```
Ordem (ESLint plugin import):
1. builtin       → node:fs, node:path
2. external      → @nestjs, express, rxjs, lodash
3. internal      → @modules, @core (alias paths)
4. parent        → ../../../
5. sibling       → ./sibling
6. index         → ./index
```

---

## ✨ Testar a Configuração

### 1. Criar arquivo teste

```bash
touch src/test-imports.ts
```

### 2. Adicionar imports desordenados

```typescript
import { SharedModule } from '@modules/shared';
import * as winston from 'winston';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging';
```

### 3. Executar lint

```bash
npm run lint:fix
```

### 4. Verificar resultado

```typescript
// Deve estar organizado assim:
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as winston from 'winston';

import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging';
import { SharedModule } from '@modules/shared';
```

---

## 🐛 Troubleshooting

### Problema: ESLint não encontra os alias paths

**Solução:**

```json
{
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  }
}
```

### Problema: Prettier e ESLint em conflito

**Solução:** Adicione `"prettier"` em `extends`:

```json
{
  "extends": ["eslint:recommended", "plugin:prettier/recommended"]
}
```

### Problema: Imports não estão sendo organizados ao salvar

**Solução:** Reinicie o VS Code e ESLint:

```
Cmd+Shift+P → "ESLint: Restart ESLint Server"
```

---

## 📚 Resumo das Opções

| Opção                 | Fácil | Poderoso | Recomendado    |
| --------------------- | ----- | -------- | -------------- |
| **ESLint Only**       | ✅    | ⚠️       | ✅ Para lint   |
| **Prettier Only**     | ✅    | ⚠️       | ✅ Para format |
| **ESLint + Prettier** | ⚠️    | ✅       | 🎯 **MELHOR**  |

---

## 🚀 Instalação Rápida (Copy-Paste)

```bash
# Instalar tudo
npm install --save-dev \
  eslint-plugin-import \
  eslint-import-resolver-typescript \
  @trivago/prettier-plugin-sort-imports \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier

# Criar configs (veja arquivos abaixo)
# .eslintrc.json
# .prettierrc.json

# Testar
npm run lint:fix

# No VS Code:
# Cmd+Shift+P → "ESLint: Restart ESLint Server"
```

---

## ✅ Resultado Final

Seus imports ficarão assim automaticamente:

```typescript
// ✅ Bibliotecas externas (node_modules)
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

// ✅ Linha em branco

// ✅ Imports locais (seu projeto - alfabético)
import { AppModule } from '@modules/app';
import { SharedModule } from '@modules/shared';
import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging';
```

🎉 **Pronto! Agora seus imports estarão sempre organizados!**
