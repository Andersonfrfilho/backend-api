import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import type { LogProviderInterface } from '@modules/shared/domain';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/log.provider';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    return new Observable((subscriber) => {
      const header = {
        path: request.url,
        method: request.method,
        headers: request.headers,
        query: request['query'],
        params: request['params'],
        body: request['body'],
      };
      this.logProvider.info({
        message: `Request started - ${request.method} ${request.url}`,
        context: 'LoggingInterceptor',
        params: {
          header,
        },
      });

      const now = Date.now();
      let responseData: unknown;
      next
        .handle()
        .pipe()
        .subscribe({
          next: (val) => {
            responseData = val;
            subscriber.next(val);
          },
          error: (err) => {
            this.logProvider.error({
              message: `Request failed after ${Date.now() - now}ms`,
              context: 'LoggingInterceptor',
              params: {
                error: String(err),
                statusCode: err?.status || 500,
                response: responseData,
                header,
              },
            });
            subscriber.error(err);
          },
          complete: () => {
            this.logProvider.info({
              message: `Request completed in ${Date.now() - now}ms`,
              context: 'LoggingInterceptor',
              params: {
                response: responseData,
                header,
              },
            });
            subscriber.complete();
          },
        });
    });
  }
}
