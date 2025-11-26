import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Type } from './type.entity';
import { User } from './user.entity';

@Entity()
export class UserType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: string;

  @Column()
  typeId: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.userTypes)
  user: User;

  @ManyToOne(() => Type, (type) => type.userTypes)
  type: Type;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
