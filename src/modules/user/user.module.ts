import { Module } from '@nestjs/common';
import { CreateSessionService } from './use-cases/create-session.service';
import { UserController } from './user.controller';
@Module({
  controllers: [UserController],
  providers: [CreateSessionService],
})
export class UserModule {}
