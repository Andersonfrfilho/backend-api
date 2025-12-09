import {MigrationInterface,QueryRunner,Table,TableColumn} from 'typeorm';

export default class User1763256695093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension for native UUID generation
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuidv7()',
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'last_name',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'cpf',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'rg',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'password_hash',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'gender',
            type: 'varchar',
          }),
          new TableColumn({
            name: 'details',
            type: 'jsonb',
            isNullable: true,
          }),
          new TableColumn({
            name: 'birth_date',
            type: 'timestamp',
            isNullable: false,
          }),
          new TableColumn({
            name: 'active',
            type: 'boolean',
            default: true,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    // Keep the function for other tables that use it
  }
}
