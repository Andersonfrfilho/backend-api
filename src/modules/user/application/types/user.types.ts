import { User } from '@app/modules/shared/domain/entities/user.entity';

export interface CreateUserParams extends Partial<User> {}

export interface UpdateUserParams extends Partial<User> {}
