import { Module } from '@nestjs/common';
import { register as tsConfigPathsRegister } from 'tsconfig-paths';
import * as tsConfig from '../tsconfig.json';
import envValidation from '@config/env.validation';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CoreModule } from '@core/core.module';
import { CommonModule } from '@common/common.module';
import { ErrorModule } from '@modules/error/error.module';

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
    CommonModule,
    CoreModule,
    ErrorModule,
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
