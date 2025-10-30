import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logProvider.error({
      message: 'Exception caught in filter',
      context: 'HttpExceptionFilter',
      exception,
      stack: exception instanceof Error && exception.stack,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
      },
    });

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const messageIsString = typeof exceptionResponse === 'string';
      return response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: messageIsString
          ? exceptionResponse
          : (exceptionResponse as Record<string, unknown>).message || 'Error',
      });
    }

    return response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    });
  }
}
