import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Phone } from '@modules/phone/domain/entities/phone.entity';
import { PHONE_REPOSITORY_PROVIDE } from '@modules/phone/infrastructure/phone.token';
import { PhoneRepository } from '@modules/phone/infrastructure/repositories/phone.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Phone])],
  providers: [
    {
      provide: PHONE_REPOSITORY_PROVIDE,
      useClass: PhoneRepository,
    },
  ],
  exports: [PHONE_REPOSITORY_PROVIDE],
})
export class PhoneModule {}
