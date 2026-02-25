import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { User } from '@modules/shared/domain/entities/user.entity';

export class CreateAddressRequestDto {
  @ApiProperty({
    description: 'The street name of the address',
    example: faker.location.street(),
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'The street number of the address',
    example: faker.location.buildingNumber(),
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'The complement of the address',
    example: 'Apt 101',
    required: false,
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({
    description: 'The neighborhood of the address',
    example: faker.location.city(),
  })
  @IsString()
  neighborhood: string;

  @ApiProperty({
    description: 'The city of the address',
    example: faker.location.city(),
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'The state of the address',
    example: faker.location.state({ abbreviated: true }),
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'The ZIP code of the address',
    example: faker.location.zipCode(),
  })
  @Expose({ name: 'zip_code' })
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: 'The country of the address',
    example: 'BR',
    required: false,
    default: 'BR',
  })
  @IsOptional()
  @IsString()
  country: string = 'BR';

  @ApiProperty({
    description: 'The latitude coordinate of the address',
    example: faker.location.latitude(),
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  latitude: number = 0;

  @ApiProperty({
    description: 'The longitude coordinate of the address',
    example: faker.location.longitude(),
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  longitude: number = 0;
}

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
  @Transform(({ obj }) => new Date(obj.birth_date as string | number | Date))
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
  active: boolean = true;

  @ApiProperty({
    description: 'The phone number of the user in format +55DDNNNNNNNNN',
    example: '+55993056772',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The address of the user',
    type: CreateAddressRequestDto,
  })
  @Type(() => CreateAddressRequestDto)
  @ValidateNested()
  address: CreateAddressRequestDto;
}
