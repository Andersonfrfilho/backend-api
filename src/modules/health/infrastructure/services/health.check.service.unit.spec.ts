import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckUseCaseInterface } from '../../domain/health.get.interface';
import { HEALTH_CHECK_USE_CASE_PROVIDER } from '../../infrastructure/health.provider';
import { HealthCheckService } from './health.check.service';

describe('HealthCheckService - Unit Tests', () => {
  let service: HealthCheckService;
  let useCase: HealthCheckUseCaseInterface;

  beforeEach(async () => {
    // Arrange: Setup mocks and test module
    const mockUseCase = {
      execute: jest.fn().mockReturnValue({
        status: true,
        message: 'Health check passed',
      }),
    } as unknown as HealthCheckUseCaseInterface;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        {
          provide: HEALTH_CHECK_USE_CASE_PROVIDER,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
    useCase = module.get(HEALTH_CHECK_USE_CASE_PROVIDER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should be defined', () => {
      // Arrange
      // Nothing to arrange - testing service existence

      // Act & Assert
      expect(service).toBeDefined();
    });

    it('should call useCase.execute', () => {
      // Arrange & Act
      service.execute();

      // Assert
      const mockExecute = useCase.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should return the result from useCase', () => {
      // Arrange & Act
      const result = service.execute();

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(true);
      expect(result.message).toBe('Health check passed');
    });

    it('should handle useCase errors gracefully', () => {
      // Arrange
      const error = new Error('UseCase Error');
      (useCase.execute as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => service.execute()).toThrow(error);
    });

    it('should propagate useCase response structure', () => {
      // Arrange
      const mockResponse = {
        status: true,
        message: 'Custom message',
      };
      (useCase.execute as jest.Mock).mockReturnValueOnce(mockResponse);

      // Act
      const result = service.execute();

      // Assert
      expect(result).toEqual(mockResponse);
    });
  });
});
