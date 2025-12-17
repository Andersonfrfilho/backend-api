import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { HealthCheckServiceInterface } from '@modules/health/domain/health.get.interface';
import { HealthCheckResponseDto } from '@modules/health/shared/health.dto';
import { HealthController } from './health.controller.ts';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthCheckService: jest.Mocked<HealthCheckServiceInterface>;

  beforeEach(() => {
    mockHealthCheckService = {
      execute: jest.fn(),
    } as any;

    controller = new HealthController(mockHealthCheckService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('check', () => {
    it('should return health check response', () => {
      const mockResponse: HealthCheckResponseDto = {
        status: 'ok',
        timestamp: new Date(),
      };

      mockHealthCheckService.execute.mockReturnValue(mockResponse);

      const result = controller.check();

      expect(result).toEqual(mockResponse);
      expect(mockHealthCheckService.execute).toHaveBeenCalled();
    });

    it('should call healthCheckService.execute once', () => {
      const mockResponse: HealthCheckResponseDto = {
        status: 'ok',
        timestamp: new Date(),
      };

      mockHealthCheckService.execute.mockReturnValue(mockResponse);

      controller.check();

      expect(mockHealthCheckService.execute).toHaveBeenCalledTimes(1);
    });

    it('should return response with status property', () => {
      const mockResponse: HealthCheckResponseDto = {
        status: 'ok',
        timestamp: new Date(),
      };

      mockHealthCheckService.execute.mockReturnValue(mockResponse);

      const result = controller.check();

      expect(result).toHaveProperty('status');
      expect(result.status).toBe('ok');
    });

    it('should return response with timestamp property', () => {
      const testDate = new Date();
      const mockResponse: HealthCheckResponseDto = {
        status: 'ok',
        timestamp: testDate,
      };

      mockHealthCheckService.execute.mockReturnValue(mockResponse);

      const result = controller.check();

      expect(result).toHaveProperty('timestamp');
      expect(result.timestamp).toEqual(testDate);
    });
  });
});
