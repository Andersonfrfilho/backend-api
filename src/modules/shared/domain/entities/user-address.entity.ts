import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AddressTypeEnum } from '../enums/address-type.enum';

import { Address } from './address.entity';
import { User } from './user.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  addressId: string;

  @Column({
    type: 'enum',
    enum: AddressTypeEnum,
    default: AddressTypeEnum.RESIDENTIAL,
  })
  type: AddressTypeEnum;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Address, { onDelete: 'CASCADE' })
  address: Address;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
