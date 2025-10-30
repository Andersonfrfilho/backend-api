import { Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [LoggingModule],
  exports: [LoggingModule],
})
export class InterceptorModule {}
