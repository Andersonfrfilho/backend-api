import { describe, expect, it } from '@jest/globals';
import { HealthCheckUseCase } from './health.get.use-case';

describe('HealthCheckUseCase - Unit Tests', () => {
  let useCase: HealthCheckUseCase;

  beforeEach(() => {
    // Arrange: Setup use case instance
    useCase = new HealthCheckUseCase();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return health check response with status true', () => {
      // Arrange & Act
      const result = useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(true);
      expect(result.message).toBe('Health check passed');
    });

    it('should return response with required fields', () => {
      // Arrange & Act
      const result = useCase.execute();

      // Assert
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
    });

    it('should always return status as boolean', () => {
      // Arrange & Act
      const result = useCase.execute();

      // Assert
      expect(typeof result.status).toBe('boolean');
    });

    it('should always return message as string', () => {
      // Arrange & Act
      const result = useCase.execute();

      // Assert
      expect(typeof result.message).toBe('string');
      expect(result.message).not.toBe('');
    });

    it('should execute multiple times without state changes', () => {
      // Arrange & Act
      const result1 = useCase.execute();
      const result2 = useCase.execute();

      // Assert
      expect(result1).toEqual(result2);
    });
  });
});
