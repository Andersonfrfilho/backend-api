import type { NotificationRepositoryInterface } from '@modules/notification/domain/repositories/notification.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

import { NOTIFICATION_REPOSITORY_PROVIDE } from '@modules/notification/infrastructure/notification.token';

import type {
  DeleteNotificationUseCaseInterface,
  DeleteNotificationUseCaseParams,
  DeleteNotificationUseCaseResponse,
} from '../interfaces/notification.interfaces';

@Injectable()
export class DeleteNotificationUseCase implements DeleteNotificationUseCaseInterface {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDE)
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  async execute(
    params: DeleteNotificationUseCaseParams,
  ): Promise<DeleteNotificationUseCaseResponse> {
    await this.notificationRepository.delete(params.id);
    return { success: true };
  }
}
