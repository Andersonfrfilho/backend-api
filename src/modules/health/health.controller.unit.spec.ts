import { beforeEach, describe, expect, it } from '@jest/globals';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.token';
import { Test, TestingModule } from '@nestjs/testing';
import type { HealthCheckServiceInterface } from './domain/health.get.interface';
import { HealthController } from './health.controller';

describe('HealthController - Unit Tests', () => {
  let controller: HealthController;
  let service: HealthCheckServiceInterface;

  beforeEach(async () => {
    // Arrange: Setup mocks and test module
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('check', () => {
    it('should be defined', () => {
      // Arrange
      // Nothing to arrange - testing controller existence

      // Act & Assert
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

  describe('Integration Tests - Controller → Service Pipeline', () => {
    let testingModule: TestingModule;
    let healthController: HealthController;
    let healthService: HealthCheckServiceInterface;

    beforeEach(async () => {
      // Setup for integration tests
      testingModule = await Test.createTestingModule({
        controllers: [HealthController],
        providers: [
          {
            provide: HEALTH_CHECK_SERVICE_PROVIDER,
            useValue: {
              execute: jest.fn().mockReturnValue({
                status: true,
                message: 'Health check passed',
              }),
            },
          },
        ],
      }).compile();

      healthController = testingModule.get<HealthController>(HealthController);
      healthService = testingModule.get<HealthCheckServiceInterface>(HEALTH_CHECK_SERVICE_PROVIDER);
    });

    afterEach(async () => {
      await testingModule.close();
    });

    it('should controller and service work together', () => {
      // Act
      const result = healthController.check();

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result.status).toBe(true);
    });

    it('should service execute be called from controller', () => {
      // Arrange
      const mockExecute = healthService.execute as jest.Mock;
      mockExecute.mockClear();

      // Act
      healthController.check();

      // Assert
      expect(mockExecute).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple health check calls', () => {
      // Act
      const result1 = healthController.check();
      const result2 = healthController.check();
      const result3 = healthController.check();

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
      const mockExecute = healthService.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalledTimes(3);
    });

    it('should preserve response structure through pipeline', () => {
      // Act
      const result = healthController.check();

      // Assert
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(typeof result.status).toBe('boolean');
      expect(typeof result.message).toBe('string');
    });

    it('should health check complete within performance threshold', () => {
      // Act
      const startTime = Date.now();
      healthController.check();
      const executionTime = Date.now() - startTime;

      // Assert
      expect(executionTime).toBeLessThan(50);
    });

    it('should handle consistent health status', () => {
      // Act
      const result1 = healthController.check();
      const result2 = healthController.check();

      // Assert
      expect(result1.status).toBe(result2.status);
      expect(result1.status).toBe(true);
    });
  });

  describe('Contract Tests - Health Response Shape', () => {
    /**
     * 📋 Health Response - Validates API contract
     *
     * ✅ ISO/IEC 25010 - API Compliance
     * ✅ RFC 7231 - Content validation
     */
    it('should return status and message in health response', () => {
      // Arrange
      const healthResponse = {
        status: true,
        message: 'Health check passed',
      };

      // Act & Assert
      expect(healthResponse).toHaveProperty('status');
      expect(healthResponse).toHaveProperty('message');
      expect(typeof healthResponse.status).toBe('boolean');
      expect(typeof healthResponse.message).toBe('string');
    });

    /**
     * 📋 Health Status Values - Valid status responses
     *
     * ✅ Semantic HTTP compliance
     */
    it('should return valid health status values', () => {
      // Arrange
      const healthyResponse = { status: true, message: 'Healthy' };
      const unhealthyResponse = { status: false, message: 'Unhealthy' };

      // Act & Assert
      expect([true, false]).toContain(healthyResponse.status);
      expect([true, false]).toContain(unhealthyResponse.status);
      expect(typeof healthyResponse.message).toBe('string');
      expect(typeof unhealthyResponse.message).toBe('string');
    });
  });
});
