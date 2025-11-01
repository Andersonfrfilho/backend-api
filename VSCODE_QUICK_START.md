# 🚀 Quick Start: Alias Paths no VS Code

## ✅ Já Configurado para Você!

Os arquivos abaixo foram criados na raiz do seu projeto:

### 1. `.vscode/settings.json` ✅

```json
{
  "typescript.preferences.importModuleSpecifierStyle": "non-relative",
  "typescript.preferences.importModuleSpecifierFormat": "absolute"
  // ... mais configurações
}
```

### 2. `.vscode/extensions.json` ✅

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "path-intellisense.path-intellisense",
    "projectletxyz.typescript-path-intellisense"
  ]
}
```

---

## 📋 3 Passos para Ativar:

### Passo 1: Selecionar TypeScript Workspace Version

1. Abra o VS Code
2. Pressione `Cmd+Shift+P` (Mac) ou `Ctrl+Shift+P` (Windows/Linux)
3. Digite: `TypeScript: Select TypeScript Version`
4. Escolha: **Use Workspace Version**

### Passo 2: Instalar Extensões Recomendadas

1. Vá para Extensions (Cmd+Shift+X)
2. Clique no botão azul: "Show Recommended Extensions"
3. Instale todas (especialmente `Path Intellisense`)

### Passo 3: Reiniciar TypeScript Server

1. Pressione `Cmd+Shift+P`
2. Digite: `TypeScript: Restart TS Server`
3. Pressione Enter

---

## ✨ Teste Agora!

Crie um novo arquivo e comece a digitar:

```typescript
import { SharedModule } from '
```

**Resultado esperado:**

- ✅ Sugestão: `@modules/shared`
- ❌ NÃO deve aparecer: `../../../modules/shared`

---

## 🎯 Agora Todos os Imports Usarão Alias Paths!

```typescript
// ✅ ANTES (relativo)
import { SharedModule } from '../../../modules/shared';

// ✅ DEPOIS (alias path - automático!)
import { SharedModule } from '@modules/shared';
```

---

## 📚 Documentação Completa

Veja `VSCODE_ALIAS_PATHS_SETUP.md` para:

- Troubleshooting
- Prettier + ESLint
- Configurações avançadas
- Path Intellisense customizado
