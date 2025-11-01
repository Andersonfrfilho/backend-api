import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    return new Observable((subscriber) => {
      this.logProvider.info({
        message: `Request started - ${request.method} ${request.url}`,
        context: 'LoggingInterceptor',
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
              error: String(err),
              statusCode: err?.status || 500,
            });
            subscriber.error(err);
          },
          complete: () => {
            this.logProvider.info({
              message: `Request completed in ${Date.now() - now}ms`,
              context: 'LoggingInterceptor',
              params: responseData,
            });
            subscriber.complete();
          },
        });
    });
  }
}
