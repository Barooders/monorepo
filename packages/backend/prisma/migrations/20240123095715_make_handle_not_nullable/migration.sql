/*
  Warnings:

  - Made the column `handle` on table `store_collection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_collection" ALTER COLUMN "handle" SET NOT NULL,
ALTER COLUMN "handle" SET DEFAULT '';
