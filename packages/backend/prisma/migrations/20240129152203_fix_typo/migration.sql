/*
  Warnings:

  - The values [ARCHVIVED] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "dbt"."ProductStatus_new" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');
ALTER TABLE "dbt"."store_exposed_product" ALTER COLUMN "status" TYPE "dbt"."ProductStatus_new" USING ("status"::text::"dbt"."ProductStatus_new");
ALTER TYPE "dbt"."ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "dbt"."ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "dbt"."ProductStatus_old";
COMMIT;
