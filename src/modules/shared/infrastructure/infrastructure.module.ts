import { Module } from '@nestjs/common';

import { SharedInfrastructureContextModule } from './context/context.module';
import { SharedInfrastructureInterceptorsModule } from './interceptors/interceptors.module';
import { SharedInfrastructureProviderModule } from './providers/provider.module';
import { SharedRepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [
    SharedInfrastructureProviderModule,
    SharedInfrastructureContextModule,
    SharedInfrastructureInterceptorsModule,
    SharedRepositoriesModule,
  ],
  exports: [
    SharedInfrastructureProviderModule,
    SharedInfrastructureContextModule,
    SharedInfrastructureInterceptorsModule,
    SharedRepositoriesModule,
  ],
})
export class SharedInfrastructureModule {}
