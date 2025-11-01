import { Module } from '@nestjs/common';

import { AuthController } from '@modules/auth/auth.controller';
import { AuthServicesModule } from '@modules/auth/services/auth.use-case.module';
import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [LogModule, AuthServicesModule],
  controllers: [AuthController],
})
export class AuthModule {}
