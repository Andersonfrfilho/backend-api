import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Address } from '../../domain/entities/address.entity';
import { IAddressRepository } from '../../domain/repositories/address.repository.interface';

@Injectable()
export class AddressRepository implements IAddressRepository {
  private typeormRepo: Repository<Address>;

  constructor(private dataSource: DataSource) {
    this.typeormRepo = this.dataSource.getRepository(Address);
  }

  async createAddress(
    address: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Address> {
    const newAddress = this.typeormRepo.create(address);
    return this.typeormRepo.save(newAddress);
  }

  async findById(id: string): Promise<Address | null> {
    return this.typeormRepo.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return this.typeormRepo
      .createQueryBuilder('address')
      .innerJoin('address.userAddresses', 'userAddress', 'userAddress.userId = :userId', { userId })
      .getMany();
  }

  async findByCity(city: string): Promise<Address[]> {
    return this.typeormRepo.find({ where: { city } });
  }

  async findByZipCode(zipCode: string): Promise<Address[]> {
    return this.typeormRepo.find({ where: { zipCode } });
  }

  async updateAddress(id: string, address: Partial<Address>): Promise<Address | null> {
    await this.typeormRepo.update({ id } as any, { ...address, updatedAt: new Date() });
    return this.typeormRepo.findOne({ where: { id } });
  }

  async deleteAddress(id: string): Promise<void> {
    await this.typeormRepo.softDelete(id);
  }

  async findAll(skip = 0, take = 10): Promise<[Address[], number]> {
    return this.typeormRepo.findAndCount({ skip, take });
  }
}
