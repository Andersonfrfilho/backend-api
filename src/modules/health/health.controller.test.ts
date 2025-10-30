import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService } from './health.service';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let logProvider: jest.Mock;

  beforeEach(async () => {
    logProvider = jest.fn();
    const mockHealthCheckService = {
      healthCheck: jest.fn().mockReturnValue({ status: 'ok' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: LOG_PROVIDER,
          useValue: {
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
    logProvider = module.get(LOG_PROVIDER);
  });

  describe('check', () => {
    it('should return health check response', () => {
      // Arrange - Service is properly mocked in beforeEach

      // Act
      const result = controller.check();

      // Assert
      expect(result).toEqual({ status: 'ok' });
    });

    it('should call healthCheckService.healthCheck', () => {
      // Arrange - Service is properly mocked in beforeEach

      // Act
      controller.check();

      // Assert
      expect(healthCheckService.healthCheck).toHaveBeenCalled();
    });

    it('should log info with context and message', () => {
      // Arrange - Service is properly mocked in beforeEach

      // Act
      controller.check();

      // Assert
      expect(logProvider.info).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'controller',
          context: 'HealthController',
        }),
      );
    });
  });

  describe('checkV2', () => {
    it('should return health check response', () => {
      // Arrange - Service is properly mocked in beforeEach

      // Act
      const result = controller.checkV2();

      // Assert
      expect(result).toEqual({ status: 'ok' });
    });

    it('should call healthCheckService.healthCheck', () => {
      // Arrange - Service is properly mocked in beforeEach

      // Act
      controller.checkV2();

      // Assert
      expect(healthCheckService.healthCheck).toHaveBeenCalled();
    });

    it('should log info with v2 message', () => {
      // Arrange - Service is properly mocked in beforeEach

      // Act
      controller.checkV2();

      // Assert
      expect(logProvider.info).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'controller v2',
          context: 'HealthController',
        }),
      );
    });
  });
});
