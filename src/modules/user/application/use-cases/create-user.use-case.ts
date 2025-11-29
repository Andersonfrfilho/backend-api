import { Inject, Injectable } from '@nestjs/common';

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
    console.log('###### params=>', params);
    return this.userRepositoryProvide.create(params);
  }
}
