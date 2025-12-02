import type { UserType } from '../entities/user-types.entity';
import type { UserTypeEnum } from '../enums/user-type.enum';

export interface UserTypeRepositoryInterface {
  create(data: Partial<UserType>): Promise<UserType>;
  findById(id: string): Promise<UserType | null>;
  findByUserId(userId: string): Promise<UserType[]>;
  findByUserIdAndType(userId: string, type: UserTypeEnum): Promise<UserType | null>;
  findByType(type: UserTypeEnum): Promise<UserType | null>;
  update(id: string, data: Partial<UserType>): Promise<UserType>;
  delete(id: string): Promise<boolean>;
}
