/*
  Warnings:

  - You are about to drop the column `sourceUrl` on the `store_product_for_admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_admin" DROP COLUMN "sourceUrl",
ADD COLUMN     "source_url" TEXT;
