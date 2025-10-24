import { Module } from '@nestjs/common';
import { LogModule } from '@core/providers/log/log.module';
import { AuthUseCasesModule } from '@modules/auth/use-cases/auth.use-case.module';
import { AUTH_SERVICE_PROVIDE } from '@modules/auth/auth.interface';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
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
