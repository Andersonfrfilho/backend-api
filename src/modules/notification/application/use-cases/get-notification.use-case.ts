import type { NotificationRepositoryInterface } from '@modules/notification/domain/repositories/notification.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

import { NotificationErrorFactory } from '@modules/notification/application/factories/notification-error.factory';
import { NOTIFICATION_REPOSITORY_PROVIDE } from '@modules/notification/infrastructure/notification.token';

import type {
  GetNotificationUseCaseInterface,
  GetNotificationUseCaseParams,
  GetNotificationUseCaseResponse,
} from '../interfaces/notification.interfaces';

@Injectable()
export class GetNotificationUseCase implements GetNotificationUseCaseInterface {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDE)
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  async execute(params: GetNotificationUseCaseParams): Promise<GetNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(params.id);
    if (!notification) {
      throw NotificationErrorFactory.notFound(params.id);
    }
    return notification;
  }
}
