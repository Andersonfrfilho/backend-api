import { Module } from '@nestjs/common';

import { AuthApplicationUseCaseModule } from './use-cases/auth.use-cases.module';

@Module({
  imports: [AuthApplicationUseCaseModule],
  exports: [AuthApplicationUseCaseModule],
})
export class AuthApplicationModule {}
