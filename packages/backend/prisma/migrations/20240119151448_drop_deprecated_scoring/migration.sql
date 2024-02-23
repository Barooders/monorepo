/*
  Warnings:

  - You are about to drop the column `scoring` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "scoring";

-- DropEnum
DROP TYPE "public"."ProductScoring";
