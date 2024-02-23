/*
  Warnings:

  - Made the column `collection_internal_id` on table `store_discount_collection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_discount_collection" ALTER COLUMN "collection_internal_id" SET NOT NULL;
