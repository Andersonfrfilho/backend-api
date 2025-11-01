import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import { HealthCheckServiceInterface } from '../health.interfaces';
import { HealthCheckService } from './healthCheck.service';

describe('HealthCheckService', () => {
  let service: HealthCheckServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        {
          provide: LOG_PROVIDER,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthCheckServiceInterface>(HealthCheckService);
  });

  it('should be defined', () => {
    // Arrange - Setup is done in beforeEach

    // Act & Assert
    expect(service).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should throw ForbiddenException', async () => {
      // Arrange - Service is properly instantiated in beforeEach

      // Act
      const result = service.execute();

      // Assert
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });
});
