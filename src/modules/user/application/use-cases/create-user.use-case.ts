import { Inject, Injectable } from '@nestjs/common';

import type { AddressRepositoryInterface } from '@app/modules/address/domain/repositories/address.repository.interface';
import { ADDRESS_REPOSITORY_PROVIDE } from '@app/modules/address/infrastructure/address.token';
import type { PhoneRepositoryInterface } from '@app/modules/phone/domain/repositories/phone.repository.interface';
import { PHONE_REPOSITORY_PROVIDE } from '@app/modules/phone/infrastructure/phone.token';
import { AddressTypeEnum } from '@app/modules/shared';
import type { QueueProducerMessageProviderInterface } from '@modules/shared/infrastructure/providers/queue/producer/producer.interface';
import { QUEUE_PRODUCER_PROVIDER } from '@modules/shared/infrastructure/providers/queue/producer/producer.token';
import { UserErrorFactory } from '@modules/user/application/factories';
import type { UserRepositoryInterface } from '@modules/user/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_PROVIDE } from '@modules/user/infrastructure/user.token';

import type { UserAddressRepositoryInterface } from '../../domain/repositories/user-address.repository.interface';
import { USER_ADDRESS_REPOSITORY_PROVIDE } from '../../infrastructure/user-address.token';
import type {
  UserCreateUseCaseInterface,
  UserCreateUseCaseParams,
  UserCreateUseCaseResponse,
} from '../interfaces/create-user.interface';
import { parsePhone } from '../util/phone.util';

@Injectable()
export class UserApplicationCreateUseCase implements UserCreateUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDE)
    private readonly userRepositoryProvide: UserRepositoryInterface,
    @Inject(PHONE_REPOSITORY_PROVIDE)
    private readonly phoneRepositoryProvide: PhoneRepositoryInterface,
    @Inject(ADDRESS_REPOSITORY_PROVIDE)
    private readonly addressRepositoryProvide: AddressRepositoryInterface,
    @Inject(USER_ADDRESS_REPOSITORY_PROVIDE)
    private readonly userAddressRepositoryProvide: UserAddressRepositoryInterface,
    @Inject(QUEUE_PRODUCER_PROVIDER)
    private readonly queueProducerMessageProvider: QueueProducerMessageProviderInterface,
  ) {}
  async execute(params: UserCreateUseCaseParams): Promise<UserCreateUseCaseResponse> {
    const [userByEmail, userByCpf, userByRg] = await Promise.all([
      this.userRepositoryProvide.findByEmail(params.email),
      this.userRepositoryProvide.findByCpf(params.cpf),
      this.userRepositoryProvide.findByRg(params.rg),
    ]);

    if (userByEmail) {
      throw UserErrorFactory.duplicateEmail(params.email);
    }

    if (userByCpf) {
      throw UserErrorFactory.duplicateCpf(params.cpf);
    }

    if (userByRg) {
      throw UserErrorFactory.duplicateRg(params.rg);
    }

    const phoneFormatted = parsePhone(params.phone);

    const user = await this.userRepositoryProvide.create({
      ...params,
    });
    await this.phoneRepositoryProvide.create({
      ...phoneFormatted,
      userId: user.id,
    });

    const address = await this.addressRepositoryProvide.create(params.address);

    await this.userAddressRepositoryProvide.create({
      userId: user.id,
      addressId: address.id,
      isPrimary: true,
      type: AddressTypeEnum.RESIDENTIAL,
    });

    // 🔥 ENVIO ASSÍNCRONO DE MENSAGENS APÓS CRIAÇÃO DO USUÁRIO

    // 1. Notificação de boas-vindas (Exchange: notifications, Routing Key: email.welcome)
    try {
      await this.queueProducerMessageProvider.send(
        'email.notifications',
        {
          body: {
            type: 'user-welcome',
            userId: user.id,
            email: user.email,
            name: user.name,
            template: 'welcome-email',
            priority: 'high',
          },
          headers: {
            'content-type': 'application/json',
            'message-type': 'notification',
          },
          metadata: {
            correlationId: `user-created-${user.id}`,
            userId: user.id,
            source: 'user-create-use-case',
          },
        },
        { exchange: 'notifications' },
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    try {
      await this.queueProducerMessageProvider.send(
        'audit.events',
        {
          body: {
            type: 'user-created-audit',
            userId: user.id,
            email: user.email,
            createdAt: user.createdAt,
            ipAddress: params.ipAddress, // Assume que vem do request
            userAgent: params.userAgent, // Assume que vem do request
            action: 'USER_REGISTRATION',
          },
          headers: {
            'content-type': 'application/json',
            'message-type': 'audit',
          },
          metadata: {
            correlationId: `audit-user-${user.id}`,
            userId: user.id,
            source: 'user-create-use-case',
          },
        },
        { exchange: 'audit' },
      );
    } catch (error) {
      console.error('Failed to send audit event:', error);
    }

    // 3. Sincronização com sistemas externos (Exchange: integration, Routing Key: crm.sync)
    try {
      await this.queueProducerMessageProvider.send(
        'crm.sync',
        {
          body: {
            type: 'crm-user-sync',
            userId: user.id,
            email: user.email,
            name: user.name,
            phone: phoneFormatted.number,
            address: {
              street: params.address.street,
              city: params.address.city,
              state: params.address.state,
              zipCode: params.address.zipCode,
            },
            registrationDate: user.createdAt,
          },
          headers: {
            'content-type': 'application/json',
            'message-type': 'integration',
          },
          metadata: {
            correlationId: `crm-sync-${user.id}`,
            userId: user.id,
            source: 'user-create-use-case',
          },
        },
        { exchange: 'integration' },
      );
    } catch (error) {
      console.error('Failed to send CRM sync:', error);
    }

    // 4. Análise de risco/fraude (Exchange: analytics, Routing Key: risk.analysis - com delay)
    try {
      await this.queueProducerMessageProvider.sendDelayed(
        'risk.analysis',
        {
          body: {
            type: 'risk-analysis',
            userId: user.id,
            email: user.email,
            registrationData: {
              ip: params.ipAddress,
              userAgent: params.userAgent,
              timestamp: new Date(),
            },
            riskScore: null, // Será calculado pelo consumer
          },
          headers: {
            'content-type': 'application/json',
            'message-type': 'analytics',
          },
          metadata: {
            correlationId: `risk-analysis-${user.id}`,
            userId: user.id,
            source: 'user-create-use-case',
          },
        },
        30000,
        { exchange: 'analytics' },
      ); // Delay de 30 segundos para análise
    } catch (error) {
      console.error('Failed to send risk analysis:', error);
    }
    console.log('########## mensagens enviadas com sucesso ##########');
    return user;
  }
}
