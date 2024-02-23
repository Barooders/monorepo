/*
  Warnings:

  - You are about to drop the column `productCondition` on the `OrderLines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrderLines" DROP COLUMN "productCondition";
