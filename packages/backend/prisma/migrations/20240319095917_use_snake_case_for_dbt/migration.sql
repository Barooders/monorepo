/*
  Warnings:

  - You are about to drop the column `firstImage` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `syncDate` on the `store_b2b_product` table. All the data in the column will be lost.
  - Added the required column `sync_date` to the `store_b2b_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product" DROP COLUMN "firstImage",
DROP COLUMN "syncDate",
ADD COLUMN     "first_image" VARCHAR(512),
ADD COLUMN     "sync_date" DATE NOT NULL;
