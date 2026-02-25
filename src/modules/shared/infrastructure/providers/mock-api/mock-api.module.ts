import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderHttpModule } from '../http/http.module';
import { HttpProvider } from '../http/http.provider';
import { HTTP_PROVIDER } from '../http/http.token';

import { MockApiProvider } from './mock-api.provider';
import { MOCK_API_PROVIDER } from './mock-api.provider.token';

/**
 * Mock API provider module
 */
@Module({
  imports: [SharedInfrastructureProviderHttpModule],
  providers: [
    {
      provide: MOCK_API_PROVIDER,
      useFactory: (httpProvider: HttpProvider) => new MockApiProvider(httpProvider),
      inject: [HTTP_PROVIDER],
    },
  ],
  exports: [MOCK_API_PROVIDER],
})
export class SharedInfrastructureProviderMockApiModule {}
