import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigModule } from '@app/config/config.module';

import { HTTP_AXIOS_CONNECTION, HTTP_AXIOS_PROVIDER } from '../../http.token';

import { AxiosHttpProvider } from './axios.http.provider';
import { AXIOS_HTTP_PROVIDER } from './axios.http.token';

export const createAxiosConnection = (configService: ConfigService) => {
  return {
    timeout: configService.get<number>('HTTP_TIMEOUT', 30000),
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Backend-API/1.0',
    },
  };
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: HTTP_AXIOS_CONNECTION,
      useFactory: createAxiosConnection,
      inject: [ConfigService],
    },
    {
      provide: AXIOS_HTTP_PROVIDER,
      useFactory: () => new AxiosHttpProvider(),
      inject: [HTTP_AXIOS_CONNECTION],
    },
    {
      provide: HTTP_AXIOS_PROVIDER,
      useExisting: AXIOS_HTTP_PROVIDER,
    },
  ],
  exports: [HTTP_AXIOS_CONNECTION, HTTP_AXIOS_PROVIDER],
})
export class SharedInfrastructureProviderHttpImplementationAxiosModule {}
