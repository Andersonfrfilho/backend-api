# ===== STAGE 1: Build =====
FROM node:25-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Allow injecting a private registry token at build time (ARG not persisted)
# Use NPM_TOKEN for consistency with local env
ARG NPM_TOKEN
RUN if [ -n "$NPM_TOKEN" ]; then \
      printf "@adatechnology:registry=https://npm.adatechnology.com/\n//npm.adatechnology.com/:_authToken=${NPM_TOKEN}\n" > .npmrc; \
    fi && \
    npm ci && \
    rm -f .npmrc

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