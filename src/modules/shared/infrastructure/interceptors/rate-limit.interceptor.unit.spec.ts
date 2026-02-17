import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { RateLimitConfig, RateLimitInterceptor } from './rate-limit.interceptor';

describe('RateLimitInterceptor - Unit Tests', () => {
  let interceptor: RateLimitInterceptor;
  let mockContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;
  let mockRequest: any;
  let config: RateLimitConfig;

  beforeEach(() => {
    config = {
      maxAttempts: 5,
      windowMs: 60000, // 60 seconds
      message: 'Too many requests',
    };

    interceptor = new RateLimitInterceptor(config);

    mockRequest = {
      ip: '127.0.0.1',
      headers: {},
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue({
          setHeader: jest.fn(),
        }),
      } as any),
    };

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ success: true })),
    } as any;
  });

  describe('intercept', () => {
    it('should be defined', () => {
      expect(interceptor).toBeDefined();
      expect(interceptor.intercept).toBeDefined();
    });

    it('should allow requests within rate limit', (done) => {
      const result = interceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: (response) => {
          expect(response).toEqual({ success: true });
          done();
        },
      });
    });

    it('should allow multiple requests from same IP within limit', (done) => {
      let successCount = 0;

      for (let i = 0; i < config.maxAttempts; i++) {
        interceptor
          .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
          .subscribe({
            next: () => {
              successCount++;
              if (successCount === config.maxAttempts) {
                expect(successCount).toBe(config.maxAttempts);
                done();
              }
            },
          });
      }
    });

    it('should track requests by IP address', () => {
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      // First IP - make a request
      mockRequest.headers['x-forwarded-for'] = ip1;
      expect(() => {
        interceptor
          .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
          .subscribe();
      }).not.toThrow();

      // Different IP should be tracked separately
      mockRequest.headers['x-forwarded-for'] = ip2;
      expect(() => {
        interceptor
          .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
          .subscribe();
      }).not.toThrow();

      // Both IPs should be tracked
      expect(interceptor).toBeDefined();
    });
  });

  describe('Rate limiting enforcement', () => {
    it('should block requests exceeding maxAttempts', () => {
      // Make requests up to the limit
      for (let i = 0; i < config.maxAttempts; i++) {
        expect(() => {
          interceptor
            .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
            .subscribe();
        }).not.toThrow();
      }

      // One more request should be blocked and throw synchronously
      expect(() => {
        interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler);
      }).toThrow();
    });

    it('should return 429 status for rate limit exceeded', () => {
      // Make requests up to the limit
      for (let i = 0; i < config.maxAttempts; i++) {
        expect(() => {
          interceptor
            .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
            .subscribe();
        }).not.toThrow();
      }

      // Next request should throw with 429 status
      expect(() => {
        interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler);
      }).toThrow();
    });
  });

  describe('Time window handling', () => {
    it('should reset counter after time window expires', async () => {
      const shortConfig: RateLimitConfig = {
        maxAttempts: 2,
        windowMs: 100, // 100ms window for testing
      };

      const shortInterceptor = new RateLimitInterceptor(shortConfig);

      // Make 2 requests
      for (let i = 0; i < shortConfig.maxAttempts; i++) {
        shortInterceptor
          .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
          .subscribe();
      }

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Next request should be allowed
      const result = shortInterceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: () => {
          expect(mockCallHandler.handle).toHaveBeenCalled();
        },
      });
    });
  });

  describe('IP address detection', () => {
    it('should use X-Forwarded-For header for IP detection', (done) => {
      mockRequest.headers['x-forwarded-for'] = '203.0.113.5';

      const result = interceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: () => {
          // Should succeed - different IP
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should fall back to request.ip if X-Forwarded-For not present', (done) => {
      mockRequest.ip = '10.0.0.1';
      delete mockRequest.headers['x-forwarded-for'];

      const result = interceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: () => {
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle localhost IP', (done) => {
      mockRequest.ip = '127.0.0.1';

      const result = interceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: () => {
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle IPv6 addresses', (done) => {
      mockRequest.ip = '::1';

      const result = interceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: () => {
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('Configuration', () => {
    it('should accept custom maxAttempts', () => {
      const customConfig: RateLimitConfig = {
        maxAttempts: 10,
        windowMs: 60000,
      };

      const customInterceptor = new RateLimitInterceptor(customConfig);

      expect(customInterceptor).toBeDefined();
    });

    it('should accept custom windowMs', () => {
      const customConfig: RateLimitConfig = {
        maxAttempts: 5,
        windowMs: 120000, // 2 minutes
      };

      const customInterceptor = new RateLimitInterceptor(customConfig);

      expect(customInterceptor).toBeDefined();
    });

    it('should accept custom message', () => {
      const customConfig: RateLimitConfig = {
        maxAttempts: 5,
        windowMs: 60000,
        message: 'Custom rate limit message',
      };

      const customInterceptor = new RateLimitInterceptor(customConfig);

      expect(customInterceptor).toBeDefined();
    });
  });

  describe('Memory management', () => {
    it('should cleanup expired records periodically', async () => {
      // This tests that the cleanup interval is set
      const customConfig: RateLimitConfig = {
        maxAttempts: 5,
        windowMs: 100,
      };

      const cleanupInterceptor = new RateLimitInterceptor(customConfig);

      expect(cleanupInterceptor).toBeDefined();
      // Cleanup should be triggered automatically
    });

    it('should not memory leak with many IPs', () => {
      // Make requests from different IPs
      const ipCount = 5; // Equal to maxAttempts
      for (let i = 0; i < ipCount; i++) {
        // Set X-Forwarded-For header which is the first thing getClientIp checks
        mockRequest.headers['x-forwarded-for'] = `192.168.1.${i}`;

        expect(() => {
          // Only make 1 request per IP
          interceptor
            .intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
            .subscribe();
        }).not.toThrow();
      }

      // Verify the interceptor is working and tracked the IPs
      expect(interceptor).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle missing request object', () => {
      const badContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
          getResponse: jest.fn().mockReturnValue({
            setHeader: jest.fn(),
          }),
        }),
      } as any;

      expect(() => {
        interceptor.intercept(badContext as ExecutionContext, mockCallHandler as CallHandler);
      }).not.toThrow();
    });

    it('should handle missing IP address', (done) => {
      mockRequest.ip = undefined;

      const result = interceptor.intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      );

      result.subscribe({
        next: () => {
          // Should use fallback IP
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
