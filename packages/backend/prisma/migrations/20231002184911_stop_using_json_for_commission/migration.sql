/*
  Warnings:

  - You are about to drop the column `commission` on the `OrderLines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrderLines" DROP COLUMN "commission",
ADD COLUMN     "buyerCommission" DOUBLE PRECISION,
ADD COLUMN     "vendorCommission" DOUBLE PRECISION,
ADD COLUMN     "vendorShipping" DOUBLE PRECISION;
