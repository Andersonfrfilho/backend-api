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
  Scope,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
@Injectable({ scope: Scope.REQUEST })
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof Error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
