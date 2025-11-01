import { faker } from '@faker-js/faker';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

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

@ApiExtraModels(AuthLoginSessionResponseDto)
export class AuthLoginSessionControllerResponseDto extends AuthLoginSessionResponseDto {}
