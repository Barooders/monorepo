/*
  Warnings:

  - You are about to drop the column `parentId` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Collection" DROP CONSTRAINT "Collection_parentId_fkey";

-- AlterTable
ALTER TABLE "public"."Collection" RENAME COLUMN "parentId" TO "parentCollectionId";

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_parentCollectionId_fkey" FOREIGN KEY ("parentCollectionId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
