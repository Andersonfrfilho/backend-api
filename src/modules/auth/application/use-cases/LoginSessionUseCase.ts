import { Injectable } from '@nestjs/common';

import { AuthLoginSessionUseCaseInterface } from '../../domain/auth.login-session.interface';
import { AuthLoginSessionUseCaseParamsDto } from '../dtos/LoginSessionRequest.dto';
import { AuthLoginSessionUseCaseResponseDto } from '../dtos/LoginSessionResponse.dto';

@Injectable()
export class AuthLoginSessionUseCase implements AuthLoginSessionUseCaseInterface {
  execute(_: AuthLoginSessionUseCaseParamsDto): Promise<AuthLoginSessionUseCaseResponseDto> {
    const response: AuthLoginSessionUseCaseResponseDto = {
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
    };
    return Promise.resolve(response);
  }
}
