import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class AuthLoginSessionRequestDto {
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
