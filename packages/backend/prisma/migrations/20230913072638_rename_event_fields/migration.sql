/*

*/
-- AlterTable
ALTER TABLE "public"."Event" RENAME COLUMN "newAggregateName" TO "aggregateName";
ALTER TABLE "public"."Event" RENAME COLUMN "newName" TO "name";
