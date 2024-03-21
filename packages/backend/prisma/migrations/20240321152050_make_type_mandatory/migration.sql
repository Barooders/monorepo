/*
  Warnings:

  - Made the column `type` on table `SavedSearch` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "public"."SavedSearch" SET "type" = 'PUBLIC_COLLECTION_PAGE' WHERE "type" IS NULL;
-- AlterTable
ALTER TABLE "public"."SavedSearch" ALTER COLUMN "type" SET NOT NULL;
