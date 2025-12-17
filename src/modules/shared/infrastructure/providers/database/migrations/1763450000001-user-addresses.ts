import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export default class UserAddresses1763450000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM type first
    await queryRunner.query(`
      CREATE TYPE address_type_enum AS ENUM (
        'RESIDENTIAL',
        'COMMERCIAL',
        'DELIVERY',
        'BILLING',
        'OTHER'
      )
    `);

    await queryRunner.createTable(
      new Table({
        name: 'user_addresses',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: 'address_id',
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: 'type',
            type: 'address_type_enum',
            isNullable: false,
          }),
          new TableColumn({
            name: 'is_primary',
            type: 'boolean',
            isNullable: false,
            default: false,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
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
          {
            columnNames: ['address_id'],
            referencedTableName: 'addresses',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            columnNames: ['user_id'],
            name: 'IDX_user_address_user_id',
          },
          {
            columnNames: ['address_id'],
            name: 'IDX_user_address_address_id',
          },
          {
            columnNames: ['user_id', 'is_primary'],
            name: 'IDX_user_address_user_id_primary',
          },
          {
            columnNames: ['user_id', 'address_id', 'type'],
            isUnique: true,
            name: 'UQ_user_address_user_address_type',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_addresses', true, true, true);
    await queryRunner.query('DROP TYPE IF EXISTS address_type_enum');
  }
}
