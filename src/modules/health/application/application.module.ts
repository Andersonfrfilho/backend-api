import { Module } from '@nestjs/common';

import { HealthApplicationUseCasesModule } from './use-cases/use-cases.module';

@Module({
  imports: [HealthApplicationUseCasesModule],
  exports: [HealthApplicationUseCasesModule],
})
export class HealthApplicationModule {}
