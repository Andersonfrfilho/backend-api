import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../shared/domain/entities/user.entity';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { USER_REPOSITORY_PROVIDE } from './infrastructure/user.token';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: USER_REPOSITORY_PROVIDE,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY_PROVIDE],
})
export class UserModule {}
