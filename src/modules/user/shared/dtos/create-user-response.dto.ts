import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: faker.string.uuid(),
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: faker.person.firstName(),
  })
  name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: faker.person.lastName(),
  })
  lastName: string;
  @ApiProperty({
    description: 'The CPF of the user',
    example: faker.string.numeric(11),
  })
  cpf: string;

  @ApiProperty({
    description: 'The RG of the user',
    example: faker.string.numeric(9),
  })
  rg: string;

  @ApiProperty({
    description: 'The email of the user',
    example: faker.internet.email(),
  })
  email: string;

  @ApiProperty({
    description: 'The gender of the user',
    example: faker.person.gender(),
  })
  gender: string;

  @ApiProperty({
    description: 'The details of the user',
    example: { hobby: 'reading', favoriteColor: 'blue' },
  })
  details: Record<string, unknown>;

  @ApiProperty({
    description: 'The birth date of the user',
    example: faker.date.past().toISOString(),
  })
  birthDate: Date;

  @ApiProperty({
    description: 'The creation date of the user',
    example: faker.date.past().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the user',
    example: faker.date.recent().toISOString(),
  })
  updatedAt: Date | null;

  @ApiProperty({
    description: 'The deletion date of the user',
    example: null,
  })
  deletedAt: Date | null;
}
