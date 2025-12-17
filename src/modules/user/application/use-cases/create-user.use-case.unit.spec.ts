import { AddressTypeEnum } from '@app/modules/shared';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UserApplicationCreateUseCase } from './create-user.use-case';

describe('UserApplicationCreateUseCase - Unit Tests', () => {
  let useCase: UserApplicationCreateUseCase;
  let mockUserRepository: any;
  let mockPhoneRepository: any;
  let mockAddressRepository: any;
  let mockUserAddressRepository: any;

  beforeEach(() => {
    // Setup mocks
    mockUserRepository = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findByRg: jest.fn(),
      create: jest.fn(),
    };

    mockPhoneRepository = {
      create: jest.fn(),
    };

    mockAddressRepository = {
      create: jest.fn(),
    };

    mockUserAddressRepository = {
      create: jest.fn(),
    };

    useCase = new UserApplicationCreateUseCase(
      mockUserRepository,
      mockPhoneRepository,
      mockAddressRepository,
      mockUserAddressRepository,
    );
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
      expect(useCase.execute).toBeDefined();
    });

    it('should throw error when email already exists', async () => {
      const params = {
        email: 'existing@example.com',
        cpf: '12345678901',
        rg: '123456789',
        phone: '+5585993056772',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        address: {
          street: 'Test Street',
          number: '123',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345-678',
        },
      };

      mockUserRepository.findByEmail.mockResolvedValue({ id: 'user-1', email: params.email });

      expect(() => useCase.execute(params)).rejects.toThrow();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(params.email);
    });

    it('should throw error when CPF already exists', async () => {
      const params = {
        email: 'new@example.com',
        cpf: '12345678901',
        rg: '123456789',
        phone: '+5585993056772',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        address: {
          street: 'Test Street',
          number: '123',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345-678',
        },
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByCpf.mockResolvedValue({ id: 'user-1', cpf: params.cpf });

      expect(() => useCase.execute(params)).rejects.toThrow();
      expect(mockUserRepository.findByCpf).toHaveBeenCalledWith(params.cpf);
    });

    it('should throw error when RG already exists', async () => {
      const params = {
        email: 'new@example.com',
        cpf: '12345678901',
        rg: '123456789',
        phone: '+5585993056772',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        address: {
          street: 'Test Street',
          number: '123',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345-678',
        },
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockUserRepository.findByRg.mockResolvedValue({ id: 'user-1', rg: params.rg });

      expect(() => useCase.execute(params)).rejects.toThrow();
      expect(mockUserRepository.findByRg).toHaveBeenCalledWith(params.rg);
    });

    it('should successfully create user with all related data', async () => {
      const params = {
        email: 'new@example.com',
        cpf: '12345678901',
        rg: '123456789',
        phone: '+5585993056772',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        address: {
          street: 'Test Street',
          number: '123',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345-678',
        },
      };

      const userId = faker.string.uuid();
      const addressId = faker.string.uuid();
      const userAddressId = faker.string.uuid();

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockUserRepository.findByRg.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: userId,
        ...params,
      });
      mockPhoneRepository.create.mockResolvedValue({
        id: 'phone-1',
        country: '+55',
        area: '85',
        number: '993056772',
        userId,
      });
      mockAddressRepository.create.mockResolvedValue({
        id: addressId,
        ...params.address,
      });
      mockUserAddressRepository.create.mockResolvedValue({
        id: userAddressId,
        userId,
        addressId,
        isPrimary: true,
        type: AddressTypeEnum.RESIDENTIAL,
      });

      const result = await useCase.execute(params);

      expect(result.id).toBe(userId);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockPhoneRepository.create).toHaveBeenCalled();
      expect(mockAddressRepository.create).toHaveBeenCalled();
      expect(mockUserAddressRepository.create).toHaveBeenCalled();
    });

    it('should parse phone correctly before creating', async () => {
      const params = {
        email: 'new@example.com',
        cpf: '12345678901',
        rg: '123456789',
        phone: '+5585993056772',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        address: {
          street: 'Test Street',
          number: '123',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345-678',
        },
      };

      const userId = faker.string.uuid();
      const addressId = faker.string.uuid();

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockUserRepository.findByRg.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({ id: userId, ...params });
      mockPhoneRepository.create.mockResolvedValue({ id: 'phone-1' });
      mockAddressRepository.create.mockResolvedValue({ id: addressId });
      mockUserAddressRepository.create.mockResolvedValue({ id: 'ua-1' });

      await useCase.execute(params);

      // Verify phone was created with parsed components
      expect(mockPhoneRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          country: '+55',
          area: '85',
          number: '993056772',
          userId,
        }),
      );
    });
  });
});
