import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { requestContext } from '@core/context/request-context';
import { randomUUID } from 'node:crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    const rawRequestId = request.headers['x-request-id'];
    const requestId: string =
      (Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId) ??
      randomUUID();

    return new Observable((subscriber) => {
      requestContext.run({ requestId }, () => {
        this.logProvider.info({
          message: `Request started - ${request.method} ${request.url}`,
          context: 'LoggingInterceptor',
        });

        const now = Date.now();
        next
          .handle()
          .pipe()
          .subscribe({
            next: (val) => subscriber.next(val),
            error: (err) => {
              this.logProvider.error({
                message: `Request failed after ${Date.now() - now}ms`,
                context: 'LoggingInterceptor',
                error: err,
              });
              subscriber.error(err);
            },
            complete: () => {
              this.logProvider.info({
                message: `Request completed in ${Date.now() - now}ms`,
                context: 'LoggingInterceptor',
              });
              subscriber.complete();
            },
          });
      });
    });
  }
}
