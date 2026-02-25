import type { NotificationRepositoryInterface } from '@modules/notification/domain/notification.interface';
import { Inject, Injectable } from '@nestjs/common';

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

  execute(params: CreateNotificationUseCaseParams): Promise<CreateNotificationUseCaseResponse> {
    return this.notificationRepository.create(params);
  }
}
