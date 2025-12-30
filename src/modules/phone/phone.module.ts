import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PHONE_REPOSITORY_PROVIDE } from '@modules/phone/infrastructure/phone.token';
import { PhoneRepository } from '@modules/phone/infrastructure/repositories/phone.repository';
import { Phone } from '@modules/shared/domain/entities/phone.entity';

import { CONNECTIONS_NAMES } from '../shared/infrastructure/providers/database/database.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Phone], CONNECTIONS_NAMES.POSTGRES)],
  providers: [
    {
      provide: PHONE_REPOSITORY_PROVIDE,
      useClass: PhoneRepository,
    },
  ],
  exports: [PHONE_REPOSITORY_PROVIDE],
})
export class PhoneModule {}
