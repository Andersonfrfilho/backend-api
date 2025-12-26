import { Test, TestingModule } from '@nestjs/testing';

import { NotificationController } from '@modules/notification/infrastructure/notification.controller';
import { NotificationServiceInterface } from '@modules/notification/infrastructure/notification.service';
import { NOTIFICATION_SERVICE_PROVIDE } from '@modules/notification/infrastructure/notification.token';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationServiceInterface;

  const mockNotificationService = {
    createNotification: jest.fn(),
    getNotification: jest.fn(),
    getAllNotifications: jest.fn(),
    updateNotification: jest.fn(),
    deleteNotification: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NOTIFICATION_SERVICE_PROVIDE,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationServiceInterface>(NOTIFICATION_SERVICE_PROVIDE);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createParams = {
        message: 'Test notification',
        type: 'info',
        userId: 'user123',
      };

      const expectedResult = {
        _id: '507f1f77bcf86cd799439011',
        ...createParams,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotificationService.createNotification.mockResolvedValue(expectedResult);

      const result = await controller.create(createParams);

      expect(service.createNotification).toHaveBeenCalledWith(createParams);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should get a notification by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      const expectedResult = {
        _id: id,
        message: 'Test notification',
        type: 'info',
        userId: 'user123',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotificationService.getNotification.mockResolvedValue(expectedResult);

      const result = await controller.getById(id);

      expect(service.getNotification).toHaveBeenCalledWith({ id });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should get all notifications', async () => {
      const expectedResult = [
        {
          _id: '507f1f77bcf86cd799439011',
          message: 'Test notification 1',
          type: 'info',
          userId: 'user123',
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          message: 'Test notification 2',
          type: 'warning',
          userId: 'user456',
          read: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockNotificationService.getAllNotifications.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(service.getAllNotifications).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });

    it('should get notifications by userId', async () => {
      const userId = 'user123';
      const expectedResult = [
        {
          _id: '507f1f77bcf86cd799439011',
          message: 'Test notification',
          type: 'info',
          userId,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockNotificationService.getAllNotifications.mockResolvedValue(expectedResult);

      const result = await controller.getAll(userId);

      expect(service.getAllNotifications).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(expectedResult);
    });
  });
});
