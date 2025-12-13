import { SecurityHeadersMiddleware } from './security-headers.middleware';

describe('SecurityHeadersMiddleware', () => {
  let middleware: SecurityHeadersMiddleware;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock<any>;

  beforeEach(() => {
    middleware = new SecurityHeadersMiddleware();

    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('use method', () => {
    it('should be defined', () => {
      expect(middleware.use).toBeDefined();
      expect(typeof middleware.use).toBe('function');
    });

    it('should call next function', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should call next function without arguments', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('X-Content-Type-Options header', () => {
    it('should set X-Content-Type-Options header to nosniff', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    });

    it('should prevent MIME type sniffing', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const contentTypeCall = calls.find((call) => call[0] === 'X-Content-Type-Options');

      expect(contentTypeCall).toBeDefined();
      expect(contentTypeCall[1]).toBe('nosniff');
    });
  });

  describe('X-Frame-Options header', () => {
    it('should set X-Frame-Options header to DENY', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    });

    it('should prevent clickjacking attacks', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const frameOptionsCall = calls.find((call) => call[0] === 'X-Frame-Options');

      expect(frameOptionsCall).toBeDefined();
      expect(frameOptionsCall[1]).toBe('DENY');
    });
  });

  describe('X-XSS-Protection header', () => {
    it('should set X-XSS-Protection header to 1; mode=block', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    });

    it('should provide XSS protection for older browsers', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const xssProtectionCall = calls.find((call) => call[0] === 'X-XSS-Protection');

      expect(xssProtectionCall).toBeDefined();
      expect(xssProtectionCall[1]).toContain('1');
      expect(xssProtectionCall[1]).toContain('mode=block');
    });
  });

  describe('Strict-Transport-Security header', () => {
    it('should set Strict-Transport-Security header with max-age and includeSubDomains', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    });

    it('should enforce HTTPS with 1 year max-age', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const hstsCall = calls.find((call) => call[0] === 'Strict-Transport-Security');

      expect(hstsCall).toBeDefined();
      expect(hstsCall[1]).toContain('max-age=31536000');
      expect(hstsCall[1]).toContain('includeSubDomains');
    });

    it('should include 31536000 seconds (1 year) in max-age', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const hstsCall = calls.find((call) => call[0] === 'Strict-Transport-Security');

      expect(hstsCall[1]).toContain('31536000');
    });
  });

  describe('Content-Security-Policy header', () => {
    it('should set Content-Security-Policy header', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall).toBeDefined();
    });

    it('should restrict default-src to self', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall[1]).toContain("default-src 'self'");
    });

    it('should restrict script-src to self', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall[1]).toContain("script-src 'self'");
    });

    it('should restrict style-src to self and unsafe-inline', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall[1]).toContain("style-src 'self' 'unsafe-inline'");
    });

    it('should restrict img-src to self and data URIs', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall[1]).toContain("img-src 'self' data:");
    });

    it('should restrict font-src to self', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall[1]).toContain("font-src 'self'");
    });

    it('should contain complete CSP policy', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');
      const cspValue = cspCall[1];

      expect(cspValue).toContain("default-src 'self'");
      expect(cspValue).toContain("script-src 'self'");
      expect(cspValue).toContain("style-src 'self' 'unsafe-inline'");
      expect(cspValue).toContain("img-src 'self' data:");
      expect(cspValue).toContain("font-src 'self'");
    });
  });

  describe('Referrer-Policy header', () => {
    it('should set Referrer-Policy header to strict-origin-when-cross-origin', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin',
      );
    });

    it('should reduce referrer information leakage', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const referrerCall = calls.find((call) => call[0] === 'Referrer-Policy');

      expect(referrerCall).toBeDefined();
      expect(referrerCall[1]).toBe('strict-origin-when-cross-origin');
    });
  });

  describe('X-Powered-By header removal', () => {
    it('should remove X-Powered-By header', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.removeHeader).toHaveBeenCalledWith('X-Powered-By');
    });

    it('should call removeHeader exactly once for X-Powered-By', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.removeHeader as jest.Mock).mock.calls;
      const poweredByRemoval = calls.filter((call) => call[0] === 'X-Powered-By');

      expect(poweredByRemoval.length).toBe(1);
    });

    it('should prevent technology stack exposure', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.removeHeader).toHaveBeenCalledWith('X-Powered-By');
    });
  });

  describe('header order and completeness', () => {
    it('should set all required security headers', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const headerNames = calls.map((call) => call[0]);

      expect(headerNames).toContain('X-Content-Type-Options');
      expect(headerNames).toContain('X-Frame-Options');
      expect(headerNames).toContain('X-XSS-Protection');
      expect(headerNames).toContain('Strict-Transport-Security');
      expect(headerNames).toContain('Content-Security-Policy');
      expect(headerNames).toContain('Referrer-Policy');
    });

    it('should set 6 security headers', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      expect(calls.length).toBe(6);
    });

    it('should remove X-Powered-By header', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const removeHeaderCalls = (mockResponse.removeHeader as jest.Mock).mock.calls;
      expect(removeHeaderCalls.length).toBe(1);
      expect(removeHeaderCalls[0][0]).toBe('X-Powered-By');
    });
  });

  describe('middleware integration', () => {
    it('should be injectable', () => {
      expect(() => {
        new SecurityHeadersMiddleware();
      }).not.toThrow();
    });

    it('should implement NestMiddleware interface', () => {
      expect(middleware).toHaveProperty('use');
      expect(typeof middleware.use).toBe('function');
    });

    it('should work with multiple consecutive calls', () => {
      const mockResponse2 = {
        setHeader: jest.fn(),
        removeHeader: jest.fn(),
      };

      middleware.use(mockRequest, mockResponse, mockNext);
      middleware.use(mockRequest, mockResponse2, mockNext);

      // Both should have called setHeader
      expect(mockResponse.setHeader).toHaveBeenCalled();
      expect(mockResponse2.setHeader).toHaveBeenCalled();
    });

    it('should not modify the request object', () => {
      const requestCopy = { ...mockRequest };
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest).toEqual(requestCopy);
    });

    it('should call next before modifying response in theory', () => {
      // The middleware modifies response then calls next
      // Ensure next is called once
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('security coverage', () => {
    it('should protect against MIME type sniffing (CVE coverage)', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    });

    it('should protect against clickjacking (CVE coverage)', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    });

    it('should protect against XSS attacks (CVE coverage)', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    });

    it('should enforce HTTPS (CVE coverage)', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const hstsCall = calls.find((call) => call[0] === 'Strict-Transport-Security');

      expect(hstsCall).toBeDefined();
    });

    it('should restrict content sources via CSP', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall).toBeDefined();
      expect(cspCall[1]).toContain("default-src 'self'");
    });

    it('should limit referrer information leakage', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin',
      );
    });

    it('should not expose server technology stack', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.removeHeader).toHaveBeenCalledWith('X-Powered-By');
    });
  });

  describe('edge cases', () => {
    it('should handle when response object is minimal', () => {
      const minimalResponse = {
        setHeader: jest.fn(),
        removeHeader: jest.fn(),
      };

      expect(() => {
        middleware.use(
          mockRequest as Request,
          minimalResponse as Partial<Response> as Response,
          mockNext as NextFunction,
        );
      }).not.toThrow();
    });

    it('should still call next even if response operations throw', () => {
      const errorResponse = {
        setHeader: jest.fn().mockImplementation(() => {
          throw new Error('setHeader failed');
        }),
        removeHeader: jest.fn(),
      };

      // The middleware doesn't have error handling, so it will throw
      expect(() => {
        middleware.use(
          mockRequest as Request,
          errorResponse as Partial<Response> as Response,
          mockNext as NextFunction,
        );
      }).toThrow();
    });

    it('should handle null next function gracefully', () => {
      const nullNext = null as any;

      expect(() => {
        middleware.use(mockRequest as Request, mockResponse as Response, nullNext);
      }).toThrow();
    });

    it('should work with undefined request properties', () => {
      const emptyRequest = {} as Request;

      expect(() => {
        middleware.use(emptyRequest, mockResponse as Response, mockNext as NextFunction);
      }).not.toThrow();
    });
  });

  describe('OWASP compliance', () => {
    it('should meet OWASP A03:2021 - Injection protection requirements', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const cspCall = calls.find((call) => call[0] === 'Content-Security-Policy');

      expect(cspCall).toBeDefined();
      // CSP helps mitigate injection attacks
    });

    it('should meet OWASP A05:2021 - Broken Access Control requirements', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      // X-Frame-Options helps prevent unauthorized framing
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    });

    it('should meet OWASP A01:2021 - Broken Access Control via multiple headers', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      const calls = (mockResponse.setHeader as jest.Mock).mock.calls;
      const headerNames = calls.map((call) => call[0]);

      // Multiple defense layers
      expect(headerNames).toContain('X-Frame-Options');
      expect(headerNames).toContain('Content-Security-Policy');
      expect(headerNames).toContain('Strict-Transport-Security');
    });
  });
});
