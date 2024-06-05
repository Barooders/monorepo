/*
  Warnings:

  - The primary key for the `store_discount_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "store_discount" ALTER COLUMN "id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "store_discount_collection" DROP CONSTRAINT "store_discount_collection_pkey",
ALTER COLUMN "discount_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "store_discount_collection_pkey" PRIMARY KEY ("collection_internal_id", "discount_id");
