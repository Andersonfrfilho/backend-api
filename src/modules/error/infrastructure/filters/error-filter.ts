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

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    if (!response?.raw) {
      return;
    }

    try {
      try {
        this.logProvider.error({
          message: 'Exception caught in filter',
          context: 'HttpExceptionFilter',
          exception: String(exception),
          exceptionType: typeof exception,
          stack:
            exception instanceof Error
              ? exception.stack
              : 'Not an Error instance',
          request: {
            method: request.method,
            url: request.url,
          },
        });
      } catch (logError) {
        console.error('[HttpExceptionFilter] Logger failed:', String(logError));
      }

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : ((exceptionResponse as Record<string, unknown>).message as
                | string
                | undefined) || 'Error';
      } else if (exception instanceof Error) {
        message = exception.message || 'Internal server error';
      }

      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } catch (sendError) {
      try {
        this.logProvider.error({
          message: 'Failed to send error response',
          context: 'HttpExceptionFilter',
        });
      } catch (logError) {
        console.error(
          '[HttpExceptionFilter] Failed to send response:',
          String(sendError),
          'Logging error:',
          String(logError),
        );
      }
    }
  }
}
