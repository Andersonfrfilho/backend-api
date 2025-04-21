import { Module } from '@nestjs/common';
import { LoggingInterceptor } from './log/log.interceptor';
import { LogModule } from 'src/providers/log/log.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [LogModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class InterceptorModule {}
