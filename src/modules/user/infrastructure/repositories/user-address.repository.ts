import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserAddress } from '@modules/shared/domain/entities/user-address.entity';
import { UserAddressErrorFactory } from '@modules/user/application/factories/user-address.error.factory';
import type {
  CreateUserAddressParams,
  UpdateUserAddressParams,
  UserAddressRepositoryInterface,
} from '@modules/user/domain/repositories/user-address.repository.interface';

@Injectable()
export class UserAddressRepository implements UserAddressRepositoryInterface {
  constructor(
    @InjectRepository(UserAddress)
    private typeormRepo: Repository<UserAddress>,
  ) {}

  async create(userAddress: CreateUserAddressParams): Promise<UserAddress> {
    const newUserAddress = this.typeormRepo.create(userAddress);
    return this.typeormRepo.save(newUserAddress);
  }

  async findById(id: string): Promise<UserAddress | null> {
    return this.typeormRepo.findOne({
      where: { id },
      relations: ['user', 'address'],
    });
  }

  async findByUserId(userId: string): Promise<UserAddress[]> {
    return this.typeormRepo.find({
      where: { userId },
      relations: ['address'],
    });
  }

  async findByAddressId(addressId: string): Promise<UserAddress[]> {
    return this.typeormRepo.find({
      where: { addressId },
      relations: ['user'],
    });
  }

  async findPrimaryByUserId(userId: string): Promise<UserAddress | null> {
    return this.typeormRepo.findOne({
      where: { userId, isPrimary: true },
      relations: ['address'],
    });
  }

  async update(id: string, userAddress: UpdateUserAddressParams): Promise<UserAddress> {
    await this.typeormRepo.update(id, userAddress);
    const updated = await this.typeormRepo.findOne({
      where: { id },
      relations: ['user', 'address'],
    });
    if (!updated) {
      throw UserAddressErrorFactory.notFound(id);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.typeormRepo.delete({ userId });
  }

  /**
   * Cria uma relação entre usuário e endereço com tipo e primary flag
   * Otimizado para evitar queries grandes
   */
  async linkUserToAddress(
    userId: string,
    addressId: string,
    type: string,
    isPrimary: boolean = false,
  ): Promise<UserAddress> {
    return this.create({
      userId,
      addressId,
      type: type as any,
      isPrimary,
    });
  }

  /**
   * Remove a relação entre usuário e endereço específico
   */
  async unlinkUserFromAddress(userId: string, addressId: string): Promise<void> {
    await this.typeormRepo.delete({ userId, addressId });
  }

  /**
   * Encontra endereços de um usuário com filtro de tipo
   */
  async findByUserIdAndType(userId: string, type: string): Promise<UserAddress[]> {
    return this.typeormRepo.find({
      where: { userId, type: type as any },
      relations: ['address'],
    });
  }
}
