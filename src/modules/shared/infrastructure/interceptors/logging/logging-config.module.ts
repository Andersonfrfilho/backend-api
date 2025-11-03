import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { LoggingIgnoreConfig } from '@modules/shared/infrastructure/interceptors/logging/logging.config';
import { DEFAULT_LOGGING_IGNORE_CONFIG } from '@modules/shared/infrastructure/interceptors/logging/logging.config';
import { LOGGING_IGNORE_CONFIG } from '@modules/shared/infrastructure/log.provider';

@Global()
@Module({
  providers: [
    {
      provide: LOGGING_IGNORE_CONFIG,
      useFactory: (): LoggingIgnoreConfig => {
        return DEFAULT_LOGGING_IGNORE_CONFIG;
      },
      inject: [ConfigService],
    },
  ],
  exports: [LOGGING_IGNORE_CONFIG],
})
export class LoggingConfigModule {}
