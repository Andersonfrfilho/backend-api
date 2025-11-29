import { Body, Controller, Inject, Injectable, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import type { UserServiceInterface } from '../application/interfaces/user.create.interface';
import { CreateUserRequestDto } from '../shared/dtos/CreateUserRequest.dto';
import { CreateUserResponseDto } from '../shared/dtos/CreateUserResponse.dto';

import { USER_SERVICE_PROVIDE } from './user.token';

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
