import { Controller, Get, Version } from '@nestjs/common';
import { CreateSessionService } from './use-cases/create-session.service';

@Controller('/user')
export class UserController {
  constructor(private readonly createUserService: CreateSessionService) {}

  @Version('1')
  @Get('cats')
  findAllV1(): string {
    return this.createUserService.getHello();
  }

  @Version('2')
  @Get('cats')
  findAllV2(): string {
    return this.createUserService.getHello();
  }
}
