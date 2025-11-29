import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@modules/shared/domain/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from '@modules/user/application/types';
import { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private typeormRepo: Repository<User>,
  ) {}
  update(id: string, user: UpdateUserParams): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
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
