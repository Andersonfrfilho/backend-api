import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Scope,
} from '@nestjs/common';

import type { Request } from 'express';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    this.logProvider.info({
      message: 'interceptor - before',
      context: 'LoggingInterceptor',
    });
    const request = context.switchToHttp().getRequest<Request>();

    const rawRequestId = request.headers['x-request-id'];
    const hasRequestId: string = Array.isArray(rawRequestId)
      ? rawRequestId[0]
      : (rawRequestId ?? '');

    if (hasRequestId) {
      this.logProvider.setRequestId(hasRequestId);
    }
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logProvider.info(`interceptor - after ${Date.now() - now}ms`),
        ),
      );
  }
}
