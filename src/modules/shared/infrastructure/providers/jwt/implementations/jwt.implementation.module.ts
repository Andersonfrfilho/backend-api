import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigModule } from '@app/config/config.module';

import { JWT_JSONWEBTOKEN_PROVIDER } from '../jwt.token';

import { PassportJwtProvider } from './passport/passport.jwt.provider';

export const createJwtProvider = (configService: ConfigService) => {
  const secret = configService.get<string>('JWT_SECRET', 'default-secret-key');
  return new PassportJwtProvider(secret);
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: JWT_JSONWEBTOKEN_PROVIDER,
      useFactory: createJwtProvider,
      inject: [ConfigService],
    },
  ],
  exports: [JWT_JSONWEBTOKEN_PROVIDER],
})
export class SharedInfrastructureProviderJwtImplementationModule {}
