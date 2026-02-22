import { Inject, Injectable } from '@nestjs/common';

import { AuthLoginSessionUseCaseInterface } from '@modules/auth/domain/auth.login-session.interface';
import {
  AuthLoginSessionRequestDto as AuthLoginSessionUseCaseParamsDto,
  AuthLoginSessionResponseDto as AuthLoginSessionUseCaseResponseDto,
} from '@modules/auth/shared/dtos';
import type { LogProviderInterface } from '@modules/shared/domain';
import { RequestContextService } from '@modules/shared/infrastructure/context/request-context.service';
import { KeycloakClient } from '@modules/shared/infrastructure/keycloak/keycloak.client';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

@Injectable()
export class AuthLoginSessionUseCase implements AuthLoginSessionUseCaseInterface {
  @Inject(LOG_PROVIDER) private readonly loggerProvider: LogProviderInterface;
  constructor(
    private readonly keycloakClient: KeycloakClient,
    private readonly requestContext: RequestContextService,
  ) {}

  async execute(
    params: AuthLoginSessionUseCaseParamsDto,
  ): Promise<AuthLoginSessionUseCaseResponseDto> {
    const caller = this.requestContext?.get('caller');
    this.loggerProvider?.info({
      message: 'AuthLoginSessionUseCase.execute - start',
      context: 'AuthLoginSessionUseCase - execute',
      params: { email: params.email, caller },
    });

    try {
      const body = await this.keycloakClient.getTokenWithCredentials(params.email, params.password);

      const result: AuthLoginSessionUseCaseResponseDto = {
        accessToken: body.access_token,
        refreshToken: body.refresh_token ?? '',
      };

      this.loggerProvider?.info({
        message: 'AuthLoginSessionUseCase.execute - success',
        context: 'AuthLoginSessionUseCase - execute',
        params: { email: params.email, caller },
      });

      return result;
    } catch (error: any) {
      const safeError = { message: error?.message, name: error?.name, code: error?.code };
      this.loggerProvider?.error({
        message: 'AuthLoginSessionUseCase.execute - error',
        context: 'AuthLoginSessionUseCase - execute',
        params: { email: params.email, caller, error: safeError },
      });
      throw error;
    }
  }
}
