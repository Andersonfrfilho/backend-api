import { Inject, Injectable } from '@nestjs/common';

import type { PhoneRepositoryInterface } from '@app/modules/phone/domain/repositories/phone.repository.interface';
import { PHONE_REPOSITORY_PROVIDE } from '@app/modules/phone/infrastructure/phone.token';
import { UserErrorFactory } from '@modules/user/application/factories';
import type { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_PROVIDE } from '@modules/user/infrastructure/user.token';

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
    console.log('Parsed phone:', phoneFormatted);
    const user = await this.userRepositoryProvide.create({
      ...params,
    });
    console.log('Created user:', user);
    await this.phoneRepositoryProvide.create({
      ...phoneFormatted,
      userId: user.id,
    });
    console.log('Created phone:', phoneFormatted);
    return user;
  }
}
