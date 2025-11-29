import { Module } from '@nestjs/common';

import { HealthInfrastructureServiceModule } from '@modules/health/infrastructure/services/health.service.module';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [UserRepository, UserService],
  controllers: [UserController],
  exports: [HealthInfrastructureServiceModule],
})
export class UserInfrastructureModule {}
