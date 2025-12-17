import { beforeEach, describe, expect, it } from '@jest/globals';
import { UserAddressRepository } from './user-address.repository';

describe('UserAddressRepository - Extended Coverage - Unit Tests', () => {
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

  describe('linkUserToAddress', () => {
    it('should link user to address with type and isPrimary flag', async () => {
      const userId = 'user-1';
      const addressId = 'address-1';
      const type = 'HOME';
      const isPrimary = true;

      const linkedAddress = {
        id: 'link-1',
        userId,
        addressId,
        type,
        isPrimary,
      };

      mockTypeormRepo.create.mockReturnValue(linkedAddress);
      mockTypeormRepo.save.mockResolvedValue(linkedAddress);

      const result = await repository.linkUserToAddress(userId, addressId, type, isPrimary);

      expect(result).toEqual(linkedAddress);
      expect(mockTypeormRepo.create).toHaveBeenCalled();
    });

    it('should default isPrimary to false', async () => {
      const userId = 'user-1';
      const addressId = 'address-1';
      const type = 'WORK';

      const linkedAddress = {
        id: 'link-1',
        userId,
        addressId,
        type,
        isPrimary: false,
      };

      mockTypeormRepo.create.mockReturnValue(linkedAddress);
      mockTypeormRepo.save.mockResolvedValue(linkedAddress);

      const result = await repository.linkUserToAddress(userId, addressId, type);

      expect(result.isPrimary).toBe(false);
    });

    it('should handle different address types', async () => {
      const types = ['HOME', 'WORK', 'BILLING', 'SHIPPING'];
      const userId = 'user-1';
      const addressId = 'address-1';

      for (const type of types) {
        const linkedAddress = {
          id: `link-${type}`,
          userId,
          addressId,
          type,
          isPrimary: false,
        };

        mockTypeormRepo.create.mockReturnValue(linkedAddress);
        mockTypeormRepo.save.mockResolvedValue(linkedAddress);

        const result = await repository.linkUserToAddress(userId, addressId, type);
        expect(result.type).toBe(type);
      }
    });
  });

  describe('unlinkUserFromAddress', () => {
    it('should unlink user from specific address', async () => {
      const userId = 'user-1';
      const addressId = 'address-1';

      mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });

      await repository.unlinkUserFromAddress(userId, addressId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith({ userId, addressId });
    });

    it('should handle when link does not exist', async () => {
      const userId = 'user-1';
      const addressId = 'address-1';

      mockTypeormRepo.delete.mockResolvedValue({ affected: 0 });

      await repository.unlinkUserFromAddress(userId, addressId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith({ userId, addressId });
    });
  });

  describe('findByUserIdAndType', () => {
    it('should find user addresses by type', async () => {
      const userId = 'user-1';
      const type = 'HOME';
      const userAddresses = [
        {
          id: '1',
          userId,
          addressId: 'addr-1',
          type,
          isPrimary: true,
          address: { id: 'addr-1', city: 'São Paulo' },
        },
      ];

      mockTypeormRepo.find.mockResolvedValue(userAddresses);

      const result = await repository.findByUserIdAndType(userId, type);

      expect(result).toEqual(userAddresses);
      expect(mockTypeormRepo.find).toHaveBeenCalledWith({
        where: { userId, type },
        relations: ['address'],
      });
    });

    it('should return empty array when no addresses found for type', async () => {
      mockTypeormRepo.find.mockResolvedValue([]);

      const result = await repository.findByUserIdAndType('user-1', 'NONEXISTENT');

      expect(result).toEqual([]);
    });

    it('should handle different address types', async () => {
      const types = ['HOME', 'WORK', 'BILLING', 'SHIPPING'];
      const userId = 'user-1';

      mockTypeormRepo.find.mockResolvedValue([]);

      for (const type of types) {
        await repository.findByUserIdAndType(userId, type);
        expect(mockTypeormRepo.find).toHaveBeenCalledWith({
          where: { userId, type },
          relations: ['address'],
        });
      }

      expect(mockTypeormRepo.find).toHaveBeenCalledTimes(4);
    });
  });

  describe('deleteByUserId', () => {
    it('should delete all addresses for a user', async () => {
      const userId = 'user-1';

      mockTypeormRepo.delete.mockResolvedValue({ affected: 3 });

      await repository.deleteByUserId(userId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith({ userId });
    });

    it('should handle user with no addresses', async () => {
      const userId = 'user-new';

      mockTypeormRepo.delete.mockResolvedValue({ affected: 0 });

      await repository.deleteByUserId(userId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith({ userId });
    });
  });

  describe('update operation edge cases', () => {
    it('should throw error when updating non-existent user address', async () => {
      const id = 'non-existent-id';
      const updateParams = { isPrimary: true };

      mockTypeormRepo.update.mockResolvedValue({ affected: 0 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      await expect(repository.update(id, updateParams)).rejects.toThrow();
    });

    it('should load relations after update', async () => {
      const id = 'link-1';
      const updateParams = { isPrimary: true };
      const updated = {
        id,
        userId: 'user-1',
        addressId: 'addr-1',
        isPrimary: true,
        user: { id: 'user-1', name: 'Test User' },
        address: { id: 'addr-1', city: 'São Paulo' },
      };

      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updated);

      const result = await repository.update(id, updateParams);

      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['user', 'address'],
      });
      expect(result.user).toBeDefined();
      expect(result.address).toBeDefined();
    });
  });

  describe('create operation', () => {
    it('should create user address link', async () => {
      const createParams = {
        userId: 'user-1',
        addressId: 'addr-1',
        type: 'HOME',
        isPrimary: true,
      };

      const created = { id: 'link-1', ...createParams };
      mockTypeormRepo.create.mockReturnValue(created);
      mockTypeormRepo.save.mockResolvedValue(created);

      const result = await repository.create(createParams);

      expect(result).toEqual(created);
    });
  });

  describe('integration scenarios', () => {
    it('should handle setting primary address', async () => {
      const userId = 'user-1';
      const addressId = 'addr-1';

      // Link as primary
      const linked = {
        id: 'link-1',
        userId,
        addressId,
        type: 'HOME',
        isPrimary: true,
      };

      mockTypeormRepo.create.mockReturnValue(linked);
      mockTypeormRepo.save.mockResolvedValue(linked);

      const result = await repository.linkUserToAddress(userId, addressId, 'HOME', true);
      expect(result.isPrimary).toBe(true);
    });

    it('should handle managing multiple user addresses', async () => {
      const userId = 'user-1';

      // Link multiple addresses
      const addresses = [
        { addressId: 'addr-1', type: 'HOME', isPrimary: true },
        { addressId: 'addr-2', type: 'WORK', isPrimary: false },
        { addressId: 'addr-3', type: 'BILLING', isPrimary: false },
      ];

      for (const addr of addresses) {
        const linked = {
          id: `link-${addr.addressId}`,
          userId,
          ...addr,
        };

        mockTypeormRepo.create.mockReturnValue(linked);
        mockTypeormRepo.save.mockResolvedValue(linked);

        await repository.linkUserToAddress(userId, addr.addressId, addr.type, addr.isPrimary);
      }

      expect(mockTypeormRepo.save).toHaveBeenCalledTimes(3);
    });

    it('should handle replacing primary address', async () => {
      const userId = 'user-1';

      // Old primary
      const oldPrimary = {
        id: 'link-1',
        userId,
        addressId: 'addr-1',
        type: 'HOME',
        isPrimary: true,
      };

      // New primary
      const newPrimary = {
        id: 'link-2',
        userId,
        addressId: 'addr-2',
        type: 'HOME',
        isPrimary: true,
      };

      mockTypeormRepo.create.mockReturnValue(newPrimary);
      mockTypeormRepo.save.mockResolvedValue(newPrimary);

      const result = await repository.linkUserToAddress(userId, 'addr-2', 'HOME', true);

      expect(result.isPrimary).toBe(true);
    });
  });
});
