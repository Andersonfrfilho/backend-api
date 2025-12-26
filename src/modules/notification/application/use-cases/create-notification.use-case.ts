import { Inject, Injectable } from '@nestjs/common';

import type { NotificationRepositoryInterface } from '@modules/notification/domain/repositories/notification.repository.interface';
import { NOTIFICATION_REPOSITORY_PROVIDE } from '@modules/notification/infrastructure/notification.token';

import type {
  CreateNotificationUseCaseInterface,
  CreateNotificationUseCaseParams,
  CreateNotificationUseCaseResponse,
} from '../interfaces/notification.interfaces';

@Injectable()
export class CreateNotificationUseCase implements CreateNotificationUseCaseInterface {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDE)
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  async execute(
    params: CreateNotificationUseCaseParams,
  ): Promise<CreateNotificationUseCaseResponse> {
    return this.notificationRepository.create(params);
  }
}
