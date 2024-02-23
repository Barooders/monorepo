/*
  Warnings:

  - The `scoring` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."CustomerScoring" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "public"."Customer" 
  ALTER COLUMN "scoring" TYPE "public"."CustomerScoring" using "scoring"::"public"."CustomerScoring";
