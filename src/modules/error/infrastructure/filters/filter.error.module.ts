import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LogModule } from '@core/providers/log/log.module';
import { HttpExceptionFilter } from '@modules/error/infrastructure/filters/error-filter';
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
