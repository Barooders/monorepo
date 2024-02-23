-- CreateEnum
CREATE TYPE "public"."ProductNotation" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "manualNotation" "public"."ProductNotation";
