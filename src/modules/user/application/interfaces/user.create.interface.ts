import { User } from '@app/modules/shared/domain/entities/user.entity';

interface CreateUserDto extends Partial<User> {}
export interface UserCreateUseCaseParams extends CreateUserDto {}
export interface UserCreateUseCaseResponse extends User {}
export interface UserCreateUseCaseInterface {
  execute(dto: UserCreateUseCaseParams): Promise<UserCreateUseCaseResponse>;
}

export interface UserServiceParams extends CreateUserDto {}
export interface UserServiceResponse extends User {}

export interface UserServiceInterface {
  createUser(dto: UserServiceParams): Promise<UserServiceResponse>;
}
