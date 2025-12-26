import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationErrorFactory } from '@modules/notification/application/factories/notification-error.factory';
import {
  CreateNotificationParams,
  NotificationRepositoryInterface,
  UpdateNotificationParams,
} from '@modules/notification/domain/repositories/notification.repository.interface';
import { Notification } from '@modules/shared/domain/entities/notification.entity';

@Injectable()
export class NotificationRepository implements NotificationRepositoryInterface {
  constructor(
    @InjectRepository(Notification)
    private typeormRepo: Repository<Notification>,
  ) {}

  async create(notification: CreateNotificationParams): Promise<Notification> {
    const newNotification = this.typeormRepo.create(notification);
    return this.typeormRepo.save(newNotification);
  }

  async findById(id: string): Promise<Notification | null> {
    return this.typeormRepo.findOne({
      where: { _id: id as any },
    });
  }

  async findAll(): Promise<Notification[]> {
    return this.typeormRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.typeormRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, notification: UpdateNotificationParams): Promise<Notification> {
    await this.typeormRepo.update(id, notification as any);
    const updatedNotification = await this.typeormRepo.findOne({
      where: { _id: id as any },
    });
    if (!updatedNotification) {
      throw NotificationErrorFactory.notFound(id);
    }
    return updatedNotification;
  }

  async delete(id: string): Promise<void> {
    const result = await this.typeormRepo.delete(id);
    if (result.affected === 0) {
      throw NotificationErrorFactory.notFound(id);
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.typeormRepo.update({ userId, read: false }, { read: true } as any);
  }
}
