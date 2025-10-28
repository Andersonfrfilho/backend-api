import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './error-filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LOG_PROVIDER } from '@app/core/providers/log/log.interface'; // Or '@core/providers/log/log.interface' if preferred; ensure file exists
import type { ArgumentsHost } from '@nestjs/common';

// Mocks for ArgumentsHost and response/request
let mockJson: jest.Mock;
let mockStatus: jest.Mock;
let mockGetResponse: jest.Mock;
let mockGetRequest: jest.Mock;
let mockHttpArgumentsHost: jest.Mock;
let mockArgumentsHost: ArgumentsHost;

// Mocks for log provider
const logMock = jest.fn();
const errorMock = jest.fn();
const warnMock = jest.fn();
const mockLogProvider = {
  log: logMock,
  error: errorMock,
  warn: warnMock,
};

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: LOG_PROVIDER,
          useValue: mockLogProvider,
        },
      ],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    // Initialize response/request mocks
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockGetRequest = jest.fn().mockReturnValue({ url: '/test-url' }); // Mock request URL for path in response
    mockHttpArgumentsHost = jest.fn().mockReturnValue({
      getResponse: mockGetResponse,
      getRequest: mockGetRequest,
    });

    mockArgumentsHost = {
      switchToHttp: mockHttpArgumentsHost,
    } as unknown as ArgumentsHost;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException and log error', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    // Verify response handling (adjust based on your filter's exact output)
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        path: '/test-url', // Assuming filter includes request path
      }),
    );

    // Verify logging
    expect(errorMock).toHaveBeenCalled(); // Add more specific expectations if needed, e.g., withTimes(1) or withArgs(...)
  });
});
