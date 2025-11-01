import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { redocInterceptor } from './redoc/redoc.interceptor';
import { swaggerInterceptor } from './swagger/swagger.interceptor';

export interface DocsFactoryConfig {
  app: NestFastifyApplication;
  document: Record<string, any>;
  redoc?: Partial<unknown>;
}

export function docsFactory(config: DocsFactoryConfig): void {
  const { app, document, redoc: redocConfig } = config;

  swaggerInterceptor(app, document);
  redocInterceptor(app);
}
