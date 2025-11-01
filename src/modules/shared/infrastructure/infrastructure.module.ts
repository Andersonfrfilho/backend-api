import { Module } from '@nestjs/common';

import { SharedInfrastructureContextModule } from './context/context.module';
import { SharedInfrastructureInterceptorsModule } from './interceptors/interceptors.module';

@Module({
  imports: [
    SharedInfrastructureContextModule,
    SharedInfrastructureInterceptorsModule,
  ],
  exports: [
    SharedInfrastructureContextModule,
    SharedInfrastructureInterceptorsModule,
  ],
})
export class SharedInfrastructureModule {}
