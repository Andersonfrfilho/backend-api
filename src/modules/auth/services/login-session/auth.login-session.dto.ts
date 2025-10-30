import { IsEmail, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

export class AuthLoginSessionParamsDto {
  @ApiProperty({
    description: 'The email of the user',
    example: faker.internet.email(),
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: faker.internet.password(),
  })
  @IsStrongPassword()
  password: string;
}

export class AuthLoginTokenParamsDto {
  @ApiProperty({
    description: 'The refresh token of the user',
    example: faker.internet.jwt(),
  })
  @IsStrongPassword()
  refreshToken: string;
}

export class AuthLoginSessionResponseDto {
  @ApiProperty({
    description: 'The access token of the user',
    example: faker.internet.jwt(),
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token of the user',
    example: faker.internet.jwt(),
  })
  refreshToken: string;
}

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
    statusCode: 400,
    message: 'Missing credentials',
    errorCode: ERRORS_CODE_AUTH_LOGIN.MISSING_CREDENTIALS,
  },
};
