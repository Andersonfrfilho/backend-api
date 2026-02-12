import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HTTP_STATUS } from '@config/constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Login successful' })
  login(): any {
    return { message: 'Login not implemented yet' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: HTTP_STATUS.CREATED, description: 'Registration successful' })
  register(): any {
    return { message: 'Registration not implemented yet' };
  }
}
