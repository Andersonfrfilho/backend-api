import type { NotificationRepositoryInterface } from '@modules/notification/domain/repositories/notification.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

import { NOTIFICATION_REPOSITORY_PROVIDE } from '@modules/notification/infrastructure/notification.token';

import type {
  MarkAsReadUseCaseInterface,
  MarkAsReadUseCaseParams,
  MarkAsReadUseCaseResponse,
} from '../interfaces/notification.interfaces';

@Injectable()
export class MarkAsReadUseCase implements MarkAsReadUseCaseInterface {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDE)
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  execute(params: MarkAsReadUseCaseParams): Promise<MarkAsReadUseCaseResponse> {
    return this.notificationRepository.markAsRead(params.id);
  }
}
