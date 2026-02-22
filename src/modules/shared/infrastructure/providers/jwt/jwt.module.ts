import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderJwtImplementationModule } from './implementations/jwt.implementation.module';
import { JwtProvider } from './jwt.provider';
import { JWT_PROVIDER } from './jwt.token';

@Module({
  imports: [SharedInfrastructureProviderJwtImplementationModule],
  providers: [
    {
      provide: JWT_PROVIDER,
      useClass: JwtProvider,
    },
    {
      provide: 'JwtProvider',
      useClass: JwtProvider,
    },
    {
      provide: JwtProvider,
      useClass: JwtProvider,
    },
  ],
  exports: [JWT_PROVIDER, 'JwtProvider', JwtProvider],
})
export class SharedInfrastructureProviderJwtModule {}
