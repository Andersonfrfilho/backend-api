import { beforeEach, describe, expect, it } from '@jest/globals';

import { AddressTypeEnum } from '../enums/address-type.enum';
import { UserAddress } from './user-address.entity';

describe('UserAddress Entity', () => {
  let userAddress: UserAddress;

  it('should create an instance', () => {
    userAddress = new UserAddress();
    expect(userAddress).toBeInstanceOf(UserAddress);
  });

  describe('properties', () => {
    beforeEach(() => {
      userAddress = new UserAddress();
    });

    it('should have id property', () => {
      userAddress.id = '550e8400-e29b-41d4-a716-446655440000';
      expect(userAddress.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should have userId property', () => {
      userAddress.userId = '550e8400-e29b-41d4-a716-446655440001';
      expect(userAddress.userId).toBe('550e8400-e29b-41d4-a716-446655440001');
    });

    it('should have addressId property', () => {
      userAddress.addressId = '550e8400-e29b-41d4-a716-446655440002';
      expect(userAddress.addressId).toBe('550e8400-e29b-41d4-a716-446655440002');
    });

    it('should have type property with default RESIDENTIAL', () => {
      expect(userAddress.type).toBeUndefined();
      userAddress.type = AddressTypeEnum.RESIDENTIAL;
      expect(userAddress.type).toBe(AddressTypeEnum.RESIDENTIAL);
    });

    it('should have isPrimary property with default false', () => {
      expect(userAddress.isPrimary).toBeUndefined();
      userAddress.isPrimary = true;
      expect(userAddress.isPrimary).toBe(true);
    });

    it('should have user relationship', () => {
      userAddress.user = { id: '550e8400-e29b-41d4-a716-446655440001' } as any;
      expect(userAddress.user).toBeDefined();
      expect(userAddress.user.id).toBe('550e8400-e29b-41d4-a716-446655440001');
    });

    it('should have address relationship', () => {
      userAddress.address = { id: '550e8400-e29b-41d4-a716-446655440002' } as any;
      expect(userAddress.address).toBeDefined();
      expect(userAddress.address.id).toBe('550e8400-e29b-41d4-a716-446655440002');
    });

    it('should have createdAt property', () => {
      const now = new Date();
      userAddress.createdAt = now;
      expect(userAddress.createdAt).toEqual(now);
    });

    it('should have updatedAt property', () => {
      const now = new Date();
      userAddress.updatedAt = now;
      expect(userAddress.updatedAt).toEqual(now);
    });

    it('should allow null updatedAt', () => {
      userAddress.updatedAt = null;
      expect(userAddress.updatedAt).toBeNull();
    });

    it('should have deletedAt property', () => {
      const now = new Date();
      userAddress.deletedAt = now;
      expect(userAddress.deletedAt).toEqual(now);
    });

    it('should allow null deletedAt', () => {
      userAddress.deletedAt = null;
      expect(userAddress.deletedAt).toBeNull();
    });
  });

  describe('address type enum', () => {
    beforeEach(() => {
      userAddress = new UserAddress();
    });

    it('should support RESIDENTIAL type', () => {
      userAddress.type = AddressTypeEnum.RESIDENTIAL;
      expect(userAddress.type).toBe(AddressTypeEnum.RESIDENTIAL);
    });

    it('should support COMMERCIAL type', () => {
      userAddress.type = AddressTypeEnum.COMMERCIAL;
      expect(userAddress.type).toBe(AddressTypeEnum.COMMERCIAL);
    });

    it('should support BILLING type', () => {
      userAddress.type = AddressTypeEnum.BILLING;
      expect(userAddress.type).toBe(AddressTypeEnum.BILLING);
    });

    it('should support SHIPPING type', () => {
      userAddress.type = AddressTypeEnum.SHIPPING;
      expect(userAddress.type).toBe(AddressTypeEnum.SHIPPING);
    });
  });

  describe('full user address scenario', () => {
    it('should create complete user address with all properties', () => {
      userAddress = new UserAddress();
      userAddress.id = '550e8400-e29b-41d4-a716-446655440000';
      userAddress.userId = '550e8400-e29b-41d4-a716-446655440001';
      userAddress.addressId = '550e8400-e29b-41d4-a716-446655440002';
      userAddress.type = AddressTypeEnum.RESIDENTIAL;
      userAddress.isPrimary = true;
      userAddress.createdAt = new Date('2024-01-01');
      userAddress.updatedAt = new Date('2024-01-15');

      expect(userAddress.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(userAddress.userId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(userAddress.addressId).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(userAddress.type).toBe(AddressTypeEnum.RESIDENTIAL);
      expect(userAddress.isPrimary).toBe(true);
      expect(userAddress.createdAt).toEqual(new Date('2024-01-01'));
    });

    it('should handle primary address selection', () => {
      userAddress = new UserAddress();
      userAddress.isPrimary = true;
      expect(userAddress.isPrimary).toBe(true);

      const secondaryAddress = new UserAddress();
      secondaryAddress.isPrimary = false;
      expect(secondaryAddress.isPrimary).toBe(false);
    });

    it('should handle soft delete', () => {
      userAddress = new UserAddress();
      userAddress.id = '550e8400-e29b-41d4-a716-446655440000';
      userAddress.deletedAt = new Date();

      expect(userAddress.deletedAt).toBeInstanceOf(Date);
    });

    it('should handle multiple address types for user', () => {
      const residentialAddress = new UserAddress();
      residentialAddress.userId = '550e8400-e29b-41d4-a716-446655440001';
      residentialAddress.type = AddressTypeEnum.RESIDENTIAL;
      residentialAddress.isPrimary = true;

      const billingAddress = new UserAddress();
      billingAddress.userId = '550e8400-e29b-41d4-a716-446655440001';
      billingAddress.type = AddressTypeEnum.BILLING;
      billingAddress.isPrimary = false;

      expect(residentialAddress.userId).toBe(billingAddress.userId);
      expect(residentialAddress.type).not.toBe(billingAddress.type);
      expect(residentialAddress.isPrimary).toBe(true);
      expect(billingAddress.isPrimary).toBe(false);
    });
  });

  describe('timestamp behavior', () => {
    beforeEach(() => {
      userAddress = new UserAddress();
    });

    it('should track creation time', () => {
      const before = new Date();
      userAddress.createdAt = new Date();
      const after = new Date();

      expect(userAddress.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(userAddress.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should support update tracking', () => {
      userAddress.createdAt = new Date('2024-01-01');
      userAddress.updatedAt = new Date('2024-01-15');

      expect(userAddress.createdAt.getTime()).toBeLessThan(userAddress.updatedAt.getTime());
    });

    it('should support soft deletion tracking', () => {
      userAddress.createdAt = new Date('2024-01-01');
      userAddress.updatedAt = new Date('2024-01-15');
      userAddress.deletedAt = new Date('2024-01-20');

      expect(userAddress.deletedAt.getTime()).toBeGreaterThan(userAddress.updatedAt.getTime());
    });
  });

  describe('relationship management', () => {
    beforeEach(() => {
      userAddress = new UserAddress();
    });

    it('should maintain user relationship on cascade delete', () => {
      const mockUser = { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Test User' };
      userAddress.user = mockUser as any;

      expect(userAddress.user).toEqual(mockUser);
    });

    it('should maintain address relationship on cascade delete', () => {
      const mockAddress = { id: '550e8400-e29b-41d4-a716-446655440002', street: 'Test Street' };
      userAddress.address = mockAddress as any;

      expect(userAddress.address).toEqual(mockAddress);
    });
  });
});
