import { UserAddress } from '@modules/shared/domain/entities/user-address.entity';
import { AddressTypeEnum } from '@modules/shared/domain/enums/address-type.enum';

export interface CreateUserAddressParams {
  userId: string;
  addressId: string;
  type: AddressTypeEnum;
  isPrimary: boolean;
}

export interface UpdateUserAddressParams {
  type?: AddressTypeEnum;
  isPrimary?: boolean;
}

export interface UserAddressRepositoryInterface {
  create(userAddress: CreateUserAddressParams): Promise<UserAddress>;
  findById(id: string): Promise<UserAddress | null>;
  findByUserId(userId: string): Promise<UserAddress[]>;
  findByAddressId(addressId: string): Promise<UserAddress[]>;
  findPrimaryByUserId(userId: string): Promise<UserAddress | null>;
  update(id: string, userAddress: UpdateUserAddressParams): Promise<UserAddress>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;

  /**
   * Cria uma relação entre usuário e endereço com tipo e primary flag
   * Otimizado para evitar queries grandes
   */
  linkUserToAddress(
    userId: string,
    addressId: string,
    type: AddressTypeEnum,
    isPrimary?: boolean,
  ): Promise<UserAddress>;

  /**
   * Remove a relação entre usuário e endereço específico
   */
  unlinkUserFromAddress(userId: string, addressId: string): Promise<void>;

  /**
   * Encontra endereços de um usuário com filtro de tipo
   */
  findByUserIdAndType(userId: string, type: AddressTypeEnum): Promise<UserAddress[]>;
}
