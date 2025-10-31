import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LogModule } from '@core/providers/log/log.module';
import { HttpExceptionFilter } from '@common/filters/error/error-filter';
@Module({
  imports: [LogModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class FilterErrorModule {}
