export interface NotificationServiceInterface {
  createNotification(params: CreateNotificationParams): Promise<CreateNotificationResponse>;
  getNotification(params: GetNotificationParams): Promise<GetNotificationResponse>;
  getAllNotifications(params?: GetAllNotificationsParams): Promise<GetAllNotificationsResponse[]>;
  updateNotification(params: UpdateNotificationParams): Promise<UpdateNotificationResponse>;
  deleteNotification(params: DeleteNotificationParams): Promise<DeleteNotificationResponse>;
  markAsRead(params: MarkAsReadParams): Promise<MarkAsReadResponse>;
  markAllAsRead(params: MarkAllAsReadParams): Promise<MarkAllAsReadResponse>;
}

export interface CreateNotificationParams {
  message: string;
  type: string;
  userId?: string;
}

export interface CreateNotificationResponse {
  _id: string;
  message: string;
  type: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetNotificationParams {
  id: string;
}

export interface GetNotificationResponse {
  _id: string;
  message: string;
  type: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllNotificationsParams {
  userId?: string;
}

export interface GetAllNotificationsResponse {
  _id: string;
  message: string;
  type: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateNotificationParams {
  id: string;
  message?: string;
  type?: string;
  read?: boolean;
}

export interface UpdateNotificationResponse {
  _id: string;
  message: string;
  type: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteNotificationParams {
  id: string;
}

export interface DeleteNotificationResponse {
  success: boolean;
}

export interface MarkAsReadParams {
  id: string;
}

export interface MarkAsReadResponse {
  _id: string;
  message: string;
  type: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarkAllAsReadParams {
  userId: string;
}

export interface MarkAllAsReadResponse {
  success: boolean;
}
