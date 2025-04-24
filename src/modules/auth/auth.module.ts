import { Module } from '@nestjs/common';
import { LogModule } from 'src/providers/log/log.module';
import { AuthUseCasesModule } from './use-cases/auth.use-case.module';
import { AUTH_SERVICE_PROVIDE } from './auth.interface';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
@Module({
  imports: [LogModule, AuthUseCasesModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE_PROVIDE,
      useClass: AuthService,
    },
  ],
  exports: [AUTH_SERVICE_PROVIDE],
})
export class AuthModule {}
