import { Inject, Injectable } from '@nestjs/common';

import type { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY_PROVIDE } from '../../infrastructure/user.token';
import type {
  UserCreateUseCaseInterface,
  UserCreateUseCaseParams,
  UserCreateUseCaseResponse,
} from '../interfaces/user.create.interface';

@Injectable()
export class UserApplicationCreateUseCase implements UserCreateUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDE)
    private readonly userRepositoryProvide: UserRepositoryInterface,
  ) {}
  async execute(params: UserCreateUseCaseParams): Promise<UserCreateUseCaseResponse> {
    return this.userRepositoryProvide.create(params);
  }
}
