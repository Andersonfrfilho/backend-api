import { Address } from '../entities/address.entity';

export interface IAddressRepository {
  createAddress(
    address: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  findByCity(city: string): Promise<Address[]>;
  findByZipCode(zipCode: string): Promise<Address[]>;
  updateAddress(id: string, address: Partial<Address>): Promise<Address | null>;
  deleteAddress(id: string): Promise<void>;
  findAll(skip?: number, take?: number): Promise<[Address[], number]>;
}
