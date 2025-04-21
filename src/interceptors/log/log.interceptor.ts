import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Scope,
  // Inject,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from 'src/providers/log/log.interface';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOG_PROVIDER) private logProvider: LogProviderInterface,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      this.logProvider.info('interceptor - before');

      const now = Date.now();
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logProvider.info(`interceptor - after ${Date.now() - now}ms`),
          ),
        );
    } catch (error) {
      console.log(error);
    }
  }
}
