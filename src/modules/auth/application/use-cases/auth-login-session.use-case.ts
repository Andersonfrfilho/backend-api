import { KEYCLOAK_CLIENT } from '@adatechnology/auth-keycloak';
import type { KeycloakClientInterface } from '@adatechnology/auth-keycloak';
import { Inject, Injectable } from '@nestjs/common';

import { AuthLoginSessionUseCaseInterface } from '@modules/auth/domain/auth.login-session.interface';
import {
  AuthLoginSessionRequestDto as AuthLoginSessionUseCaseParamsDto,
  AuthLoginSessionResponseDto as AuthLoginSessionUseCaseResponseDto,
} from '@modules/auth/shared/dtos';
import type { LogProviderInterface } from '@modules/shared/domain';
import { RequestContextService } from '@modules/shared/infrastructure/context/request-context.service';
import { LOGGER_PROVIDER } from '@adatechnology/logger';

// Extended client type to include helper methods present in the concrete
// implementation but not declared on the exported interface.
type ExtendedKeycloakClient = KeycloakClientInterface & {
  getTokenWithCredentials?: (username: string, password: string) => Promise<any>;
  clearTokenCache?: () => void;
};

@Injectable()
export class AuthLoginSessionUseCase implements AuthLoginSessionUseCaseInterface {
  @Inject(LOGGER_PROVIDER) private readonly loggerProvider: LogProviderInterface;
  constructor(
    @Inject(KEYCLOAK_CLIENT) private readonly keycloakClient: ExtendedKeycloakClient,
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
      const body = await this.keycloakClient.getTokenWithCredentials!(
        params.email,
        params.password,
      );

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
