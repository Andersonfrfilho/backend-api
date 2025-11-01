import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'node:crypto';
import { requestContext } from '@core/context/request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: (error?: Error) => void) {
    const rawRequestId = req.headers['x-request-id'];
    const requestId =
      (Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId) ??
      randomUUID();

    requestContext.run({ requestId }, () => {
      if (typeof (res as any).header === 'function') {
        (res as any).header('x-request-id', requestId);
      }
      next();
    });
  }
}
