import { Module } from '@nestjs/common';
import { CreateSessionService } from './use-cases/create-session.service';
@Module({
  controllers: [UserModule],
  providers: [CreateSessionService],
})
export class UserModule {}
