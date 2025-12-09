import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export default class Addresses1763450000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuidv7()',
          }),
          new TableColumn({
            name: 'street',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'number',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'complement',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'neighborhood',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'city',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'state',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'zip_code',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'country',
            type: 'varchar',
            isNullable: false,
            default: "'BR'",
          }),
          new TableColumn({
            name: 'latitude',
            type: 'numeric',
            precision: 10,
            scale: 8,
            isNullable: true,
          }),
          new TableColumn({
            name: 'longitude',
            type: 'numeric',
            precision: 11,
            scale: 8,
            isNullable: true,
          }),
          new TableColumn({
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: true,
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
        indices: [
          {
            columnNames: ['city'],
            name: 'IDX_address_city',
          },
          {
            columnNames: ['state'],
            name: 'IDX_address_state',
          },
          {
            columnNames: ['zip_code'],
            name: 'IDX_address_zip_code',
          },
          {
            columnNames: ['active'],
            name: 'IDX_address_active',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses', true, true, true);
  }
}
