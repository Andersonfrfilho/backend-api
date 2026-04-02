import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { HttpExceptionFilter } from '@modules/error/infrastructure/filters/error-filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class FilterErrorModule {}
