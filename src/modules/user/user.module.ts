import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddress } from '@modules/shared/domain/entities/user-address.entity';
import { User } from '@modules/shared/domain/entities/user.entity';
import { SharedModule } from '@modules/shared/shared.module';

import { AddressModule } from '../address/address.module';
import { PhoneModule } from '../phone/phone.module';

import { UserApplicationCreateUseCase } from './application/use-cases/create-user.use-case';
import { UserAddressRepository } from './infrastructure/repositories/user-address.repository';
import { USER_ADDRESS_REPOSITORY_PROVIDE } from './infrastructure/user-address.token';
import { UserController } from './infrastructure/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './infrastructure/user.service';
import {
  USER_CREATE_USE_CASE_PROVIDE,
  USER_REPOSITORY_PROVIDE,
  USER_SERVICE_PROVIDE,
} from './infrastructure/user.token';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAddress]),
    SharedModule,
    PhoneModule,
    AddressModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY_PROVIDE,
      useClass: UserRepository,
    },
    {
      provide: USER_ADDRESS_REPOSITORY_PROVIDE,
      useClass: UserAddressRepository,
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
    USER_ADDRESS_REPOSITORY_PROVIDE,
  ],
})
export class UserModule {}
