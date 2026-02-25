import { beforeEach, describe, expect, it } from '@jest/globals';
import { UserService } from './user.service';

describe('UserService - Unit Tests', () => {
  let service: UserService;
  let mockUserCreateUseCase: any;

  beforeEach(() => {
    mockUserCreateUseCase = {
      execute: jest.fn(),
    };
    service = new UserService(mockUserCreateUseCase);
  });

  describe('createUser', () => {
    it('should call use case execute with params', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const expectedResponse = {
        id: 'user-1',
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
      };

      mockUserCreateUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await service.createUser(params);

      expect(mockUserCreateUseCase.execute).toHaveBeenCalledWith(params);
      expect(result).toEqual(expectedResponse);
    });

    it('should return user response', async () => {
      const params = {
        email: 'user@example.com',
        password: 'secure123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = {
        id: 'user-123',
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        createdAt: new Date().toISOString(),
      };

      mockUserCreateUseCase.execute.mockResolvedValue(response);

      const result = await service.createUser(params);

      expect(result.id).toBe('user-123');
      expect(result.email).toBe(params.email);
    });

    it('should propagate use case errors', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const error = new Error('Email already exists');
      mockUserCreateUseCase.execute.mockRejectedValue(error);

      await expect(service.createUser(params)).rejects.toThrow('Email already exists');
    });

    it('should handle multiple user creations', async () => {
      const param1 = {
        email: 'user1@example.com',
        password: 'pass1',
        firstName: 'User',
        lastName: 'One',
      };

      const param2 = {
        email: 'user2@example.com',
        password: 'pass2',
        firstName: 'User',
        lastName: 'Two',
      };

      const response1 = { id: 'user-1', email: param1.email };
      const response2 = { id: 'user-2', email: param2.email };

      mockUserCreateUseCase.execute
        .mockResolvedValueOnce(response1)
        .mockResolvedValueOnce(response2);

      const result1 = await service.createUser(param1);
      const result2 = await service.createUser(param2);

      expect(result1.id).toBe('user-1');
      expect(result2.id).toBe('user-2');
      expect(mockUserCreateUseCase.execute).toHaveBeenCalledTimes(2);
    });

    it('should preserve all parameters passed to use case', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '123456789',
        address: {
          street: 'Test St',
          city: 'Test City',
        },
      };

      mockUserCreateUseCase.execute.mockResolvedValue({ id: 'user-1' });

      await service.createUser(params);

      expect(mockUserCreateUseCase.execute).toHaveBeenCalledWith(params);
    });

    it('should handle async execution', (done) => {
      const params = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserCreateUseCase.execute.mockResolvedValue({ id: 'user-1' });

      void service.createUser(params).then(() => {
        expect(mockUserCreateUseCase.execute).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('service initialization', () => {
    it('should inject use case', () => {
      expect(service['userCreateUseCase']).toBeDefined();
    });

    it('should be injectable', () => {
      expect(service).toBeDefined();
      expect(typeof service.createUser).toBe('function');
    });
  });
});
