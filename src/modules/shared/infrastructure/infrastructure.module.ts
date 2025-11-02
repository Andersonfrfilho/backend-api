import { Module } from '@nestjs/common';

import { SharedInfrastructureContextModule } from './context/context.module';
import { SharedInfrastructureInterceptorsModule } from './interceptors/interceptors.module';
import { SharedInfrastructureProviderModule } from './providers/provider.module';

@Module({
  imports: [
    SharedInfrastructureProviderModule,
    SharedInfrastructureContextModule,
    SharedInfrastructureInterceptorsModule,
  ],
  exports: [
    SharedInfrastructureProviderModule,
    SharedInfrastructureContextModule,
    SharedInfrastructureInterceptorsModule,
  ],
})
export class SharedInfrastructureModule {}
