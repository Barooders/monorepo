/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PriceOffer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."PriceOffer" ADD COLUMN     "name" BIGSERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PriceOffer_name_key" ON "public"."PriceOffer"("name");
