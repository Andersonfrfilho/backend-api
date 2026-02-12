import type { NotificationRepositoryInterface } from '@modules/notification/domain/repositories/notification.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

import { NOTIFICATION_REPOSITORY_PROVIDE } from '@modules/notification/infrastructure/notification.token';

import type {
  MarkAllAsReadUseCaseInterface,
  MarkAllAsReadUseCaseParams,
  MarkAllAsReadUseCaseResponse,
} from '../interfaces/notification.interfaces';

@Injectable()
export class MarkAllAsReadUseCase implements MarkAllAsReadUseCaseInterface {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDE)
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  async execute(params: MarkAllAsReadUseCaseParams): Promise<MarkAllAsReadUseCaseResponse> {
    await this.notificationRepository.markAllAsRead(params.userId);
    return { success: true };
  }
}
