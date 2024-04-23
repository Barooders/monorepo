/*
  Warnings:

  - You are about to drop the column `total_quantity` on the `store_b2b_product` table. All the data in the column will be lost.
  - Added the required column `total_quantity` to the `store_exposed_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product" DROP COLUMN "total_quantity";

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" ADD COLUMN     "total_quantity" BIGINT NOT NULL;
