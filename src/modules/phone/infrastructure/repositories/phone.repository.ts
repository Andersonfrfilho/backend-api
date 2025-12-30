import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type {
  CreatePhoneParams,
  PhoneRepositoryInterface,
} from '@modules/phone/domain/repositories/phone.repository.interface';
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
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Phone[]> {
    return this.typeormRepo.find({
      where: { userId },
    });
  }

  async update(id: string, phone: Partial<CreatePhoneParams>): Promise<Phone> {
    await this.typeormRepo.update(id, phone);
    const updated = await this.typeormRepo.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error('Phone not found');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }
}
