/*
  Warnings:

  - You are about to drop the column `rating` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "rating",
DROP COLUMN "type";
