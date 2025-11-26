import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Phone } from './phone.entity';
import { UserType } from './userTypes.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  gender: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, unknown>;

  @Column({ name: 'birth_date', type: 'timestamp' })
  birthDate: Date;

  @ManyToOne(() => Phone, (phone) => phone.user)
  phones: Phone[];

  @ManyToOne(() => UserType, (userType) => userType.type)
  userTypes: UserType[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
