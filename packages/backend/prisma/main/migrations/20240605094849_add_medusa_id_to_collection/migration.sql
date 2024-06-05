/*
  Warnings:

  - A unique constraint covering the columns `[medusaId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Collection" ADD COLUMN     "medusaId" TEXT,
ALTER COLUMN "shopifyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_medusaId_key" ON "public"."Collection"("medusaId");
