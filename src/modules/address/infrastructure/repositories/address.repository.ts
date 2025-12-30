import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddressErrorFactory } from '@modules/address/application/factories/address.error.factory';
import type {
  AddressRepositoryInterface,
  CreateAddressParams,
  UpdateAddressParams,
} from '@modules/address/domain/repositories/address.repository.interface';
import { Address } from '@modules/shared/domain/entities/address.entity';

@Injectable()
export class AddressRepository implements AddressRepositoryInterface {
  constructor(
    @InjectRepository(Address, 'postgres')
    private typeormRepo: Repository<Address>,
  ) {}

  async create(address: CreateAddressParams): Promise<Address> {
    const newAddress = this.typeormRepo.create({
      ...address,
      active: true,
    });
    return this.typeormRepo.save(newAddress);
  }

  async findById(id: string): Promise<Address | null> {
    return this.typeormRepo.findOne({
      where: { id },
    });
  }

  async findByCity(city: string): Promise<Address[]> {
    return this.typeormRepo.find({
      where: { city },
    });
  }

  async findByState(state: string): Promise<Address[]> {
    return this.typeormRepo.find({
      where: { state },
    });
  }

  async update(id: string, address: UpdateAddressParams): Promise<Address> {
    await this.typeormRepo.update(id, address);
    const updated = await this.typeormRepo.findOne({
      where: { id },
    });
    if (!updated) {
      throw AddressErrorFactory.notFound(id);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }
}
