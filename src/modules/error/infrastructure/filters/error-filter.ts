import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '@modules/error';
import { APP_ERROR_TYPE } from '@modules/error/infrastructure/filters/error-filter.constant';
import type { LogProviderInterface } from '@modules/shared/domain';
import { requestContext } from '@modules/shared/infrastructure/context/request-context';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/log.provider';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface) {}
  logResponse(
    exception: AppError | HttpException | Error,
    request: FastifyRequest,
    responseBody?: Record<string, unknown>,
  ) {
    try {
      const rawRequestId = request.headers['x-request-id'];
      const headerRequestId = (Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId) ?? '';

      this.logProvider.error({
        message: 'Exception caught in filter',
        context: 'HttpExceptionFilter',
        requestId: headerRequestId,
        params: {
          request: {
            query: request.query,
            params: request.params,
            headers: request.headers,
            method: request.method,
            url: request.url,
          },
          exceptionType: exception instanceof AppError ? exception.type : 'Error',
          exceptionMessage: exception instanceof Error ? exception.message : String(exception),
          details: exception instanceof AppError ? exception.details : undefined,
          responseBody,
        },
      });
    } catch (logError) {
      console.error('[HttpExceptionFilter] Logger failed:', String(logError));
    }
  }
  private getRequestId(request: FastifyRequest): string {
    // 1. Try to get requestId from request object (set by LoggingInterceptor)
    const requestIdFromRequest = (request as any).requestId;
    if (requestIdFromRequest) {
      return requestIdFromRequest;
    }

    // 2. Try to get from requestContext (fallback)
    const contextStore = requestContext.getStore();
    if (contextStore?.requestId) {
      return contextStore.requestId;
    }

    // 3. Try to get from x-request-id header (last resort)
    const rawRequestId = request.headers['x-request-id'];
    return (Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId) ?? '';
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (!response?.raw) {
      return;
    }

    const requestId = this.getRequestId(request);
    response.header('x-request-id', requestId);

    let details: unknown;

    try {
      if (exception instanceof AppError) {
        const status = exception.statusCode;
        const message = exception.message;

        if ((exception.type as string) === APP_ERROR_TYPE.VALIDATION) {
          details = exception.details;
        }

        const responseBody: Record<string, unknown> = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
        };

        if (details) {
          responseBody.details = details;
        }

        this.logResponse(exception, request, responseBody);
        response.status(status).send(responseBody);
        return;
      }

      this.handleNonAppError(exception, request, response);
    } catch (sendError) {
      this.handleFilterError(sendError);
    }
  }

  private handleNonAppError(exception: unknown, request: FastifyRequest, response: FastifyReply) {
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    const errorResponseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };
    this.logResponse(exception as Error, request, errorResponseBody);
    response.status(status).send(errorResponseBody);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      return typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as Record<string, unknown>).message as string | undefined) || 'Error';
    }
    if (exception instanceof Error) {
      return exception.message || 'Internal server error';
    }
    return 'Internal server error';
  }

  private handleFilterError(sendError: unknown) {
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
