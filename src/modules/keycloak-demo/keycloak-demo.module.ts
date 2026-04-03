import { LoggerModule } from '@adatechnology/logger';
import { Module } from '@nestjs/common';

import { KeycloakDemoController } from './keycloak-demo.controller';
import { KeycloakDemoService } from './keycloak-demo.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [KeycloakDemoController],
  providers: [KeycloakDemoService],
})
export class KeycloakDemoModule {}
