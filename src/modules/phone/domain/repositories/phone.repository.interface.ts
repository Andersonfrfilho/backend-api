import { Phone } from '@modules/phone/domain/entities/phone.entity';

export interface CreatePhoneParams {
  country: string;
  area: string;
  number: string;
  userId: string;
}

export interface PhoneRepositoryInterface {
  create(phone: CreatePhoneParams): Promise<Phone>;
  findById(id: string): Promise<Phone | null>;
  findByUserId(userId: string): Promise<Phone[]>;
  update(id: string, phone: Partial<CreatePhoneParams>): Promise<Phone>;
  delete(id: string): Promise<void>;
}
