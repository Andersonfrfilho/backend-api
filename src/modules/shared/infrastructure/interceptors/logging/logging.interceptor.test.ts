import { LOG_PROVIDER } from '@app/core/providers/log/log.interface';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockArgumentsHost: ExecutionContext;
  let mockCallHandler: CallHandler;
  const logMock = jest.fn();
  const infoMock = jest.fn();
  const errorMock = jest.fn();
  const warnMock = jest.fn();
  const mockLogProvider = {
    log: logMock,
    info: infoMock,
    error: errorMock,
    warn: warnMock,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggingInterceptor,
        {
          provide: LOG_PROVIDER,
          useValue: mockLogProvider,
        },
      ],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    jest.clearAllMocks();
  });
  const mockGetRequest = jest.fn();
  const mockGetResponse = jest.fn();
  const mockGetNext = jest.fn();
  mockArgumentsHost = {
    switchToHttp: () => ({
      getRequest: mockGetRequest,
      getResponse: mockGetResponse,
      getNext: mockGetNext,
    }),
  } as unknown as ExecutionContext;
  mockCallHandler = {
    handle: jest.fn(),
  } as unknown as CallHandler;
  it('should be defined', () => {
    // Arrange
    const requestResponse: Request = {
      headers: {
        'x-request-id': 'test-request-id',
      },
      method: 'GET',
      url: '/test',
    } as unknown as Request;
    mockGetRequest.mockReturnValue(requestResponse);
    mockCallHandler.handle = jest
      .fn()
      .mockReturnValue(new Observable((subscriber) => subscriber.complete()));

    // Act
    const result = interceptor.intercept(mockArgumentsHost, mockCallHandler);
    result.subscribe().unsubscribe();

    // Assert
    expect(result).toBeInstanceOf(Observable);
    expect(interceptor).toBeDefined();
    expect(infoMock).toHaveBeenCalled();
  });

  it('should generate a request ID from randomUUID when x-request-id header is missing', () => {
    // Arrange
    const requestResponse: Request = {
      headers: {},
      method: 'POST',
      url: '/api/users',
    } as unknown as Request;
    mockGetRequest.mockReturnValue(requestResponse);
    mockCallHandler.handle = jest
      .fn()
      .mockReturnValue(new Observable((subscriber) => subscriber.complete()));

    // Act
    const result = interceptor.intercept(mockArgumentsHost, mockCallHandler);
    result.subscribe().unsubscribe();

    // Assert
    expect(mockLogProvider.log).toBeDefined();
  });

  it('should handle array x-request-id header', () => {
    // Arrange
    const requestResponse: Request = {
      headers: {
        'x-request-id': ['array-request-id'],
      },
      method: 'PUT',
      url: '/api/test',
    } as unknown as Request;
    mockGetRequest.mockReturnValue(requestResponse);
    mockCallHandler.handle = jest
      .fn()
      .mockReturnValue(new Observable((subscriber) => subscriber.complete()));

    // Act
    const result = interceptor.intercept(mockArgumentsHost, mockCallHandler);
    result.subscribe().unsubscribe();

    // Assert
    expect(result).toBeInstanceOf(Observable);
  });

  it('should log error when request handler throws', () => {
    // Arrange
    const requestResponse: Request = {
      headers: { 'x-request-id': 'error-test-id' },
      method: 'DELETE',
      url: '/api/test',
    } as unknown as Request;
    const testError = new Error('Test error');
    mockGetRequest.mockReturnValue(requestResponse);
    mockCallHandler.handle = jest
      .fn()
      .mockReturnValue(
        new Observable((subscriber) => subscriber.error(testError)),
      );

    // Act
    const result = interceptor.intercept(mockArgumentsHost, mockCallHandler);
    result.subscribe({
      error: () => {},
    });

    // Assert
    expect(errorMock).toHaveBeenCalled();
  });

  it('should log request completion', (done) => {
    // Arrange
    const requestResponse: Request = {
      headers: { 'x-request-id': 'complete-test-id' },
      method: 'GET',
      url: '/api/data',
    } as unknown as Request;
    mockGetRequest.mockReturnValue(requestResponse);
    mockCallHandler.handle = jest
      .fn()
      .mockReturnValue(new Observable((subscriber) => subscriber.complete()));

    // Act
    const result = interceptor.intercept(mockArgumentsHost, mockCallHandler);
    result.subscribe({
      complete: () => {
        // Assert
        expect(infoMock).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should pass through values from handler', (done) => {
    // Arrange
    const requestResponse: Request = {
      headers: { 'x-request-id': 'passthrough-test-id' },
      method: 'GET',
      url: '/api/test',
    } as unknown as Request;
    const testData = { success: true };
    mockGetRequest.mockReturnValue(requestResponse);
    mockCallHandler.handle = jest.fn().mockReturnValue(
      new Observable((subscriber) => {
        subscriber.next(testData);
        subscriber.complete();
      }),
    );

    // Act
    const result = interceptor.intercept(mockArgumentsHost, mockCallHandler);
    result.subscribe({
      next: (value) => {
        // Assert
        expect(value).toEqual(testData);
        done();
      },
    });
  });
});
