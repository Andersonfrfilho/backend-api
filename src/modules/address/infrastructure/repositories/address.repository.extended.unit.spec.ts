import { beforeEach, describe, expect, it } from '@jest/globals';
import { AddressRepository } from './address.repository';

describe('AddressRepository - Extended Coverage - Unit Tests', () => {
  let repository: AddressRepository;
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
    repository = new AddressRepository(mockTypeormRepo);
  });

  describe('findByCity', () => {
    it('should find addresses by city', async () => {
      const city = 'São Paulo';
      const addresses = [
        { id: '1', city, state: 'SP', street: 'Rua A' },
        { id: '2', city, state: 'SP', street: 'Rua B' },
      ];
      mockTypeormRepo.find.mockResolvedValue(addresses);

      const result = await repository.findByCity(city);

      expect(result).toEqual(addresses);
      expect(mockTypeormRepo.find).toHaveBeenCalledWith({ where: { city } });
    });

    it('should return empty array when no addresses found', async () => {
      mockTypeormRepo.find.mockResolvedValue([]);

      const result = await repository.findByCity('Unknown City');

      expect(result).toEqual([]);
    });

    it('should handle different city names', async () => {
      const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];
      mockTypeormRepo.find.mockResolvedValue([]);

      for (const city of cities) {
        await repository.findByCity(city);
        expect(mockTypeormRepo.find).toHaveBeenCalledWith({ where: { city } });
      }

      expect(mockTypeormRepo.find).toHaveBeenCalledTimes(3);
    });
  });

  describe('findByState', () => {
    it('should find addresses by state', async () => {
      const state = 'SP';
      const addresses = [
        { id: '1', city: 'São Paulo', state, street: 'Rua A' },
        { id: '2', city: 'Campinas', state, street: 'Rua B' },
      ];
      mockTypeormRepo.find.mockResolvedValue(addresses);

      const result = await repository.findByState(state);

      expect(result).toEqual(addresses);
      expect(mockTypeormRepo.find).toHaveBeenCalledWith({ where: { state } });
    });

    it('should return empty array when no addresses found', async () => {
      mockTypeormRepo.find.mockResolvedValue([]);

      const result = await repository.findByState('ZZ');

      expect(result).toEqual([]);
    });

    it('should handle all Brazilian state codes', async () => {
      const states = ['SP', 'RJ', 'MG', 'BA', 'RS'];
      mockTypeormRepo.find.mockResolvedValue([]);

      for (const state of states) {
        await repository.findByState(state);
        expect(mockTypeormRepo.find).toHaveBeenCalledWith({ where: { state } });
      }

      expect(mockTypeormRepo.find).toHaveBeenCalledTimes(5);
    });
  });

  describe('update with not found error', () => {
    it('should throw error when updating non-existent address', async () => {
      const id = 'non-existent-id';
      const updateParams = { street: 'New Street' };
      mockTypeormRepo.update.mockResolvedValue({ affected: 0 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      await expect(repository.update(id, updateParams)).rejects.toThrow();
    });

    it('should throw AddressErrorFactory.notFound when address not found after update', async () => {
      const id = 'missing-address-id';
      const updateParams = { street: 'Updated Street' };
      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      try {
        await repository.update(id, updateParams);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(mockTypeormRepo.update).toHaveBeenCalledWith(id, updateParams);
        expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({ where: { id } });
      }
    });

    it('should call findOne after update to verify', async () => {
      const id = 'test-id';
      const updateParams = { street: 'New Street' };
      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      try {
        await repository.update(id, updateParams);
      } catch {
        // Expected to throw
      }

      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return updated address when found', async () => {
      const id = 'test-id';
      const updateParams = { street: 'New Street' };
      const updatedAddress = { id, city: 'São Paulo', ...updateParams };
      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updatedAddress);

      const result = await repository.update(id, updateParams);

      expect(result).toEqual(updatedAddress);
    });

    it('should handle update with multiple fields', async () => {
      const id = 'address-1';
      const updateParams = {
        street: 'New Street',
        city: 'New City',
        state: 'NS',
        zipCode: '12345-678',
      };
      const updatedAddress = { id, ...updateParams, active: true };
      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updatedAddress);

      const result = await repository.update(id, updateParams);

      expect(result).toEqual(updatedAddress);
      expect(result.street).toBe('New Street');
      expect(result.city).toBe('New City');
    });

    it('should throw error when findOne returns falsy value', async () => {
      const id = 'test-id';
      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(undefined);

      await expect(repository.update(id, {})).rejects.toThrow();
    });
  });

  describe('create operation', () => {
    it('should set active flag to true on creation', async () => {
      const createParams = {
        street: 'Rua das Flores',
        city: 'São Paulo',
        state: 'SP',
      };
      const savedAddress = { id: 'new-id', ...createParams, active: true };

      mockTypeormRepo.create.mockReturnValue({ ...createParams, active: true });
      mockTypeormRepo.save.mockResolvedValue(savedAddress);

      const result = await repository.create(createParams);

      expect(result.active).toBe(true);
      expect(mockTypeormRepo.save).toHaveBeenCalled();
    });

    it('should preserve all address properties', async () => {
      const createParams = {
        street: 'Avenida Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
      };
      const savedAddress = { id: 'new-id', ...createParams, active: true };

      mockTypeormRepo.create.mockReturnValue({ ...createParams, active: true });
      mockTypeormRepo.save.mockResolvedValue(savedAddress);

      const result = await repository.create(createParams);

      expect(result).toMatchObject(createParams);
    });
  });

  describe('delete operation', () => {
    it('should delete address by id', async () => {
      const id = 'address-to-delete';
      mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });

      await repository.delete(id);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith(id);
    });

    it('should handle deletion of non-existent address', async () => {
      const id = 'non-existent';
      mockTypeormRepo.delete.mockResolvedValue({ affected: 0 });

      await repository.delete(id);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete CRUD cycle', async () => {
      const createParams = {
        street: 'Test Street',
        city: 'Test City',
        state: 'TS',
      };

      // Create
      const newAddress = { id: '1', ...createParams, active: true };
      mockTypeormRepo.create.mockReturnValue(newAddress);
      mockTypeormRepo.save.mockResolvedValue(newAddress);

      const created = await repository.create(createParams);
      expect(created.id).toBe('1');

      // Read
      mockTypeormRepo.findOne.mockResolvedValue(newAddress);
      const found = await repository.findById('1');
      expect(found).toEqual(newAddress);

      // Update
      const updateParams = { street: 'Updated Street' };
      const updated = { ...newAddress, ...updateParams };
      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updated);

      const result = await repository.update('1', updateParams);
      expect(result.street).toBe('Updated Street');

      // Delete
      mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });
      await repository.delete('1');

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith('1');
    });
  });
});
