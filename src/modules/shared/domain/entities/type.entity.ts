import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserType } from './userTypes.entity';

@Entity()
export class Type {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => UserType, (userType) => userType.user)
  userTypes: UserType[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
