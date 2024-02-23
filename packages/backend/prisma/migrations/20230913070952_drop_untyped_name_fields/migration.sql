/*
  Warnings:

  - You are about to drop the column `aggregateName` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "aggregateName",
DROP COLUMN "name";
