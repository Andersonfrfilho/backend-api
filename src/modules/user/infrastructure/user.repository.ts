import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  MethodNotImplementedErrorFactory,
  UserErrorFactory,
} from '@modules/error/application/factories';
import { User } from '@modules/shared/domain/entities/user.entity';
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
    throw MethodNotImplementedErrorFactory.methodNotImplemented('UserRepository.delete');
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
}
