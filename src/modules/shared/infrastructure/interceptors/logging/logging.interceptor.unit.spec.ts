import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import type { LogProviderInterface } from '@modules/shared/domain';
import { LoggingInterceptor } from './logging.interceptor';

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
      const error = Object.assign(new Error('Forbidden'), { status: 403 });
      const mockCallHandler = createErrorCallHandler(error);

      // Act
      interceptor.intercept(mockContext, mockCallHandler).subscribe({
        // Assert
        error: () => {
          expect(logProvider.error).toHaveBeenCalledWith(
            expect.objectContaining({
              message: expect.stringContaining('Request failed'),
              params: expect.objectContaining({
                statusCode: 403,
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
                statusCode: 500,
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

  describe('ignore routes functionality', () => {
    it('should skip logging for ignored health route', (done) => {
      // Arrange
      const mockLogProvider = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      } as unknown as LogProviderInterface;

      const ignoreConfig = {
        enabled: true,
        ignoredRoutes: ['/health'],
      };

      const localInterceptor = new LoggingInterceptor(mockLogProvider, ignoreConfig);
      const mockRequest = createMockRequest('/health', 'GET');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of({ status: 'ok' }),
      } as unknown as CallHandler;

      // Act
      localInterceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (data) => {
          // Assert
          expect(mockLogProvider.info).not.toHaveBeenCalled();
          expect(data).toEqual({ status: 'ok' });
          done();
        },
      });
    });

    it('should skip logging for nested ignored routes', (done) => {
      // Arrange
      const mockLogProvider = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      } as unknown as LogProviderInterface;

      const ignoreConfig = {
        enabled: true,
        ignoredRoutes: ['/health'],
      };

      const localInterceptor = new LoggingInterceptor(mockLogProvider, ignoreConfig);
      const mockRequest = createMockRequest('/health/live', 'GET');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of({ status: 'alive' }),
      } as unknown as CallHandler;

      // Act
      localInterceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: (data) => {
          // Assert
          expect(mockLogProvider.info).not.toHaveBeenCalled();
          expect(data).toEqual({ status: 'alive' });
          done();
        },
      });
    });

    it('should skip logging when config is disabled', (done) => {
      // Arrange
      const mockLogProvider = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      } as unknown as LogProviderInterface;

      const ignoreConfig = {
        enabled: false,
        ignoredRoutes: [],
      };

      const localInterceptor = new LoggingInterceptor(mockLogProvider, ignoreConfig);
      const mockRequest = createMockRequest('/users', 'GET');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of([]),
      } as unknown as CallHandler;

      // Act
      localInterceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: () => {
          // Assert
          expect(mockLogProvider.info).not.toHaveBeenCalled();
        },
        complete: () => {
          done();
        },
      });
    });

    it('should log non-ignored routes even with ignore config', (done) => {
      // Arrange
      const mockLogProvider = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      } as unknown as LogProviderInterface;

      const ignoreConfig = {
        enabled: true,
        ignoredRoutes: ['/health'],
      };

      const localInterceptor = new LoggingInterceptor(mockLogProvider, ignoreConfig);
      const mockRequest = createMockRequest('/api/users', 'GET');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of([]),
      } as unknown as CallHandler;

      // Act
      localInterceptor.intercept(mockContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(mockLogProvider.info).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should support regex patterns in ignored routes', (done) => {
      // Arrange
      const mockLogProvider = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      } as unknown as LogProviderInterface;

      const ignoreConfig = {
        enabled: true,
        ignoredRoutes: [/^\/api\/health/],
      };

      const localInterceptor = new LoggingInterceptor(mockLogProvider, ignoreConfig);
      const mockRequest = createMockRequest('/api/health/status', 'GET');
      const mockContext = createMockContext(mockRequest);
      const mockCallHandler = {
        handle: () => of({ status: 'up' }),
      } as unknown as CallHandler;

      // Act
      localInterceptor.intercept(mockContext, mockCallHandler).subscribe({
        next: () => {
          // Assert
          expect(mockLogProvider.info).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should support multiple ignore routes', (done) => {
      // Arrange
      const mockLogProvider = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      } as unknown as LogProviderInterface;

      const ignoreConfig = {
        enabled: true,
        ignoredRoutes: ['/health', '/metrics', '/docs'],
      };

      const localInterceptor = new LoggingInterceptor(mockLogProvider, ignoreConfig);
      const mockRequest1 = createMockRequest('/metrics', 'GET');
      const mockContext1 = createMockContext(mockRequest1);
      const mockCallHandler = {
        handle: () => of({}),
      } as unknown as CallHandler;

      // Act
      localInterceptor.intercept(mockContext1, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(mockLogProvider.info).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
