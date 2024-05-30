import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVendorColumn1717080696293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "vendor_id" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "ProductVendorId" ON "product" ("vendor_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "medusa"."ProductVendorId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "vendor_id"`);
  }
}
