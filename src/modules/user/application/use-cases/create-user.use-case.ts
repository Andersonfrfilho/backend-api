import { Inject, Injectable } from '@nestjs/common';

import { UserErrorFactory } from '@modules/error/application/factories';
import type { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_PROVIDE } from '@modules/user/infrastructure/user.token';

import type {
  UserCreateUseCaseInterface,
  UserCreateUseCaseParams,
  UserCreateUseCaseResponse,
} from '../interfaces/create-user.interface';

@Injectable()
export class UserApplicationCreateUseCase implements UserCreateUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDE)
    private readonly userRepositoryProvide: UserRepositoryInterface,
  ) {}
  async execute(params: UserCreateUseCaseParams): Promise<UserCreateUseCaseResponse> {
    if (!params.email) {
      throw UserErrorFactory.invalidPassword();
    }

    const userAlreadyExists = await this.userRepositoryProvide.findByEmail(params.email);

    if (userAlreadyExists) {
      throw UserErrorFactory.duplicateEmail(params.email);
    }

    return this.userRepositoryProvide.create(params as any);
  }
}
