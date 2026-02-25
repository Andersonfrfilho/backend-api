import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderHttpImplementationAxiosModule } from './axios/axios.http.module';

@Module({
  imports: [SharedInfrastructureProviderHttpImplementationAxiosModule],
  exports: [SharedInfrastructureProviderHttpImplementationAxiosModule],
})
export class SharedInfrastructureProviderHttpImplementationModule {}
