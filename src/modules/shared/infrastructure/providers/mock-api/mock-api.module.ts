import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderHttpModule } from '../http/http.module';

import { MockApiProvider } from './mock-api.provider';

/**
 * Mock API provider module
 */
@Module({
  imports: [SharedInfrastructureProviderHttpModule],
  providers: [
    {
      provide: 'MockApiProvider',
      useFactory: (httpProvider: any) => new MockApiProvider(httpProvider),
      inject: ['HttpProvider'],
    },
  ],
  exports: ['MockApiProvider'],
})
export class SharedInfrastructureProviderMockApiModule {}
