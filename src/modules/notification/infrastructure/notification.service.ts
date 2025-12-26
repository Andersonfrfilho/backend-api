import { Inject, Injectable } from '@nestjs/common';

import type {
  CreateNotificationUseCaseInterface,
  DeleteNotificationUseCaseInterface,
  GetAllNotificationsUseCaseInterface,
  GetNotificationUseCaseInterface,
  MarkAllAsReadUseCaseInterface,
  MarkAsReadUseCaseInterface,
  UpdateNotificationUseCaseInterface,
} from '@modules/notification/application/interfaces/notification.interfaces';
import {
  NOTIFICATION_CREATE_USE_CASE_PROVIDE,
  NOTIFICATION_DELETE_USE_CASE_PROVIDE,
  NOTIFICATION_GET_ALL_USE_CASE_PROVIDE,
  NOTIFICATION_GET_USE_CASE_PROVIDE,
  NOTIFICATION_MARK_ALL_AS_READ_USE_CASE_PROVIDE,
  NOTIFICATION_MARK_AS_READ_USE_CASE_PROVIDE,
  NOTIFICATION_UPDATE_USE_CASE_PROVIDE,
} from '@modules/notification/infrastructure/notification.token';

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

@Injectable()
export class NotificationService implements NotificationServiceInterface {
  constructor(
    @Inject(NOTIFICATION_CREATE_USE_CASE_PROVIDE)
    private readonly createNotificationUseCase: CreateNotificationUseCaseInterface,
    @Inject(NOTIFICATION_GET_USE_CASE_PROVIDE)
    private readonly getNotificationUseCase: GetNotificationUseCaseInterface,
    @Inject(NOTIFICATION_GET_ALL_USE_CASE_PROVIDE)
    private readonly getAllNotificationsUseCase: GetAllNotificationsUseCaseInterface,
    @Inject(NOTIFICATION_UPDATE_USE_CASE_PROVIDE)
    private readonly updateNotificationUseCase: UpdateNotificationUseCaseInterface,
    @Inject(NOTIFICATION_DELETE_USE_CASE_PROVIDE)
    private readonly deleteNotificationUseCase: DeleteNotificationUseCaseInterface,
    @Inject(NOTIFICATION_MARK_AS_READ_USE_CASE_PROVIDE)
    private readonly markAsReadUseCase: MarkAsReadUseCaseInterface,
    @Inject(NOTIFICATION_MARK_ALL_AS_READ_USE_CASE_PROVIDE)
    private readonly markAllAsReadUseCase: MarkAllAsReadUseCaseInterface,
  ) {}

  async createNotification(params: CreateNotificationParams): Promise<CreateNotificationResponse> {
    const result = await this.createNotificationUseCase.execute(params);
    return {
      ...result,
      _id: result._id.toString(),
    };
  }

  async getNotification(params: GetNotificationParams): Promise<GetNotificationResponse> {
    const result = await this.getNotificationUseCase.execute(params);
    return {
      ...result,
      _id: result._id.toString(),
    };
  }

  async getAllNotifications(
    params?: GetAllNotificationsParams,
  ): Promise<GetAllNotificationsResponse[]> {
    const results = await this.getAllNotificationsUseCase.execute(params);
    return results.map((result) => ({
      ...result,
      _id: result._id.toString(),
    }));
  }

  async updateNotification(params: UpdateNotificationParams): Promise<UpdateNotificationResponse> {
    const result = await this.updateNotificationUseCase.execute(params);
    return {
      ...result,
      _id: result._id.toString(),
    };
  }

  async deleteNotification(params: DeleteNotificationParams): Promise<DeleteNotificationResponse> {
    return this.deleteNotificationUseCase.execute(params);
  }

  async markAsRead(params: MarkAsReadParams): Promise<MarkAsReadResponse> {
    const result = await this.markAsReadUseCase.execute(params);
    return {
      ...result,
      _id: result._id.toString(),
    };
  }

  async markAllAsRead(params: MarkAllAsReadParams): Promise<MarkAllAsReadResponse> {
    return this.markAllAsReadUseCase.execute(params);
  }
}
