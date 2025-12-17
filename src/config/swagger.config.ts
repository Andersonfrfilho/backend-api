import { DocumentBuilder } from '@nestjs/swagger';

import { EnvironmentProviderInterface } from './domain/interfaces/environment.interface';

// como utilizar a classe aqui dentro sem alterar performance ?
interface SwaggerConfigParams extends Partial<EnvironmentProviderInterface> {}
export const swaggerConfig = (environment: SwaggerConfigParams) =>
  new DocumentBuilder()
    .setTitle('Backend Service API')
    .setDescription('Backend Service API Documentation Template NestJs Fastify')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(environment.baseUrlDevelopment || 'http://localhost:3333', 'Development')
    .addServer(environment.baseUrlStaging || 'https://api-hml.example.com', 'Staging (STG)')
    .addServer(environment.baseUrlProduction || 'https://api-prod.example.com', 'Production')
    .build();
