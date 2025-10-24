import { Module, Scope } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@common/filters/error-filter';
import { LogModule } from '@core/providers/log/log.module';
@Module({
  imports: [LogModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
      scope: Scope.REQUEST,
    },
  ],
})
export class FilterModule {}
