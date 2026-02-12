import { Notification } from '@modules/shared/domain/entities/notification.entity';

export interface NotificationRepositoryInterface {
  create(notification: CreateNotificationParams): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findAll(): Promise<Notification[]>;
  findByUserId(userId: string): Promise<Notification[]>;
  update(id: string, notification: UpdateNotificationParams): Promise<Notification>;
  delete(id: string): Promise<void>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface CreateNotificationParams {
  message: string;
  type: string;
  userId?: string;
}

export interface UpdateNotificationParams {
  message?: string;
  type?: string;
  read?: boolean;
}
