/*
  Warnings:

  - You are about to drop the column `vendorId` on the `store_product_for_analytics` table. All the data in the column will be lost.
  - Added the required column `vendor_id` to the `store_product_for_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" DROP COLUMN "vendorId",
ADD COLUMN     "vendor_id" UUID NOT NULL;
