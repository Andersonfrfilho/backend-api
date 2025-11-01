import { ApiExtraModels } from '@nestjs/swagger';

import { AuthLoginSessionResponseDto } from '@modules/auth/shared/dtos';

@ApiExtraModels(AuthLoginSessionResponseDto)
export class AuthLoginSessionControllerResponseDto extends AuthLoginSessionResponseDto {}

export interface AuthLoginSessionServiceResponseDto extends AuthLoginSessionResponseDto {}

export interface AuthLoginSessionUseCaseResponseDto extends AuthLoginSessionResponseDto {}
