import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ENVIRONMENT_SERVICE_PROVIDER } from '@config/config.token';
import envValidation from '@config/env.validation';
import { EnvironmentProvider } from '@config/infrastructure/providers/environment.provider';

const pathLocationEnvFile = join(process.cwd(), '.env');

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
      envFilePath: pathLocationEnvFile,
    }),
  ],
  providers: [
    {
      provide: ENVIRONMENT_SERVICE_PROVIDER,
      useClass: EnvironmentProvider,
    },
  ],
  exports: [ENVIRONMENT_SERVICE_PROVIDER],
})
export class ConfigModule {}
