import { describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HEALTH_CHECK_SERVICE_PROVIDER } from './infrastructure/health.provider';
import type { HealthCheckServiceInterface } from './domain/health.get.interface';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthCheckServiceInterface;

  beforeEach(async () => {
    // Mock do Service
    const mockService = {
      execute: jest.fn().mockReturnValue({
        status: true,
        message: 'Health check passed',
      }),
    } as unknown as HealthCheckServiceInterface;

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_CHECK_SERVICE_PROVIDER,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = moduleRef.get<HealthController>(HealthController);
    service = moduleRef.get<HealthCheckServiceInterface>(HEALTH_CHECK_SERVICE_PROVIDER);
  });

  describe('check', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call service.execute', () => {
      // Arrange & Act
      controller.check();

      // Assert
      const mockExecute = service.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should return health check response', () => {
      // Arrange & Act
      const result = controller.check();

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result.status).toBe(true);
    });

    it('should propagate service response', () => {
      // Arrange
      const mockResponse = {
        status: true,
        message: 'Service is healthy',
      };
      const mockExecute = service.execute as jest.Mock;
      mockExecute.mockReturnValueOnce(mockResponse);

      // Act
      const result = controller.check();

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should handle service errors', () => {
      // Arrange
      const error = new Error('Service Error');
      const mockExecute = service.execute as jest.Mock;
      mockExecute.mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => controller.check()).toThrow(error);
    });
  });
});
