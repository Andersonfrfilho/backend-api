import { BadRequestException, NotFoundException } from '@nestjs/common';

export class NotificationErrorFactory {
  static notFound(id: string): NotFoundException {
    return new NotFoundException(`Notification with id ${id} not found`);
  }

  static duplicateNotification(message: string): BadRequestException {
    return new BadRequestException(`Notification with message "${message}" already exists`);
  }

  static invalidType(type: string): BadRequestException {
    return new BadRequestException(`Invalid notification type: ${type}`);
  }
}
