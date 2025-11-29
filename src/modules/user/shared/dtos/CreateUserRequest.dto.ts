import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'The name of the user',
    example: faker.person.firstName(),
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: faker.person.lastName(),
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The CPF of the user',
    example: faker.string.numeric(11),
  })
  @IsString()
  cpf: string;

  @ApiProperty({
    description: 'The RG of the user',
    example: faker.string.numeric(9),
  })
  @IsString()
  rg: string;

  @ApiProperty({
    description: 'The gender of the user',
    example: faker.person.gender(),
  })
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'The password hash of the user',
    example: faker.internet.password(),
  })
  @IsString()
  passwordHash: string;
}
