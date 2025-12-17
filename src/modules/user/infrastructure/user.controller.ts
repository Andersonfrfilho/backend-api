import { Body, Controller, Inject, Injectable, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import type { UserServiceInterface } from '@modules/user/application/interfaces/create-user.interface';
import { USER_SERVICE_PROVIDE } from '@modules/user/infrastructure/user.token';
import { CreateUserRequestDto } from '@modules/user/shared/dtos/create-user-request.dto';
import { CreateUserResponseDto } from '@modules/user/shared/dtos/create-user-response.dto';

@Injectable()
@Controller('/user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE_PROVIDE)
    private readonly userService: UserServiceInterface,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criar um usuário',
    description: `
      Esta rota realiza a criação de um novo usuário.
    `,
  })
  @ApiOkResponse({
    description: 'Usuário criado com sucesso.',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() params: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return this.userService.createUser(params);
  }
}
