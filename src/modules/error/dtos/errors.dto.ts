import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorDto {
  @ApiProperty({
    description: 'Error code',
    example: HttpStatus.BAD_REQUEST,
    default: HttpStatus.BAD_REQUEST,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2025-11-01T17:16:42.226Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path of the request that caused the error',
    example: '/v1/auth/login-session',
  })
  path: string;

  @ApiProperty({
    description: 'Error message indicating internal server error',
    example: 'Internal server error',
  })
  message: string;

  @ApiProperty({
    description: 'Internal Mapped error code',
    example: HttpStatus.BAD_REQUEST,
    default: faker.number.int({ min: 1000, max: 9999 }),
  })
  code?: number;
}

export class BadRequestErrorValidationRequestDto {
  @ApiProperty({
    description: 'Error code',
    example: HttpStatus.BAD_REQUEST,
    default: HttpStatus.BAD_REQUEST,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2025-11-01T17:16:42.226Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path of the request that caused the error',
    example: '/v1/auth/login-session',
  })
  path: string;

  @ApiProperty({
    description: 'Error message indicating validation failure',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Internal Mapped error code',
    example: HttpStatus.BAD_REQUEST,
    default: faker.number.int({ min: 1000, max: 9999 }),
  })
  code?: number;

  @ApiProperty({
    description: 'Details of the validation errors',
    example: [
      {
        field: 'email',
        errors: ['email must be an email'],
      },
    ],
  })
  details: Record<string, unknown>[];
}
