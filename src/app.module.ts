import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { register as tsConfigPathsRegister } from 'tsconfig-paths';

import envValidation from '@config/env.validation';
import { AuthModule } from '@modules/auth/auth.module';
import { ErrorModule } from '@modules/error/error.module';
import { HealthModule } from '@modules/health/health.module';

import * as tsConfig from '../tsconfig.json';

import { SharedModule } from './modules/shared/shared.module';

const compilerOptions = tsConfig.compilerOptions;
tsConfigPathsRegister({
  baseUrl: compilerOptions.baseUrl,
  paths: compilerOptions.paths,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
      envFilePath: '.env',
    }),
    SharedModule,
    ErrorModule,
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
