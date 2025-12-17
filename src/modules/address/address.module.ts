import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ADDRESS_REPOSITORY_PROVIDE } from '@modules/address/infrastructure/address.token';
import { AddressRepository } from '@modules/address/infrastructure/repositories/address.repository';
import { Address } from '@modules/shared/domain/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [
    {
      provide: ADDRESS_REPOSITORY_PROVIDE,
      useClass: AddressRepository,
    },
  ],
  exports: [ADDRESS_REPOSITORY_PROVIDE],
})
export class AddressModule {}
