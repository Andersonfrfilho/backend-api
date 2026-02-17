import { Module } from '@nestjs/common';

import { HttpProvider } from './http.provider';
import { HTTP_PROVIDER } from './http.token';
import { SharedInfrastructureProviderHttpImplementationModule } from './implementations/http.implementation.module';

@Module({
  imports: [SharedInfrastructureProviderHttpImplementationModule],
  providers: [
    {
      provide: HTTP_PROVIDER,
      useClass: HttpProvider,
    },
    {
      provide: 'HttpProvider',
      useClass: HttpProvider,
    },
  ],
  exports: [HTTP_PROVIDER, 'HttpProvider'],
})
export class SharedInfrastructureProviderHttpModule {}
