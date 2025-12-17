import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@modules/shared/domain/entities/user.entity';
import { UserErrorFactory } from '@modules/user/application/factories';
import { CreateUserParams, UpdateUserParams } from '@modules/user/application/types';
import { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private typeormRepo: Repository<User>,
  ) {}
  async update(id: string, user: UpdateUserParams): Promise<User> {
    await this.typeormRepo.update(id, user as any);
    const updatedUser = await this.typeormRepo.findOne({
      where: { id },
    });
    if (!updatedUser) {
      throw UserErrorFactory.notFound(id);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }

  async create(user: CreateUserParams): Promise<User> {
    const newUser = this.typeormRepo.create(user);
    return this.typeormRepo.save(newUser);
  }

  async findById(id: string): Promise<User | null> {
    return this.typeormRepo.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.typeormRepo.findOne({
      where: { email },
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.typeormRepo.findOne({
      where: { details: { cpf } },
    });
  }

  async findByRg(rg: string): Promise<User | null> {
    return this.typeormRepo.findOne({
      where: { details: { rg } },
    });
  }
}
