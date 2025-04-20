import { Module } from '@nestjs/common';
import { LogProvider } from './log.service';
import { LOG_PROVIDER } from './log.constant';
@Module({
  providers: [
    {
      provide: LOG_PROVIDER,
      useClass: LogProvider,
    },
  ],
  exports: [LOG_PROVIDER],
})
export class LogModule {}
