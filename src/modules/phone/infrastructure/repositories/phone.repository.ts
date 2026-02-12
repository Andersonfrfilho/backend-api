/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {
  CreatePhoneParams,
  PhoneRepositoryInterface,
} from '@modules/phone/domain/repositories/phone.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppErrorFactory } from '@modules/error/application/app.error.factory';
import { Phone } from '@modules/shared/domain/entities/phone.entity';

@Injectable()
export class PhoneRepository implements PhoneRepositoryInterface {
  constructor(
    @InjectRepository(Phone, 'postgres')
    private typeormRepo: Repository<Phone>,
  ) {}

  async create(phone: CreatePhoneParams): Promise<Phone> {
    const newPhone = this.typeormRepo.create(phone);
    return this.typeormRepo.save(newPhone);
  }

  async findById(id: string): Promise<Phone | null> {
    return this.typeormRepo.findOne({
      where: { id: id },
    });
  }

  async findByUserId(userId: string): Promise<Phone[]> {
    return this.typeormRepo.find({
      where: { userId },
    });
  }

  async update(id: string, phone: Partial<CreatePhoneParams>): Promise<Phone> {
    await this.typeormRepo.update(id, phone as any);
    const updated = await this.typeormRepo.findOne({
      where: { id: id },
    });
    if (!updated) {
      throw AppErrorFactory.notFound({
        message: 'Phone not found',
        code: 'PHONE_NOT_FOUND',
      });
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }
}
