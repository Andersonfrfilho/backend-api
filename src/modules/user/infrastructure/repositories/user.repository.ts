// users/infrastructure/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@app/modules/shared/domain/entities/user.entity';

import { CreateUserParams, UpdateUserParams } from '../../application/types';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private typeormRepo: Repository<User>,
  ) {}
  async create(user: CreateUserParams): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, user: UpdateUserParams): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
