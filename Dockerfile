FROM node:25

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && \
  npx tsc src/modules/shared/infrastructure/providers/database/migrations/*.ts \
  --outDir dist/modules/shared/infrastructure/providers/database/migrations \
  --module commonjs \
  --target es2020 \
  --esModuleInterop \
  --skipLibCheck \
  --strict false

# Executa migrations e inicia em desenvolvimento
CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]