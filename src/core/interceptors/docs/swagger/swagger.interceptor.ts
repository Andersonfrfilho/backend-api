import { NestFastifyApplication } from '@nestjs/platform-fastify';

export function swaggerInterceptor(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  // Registrar rota para servir o swagger spec JSON
  app
    .getHttpAdapter()
    .getInstance()
    .get('/swagger-spec', (_, reply) => {
      reply.header('Content-Type', 'application/json');
      return reply.send(document);
    });
}
