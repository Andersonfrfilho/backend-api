import { Inject, Injectable } from '@nestjs/common';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from '../../../../providers/log/log.interface';
import {
  AuthLoginSessionUseCaseInterface,
  AuthLoginSessionUseCaseResponse,
} from '../use-cases.interface';
import { TypeForm } from '../../../../modules/commons/commons.enum';
import { PAGES_SCREENS_NAMES } from '../../../../modules/commons/commons.constant';

@Injectable()
export class AuthLoginSessionUseCase
  implements AuthLoginSessionUseCaseInterface
{
  constructor(
    @Inject(LOG_PROVIDER) private logProvider: LogProviderInterface,
  ) {}
  execute(): Promise<AuthLoginSessionUseCaseResponse> {
    this.logProvider.info('AuthLoginSessionUseCase');
    const response: AuthLoginSessionUseCaseResponse = {
      type: TypeForm.FORM,
      screen: PAGES_SCREENS_NAMES.LOGIN_SCREEN,
      props: {
        title: 'Entrar',
        fields: [
          {
            type: 'email',
            name: 'email',
            label: 'E-mail',
            placeholder: 'Digite seu e-mail',
            required: true,
          },
          {
            type: 'password',
            name: 'senha',
            label: 'Senha',
            placeholder: 'Digite sua senha',
            required: true,
          },
        ],
        submitButton: {
          label: 'Acessar',
          action: '/login',
        },
      },
    };
    return Promise.resolve(response);
  }
}
