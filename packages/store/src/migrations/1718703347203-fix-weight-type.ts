import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixWeightType1718703347203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE medusa.product ALTER COLUMN weight TYPE NUMERIC(10, 2)`,
    );
    await queryRunner.query(
      `ALTER TABLE medusa.product_variant ALTER COLUMN weight TYPE NUMERIC(10, 2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE medusa.product ALTER COLUMN weight TYPE int4`,
    );
    await queryRunner.query(
      `ALTER TABLE medusa.product_variant ALTER COLUMN weight TYPE int4`,
    );
  }
}
