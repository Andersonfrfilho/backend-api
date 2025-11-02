import { Module } from '@nestjs/common';

import { SharedInfrastructureLoggingModule } from '@modules/shared/infrastructure/interceptors/logging/logging.module';

@Module({
  imports: [SharedInfrastructureLoggingModule],
  exports: [SharedInfrastructureLoggingModule],
})
export class SharedInfrastructureInterceptorsModule {}
