import { HttpModule as ExternalHttpModule } from '@adatechnology/http-client';
import { Module } from '@nestjs/common';

import { HTTP_PROVIDER } from './http.token';

@Module({
  imports: [ExternalHttpModule.forRoot({}, { provide: HTTP_PROVIDER })],
  exports: [HTTP_PROVIDER],
})
export class SharedInfrastructureProviderHttpModule {}
