import { Injectable } from '@nestjs/common';

import { AuthLoginSessionUseCaseInterface } from '@modules/auth/domain/auth.login-session.interface';
import {
  AuthLoginSessionRequestDto as AuthLoginSessionUseCaseParamsDto,
  AuthLoginSessionResponseDto as AuthLoginSessionUseCaseResponseDto,
} from '@modules/auth/shared/dtos';

@Injectable()
export class AuthLoginSessionUseCase implements AuthLoginSessionUseCaseInterface {
  execute(_: AuthLoginSessionUseCaseParamsDto): Promise<AuthLoginSessionUseCaseResponseDto> {
    const response: AuthLoginSessionUseCaseResponseDto = {
      accessToken: 'mocked-access-token' + _.email,
      refreshToken: 'mocked-refresh-token',
    };
    return Promise.resolve(response);
  }
}
