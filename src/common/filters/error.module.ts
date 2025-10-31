import { Module } from '@nestjs/common';
import { FilterErrorModule } from './error/filter.error.module';
@Module({
  imports: [FilterErrorModule],
  exports: [FilterErrorModule],
})
export class FilterModule {}
