import { ApiExtraModels } from '@nestjs/swagger';

import {
  AuthLoginSessionParamsDto,
  AuthLoginSessionResponseDto,
} from '@modules/auth/services/login-session/auth.login-session.dto';

@ApiExtraModels(AuthLoginSessionParamsDto)
export class AuthLoginSessionControllerParams extends AuthLoginSessionParamsDto {}
@ApiExtraModels(AuthLoginSessionResponseDto)
export class AuthLoginSessionControllerResponse extends AuthLoginSessionResponseDto {}
