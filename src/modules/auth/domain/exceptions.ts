import { HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import {
  BadRequestErrorValidationRequestDto,
  InternalServerErrorDto,
} from '@modules/error/dtos/errors.dto';

@ApiExtraModels(BadRequestErrorValidationRequestDto)
export class AuthBadRequestErrorValidationRequestDto extends BadRequestErrorValidationRequestDto {}
@ApiExtraModels(InternalServerErrorDto)
export class AuthLoginSessionServiceInternalServerErrorDto extends InternalServerErrorDto {}

export class AuthLoginSessionServiceErrorNotFoundDto {
  @ApiProperty({
    description: 'Error message indicating user not found',
    example: 'User not found',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: HttpStatus.NOT_FOUND,
    default: HttpStatus.NOT_FOUND,
  })
  code: number;
}

export class AuthLoginSessionServiceErrorInactiveDto {
  @ApiProperty({
    description: 'Error message indicating user is inactive',
    example: 'User is inactive',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: HttpStatus.NOT_FOUND,
    default: HttpStatus.NOT_FOUND,
  })
  code: number;
}

export class AuthLoginSessionServiceErrorInvalidCredentialsDto {
  @ApiProperty({
    description: 'Error message indicating invalid credentials',
    example: 'Invalid credentials',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: HttpStatus.UNAUTHORIZED,
    default: HttpStatus.UNAUTHORIZED,
  })
  code: number;
}

export const ERRORS_CODE_AUTH_LOGIN = {
  MISSING_CREDENTIALS: 'AUTH_LOGIN_001',
};

export const ERRORS_AUTH_LOGIN_SESSION = {
  MISSING_CREDENTIALS: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Missing credentials',
    errorCode: ERRORS_CODE_AUTH_LOGIN.MISSING_CREDENTIALS,
  },
};
