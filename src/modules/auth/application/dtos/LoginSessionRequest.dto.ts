import { ApiExtraModels } from '@nestjs/swagger';

import { AuthLoginSessionRequestDto } from '@modules/auth/shared/dtos';

@ApiExtraModels(AuthLoginSessionRequestDto)
export class AuthLoginSessionControllerRequestDto extends AuthLoginSessionRequestDto {}

export interface AuthLoginSessionServiceRequestDto extends AuthLoginSessionRequestDto {}

export interface AuthLoginSessionUseCaseParamsDto extends AuthLoginSessionRequestDto {}
