import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Notification {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  message: string;

  @Column()
  type: string;
}
