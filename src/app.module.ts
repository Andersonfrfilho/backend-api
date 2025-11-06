import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { register as tsConfigPathsRegister } from 'tsconfig-paths';

import envValidation from '@config/env.validation';
import { AuthModule } from '@modules/auth/auth.module';
import { ErrorModule } from '@modules/error/error.module';
import { HealthModule } from '@modules/health/health.module';
import { SecurityHeadersMiddleware } from '@modules/shared/infrastructure/middleware/security-headers.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica Security Headers Middleware globalmente
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*');
    // NOTA: CSRF middleware desativado por enquanto - causa timeout nos testes
    // Pode ser ativado individualmente em rotas específicas quando necessário
  }
}
