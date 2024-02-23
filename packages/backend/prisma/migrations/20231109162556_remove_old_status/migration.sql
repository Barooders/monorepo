/*
  Warnings:

  - You are about to drop the column `oldStatus` on the `VendorProProduct` table. All the data in the column will be lost.
  - Made the column `syncStatus` on table `VendorProProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."VendorProProduct" DROP COLUMN "oldStatus",
ALTER COLUMN "syncStatus" SET NOT NULL;
