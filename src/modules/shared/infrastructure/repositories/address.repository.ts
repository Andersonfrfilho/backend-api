import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Address } from '../../domain/entities/address.entity';
import { IAddressRepository } from '../../domain/repositories/address.repository.interface';

@Injectable()
export class AddressRepository extends Repository<Address> implements IAddressRepository {
  constructor(private dataSource: DataSource) {
    super(Address, dataSource.createEntityManager());
  }

  async createAddress(
    address: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Address> {
    const newAddress = super.create(address);
    return this.save(newAddress);
  }

  async findById(id: string): Promise<Address | null> {
    return this.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return this.createQueryBuilder('address')
      .innerJoin('address.userAddresses', 'userAddress', 'userAddress.userId = :userId', { userId })
      .getMany();
  }

  async findByCity(city: string): Promise<Address[]> {
    return this.find({ where: { city } });
  }

  async findByZipCode(zipCode: string): Promise<Address[]> {
    return this.find({ where: { zipCode } });
  }

  async updateAddress(id: string, address: Partial<Address>): Promise<Address | null> {
    await super.update({ id } as any, { ...address, updatedAt: new Date() });
    return this.findOne({ where: { id } });
  }

  async deleteAddress(id: string): Promise<void> {
    await this.softDelete(id);
  }

  async findAll(skip = 0, take = 10): Promise<[Address[], number]> {
    return this.findAndCount({ skip, take });
  }
}
