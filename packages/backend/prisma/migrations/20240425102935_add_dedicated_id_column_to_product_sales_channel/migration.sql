/*
  Warnings:

  - The primary key for the `ProductSalesChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."ProductSalesChannel" DROP CONSTRAINT "ProductSalesChannel_pkey",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
ADD CONSTRAINT "ProductSalesChannel_pkey" PRIMARY KEY ("id");
