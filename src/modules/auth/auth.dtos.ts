export {
  BadRequestErrorValidationRequestDto,
  InternalServerErrorDto,
} from '@modules/error/dtos/errors.dto';
import { ApiExtraModels } from '@nestjs/swagger';

import {
  AuthLoginSessionParamsDto,
  AuthLoginSessionResponseDto,
} from '@modules/auth/services/login-session/auth.login-session.dto';
import {
  BadRequestErrorValidationRequestDto,
  InternalServerErrorDto,
} from '@modules/error/dtos/errors.dto';

@ApiExtraModels(AuthLoginSessionParamsDto)
export class AuthLoginSessionControllerParams extends AuthLoginSessionParamsDto {}
@ApiExtraModels(AuthLoginSessionResponseDto)
export class AuthLoginSessionControllerResponse extends AuthLoginSessionResponseDto {}

@ApiExtraModels(BadRequestErrorValidationRequestDto)
export class AuthBadRequestErrorValidationRequestDto extends BadRequestErrorValidationRequestDto {}
@ApiExtraModels(InternalServerErrorDto)
export class AuthLoginSessionServiceInternalServerErrorDto extends InternalServerErrorDto {}
