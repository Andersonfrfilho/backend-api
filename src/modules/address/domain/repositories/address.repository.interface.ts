import { Address } from '@modules/shared/domain/entities/address.entity';

export interface CreateAddressParams {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface UpdateAddressParams {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
}

export interface AddressRepositoryInterface {
  create(address: CreateAddressParams): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByCity(city: string): Promise<Address[]>;
  findByState(state: string): Promise<Address[]>;
  update(id: string, address: UpdateAddressParams): Promise<Address>;
  delete(id: string): Promise<void>;
}
