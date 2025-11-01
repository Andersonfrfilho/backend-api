import { AuthLoginSessionControllerRequestDto } from '@modules/auth/application/dtos/LoginSessionRequest.dto';
import { AuthLoginSessionControllerResponseDto } from '@modules/auth/application/dtos/LoginSessionResponse.dto';

export interface AuthLoginSessionControllerInterface {
  loginSession(
    params: AuthLoginSessionControllerRequestDto,
  ): Promise<AuthLoginSessionControllerResponseDto>;
}

export interface AuthLoginSessionServiceInterface {
  execute(
    params: AuthLoginSessionControllerRequestDto,
  ): Promise<AuthLoginSessionControllerResponseDto>;
}
