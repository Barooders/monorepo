-- CreateEnum
CREATE TYPE "public"."Condition" AS ENUM ('AS_NEW', 'VERY_GOOD', 'GOOD');

-- AlterTable
ALTER TABLE "public"."OrderLines" ADD COLUMN     "variantCondition" "public"."Condition";

-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "condition" "public"."Condition";
