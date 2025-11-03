import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { REDOC_HTML } from './redoc.constant';

export function redocInterceptor(app: NestFastifyApplication) {
  app
    .getHttpAdapter()
    .getInstance()
    .get('/re-docs', (_, reply) => {
      reply.header('Content-Type', 'text/html');
      return reply.send(REDOC_HTML);
    });
}
