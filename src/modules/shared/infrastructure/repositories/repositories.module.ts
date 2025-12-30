import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address } from '@modules/shared/domain/entities/address.entity';
import { UserAddress } from '@modules/shared/domain/entities/user-address.entity';

import { CONNECTIONS_NAMES } from '../providers/database/database.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Address, UserAddress], CONNECTIONS_NAMES.POSTGRES)],
})
export class SharedRepositoriesModule {}
