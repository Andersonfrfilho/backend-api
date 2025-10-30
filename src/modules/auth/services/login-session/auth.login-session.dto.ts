import { IsEmail, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginSessionParamsDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsStrongPassword()
  password: string;
}

export class AuthLoginSessionResponseDto {
  @ApiProperty({ description: 'The access token of the user' })
  accessToken: string;

  @ApiProperty({ description: 'The refresh token of the user' })
  refreshToken: string;
}
