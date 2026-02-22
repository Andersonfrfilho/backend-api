import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { SharedInfrastructureContextModule } from '@modules/shared/infrastructure/context/context.module';
import { RequestContextService } from '@modules/shared/infrastructure/context/request-context.service';
import { LoggingConfigModule } from '@modules/shared/infrastructure/interceptors/logging/logging-config.module';
import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging/logging.interceptor';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import {
  LOG_PROVIDER,
  LOGGING_IGNORE_CONFIG,
} from '@modules/shared/infrastructure/providers/log/log.token';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    LoggingConfigModule,
    SharedInfrastructureContextModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (
        logProvider: import('@modules/shared/domain/interfaces/log.interface').LogProviderInterface,
        requestContext: RequestContextService,
        loggingConfig: import('./logging.config').LoggingIgnoreConfig,
      ) => {
        const interceptor = new LoggingInterceptor(logProvider, loggingConfig);
        interceptor.setRequestContext(requestContext);
        return interceptor;
      },
      inject: [LOG_PROVIDER, RequestContextService, LOGGING_IGNORE_CONFIG],
    },
  ],
})
export class SharedInfrastructureLoggingModule {}
