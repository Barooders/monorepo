/*
  Warnings:

  - You are about to drop the column `parentCollectionId` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Collection" DROP CONSTRAINT "Collection_parentCollectionId_fkey";

-- AlterTable
ALTER TABLE "public"."Collection" DROP COLUMN "parentCollectionId";
