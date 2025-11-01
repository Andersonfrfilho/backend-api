import { Module } from '@nestjs/common';

import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [LogModule],
  exports: [LogModule],
})
export class ProviderModule {}
