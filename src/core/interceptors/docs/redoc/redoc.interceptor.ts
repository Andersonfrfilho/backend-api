import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { generateReDocHtml } from './redoc.factory';
import { ReDocConfig } from './redoc.config';

export function redocInterceptor(
  app: NestFastifyApplication,
  config?: Partial<ReDocConfig>,
) {
  const redocHtml = generateReDocHtml(config);

  app
    .getHttpAdapter()
    .getInstance()
    .get('/re-docs', (_, reply) => {
      reply.header('Content-Type', 'text/html');
      return reply.send(redocHtml);
    });
}
