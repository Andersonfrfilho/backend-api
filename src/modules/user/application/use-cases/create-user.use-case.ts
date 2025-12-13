import { Inject, Injectable } from '@nestjs/common';

import type { AddressRepositoryInterface } from '@app/modules/address/domain/repositories/address.repository.interface';
import { ADDRESS_REPOSITORY_PROVIDE } from '@app/modules/address/infrastructure/address.token';
import type { PhoneRepositoryInterface } from '@app/modules/phone/domain/repositories/phone.repository.interface';
import { PHONE_REPOSITORY_PROVIDE } from '@app/modules/phone/infrastructure/phone.token';
import { AddressTypeEnum } from '@app/modules/shared';
import { UserErrorFactory } from '@modules/user/application/factories';
import type { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_PROVIDE } from '@modules/user/infrastructure/user.token';

import type { UserAddressRepositoryInterface } from '../../domain/repositories/user-address.repository.interface';
import { USER_ADDRESS_REPOSITORY_PROVIDE } from '../../infrastructure/user-address.token';
import type {
  UserCreateUseCaseInterface,
  UserCreateUseCaseParams,
  UserCreateUseCaseResponse,
} from '../interfaces/create-user.interface';
import { parsePhone } from '../util/phone.util';

@Injectable()
export class UserApplicationCreateUseCase implements UserCreateUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDE)
    private readonly userRepositoryProvide: UserRepositoryInterface,
    @Inject(PHONE_REPOSITORY_PROVIDE)
    private readonly phoneRepositoryProvide: PhoneRepositoryInterface,
    @Inject(ADDRESS_REPOSITORY_PROVIDE)
    private readonly addressRepositoryProvide: AddressRepositoryInterface,
    @Inject(USER_ADDRESS_REPOSITORY_PROVIDE)
    private readonly userAddressRepositoryProvide: UserAddressRepositoryInterface,
  ) {}
  async execute(params: UserCreateUseCaseParams): Promise<UserCreateUseCaseResponse> {
    const [userByEmail, userByCpf, userByRg] = await Promise.all([
      this.userRepositoryProvide.findByEmail(params.email),
      this.userRepositoryProvide.findByCpf(params.cpf),
      this.userRepositoryProvide.findByRg(params.rg),
    ]);

    if (userByEmail) {
      throw UserErrorFactory.duplicateEmail(params.email);
    }

    if (userByCpf) {
      throw UserErrorFactory.duplicateCpf(params.cpf);
    }

    if (userByRg) {
      throw UserErrorFactory.duplicateRg(params.rg);
    }

    const phoneFormatted = parsePhone(params.phone);

    const user = await this.userRepositoryProvide.create({
      ...params,
    });
    await this.phoneRepositoryProvide.create({
      ...phoneFormatted,
      userId: user.id,
    });

    const address = await this.addressRepositoryProvide.create(params.address);

    await this.userAddressRepositoryProvide.create({
      userId: user.id,
      addressId: address.id,
      isPrimary: true,
      type: AddressTypeEnum.RESIDENTIAL,
    });
    return user;
  }
}
