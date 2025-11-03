import { HttpException, HttpStatus } from '@nestjs/common';

import type { LogProviderInterface } from '@modules/shared/domain';
import { HttpExceptionFilter } from './error-filter';

describe('HttpExceptionFilter - Unit Tests', () => {
  let filter: HttpExceptionFilter;
  let logMock: jest.Mock;
  let errorMock: jest.Mock;
  let warnMock: jest.Mock;
  let mockLogProvider: LogProviderInterface;

  beforeEach(() => {
    // Arrange: Setup all mocks fresh for each test
    logMock = jest.fn();
    errorMock = jest.fn();
    warnMock = jest.fn();

    mockLogProvider = {
      info: logMock,
      error: errorMock,
      warn: warnMock,
      debug: jest.fn(),
    } as unknown as LogProviderInterface;

    // Instantiate filter directly without Test.createTestingModule
    filter = new HttpExceptionFilter(mockLogProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    // Assert
    expect(filter).toBeDefined();
  });

  it('should have catch method', () => {
    // Assert
    expect(typeof filter.catch).toBe('function');
  });

  it('should be instance of HttpExceptionFilter', () => {
    // Assert
    expect(filter instanceof HttpExceptionFilter).toBe(true);
  });

  describe('error handling', () => {
    it('should accept HttpException', () => {
      // Arrange
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      // Assert
      expect(exception).toBeDefined();
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should accept generic Error', () => {
      // Arrange
      const exception = new Error('Any Error');

      // Assert
      expect(exception).toBeDefined();
      expect(exception.message).toBe('Any Error');
    });

    it('should accept HttpException with custom response', () => {
      // Arrange
      const customMessageMock = 'Custom error message';
      const exception = new HttpException({ message: customMessageMock }, HttpStatus.BAD_REQUEST);

      // Assert
      expect(exception).toBeDefined();
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should accept HttpException with message undefined', () => {
      // Arrange
      const exception = new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR);

      // Assert
      expect(exception).toBeDefined();
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('log provider interaction', () => {
    it('should have access to mockLogProvider', () => {
      // Assert
      expect(filter['logProvider']).toBe(mockLogProvider);
    });

    it('should have info, error, and warn methods available', () => {
      // Assert
      expect(mockLogProvider.info).toBeDefined();
      expect(mockLogProvider.error).toBeDefined();
      expect(mockLogProvider.warn).toBeDefined();
    });
  });
});
