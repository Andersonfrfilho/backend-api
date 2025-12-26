import { Notification } from '@modules/shared/domain/entities/notification.entity';

export interface CreateNotificationUseCaseParams {
  message: string;
  type: string;
  userId?: string;
}

export interface CreateNotificationUseCaseResponse extends Notification {}

export interface CreateNotificationUseCaseInterface {
  execute(params: CreateNotificationUseCaseParams): Promise<CreateNotificationUseCaseResponse>;
}

export interface UpdateNotificationUseCaseParams {
  id: string;
  message?: string;
  type?: string;
  read?: boolean;
}

export interface UpdateNotificationUseCaseResponse extends Notification {}

export interface UpdateNotificationUseCaseInterface {
  execute(params: UpdateNotificationUseCaseParams): Promise<UpdateNotificationUseCaseResponse>;
}

export interface DeleteNotificationUseCaseParams {
  id: string;
}

export interface DeleteNotificationUseCaseResponse {
  success: boolean;
}

export interface DeleteNotificationUseCaseInterface {
  execute(params: DeleteNotificationUseCaseParams): Promise<DeleteNotificationUseCaseResponse>;
}

export interface GetNotificationUseCaseParams {
  id: string;
}

export interface GetNotificationUseCaseResponse extends Notification {}

export interface GetNotificationUseCaseInterface {
  execute(params: GetNotificationUseCaseParams): Promise<GetNotificationUseCaseResponse>;
}

export interface GetAllNotificationsUseCaseParams {
  userId?: string;
}

export interface GetAllNotificationsUseCaseResponse extends Notification {}

export interface GetAllNotificationsUseCaseInterface {
  execute(params?: GetAllNotificationsUseCaseParams): Promise<GetAllNotificationsUseCaseResponse[]>;
}

export interface MarkAsReadUseCaseParams {
  id: string;
}

export interface MarkAsReadUseCaseResponse extends Notification {}

export interface MarkAsReadUseCaseInterface {
  execute(params: MarkAsReadUseCaseParams): Promise<MarkAsReadUseCaseResponse>;
}

export interface MarkAllAsReadUseCaseParams {
  userId: string;
}

export interface MarkAllAsReadUseCaseResponse {
  success: boolean;
}

export interface MarkAllAsReadUseCaseInterface {
  execute(params: MarkAllAsReadUseCaseParams): Promise<MarkAllAsReadUseCaseResponse>;
}
