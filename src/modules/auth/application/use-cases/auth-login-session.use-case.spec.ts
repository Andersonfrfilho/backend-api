import { describe, it, expect, beforeEach } from '@jest/globals';
import { AuthLoginSessionUseCase } from './auth-login-session.use-case';
import { AuthLoginSessionRequestDto } from '@modules/auth/shared/dtos';

describe('AuthLoginSessionUseCase', () => {
  let useCase: AuthLoginSessionUseCase;

  beforeEach(() => {
    useCase = new AuthLoginSessionUseCase();
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should return a promise', () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result = useCase.execute(input);

      // Assert
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return login session response with tokens', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should include email in accessToken', async () => {
      // Arrange
      const email = 'user@test.com';
      const input: AuthLoginSessionRequestDto = {
        email,
        password: 'Test@1234',
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.accessToken).toContain(email);
    });

    it('should return non-empty tokens', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.accessToken).not.toBe('');
      expect(result.refreshToken).not.toBe('');
    });

    it('should handle different email addresses', async () => {
      // Arrange
      const emails = ['user1@test.com', 'user2@test.com', 'user3@test.com'];

      // Act & Assert
      for (const email of emails) {
        const input: AuthLoginSessionRequestDto = {
          email,
          password: 'Test@1234',
        };

        const result = await useCase.execute(input);

        expect(result.accessToken).toContain(email);
        expect(result.refreshToken).toBeDefined();
      }
    });

    it('should return consistent tokens for same input', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result1 = await useCase.execute(input);
      const result2 = await useCase.execute(input);

      // Assert
      expect(result1).toEqual(result2);
    });
  });
});
