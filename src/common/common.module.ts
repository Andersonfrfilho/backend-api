import { Module } from '@nestjs/common';
import { FilterModule } from '@common/filters/error.module';

@Module({
  imports: [FilterModule],
  exports: [FilterModule],
})
export class CommonModule {}
