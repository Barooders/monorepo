-- CreateEnum
CREATE TYPE "public"."ProductScoring" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "scoring" "public"."ProductScoring";
