import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { User } from '@modules/shared/domain/entities/user.entity';
import { UserTypeEnum } from '@modules/shared/domain/enums/user-type.enum';

export class CreateUserRequestDto implements Partial<User> {
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
  @Expose({ name: 'last_name' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: faker.internet.email(),
  })
  @IsEmail()
  email: string;

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
    description: 'The date of birth of the user as timestamp (milliseconds)',
    example: faker.date.past().getTime(),
    type: 'integer',
    format: 'int64',
  })
  @IsDate()
  @Transform(({ obj }) => new Date(obj.birth_date))
  @Expose({ name: 'birth_date' })
  birthDate: Date;

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
  @Expose({ name: 'password_hash' })
  @IsString()
  passwordHash: string;

  @ApiProperty({
    description: 'Additional user details',
    example: {},
    required: false,
  })
  @IsOptional()
  details: Record<string, unknown> = {};

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive: boolean = true;

  @ApiProperty({
    description: 'The phone number of the user in format +55DDNNNNNNNNN',
    example: '+55993056772',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The user type',
    enum: UserTypeEnum,
    example: UserTypeEnum.USER,
  })
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}
