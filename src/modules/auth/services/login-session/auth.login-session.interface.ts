import {
  AuthLoginSessionParamsDto,
  AuthLoginSessionResponseDto,
} from './auth.login-session.dto';

export const AUTH_LOGIN_SESSION_SERVICE_PROVIDE =
  'AUTH_LOGIN_SESSION_SERVICE_PROVIDE';

export interface AuthLoginSessionServiceParams
  extends AuthLoginSessionParamsDto {}
export interface AuthLoginSessionServiceResponse
  extends AuthLoginSessionResponseDto {}

export interface AuthLoginSessionServiceInterface {
  execute(
    params: AuthLoginSessionServiceParams,
  ): Promise<AuthLoginSessionServiceResponse>;
}
