import { CallHandler, ExecutionContext, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import type { LogProviderInterface } from '@modules/shared/domain';
import { LoggingInterceptor } from './logging.interceptor';

// Mock console.log globally for all tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

function createMockRequest(
  url: string,
  method: string,
  headers: Record<string, string> = {},
  params: Record<string, unknown> = {},
  body: Record<string, unknown> = {},
): Request {
  return {
    url,
    method,
    headers,
    query: {},
    params,
    body,
  } as unknown as Request;
}

function createMockContext(request: Request): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function createErrorCallHandler(error: Error): CallHandler {
  const handler = () => throwError(() => error);
  return {
    handle: handler,
  } as unknown as CallHandler;
}

describe('LoggingInterceptor - Unit Tests', () => {
  let interceptor: LoggingInterceptor;
  let logProvider: LogProviderInterface;

  beforeEach(() => {
    // Arrange: Setup mocks with direct instantiation
    logProvider = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as LogProviderInterface;

    // Create interceptor directly without Test.createTestingModule
    interceptor = new LoggingInterceptor(logProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should log request start', (done) => {
      // Arrange
      const mockRequest = createMockRequest('/api/users', 'GET');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of({ success: true }),
      } as unknown as CallHandler;

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        complete: () => {
          expect(logProvider.info).toHaveBeenCalled();
          const infoCall = (logProvider.info as jest.Mock).mock.calls[0][0];
          expect(infoCall).toMatchObject({
            message: expect.stringContaining('Request started'),
            context: 'LoggingInterceptor',
          });
          done();
        },
      });
    });

    it('should log completion with duration', (done) => {
      // Arrange
      const mockRequest = createMockRequest('/api/test', 'POST');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of({ result: 'success' }),
      } as unknown as CallHandler;

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        complete: () => {
          const infoCalls = (logProvider.info as jest.Mock).mock.calls;
          const completionLog = infoCalls.at(-1)?.[0];

          expect(completionLog).toMatchObject({
            message: expect.stringContaining('Request completed'),
            context: 'LoggingInterceptor',
          });
          done();
        },
      });
    });

    it('should include request header in info log', (done) => {
      // Arrange
      const params = { id: '123' };
      const mockRequest = createMockRequest('/api/resource', 'PUT', {}, params);
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of({ updated: true }),
      } as unknown as CallHandler;

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        complete: () => {
          expect(logProvider.info).toHaveBeenCalledWith(
            expect.objectContaining({
              params: expect.objectContaining({
                header: expect.objectContaining({
                  method: 'PUT',
                  path: '/api/resource',
                }),
              }),
            }),
          );
          done();
        },
      });
    });

    it('should log error with status code', (done) => {
      // Arrange
      const mockRequest = createMockRequest('/api/error', 'DELETE');
      const mockContext = createMockContext(mockRequest);
      const error = Object.assign(new Error('Forbidden'), { status: HttpStatus.FORBIDDEN });
      const mockCallHandler = createErrorCallHandler(error);

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        error: () => {
          expect(logProvider.error).toHaveBeenCalledWith(
            expect.objectContaining({
              message: expect.stringContaining('Request failed'),
              params: expect.objectContaining({
                statusCode: HttpStatus.FORBIDDEN,
              }),
            }),
          );
          done();
        },
      });
    });

    it('should log error with default status 500', (done) => {
      // Arrange
      const mockRequest = createMockRequest('/api/fail', 'GET');
      const mockContext = createMockContext(mockRequest);
      const error = new Error('Unexpected error');
      const mockCallHandler = createErrorCallHandler(error);

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        error: () => {
          expect(logProvider.error).toHaveBeenCalledWith(
            expect.objectContaining({
              params: expect.objectContaining({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              }),
            }),
          );
          done();
        },
      });
    });

    it('should include response data in completion log', (done) => {
      // Arrange
      const mockRequest = createMockRequest('/api/data', 'GET');
      const mockContext = createMockContext(mockRequest);
      const responseData = { id: 1, name: 'Test' };
      const mockCallHandler = {
        handle: () => of(responseData),
      } as unknown as CallHandler;

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        complete: () => {
          const infoCalls = (logProvider.info as jest.Mock).mock.calls;
          const completionLog = infoCalls.at(-1)?.[0];

          expect(completionLog?.params?.response).toEqual(responseData);
          done();
        },
      });
    });

    it('should pass response data through observable', (done) => {
      // Arrange
      const mockRequest = createMockRequest('/api/check', 'GET');
      const mockContext = createMockContext(mockRequest);
      const responseData = { status: 'ok' };
      const mockCallHandler = {
        handle: () => of(responseData),
      } as unknown as CallHandler;

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (data) => {
          // Assert - data should pass through
          expect(data).toEqual(responseData);
        },
        complete: () => {
          done();
        },
      });
    });
  });
});
