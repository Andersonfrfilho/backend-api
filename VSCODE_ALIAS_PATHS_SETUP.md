# ⚙️ Configurar VS Code para Usar Alias Paths Automaticamente

## 🎯 Objetivo

Fazer com que o VS Code sempre sugira imports usando alias paths (`@modules/`, `@core/`, etc) em vez de caminhos relativos.

---

## 1️⃣ Passo 1: Verificar `tsconfig.json`

Certifique-se de que seus alias paths estão configurados:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@modules/*": ["src/modules/*"],
      "@core/*": ["src/core/*"],
      "@config/*": ["src/config/*"],
      "@common/*": ["src/common/*"]
    }
  }
}
```

---

## 2️⃣ Passo 2: Configurar `.vscode/settings.json`

Crie ou edite o arquivo `.vscode/settings.json` na raiz do projeto:

```json
{
  // ===== IMPORTS COM ALIAS PATHS =====
  "typescript.preferences.importModuleSpecifierFormat": "absolute",
  "typescript.preferences.importModuleSpecifierEndingPreference": "minimal",
  "typescript.preferences.quotePreference": "single",

  // ===== AUTO-IMPORT =====
  "typescript.autoImportSuggestions.enabled": true,
  "typescript.suggest.autoImports": true,
  "typescript.suggest.enabled": true,

  // ===== DETECTAR ALIAS PATHS =====
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // ===== ORGANIZAR IMPORTS =====
  "typescript.preferences.importModuleSpecifierStyle": "non-relative",

  // ===== ESLINT (se usar) =====
  "eslint.autoFixOnSave": true,

  // ===== PRETTIER (se usar) =====
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // ===== BEHAVIOR =====
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

---

## 3️⃣ Passo 3: Verificar TypeScript Version

O VS Code precisa usar a versão do TypeScript do projeto. Configure isso:

**Opção A: Via Command Palette** (Recomendado)

1. Abra VS Code
2. Pressione `Cmd+Shift+P` (Mac) ou `Ctrl+Shift+P` (Windows/Linux)
3. Digite: `TypeScript: Select TypeScript Version`
4. Escolha: `Use Workspace Version`

**Opção B: Via settings.json**

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 4️⃣ Passo 4: Configurar Path Mapping Recognition

Se o VS Code ainda não reconhecer os paths, crie/edite `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Angular.ng-template"
  ]
}
```

---

## 5️⃣ Passo 5: Forçar Alias Paths em Auto-Imports

### Opção A: Via ESLint (Recomendado)

Se usar ESLint, configure o plugin para forçar alias paths:

```bash
npm install --save-dev eslint-plugin-import
```

**.eslintrc.json** (ou **.eslintrc.js**):

```json
{
  "extends": ["plugin:import/recommended"],
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    },
    "import/ignore": ["node_modules"]
  },
  "rules": {
    "import/no-relative-packages": "error",
    "import/no-relative-parent-imports": "warn"
  }
}
```

### Opção B: Criar `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Fix imports (alias paths)",
      "type": "shell",
      "command": "npx",
      "args": ["eslint", "src", "--fix"],
      "problemMatcher": ["$eslint-stylish"]
    }
  ]
}
```

---

## 6️⃣ Passo 6: Extensões Recomendadas

Instale extensões que ajudam com alias paths:

### Extensões Essenciais

```json
// .vscode/extensions.json
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

**Instale manualmente:**

1. `Path Intellisense` - Autocompletar caminhos
2. `TypeScript Path Intellisense` - Autocompletar alias paths
3. `ESLint` - Validação de imports

---

## 7️⃣ Passo 7: Configurar Prettier para Organizar Imports

**Se usar Prettier**, configure `.prettierrc.json`:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "importOrder": ["^@(modules|core|config|common)", "^[./]"],
  "importOrderSeparation": true,
  "importOrderCaseInsensitive": true
}
```

Instale plugin:

```bash
npm install --save-dev @trivago/prettier-plugin-sort-imports
```

Configure `.prettierrc.json`:

```json
{
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": ["^@modules", "^@core", "^@config", "^@common", "^[./]"],
  "importOrderSeparation": true
}
```

---

## 📋 Arquivo Completo: `.vscode/settings.json`

```json
{
  "// ===== TYPESCRIPT =====": "",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.autoImportSuggestions.enabled": true,
  "typescript.suggest.autoImports": true,
  "typescript.suggest.enabled": true,

  "// ===== IMPORTS COM ALIAS PATHS =====": "",
  "typescript.preferences.importModuleSpecifierFormat": "absolute",
  "typescript.preferences.importModuleSpecifierEndingPreference": "minimal",
  "typescript.preferences.importModuleSpecifierStyle": "non-relative",
  "typescript.preferences.quotePreference": "single",

  "// ===== PRETTIER =====": "",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  "// ===== ESLINT =====": "",
  "eslint.validate": ["javascript", "typescript"],
  "eslint.format.enable": true,

  "// ===== CODE ACTIONS =====": "",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },

  "// ===== EDITOR BEHAVIOR =====": "",
  "editor.defaultBranchProtectionRule": "",
  "editor.quickSuggestions": {
    "strings": true,
    "comments": true,
    "other": true
  },
  "editor.suggest.localityBonus": true,
  "editor.suggest.shareSuggestSelections": true
}
```

---

## ✅ Teste a Configuração

### 1. Criar novo arquivo TypeScript

```bash
# Crie um arquivo teste
touch src/modules/shared/test.ts
```

### 2. Adicionar import

No arquivo `test.ts`, comece a digitar:

```typescript
import { SharedModule }
```

**Resultado esperado:**

- ✅ Sugestão aparece: `@modules/shared`
- ❌ NÃO deve aparecer: `../../../shared`

### 3. Usar auto-import

1. Pressione `Cmd+Shift+O` (Mac) ou `Ctrl+Shift+O` (Windows/Linux)
2. Procure por uma classe/interface
3. Verifique se o import usa alias path

---

## 🐛 Troubleshooting

### Problema: Imports ainda aparecem com caminhos relativos

**Solução:**

```bash
# 1. Reiniciar o TypeScript server
Cmd+Shift+P → "TypeScript: Restart TS Server"

# 2. Selecionar TypeScript workspace
Cmd+Shift+P → "TypeScript: Select TypeScript Version"
→ Use Workspace Version

# 3. Recarregar VS Code
Cmd+Shift+P → "Developer: Reload Window"
```

### Problema: Intellisense não reconhece paths

**Solução:**

1. Instale `Path Intellisense` extension
2. Configure em settings.json:

```json
{
  "path-intellisense.mappings": {
    "@modules": "${workspaceRoot}/src/modules",
    "@core": "${workspaceRoot}/src/core",
    "@config": "${workspaceRoot}/src/config"
  }
}
```

### Problema: Imports não são organizados automaticamente

**Solução:**

```bash
# Instale extensão
npm install --save-dev @trivago/prettier-plugin-sort-imports

# Configure prettier
# (veja passo 7 acima)
```

---

## 🎯 Verificar Configuração

Execute este comando para verificar paths reconhecidos:

```bash
npx tsc --listFilesOnly 2>&1 | grep -i alias
```

Ou use in-editor:

```typescript
// Comece a digitar - VS Code deve sugerir:
import { AppModule } from '@modules/app'; // ✅ Alias path
// NÃO:
import { AppModule } from '../../../modules/app'; // ❌ Relativo
```

---

## 📚 Referências

- [TypeScript Paths](https://www.typescriptlang.org/tsconfig#paths)
- [VS Code TypeScript Settings](https://code.visualstudio.com/docs/languages/typescript)
- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [Prettier Plugins](https://prettier.io/docs/en/plugins.html)

---

## 🚀 Resumo Rápido

1. ✅ **`tsconfig.json`** - Paths configurados
2. ✅ **`.vscode/settings.json`** - Configurações VS Code
3. ✅ **TypeScript Workspace Version** - Selecione via Command Palette
4. ✅ **ESLint** - Force alias paths (opcional)
5. ✅ **Prettier** - Organize imports (opcional)
6. ✅ **Restart TS Server** - `Cmd+Shift+P → "TypeScript: Restart TS Server"`

Pronto! Agora VS Code sempre sugerirá alias paths! 🎉
