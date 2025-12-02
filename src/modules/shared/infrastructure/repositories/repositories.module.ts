import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserType } from '@modules/shared/domain/entities/user-types.entity';
import { UserTypeRepository } from '@modules/shared/infrastructure/repositories/user-type.repository';
import { USER_TYPE_REPOSITORY_PROVIDE } from '@modules/shared/infrastructure/user-type.token';

@Module({
  imports: [TypeOrmModule.forFeature([UserType])],
  providers: [
    {
      provide: USER_TYPE_REPOSITORY_PROVIDE,
      useClass: UserTypeRepository,
    },
  ],
  exports: [USER_TYPE_REPOSITORY_PROVIDE, TypeOrmModule],
})
export class SharedRepositoriesModule {}
