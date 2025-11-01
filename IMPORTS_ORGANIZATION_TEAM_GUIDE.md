# 📋 Configuração de Imports Organizado Automaticamente

## ✅ Status Atual

A organização de imports está **100% configurada** e funcionando automaticamente quando você salva os arquivos no VS Code.

## 🎯 Como Funciona

### Quando você salva um arquivo (Cmd+S):

1. **ESLint** reorganiza os imports na ordem correta
2. **Prettier** formata o código
3. **Blank lines** são adicionadas entre os grupos

### Ordem dos Imports (Automática):

```typescript
// 1️⃣ Node.js built-in (crypto, fs, path, etc)
import { randomUUID } from 'node:crypto';

// [BLANK LINE]

// 2️⃣ Pacotes externos (@nestjs, fastify, etc)
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

// [BLANK LINE]

// 3️⃣ Seus imports internos (alias @modules, @config, etc)
import { requestContext } from '@modules/shared/infrastructure/context/request-context';

// [BLANK LINE]

// 4️⃣ Imports relativos (../, ./)
import { UserRepository } from './user.repository';
```

## 🚀 Usar no Time

Todos os membros do time que usarem VS Code receberão as configurações automaticamente:

### Arquivos de Configuração Compartilhados:

```
projeto/
├── .vscode/
│   ├── settings.json          ← Configuração automática ao salvar
│   └── extensions.json        ← Extensões recomendadas
├── eslint.config.mjs          ← Regras de import/ordem
├── .prettierrc.json           ← Formatação
└── .eslintrc.json             ← Fallback (legacy)
```

### ✅ Quando clonar o projeto:

```bash
# 1. Clone o projeto
git clone <repo>
cd backend-api

# 2. Instale dependências
npm install

# 3. Abra no VS Code
code .

# VS Code vai:
# ✓ Carregar as configurações de .vscode/settings.json
# ✓ Sugerir instalar as extensões recomendadas
# ✓ Usar TypeScript do projeto (tsconfig.json)
# ✓ Organizar imports ao salvar (Cmd+S)
```

## 📝 Scripts Úteis

```bash
# Organizar imports em todos os arquivos
npm run lint

# Apenas verificar (sem fix)
npm run lint:check

# Forçar organização de imports
npm run lint:imports

# Formatar + Lint (recomendado antes de commit)
npm run format:all
```

## 🔧 Configurações Principais

### `.vscode/settings.json`:
- TypeScript workspace version automático
- Import do tipo "non-relative" (alias paths `@modules/*`)
- ESLint + Prettier ativado ao salvar
- Code Actions automáticas

### `eslint.config.mjs`:
- **`import/order`**: Organiza imports em grupos
- **`newlines-between`**: Adiciona linha em branco entre grupos
- **`alphabetize`**: Ordena alfabeticamente dentro de cada grupo
- Ignora regras em arquivos `.spec.ts` e `.test.ts`

### `.prettierrc.json`:
- Print width: 100 caracteres
- Single quotes
- Trailing commas
- 2 espaços de indentação

## 🎓 Padrão de Código

Agora **todo o time** terá:

✅ **Imports organizados automaticamente**
✅ **Formato consistente** (espaçamento, aspas, etc)
✅ **Sem conflitos** de merge (todos usam mesmas regras)
✅ **Sem discussões** sobre estilo (está padronizado)

## ❓ Troubleshooting

### Imports não estão reorganizando ao salvar?

```bash
# 1. Reinicie VS Code (Cmd+Q, depois abra novamente)

# 2. Verifique se as extensões estão instaladas:
# - ESLint (dbaeumer.vscode-eslint)
# - Prettier (esbenp.prettier-vscode)

# 3. Rode manualmente:
npm run lint
```

### Imports aparecem em ordem errada?

```bash
# Limpar cache do ESLint
rm -rf node_modules/.eslintcache

# Rodar lint novamente
npm run lint
```

### Conflitos de merge nos imports?

Todos usando a mesma config **minimizam** conflitos, mas se acontecer:

```bash
# Re-organize imports após merge
npm run format:all

# Commit
git add .
git commit -m "chore: organize imports after merge"
```

## 📌 Resumo para o Time

| Ação | O que acontece |
|------|---|
| Salvar arquivo (Cmd+S) | ESLint + Prettier reorganiza imports |
| `npm run lint` | Organiza todos os imports do projeto |
| `npm run format:all` | Prettier + ESLint (recomendado antes de PR) |
| Clonar projeto novo | Configura automaticamente via `.vscode/` |

---

**Resultado:** Um projeto com imports organizados, formato consistente e pronto para colaboração em equipe! 🎉
