import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export default class UserTypes1763256759255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_type',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          }),
          new TableColumn({
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: 'type',
            type: 'enum',
            enum: ['ADMIN', 'MODERATOR', 'USER', 'CUSTOMER', 'SUPPORT'],
            default: "'USER'",
            isNullable: false,
          }),
          new TableColumn({
            name: 'active',
            type: 'boolean',
            default: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          }),
          new TableColumn({
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          }),
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            columnNames: ['user_id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_type');
  }
}
