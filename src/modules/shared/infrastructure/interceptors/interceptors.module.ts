import { Module } from '@nestjs/common';

import { LoggingModule } from '@modules/shared/infrastructure/interceptors/logging/logging.module';

@Module({
  imports: [LoggingModule],
  exports: [LoggingModule],
})
export class SharedInfrastructureInterceptorsModule {}
