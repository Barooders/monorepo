/*
  Warnings:

  - Made the column `shippingSolution` on table `OrderLines` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."OrderLines" ALTER COLUMN "shippingSolution" SET NOT NULL;
