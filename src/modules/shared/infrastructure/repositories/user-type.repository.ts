import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserType } from '@modules/shared/domain/entities/user-types.entity';
import type { UserTypeEnum } from '@modules/shared/domain/enums/user-type.enum';
import type { UserTypeRepositoryInterface } from '@modules/shared/domain/repositories/user-type.repository.interface';

@Injectable()
export class UserTypeRepository implements UserTypeRepositoryInterface {
  constructor(
    @InjectRepository(UserType)
    private readonly repository: Repository<UserType>,
  ) {}

  async create(data: Partial<UserType>): Promise<UserType> {
    const userType = this.repository.create(data);
    return this.repository.save(userType);
  }

  async findById(id: string): Promise<UserType | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<UserType[]> {
    return this.repository.find({
      where: { userId, active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserIdAndType(userId: string, type: UserTypeEnum): Promise<UserType | null> {
    return this.repository.findOne({
      where: { userId, type, active: true },
    });
  }

  async findByType(type: UserTypeEnum): Promise<UserType | null> {
    return this.repository.findOne({
      where: { type, active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, data: Partial<UserType>): Promise<UserType> {
    const { user, ...updateData } = data;
    await this.repository.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('UserType not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
