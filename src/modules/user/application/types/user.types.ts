import { UserType } from '@app/modules/shared/domain/entities/user-types.entity';
import { User } from '@app/modules/shared/domain/entities/user.entity';

export interface CreateUserParams extends Partial<User> {
  userType: UserType;
}

export interface UpdateUserParams extends Partial<User> {}
