import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UserRepository } from './user.repository';

describe('UserRepository - Unit Tests', () => {
  let repository: UserRepository;
  let mockTypeormRepo: any;

  beforeEach(() => {
    mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    repository = new UserRepository(mockTypeormRepo);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: faker.internet.email(),
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const createdUser = { id: faker.string.uuid(), ...userData };

      mockTypeormRepo.create.mockReturnValue(userData);
      mockTypeormRepo.save.mockResolvedValue(createdUser);

      const result = await repository.create(userData);

      expect(result).toEqual(createdUser);
      expect(mockTypeormRepo.create).toHaveBeenCalledWith(userData);
      expect(mockTypeormRepo.save).toHaveBeenCalledWith(userData);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userId = faker.string.uuid();
      const user = {
        id: userId,
        email: faker.internet.email(),
        firstName: 'John',
        lastName: 'Doe',
      };

      mockTypeormRepo.findOne.mockResolvedValue(user);

      const result = await repository.findById(userId);

      expect(result).toEqual(user);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should return null when user not found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById(faker.string.uuid());

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = faker.internet.email();
      const user = {
        id: faker.string.uuid(),
        email,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockTypeormRepo.findOne.mockResolvedValue(user);

      const result = await repository.findByEmail(email);

      expect(result).toEqual(user);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null when user email not found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail(faker.internet.email());

      expect(result).toBeNull();
    });
  });

  describe('findByCpf', () => {
    it('should find user by cpf', async () => {
      const cpf = '12345678901';
      const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        details: { cpf },
      };

      mockTypeormRepo.findOne.mockResolvedValue(user);

      const result = await repository.findByCpf(cpf);

      expect(result).toEqual(user);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { details: { cpf } },
      });
    });

    it('should return null when user cpf not found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByCpf('12345678901');

      expect(result).toBeNull();
    });
  });

  describe('findByRg', () => {
    it('should find user by rg', async () => {
      const rg = '123456789';
      const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        details: { rg },
      };

      mockTypeormRepo.findOne.mockResolvedValue(user);

      const result = await repository.findByRg(rg);

      expect(result).toEqual(user);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { details: { rg } },
      });
    });

    it('should return null when user rg not found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByRg('123456789');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userId = faker.string.uuid();
      const updateData = { firstName: 'Jane' };
      const updatedUser = {
        id: userId,
        email: faker.internet.email(),
        firstName: 'Jane',
        lastName: 'Doe',
      };

      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updatedUser);

      const result = await repository.update(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockTypeormRepo.update).toHaveBeenCalledWith(userId, updateData);
    });

    it('should throw error when user not found during update', async () => {
      const userId = faker.string.uuid();
      mockTypeormRepo.update.mockResolvedValue({ affected: 0 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      await expect(repository.update(userId, { firstName: 'Jane' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const userId = faker.string.uuid();
      mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });

      await repository.delete(userId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith(userId);
    });
  });
});
