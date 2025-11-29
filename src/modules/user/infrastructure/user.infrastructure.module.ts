import { Module } from '@nestjs/common';

import { HealthInfrastructureServiceModule } from '@modules/health/infrastructure/services/health.service.module';
import { UserController } from '@modules/user/infrastructure/user.controller';
import { UserRepository } from '@modules/user/infrastructure/user.repository';
import { UserService } from '@modules/user/infrastructure/user.service';

@Module({
  imports: [UserRepository, UserService],
  controllers: [UserController],
  exports: [HealthInfrastructureServiceModule],
})
export class UserInfrastructureModule {}
