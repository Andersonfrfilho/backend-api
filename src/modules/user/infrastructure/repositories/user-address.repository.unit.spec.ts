import { AddressTypeEnum } from '@app/modules/shared';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UserAddressRepository } from './user-address.repository';

describe('UserAddressRepository - Unit Tests', () => {
  let repository: UserAddressRepository;
  let mockTypeormRepo: any;

  beforeEach(() => {
    mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    repository = new UserAddressRepository(mockTypeormRepo);
  });

  describe('create', () => {
    it('should create a new user address', async () => {
      const userAddressData = {
        userId: faker.string.uuid(),
        addressId: faker.string.uuid(),
        isPrimary: true,
        type: AddressTypeEnum.RESIDENTIAL,
      };

      const createdUserAddress = { id: faker.string.uuid(), ...userAddressData };

      mockTypeormRepo.create.mockReturnValue(userAddressData);
      mockTypeormRepo.save.mockResolvedValue(createdUserAddress);

      const result = await repository.create(userAddressData);

      expect(result).toEqual(createdUserAddress);
      expect(mockTypeormRepo.create).toHaveBeenCalledWith(userAddressData);
      expect(mockTypeormRepo.save).toHaveBeenCalledWith(userAddressData);
    });
  });

  describe('findById', () => {
    it('should find user address by id', async () => {
      const userAddressId = faker.string.uuid();
      const userAddress = {
        id: userAddressId,
        userId: faker.string.uuid(),
        addressId: faker.string.uuid(),
        isPrimary: true,
        type: AddressTypeEnum.RESIDENTIAL,
      };

      mockTypeormRepo.findOne.mockResolvedValue(userAddress);

      const result = await repository.findById(userAddressId);

      expect(result).toEqual(userAddress);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: userAddressId },
        relations: ['user', 'address'],
      });
    });

    it('should return null when user address not found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById(faker.string.uuid());

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find user addresses by user id', async () => {
      const userId = faker.string.uuid();
      const userAddresses = [
        {
          id: faker.string.uuid(),
          userId,
          addressId: faker.string.uuid(),
          isPrimary: true,
          type: AddressTypeEnum.RESIDENTIAL,
        },
        {
          id: faker.string.uuid(),
          userId,
          addressId: faker.string.uuid(),
          isPrimary: false,
          type: AddressTypeEnum.COMMERCIAL,
        },
      ];

      mockTypeormRepo.find.mockResolvedValue(userAddresses);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual(userAddresses);
      expect(result).toHaveLength(2);
      expect(mockTypeormRepo.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['address'],
      });
    });

    it('should return empty array when no user addresses found', async () => {
      mockTypeormRepo.find.mockResolvedValue([]);

      const result = await repository.findByUserId(faker.string.uuid());

      expect(result).toEqual([]);
    });
  });

  describe('findByAddressId', () => {
    it('should find user addresses by address id', async () => {
      const addressId = faker.string.uuid();
      const userAddresses = [
        {
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          addressId,
          isPrimary: true,
          type: AddressTypeEnum.RESIDENTIAL,
        },
      ];

      mockTypeormRepo.find.mockResolvedValue(userAddresses);

      const result = await repository.findByAddressId(addressId);

      expect(result).toEqual(userAddresses);
      expect(mockTypeormRepo.find).toHaveBeenCalledWith({
        where: { addressId },
        relations: ['user'],
      });
    });
  });

  describe('findPrimaryByUserId', () => {
    it('should find primary user address by user id', async () => {
      const userId = faker.string.uuid();
      const primaryUserAddress = {
        id: faker.string.uuid(),
        userId,
        addressId: faker.string.uuid(),
        isPrimary: true,
        type: AddressTypeEnum.RESIDENTIAL,
      };

      mockTypeormRepo.findOne.mockResolvedValue(primaryUserAddress);

      const result = await repository.findPrimaryByUserId(userId);

      expect(result).toEqual(primaryUserAddress);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { userId, isPrimary: true },
        relations: ['address'],
      });
    });

    it('should return null when no primary address found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findPrimaryByUserId(faker.string.uuid());

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user address', async () => {
      const userAddressId = faker.string.uuid();
      const updateData = { isPrimary: false };
      const updatedUserAddress = {
        id: userAddressId,
        userId: faker.string.uuid(),
        addressId: faker.string.uuid(),
        isPrimary: false,
        type: AddressTypeEnum.RESIDENTIAL,
      };

      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updatedUserAddress);

      const result = await repository.update(userAddressId, updateData);

      expect(result).toEqual(updatedUserAddress);
      expect(mockTypeormRepo.update).toHaveBeenCalledWith(userAddressId, updateData);
    });

    it('should throw error when user address not found during update', async () => {
      mockTypeormRepo.update.mockResolvedValue({ affected: 0 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      await expect(repository.update(faker.string.uuid(), { isPrimary: true })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete user address', async () => {
      const userAddressId = faker.string.uuid();
      mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });

      await repository.delete(userAddressId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith(userAddressId);
    });
  });
});
