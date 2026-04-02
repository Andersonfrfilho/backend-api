import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderModule } from './providers/provider.module';
import { SharedRepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [SharedInfrastructureProviderModule, SharedRepositoriesModule],
  exports: [SharedInfrastructureProviderModule, SharedRepositoriesModule],
})
export class SharedInfrastructureModule {}
