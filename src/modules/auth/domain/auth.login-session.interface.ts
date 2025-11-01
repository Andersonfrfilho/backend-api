import { AuthLoginSessionRequestDto, AuthLoginSessionResponseDto } from '../shared/dtos';

export interface AuthLoginSessionServiceParams extends AuthLoginSessionRequestDto {}
export interface AuthLoginSessionServiceResponse extends AuthLoginSessionResponseDto {}

export interface AuthLoginSessionUseCaseInterface {
  execute(params: AuthLoginSessionServiceParams): Promise<AuthLoginSessionServiceResponse>;
}
