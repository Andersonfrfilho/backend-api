import { User } from '@modules/shared/domain/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from '@modules/user/application/types';

export interface UserRepositoryInterface {
  create(user: CreateUserParams): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findByRg(rg: string): Promise<User | null>;
  update(id: string, user: UpdateUserParams): Promise<User>;
  delete(id: string): Promise<void>;
}
