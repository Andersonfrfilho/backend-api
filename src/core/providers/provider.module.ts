import { Module } from '@nestjs/common';
import { LogModule } from '@core/providers/log/log.module';
@Module({
  imports: [LogModule],
  exports: [LogModule],
})
export class ProviderModule {}
