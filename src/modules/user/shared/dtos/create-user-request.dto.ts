import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

import { User } from '@modules/shared/domain/entities/user.entity';

export class CreateUserRequestDto implements Partial<User> {
  @ApiProperty({
    description: 'The name of the user',
    example: faker.person.firstName(),
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: faker.person.lastName(),
  })
  @Transform(({ obj }) => obj.last_name)
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: faker.internet.email(),
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The CPF of the user',
    example: faker.string.numeric(11),
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({
    description: 'The RG of the user',
    example: faker.string.numeric(9),
  })
  @IsNotEmpty()
  @IsString()
  rg: string;

  @ApiProperty({
    description: 'The date of birth of the user as timestamp (milliseconds)',
    example: faker.date.past().getTime(),
  })
  @Transform(({ obj }) => obj.birth_date ? new Date(obj.birth_date) : null)
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    description: 'The gender of the user',
    example: faker.person.gender(),
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'The password hash of the user',
    example: faker.internet.password(),
  })
  @Transform(({ obj }) => obj.password_hash)
  @IsNotEmpty()
  @IsString()
  passwordHash: string;
}
