import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Backend Service API')
  .setDescription('Backend Service API Documentation Template NestJs Fastify')
  .setVersion('1.0')
  .addBearerAuth() // Se usar autenticação JWT
  .addServer(process.env.BASE_URL_DEV || 'http://localhost:3333', 'Development') // Default: dev local
  .addServer(
    process.env.BASE_URL_HML || 'https://api-hml.example.com',
    'Staging (STG)',
  )
  .addServer(
    process.env.BASE_URL_PROD || 'https://api-prod.example.com',
    'Production',
  )
  .build();
