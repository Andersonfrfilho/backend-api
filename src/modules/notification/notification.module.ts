import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from '@modules/shared/domain/entities/notification.entity';
import { SharedInfrastructureProviderDatabaseImplementationsMongoModule } from '@modules/shared/infrastructure/providers/database/implementations/mongo/mongo.module';

import { SharedModule } from '../shared';

import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { DeleteNotificationUseCase } from './application/use-cases/delete-notification.use-case';
import { GetAllNotificationsUseCase } from './application/use-cases/get-all-notifications.use-case';
import { GetNotificationUseCase } from './application/use-cases/get-notification.use-case';
import { MarkAllAsReadUseCase } from './application/use-cases/mark-all-as-read.use-case';
import { MarkAsReadUseCase } from './application/use-cases/mark-as-read.use-case';
import { UpdateNotificationUseCase } from './application/use-cases/update-notification.use-case';
import { NotificationController } from './infrastructure/notification.controller';
import { NotificationService } from './infrastructure/notification.service';
import {
  NOTIFICATION_CREATE_USE_CASE_PROVIDE,
  NOTIFICATION_DELETE_USE_CASE_PROVIDE,
  NOTIFICATION_GET_ALL_USE_CASE_PROVIDE,
  NOTIFICATION_GET_USE_CASE_PROVIDE,
  NOTIFICATION_MARK_ALL_AS_READ_USE_CASE_PROVIDE,
  NOTIFICATION_MARK_AS_READ_USE_CASE_PROVIDE,
  NOTIFICATION_REPOSITORY_PROVIDE,
  NOTIFICATION_SERVICE_PROVIDE,
  NOTIFICATION_UPDATE_USE_CASE_PROVIDE,
} from './infrastructure/notification.token';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    SharedInfrastructureProviderDatabaseImplementationsMongoModule,
    SharedModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY_PROVIDE,
      useClass: NotificationRepository,
    },
    {
      provide: NOTIFICATION_CREATE_USE_CASE_PROVIDE,
      useClass: CreateNotificationUseCase,
    },
    {
      provide: NOTIFICATION_GET_USE_CASE_PROVIDE,
      useClass: GetNotificationUseCase,
    },
    {
      provide: NOTIFICATION_GET_ALL_USE_CASE_PROVIDE,
      useClass: GetAllNotificationsUseCase,
    },
    {
      provide: NOTIFICATION_UPDATE_USE_CASE_PROVIDE,
      useClass: UpdateNotificationUseCase,
    },
    {
      provide: NOTIFICATION_DELETE_USE_CASE_PROVIDE,
      useClass: DeleteNotificationUseCase,
    },
    {
      provide: NOTIFICATION_MARK_AS_READ_USE_CASE_PROVIDE,
      useClass: MarkAsReadUseCase,
    },
    {
      provide: NOTIFICATION_MARK_ALL_AS_READ_USE_CASE_PROVIDE,
      useClass: MarkAllAsReadUseCase,
    },
    {
      provide: NOTIFICATION_SERVICE_PROVIDE,
      useClass: NotificationService,
    },
  ],
  exports: [NOTIFICATION_REPOSITORY_PROVIDE, NOTIFICATION_SERVICE_PROVIDE],
})
export class NotificationModule {}
