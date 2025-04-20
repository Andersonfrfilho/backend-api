import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envValidation from './config/env.validation';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { ProviderModule } from './providers/provider.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    ProviderModule,
    HealthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
