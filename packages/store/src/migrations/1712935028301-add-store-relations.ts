import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreRelations1712935028301 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "store_id" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "UserStoreId" ON "user" ("store_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "store_id" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "ProductStoreId" ON "product" ("store_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "medusa"."UserStoreId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "store_id"`);
    await queryRunner.query(`DROP INDEX "medusa"."ProductStoreId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "store_id"`);
  }
}
