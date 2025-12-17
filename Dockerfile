# ===== STAGE 1: Build =====
FROM node:25-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Compila migrations separadamente
RUN npx tsc src/modules/shared/infrastructure/providers/database/migrations/*.ts \
  --outDir dist/modules/shared/infrastructure/providers/database/migrations \
  --module commonjs \
  --target es2020 \
  --esModuleInterop \
  --skipLibCheck \
  --strict false && \
  npm prune --omit=dev

# ===== STAGE 2: Runtime (Production) =====
FROM node:25-alpine

WORKDIR /app

# Copia apenas dependências de produção
COPY --from=builder /app/node_modules ./node_modules

# Copia apenas arquivos compilados e necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package*.json ./

# Cria pasta de logs
RUN mkdir -p logs

# PRODUÇÃO: Inicia diretamente (sem rodar migrations)
# Migrations devem ser rodadas manualmente ou via pipeline CI/CD
CMD ["npm", "run", "start:prod"]