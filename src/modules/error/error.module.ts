import { Module } from '@nestjs/common';

import { FilterErrorModule } from '@modules/error/infrastructure/filters/filter.error.module';

@Module({
  imports: [FilterErrorModule],
  exports: [FilterErrorModule],
})
export class ErrorModule {}
