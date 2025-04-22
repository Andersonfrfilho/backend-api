import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envValidation from './config/env.validation';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { ProviderModule } from './providers/provider.module';
import { InterceptorModule } from './interceptors/interceptor.module';
import { ErrorModule } from './error/error.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    ErrorModule,
    InterceptorModule,
    ProviderModule,
    HealthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
