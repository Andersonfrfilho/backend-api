import { Address } from '@app/modules/shared/domain/entities/address.entity';
import { User } from '@app/modules/shared/domain/entities/user.entity';

interface AddressDto
  extends Omit<Address, 'id' | 'active' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}
interface CreateUserDto
  extends Omit<User, 'id' | 'phones' | 'addresses' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  phone: string;
  address: AddressDto;
}
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
