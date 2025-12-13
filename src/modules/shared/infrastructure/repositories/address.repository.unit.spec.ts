import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Address } from '@modules/shared/domain/entities/address.entity';
import { DataSource } from 'typeorm';
import { AddressRepository } from './address.repository';

describe('AddressRepository - Unit Tests', () => {
  let repository: AddressRepository;
  let mockTypeormRepo: any;
  let mockDataSource: any;

  const mockAddress: Address = {
    id: 'mock-address-id',
    street: 'Rua Principal',
    city: 'Fortaleza',
    state: 'CE',
    zipCode: '60010-000',
    country: 'Brasil',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    userAddresses: [],
  } as any;

  beforeEach(() => {
    mockTypeormRepo = {
      create: jest.fn().mockReturnValue(mockAddress),
      save: jest.fn().mockResolvedValue(mockAddress),
      findOne: jest.fn().mockResolvedValue(mockAddress),
      find: jest.fn().mockResolvedValue([mockAddress]),
      findAndCount: jest.fn().mockResolvedValue([[mockAddress], 1]),
      createQueryBuilder: jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockAddress]),
      }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepo),
    };

    repository = new AddressRepository(mockDataSource as unknown as DataSource);
  });

  describe('constructor', () => {
    it('should create repository instance', () => {
      expect(repository).toBeDefined();
    });

    it('should call getRepository on datasource', () => {
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Address);
    });
  });

  describe('createAddress', () => {
    it('should create and save a new address', async () => {
      const addressData = {
        street: 'Rua Principal',
        city: 'Fortaleza',
        state: 'CE',
        zipCode: '60010-000',
        country: 'Brasil',
      };

      const result = await repository.createAddress(addressData as any);

      expect(mockTypeormRepo.create).toHaveBeenCalledWith(addressData);
      expect(mockTypeormRepo.save).toHaveBeenCalledWith(mockAddress);
      expect(result).toEqual(mockAddress);
    });

    it('should return created address with id', async () => {
      const addressData = {
        street: 'Rua Principal',
        city: 'Fortaleza',
        state: 'CE',
        zipCode: '60010-000',
        country: 'Brasil',
      } as any;

      const result = await repository.createAddress(addressData);

      expect(result).toHaveProperty('id', 'mock-address-id');
    });

    it('should handle creation errors', async () => {
      (mockTypeormRepo.save as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));

      const addressData = {
        street: 'Rua Principal',
        city: 'Fortaleza',
        state: 'CE',
        zipCode: '60010-000',
        country: 'Brasil',
      } as any;

      await expect(repository.createAddress(addressData)).rejects.toThrow('Save failed');
    });
  });

  describe('findById', () => {
    it('should find address by id', async () => {
      const addressId = 'mock-address-id';

      const result = await repository.findById(addressId);

      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: addressId },
      });
      expect(result).toEqual(mockAddress);
    });

    it('should return null when address not found', async () => {
      (mockTypeormRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByCity', () => {
    it('should find addresses by city', async () => {
      const city = 'Fortaleza';

      const result = await repository.findByCity(city);

      expect(mockTypeormRepo.find).toHaveBeenCalledWith({
        where: { city },
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([mockAddress]);
    });

    it('should return empty array when no addresses found', async () => {
      (mockTypeormRepo.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await repository.findByCity('Unknown City');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('findByZipCode', () => {
    it('should find addresses by zip code', async () => {
      const zipCode = '60010-000';

      const result = await repository.findByZipCode(zipCode);

      expect(mockTypeormRepo.find).toHaveBeenCalledWith({
        where: { zipCode },
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array of addresses with matching zip code', async () => {
      const zipCode = '60010-000';

      const result = await repository.findByZipCode(zipCode);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([mockAddress]);
    });
  });

  describe('findByUserId', () => {
    it('should find addresses by user id', async () => {
      const userId = 'user-id-1';

      const result = await repository.findByUserId(userId);

      expect(mockTypeormRepo.createQueryBuilder).toHaveBeenCalledWith('address');
      expect(result).toEqual([mockAddress]);
    });

    it('should use innerJoin with correct parameters', async () => {
      const userId = 'user-id-1';
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockAddress]),
      };

      (mockTypeormRepo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await repository.findByUserId(userId);

      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'address.userAddresses',
        'userAddress',
        'userAddress.userId = :userId',
        { userId },
      );
    });

    it('should return empty array when no addresses found', async () => {
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      (mockTypeormRepo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await repository.findByUserId('user-id-1');

      expect(result).toEqual([]);
    });
  });

  describe('updateAddress', () => {
    it('should update address by id', async () => {
      const addressId = 'mock-address-id';
      const updateData = { city: 'São Paulo' };

      const result = await repository.updateAddress(addressId, updateData as any);

      expect(mockTypeormRepo.update).toHaveBeenCalled();
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: addressId },
      });
      expect(result).toEqual(mockAddress);
    });

    it('should set updatedAt timestamp', async () => {
      const addressId = 'mock-address-id';
      const updateData = { city: 'Rio de Janeiro' };

      const result = await repository.updateAddress(addressId, updateData as any);

      expect(result).toHaveProperty('updatedAt');
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null when address not found after update', async () => {
      (mockTypeormRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await repository.updateAddress('non-existent', {
        city: 'Brasília',
      } as any);

      expect(result).toBeNull();
    });

    it('should handle update errors', async () => {
      (mockTypeormRepo.update as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

      await expect(
        repository.updateAddress('mock-address-id', { city: 'Test' } as any),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteAddress', () => {
    it('should soft delete address by id', async () => {
      const addressId = 'mock-address-id';

      await repository.deleteAddress(addressId);

      expect(mockTypeormRepo.softDelete).toHaveBeenCalledWith(addressId);
    });

    it('should not throw error when deleting address', async () => {
      const addressId = 'mock-address-id';

      await expect(repository.deleteAddress(addressId)).resolves.toBeUndefined();
    });

    it('should handle delete errors', async () => {
      (mockTypeormRepo.softDelete as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

      await expect(repository.deleteAddress('mock-address-id')).rejects.toThrow('Delete failed');
    });
  });

  describe('findAll', () => {
    it('should find all addresses with pagination', async () => {
      const result = await repository.findAll(0, 10);

      expect(mockTypeormRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(Array.isArray(result[0])).toBe(true);
      expect(typeof result[1]).toBe('number');
    });

    it('should return addresses and count tuple', async () => {
      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(Array.isArray(result[0])).toBe(true);
      expect(result).toEqual([[mockAddress], 1]);
    });

    it('should accept custom pagination parameters', async () => {
      const result = await repository.findAll(5, 20);

      expect(mockTypeormRepo.findAndCount).toHaveBeenCalledWith({
        skip: 5,
        take: 20,
      });
      expect(result).toBeDefined();
    });

    it('should use default pagination values', async () => {
      await repository.findAll();

      expect(mockTypeormRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    it('should handle query errors', async () => {
      (mockTypeormRepo.findAndCount as jest.Mock).mockRejectedValueOnce(new Error('Query failed'));

      await expect(repository.findAll()).rejects.toThrow('Query failed');
    });
  });

  describe('Interface implementation', () => {
    it('should implement IAddressRepository interface', () => {
      expect(repository.createAddress).toBeDefined();
      expect(repository.findById).toBeDefined();
      expect(repository.findByCity).toBeDefined();
      expect(repository.findByZipCode).toBeDefined();
      expect(repository.findByUserId).toBeDefined();
      expect(repository.updateAddress).toBeDefined();
      expect(repository.deleteAddress).toBeDefined();
      expect(repository.findAll).toBeDefined();
    });

    it('should have all methods as functions', () => {
      expect(typeof repository.createAddress).toBe('function');
      expect(typeof repository.findById).toBe('function');
      expect(typeof repository.findByCity).toBe('function');
      expect(typeof repository.findByZipCode).toBe('function');
      expect(typeof repository.findByUserId).toBe('function');
      expect(typeof repository.updateAddress).toBe('function');
      expect(typeof repository.deleteAddress).toBe('function');
      expect(typeof repository.findAll).toBe('function');
    });
  });
});
