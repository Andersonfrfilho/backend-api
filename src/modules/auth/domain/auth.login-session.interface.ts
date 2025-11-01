import { AuthLoginSessionRequestDto, AuthLoginSessionResponseDto } from '@modules/auth/shared/dtos';

interface AuthLoginSessionServiceParams extends AuthLoginSessionRequestDto {}
interface AuthLoginSessionServiceResponse extends AuthLoginSessionResponseDto {}
interface AuthLoginSessionUseCaseParams extends AuthLoginSessionServiceParams {}
interface AuthLoginSessionUseCaseResponse extends AuthLoginSessionServiceResponse {}

export interface AuthLoginSessionUseCaseInterface {
  execute(params: AuthLoginSessionUseCaseParams): Promise<AuthLoginSessionUseCaseResponse>;
}

export interface AuthLoginSessionServiceInterface {
  execute(params: AuthLoginSessionServiceParams): Promise<AuthLoginSessionServiceResponse>;
}
