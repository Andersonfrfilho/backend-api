import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginSessionServiceInternalServerErrorDto {
  @ApiProperty({
    description: 'Error message indicating internal server error',
    example: 'Internal server error',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
    default: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  code: number;
}
