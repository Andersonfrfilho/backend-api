import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PHONE_REPOSITORY_PROVIDE } from '@modules/phone/infrastructure/phone.token';
import { PhoneRepository } from '@modules/phone/infrastructure/repositories/phone.repository';
import { User } from '@modules/shared/domain/entities/user.entity';
import { SharedModule } from '@modules/shared/shared.module';

import { PhoneModule } from '../phone/phone.module';

import { UserApplicationCreateUseCase } from './application/use-cases/create-user.use-case';
import { UserController } from './infrastructure/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './infrastructure/user.service';
import {
  USER_CREATE_USE_CASE_PROVIDE,
  USER_REPOSITORY_PROVIDE,
  USER_SERVICE_PROVIDE,
} from './infrastructure/user.token';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule, PhoneModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY_PROVIDE,
      useClass: UserRepository,
    },
    {
      provide: PHONE_REPOSITORY_PROVIDE,
      useClass: PhoneRepository,
    },
    {
      provide: USER_CREATE_USE_CASE_PROVIDE,
      useClass: UserApplicationCreateUseCase,
    },
    {
      provide: USER_SERVICE_PROVIDE,
      useClass: UserService,
    },
  ],
  exports: [
    USER_REPOSITORY_PROVIDE,
    USER_SERVICE_PROVIDE,
    USER_CREATE_USE_CASE_PROVIDE,
    PHONE_REPOSITORY_PROVIDE,
  ],
})
export class UserModule {}
