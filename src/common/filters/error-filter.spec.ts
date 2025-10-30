import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './error-filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LOG_PROVIDER } from '@app/core/providers/log/log.interface';
import type { ArgumentsHost } from '@nestjs/common';

let mockJson: jest.Mock;
let mockStatus: jest.Mock;
let mockGetResponse: jest.Mock;
let mockGetRequest: jest.Mock;
let mockHttpArgumentsHost: jest.Mock;
let mockArgumentsHost: ArgumentsHost;

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

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockGetRequest = jest.fn().mockReturnValue({ url: '/test-url' });
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
    // Arrange - Filter is properly instantiated in beforeEach

    // Act & Assert
    expect(filter).toBeDefined();
  });

  it('should handle HttpException and log error', () => {
    // Arrange
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        path: '/test-url',
      }),
    );
    expect(errorMock).toHaveBeenCalled();
  });

  it('should handle throw Error and log error', () => {
    // Arrange
    const exception = new Error('Any Error');

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        path: '/test-url',
        timestamp: expect.any(String) as string,
      }),
    );
    expect(errorMock).toHaveBeenCalled();
  });

  it('should handle throw Error and exception getResponse', () => {
    // Arrange
    const customMessageMock = 'Custom error message';
    const exception = new HttpException(
      { message: customMessageMock },
      HttpStatus.BAD_REQUEST,
    );

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: customMessageMock,
        path: '/test-url',
        timestamp: expect.any(String) as string,
      }),
    );
    expect(errorMock).toHaveBeenCalled();
  });

  it('should handle throw Error and exception getResponse when message undefined', () => {
    // Arrange
    const exception = new HttpException(
      { message: undefined },
      HttpStatus.BAD_REQUEST,
    );

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error',
        path: '/test-url',
        timestamp: expect.any(String) as string,
      }),
    );
    expect(errorMock).toHaveBeenCalled();
  });
});
