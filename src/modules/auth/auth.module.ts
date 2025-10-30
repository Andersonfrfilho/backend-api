import { Module } from '@nestjs/common';
import { LogModule } from '@core/providers/log/log.module';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthServicesModule } from './services/auth.use-case.module';
@Module({
  imports: [LogModule, AuthServicesModule],
  controllers: [AuthController],
})
export class AuthModule {}
