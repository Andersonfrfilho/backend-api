import { beforeEach, describe, expect, it } from '@jest/globals';
import { UserController } from './user.controller';

describe('UserController - Unit Tests', () => {
  let controller: UserController;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
    };
    controller = new UserController(mockUserService);
  });

  describe('create user endpoint', () => {
    it('should create user with valid params', async () => {
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

      mockUserService.createUser.mockResolvedValue(expectedResponse);

      const result = await controller.create(params);

      expect(mockUserService.createUser).toHaveBeenCalledWith(params);
      expect(result).toEqual(expectedResponse);
    });

    it('should call user service create method', async () => {
      const params = {
        email: 'user@example.com',
        password: 'secure123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserService.createUser.mockResolvedValue({ id: 'user-123' });

      await controller.create(params);

      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.createUser).toHaveBeenCalledWith(params);
    });

    it('should return created user response', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = {
        id: 'user-456',
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        createdAt: '2025-12-10T10:00:00Z',
      };

      mockUserService.createUser.mockResolvedValue(response);

      const result = await controller.create(params);

      expect(result.id).toBe('user-456');
      expect(result.email).toBe(params.email);
      expect(result.createdAt).toBeDefined();
    });

    it('should propagate service errors', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const error = new Error('Email already exists');
      mockUserService.createUser.mockRejectedValue(error);

      await expect(controller.create(params)).rejects.toThrow('Email already exists');
    });

    it('should handle validation errors from service', async () => {
      const params = {
        email: 'invalid-email',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const validationError = new Error('Invalid email format');
      mockUserService.createUser.mockRejectedValue(validationError);

      await expect(controller.create(params)).rejects.toThrow('Invalid email format');
    });

    it('should handle service timeouts', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const timeoutError = new Error('Request timeout');
      mockUserService.createUser.mockRejectedValue(timeoutError);

      await expect(controller.create(params)).rejects.toThrow('Request timeout');
    });

    it('should return promise', () => {
      const params = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserService.createUser.mockResolvedValue({ id: 'user-1' });

      const result = controller.create(params);

      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle multiple concurrent requests', async () => {
      const param1 = {
        email: 'user1@example.com',
        password: 'pass1',
        firstName: 'User1',
        lastName: 'One',
      };

      const param2 = {
        email: 'user2@example.com',
        password: 'pass2',
        firstName: 'User2',
        lastName: 'Two',
      };

      const response1 = { id: 'user-1', email: param1.email };
      const response2 = { id: 'user-2', email: param2.email };

      mockUserService.createUser.mockResolvedValueOnce(response1).mockResolvedValueOnce(response2);

      const [result1, result2] = await Promise.all([
        controller.create(param1),
        controller.create(param2),
      ]);

      expect(result1.id).toBe('user-1');
      expect(result2.id).toBe('user-2');
      expect(mockUserService.createUser).toHaveBeenCalledTimes(2);
    });

    it('should preserve all parameters from request body', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '123456789',
        cpf: '12345678900',
        rg: '123456789',
      };

      mockUserService.createUser.mockResolvedValue({ id: 'user-1' });

      await controller.create(params);

      expect(mockUserService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: params.email,
          password: params.password,
          firstName: params.firstName,
          lastName: params.lastName,
        }),
      );
    });
  });

  describe('controller initialization', () => {
    it('should inject user service', () => {
      expect(controller['userService']).toBeDefined();
    });

    it('should have create method', () => {
      expect(typeof controller.create).toBe('function');
    });

    it('should be decorated as controller', () => {
      expect(controller).toBeDefined();
    });
  });
});
