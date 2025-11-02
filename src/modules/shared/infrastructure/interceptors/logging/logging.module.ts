import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggingInterceptor } from '@modules/shared/infrastructure/interceptors/logging/logging.interceptor';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class SharedInfrastructureLoggingModule {}
