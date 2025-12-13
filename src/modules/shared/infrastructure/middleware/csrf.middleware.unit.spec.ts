import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CsrfMiddleware } from './csrf.middleware';

describe('CsrfMiddleware - Unit Tests', () => {
  let middleware: CsrfMiddleware;
  let mockRequest: Partial<FastifyRequest>;
  let mockResponse: Partial<FastifyReply>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    middleware = new CsrfMiddleware();
    nextFunction = jest.fn();

    mockRequest = {
      method: 'GET',
      ip: '127.0.0.1',
      headers: {},
    } as any;

    mockResponse = {
      header: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as any;
  });

  describe('GET requests', () => {
    it('should allow GET requests without CSRF token', () => {
      mockRequest.method = 'GET';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should generate CSRF token for GET requests', () => {
      mockRequest.method = 'GET';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.header).toHaveBeenCalledWith('X-CSRF-Token', expect.any(String));
    });

    it('should return a valid token string', () => {
      mockRequest.method = 'GET';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const headerCall = (mockResponse.header as jest.Mock).mock.calls[0];
      const token = headerCall[1];

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('HEAD requests', () => {
    it('should allow HEAD requests without CSRF validation', () => {
      mockRequest.method = 'HEAD';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should generate token for HEAD requests', () => {
      mockRequest.method = 'HEAD';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.header).toHaveBeenCalledWith('X-CSRF-Token', expect.any(String));
    });
  });

  describe('OPTIONS requests', () => {
    it('should allow OPTIONS requests without CSRF validation', () => {
      mockRequest.method = 'OPTIONS';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should generate token for OPTIONS requests', () => {
      mockRequest.method = 'OPTIONS';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.header).toHaveBeenCalledWith('X-CSRF-Token', expect.any(String));
    });
  });

  describe('POST requests', () => {
    it('should validate CSRF token for POST requests', () => {
      // First, generate a token
      mockRequest.method = 'GET';
      mockRequest.ip = '192.168.1.1';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const generatedToken = (mockResponse.header as jest.Mock).mock.calls[0][1];

      // Now try POST with the token
      mockRequest.method = 'POST';
      mockRequest.headers = { 'x-csrf-token': generatedToken };

      nextFunction.mockClear();
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject POST without CSRF token', () => {
      mockRequest.method = 'POST';
      mockRequest.headers = {};

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should reject POST with invalid CSRF token', () => {
      mockRequest.method = 'POST';
      mockRequest.headers = { 'x-csrf-token': 'invalid-token' };

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe('PUT requests', () => {
    it('should validate CSRF token for PUT requests', () => {
      // Generate token first
      mockRequest.method = 'GET';
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const generatedToken = (mockResponse.header as jest.Mock).mock.calls[0][1];

      // Try PUT with token
      mockRequest.method = 'PUT';
      mockRequest.headers = { 'x-csrf-token': generatedToken };

      nextFunction.mockClear();
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject PUT without CSRF token', () => {
      mockRequest.method = 'PUT';
      mockRequest.headers = {};

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe('DELETE requests', () => {
    it('should validate CSRF token for DELETE requests', () => {
      // Generate token
      mockRequest.method = 'GET';
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const generatedToken = (mockResponse.header as jest.Mock).mock.calls[0][1];

      // Try DELETE with token
      mockRequest.method = 'DELETE';
      mockRequest.headers = { 'x-csrf-token': generatedToken };

      nextFunction.mockClear();
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject DELETE without CSRF token', () => {
      mockRequest.method = 'DELETE';
      mockRequest.headers = {};

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe('PATCH requests', () => {
    it('should validate CSRF token for PATCH requests', () => {
      // Generate token
      mockRequest.method = 'GET';
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const generatedToken = (mockResponse.header as jest.Mock).mock.calls[0][1];

      // Try PATCH with token
      mockRequest.method = 'PATCH';
      mockRequest.headers = { 'x-csrf-token': generatedToken };

      nextFunction.mockClear();
      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject PATCH without CSRF token', () => {
      mockRequest.method = 'PATCH';
      mockRequest.headers = {};

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe('Token generation', () => {
    it('should generate different tokens for different IPs', () => {
      mockRequest.method = 'GET';
      mockRequest.ip = '192.168.1.1';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);
      const token1 = (mockResponse.header as jest.Mock).mock.calls[0][1];

      mockRequest.ip = '192.168.1.2';
      (mockResponse.header as jest.Mock).mockClear();

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);
      const token2 = (mockResponse.header as jest.Mock).mock.calls[0][1];

      expect(token1).not.toBe(token2);
    });

    it('should return token in hexadecimal format', () => {
      mockRequest.method = 'GET';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const token = (mockResponse.header as jest.Mock).mock.calls[0][1];

      // Hex string should match pattern
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });
  });

  describe('Error responses', () => {
    it('should return 403 status for CSRF validation failure', () => {
      mockRequest.method = 'POST';
      mockRequest.headers = { 'x-csrf-token': 'invalid' };

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should not call next() on CSRF validation failure', () => {
      mockRequest.method = 'POST';
      mockRequest.headers = { 'x-csrf-token': 'invalid' };

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should send error message on validation failure', () => {
      mockRequest.method = 'POST';
      mockRequest.headers = {};

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('IP address handling', () => {
    it('should track tokens per IP address', () => {
      mockRequest.ip = '10.0.0.1';
      mockRequest.method = 'GET';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const token1 = (mockResponse.header as jest.Mock).mock.calls[0][1];

      mockRequest.ip = '10.0.0.2';
      (mockResponse.header as jest.Mock).mockClear();

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      const token2 = (mockResponse.header as jest.Mock).mock.calls[0][1];

      expect(token1).not.toBe(token2);
    });

    it('should handle X-Forwarded-For header for IP detection', () => {
      mockRequest.headers = { 'x-forwarded-for': '203.0.113.5' };
      mockRequest.method = 'GET';

      middleware.use(mockRequest as any, mockResponse as any, nextFunction);

      expect(mockResponse.header).toHaveBeenCalledWith('X-CSRF-Token', expect.any(String));
    });
  });
});
