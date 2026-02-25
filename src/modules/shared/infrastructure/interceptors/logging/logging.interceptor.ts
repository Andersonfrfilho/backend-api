import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import type { LogProviderInterface } from '@modules/shared/domain';
import {
  LOG_PROVIDER,
  LOGGING_IGNORE_CONFIG,
} from '@modules/shared/infrastructure/providers/log/log.token';

import type { LoggingIgnoreConfig } from './logging.config';
import { DEFAULT_LOGGING_IGNORE_CONFIG, shouldIgnoreRoute } from './logging.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly loggingConfig: LoggingIgnoreConfig;

  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    @Optional() @Inject(LOGGING_IGNORE_CONFIG) loggingConfig?: LoggingIgnoreConfig,
  ) {
    this.loggingConfig = loggingConfig || DEFAULT_LOGGING_IGNORE_CONFIG;
  }

  // inject RequestContext lazily to avoid circular issues in unit tests
  private requestContext: any;

  // allow DI to set requestContext via property in runtime (module imports ensure provider available)
  setRequestContext(requestContext: any) {
    this.requestContext = requestContext;
  }

  private shouldSkipLogging(path: string): boolean {
    if (!this.loggingConfig.enabled) {
      return false;
    }

    return shouldIgnoreRoute(path, this.loggingConfig.ignoredRoutes);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const caller = `${context.getClass()?.name ?? 'Unknown'}::${context.getHandler()?.name ?? 'handler'}`;

    if (this.shouldSkipLogging(request.url)) {
      return next.handle();
    }

    return new Observable((subscriber) => {
      const header = {
        path: request.url,
        method: request.method,
        headers: request.headers,
        query: request['query'],
        params: request['params'],
        body: request['body'],
        caller,
      };
      // set caller into RequestContext if available
      try {
        this.requestContext?.run?.({ caller, requestId: request['requestId'] }, () => {});
      } catch (e) {
        // ignore if context not available
      }

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
