import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address } from '@modules/shared/domain/entities/address.entity';
import { UserAddress } from '@modules/shared/domain/entities/user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, UserAddress])],
})
export class SharedRepositoriesModule {}
