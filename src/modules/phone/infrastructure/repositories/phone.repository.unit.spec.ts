import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { PhoneRepository } from './phone.repository';

describe('PhoneRepository - Unit Tests', () => {
  let repository: PhoneRepository;
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

    repository = new PhoneRepository(mockTypeormRepo);
  });

  describe('create', () => {
    it('should create a new phone', async () => {
      const phoneData = {
        country: '+55',
        area: '85',
        number: '993056772',
        userId: faker.string.uuid(),
      };

      const createdPhone = { id: faker.string.uuid(), ...phoneData };

      mockTypeormRepo.create.mockReturnValue(phoneData);
      mockTypeormRepo.save.mockResolvedValue(createdPhone);

      const result = await repository.create(phoneData);

      expect(result).toEqual(createdPhone);
      expect(mockTypeormRepo.create).toHaveBeenCalledWith(phoneData);
      expect(mockTypeormRepo.save).toHaveBeenCalledWith(phoneData);
    });
  });

  describe('findById', () => {
    it('should find phone by id', async () => {
      const phoneId = faker.string.uuid();
      const phone = {
        id: phoneId,
        country: '+55',
        area: '85',
        number: '993056772',
      };

      mockTypeormRepo.findOne.mockResolvedValue(phone);

      const result = await repository.findById(phoneId);

      expect(result).toEqual(phone);
      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: phoneId },
      });
    });

    it('should return null when phone not found', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById(faker.string.uuid());

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find phones by user id', async () => {
      const userId = faker.string.uuid();
      const phones = [
        { id: faker.string.uuid(), userId, country: '+55', area: '85', number: '993056772' },
        { id: faker.string.uuid(), userId, country: '+55', area: '85', number: '998765432' },
      ];

      mockTypeormRepo.find.mockResolvedValue(phones);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual(phones);
      expect(result).toHaveLength(2);
      expect(mockTypeormRepo.find).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should return empty array when no phones found', async () => {
      mockTypeormRepo.find.mockResolvedValue([]);

      const result = await repository.findByUserId(faker.string.uuid());

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update phone', async () => {
      const phoneId = faker.string.uuid();
      const updateData = { number: '999999999' };
      const updatedPhone = {
        id: phoneId,
        country: '+55',
        area: '85',
        number: '999999999',
      };

      mockTypeormRepo.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepo.findOne.mockResolvedValue(updatedPhone);

      const result = await repository.update(phoneId, updateData);

      expect(result).toEqual(updatedPhone);
      expect(mockTypeormRepo.update).toHaveBeenCalledWith(phoneId, updateData);
    });

    it('should throw error when phone not found during update', async () => {
      mockTypeormRepo.update.mockResolvedValue({ affected: 0 });
      mockTypeormRepo.findOne.mockResolvedValue(null);

      await expect(repository.update(faker.string.uuid(), {})).rejects.toThrow('Phone not found');
    });
  });

  describe('delete', () => {
    it('should delete phone', async () => {
      const phoneId = faker.string.uuid();
      mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });

      await repository.delete(phoneId);

      expect(mockTypeormRepo.delete).toHaveBeenCalledWith(phoneId);
    });
  });
});
