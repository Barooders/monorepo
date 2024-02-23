/*
  Warnings:

  - The values [BUYER_COMMISSION] on the enum `CommissionRuleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CommissionRuleType_new" AS ENUM ('VENDOR_SHIPPING', 'VENDOR_COMMISSION');
ALTER TABLE "public"."CommissionRule" ALTER COLUMN "type" TYPE "public"."CommissionRuleType_new" USING ("type"::text::"public"."CommissionRuleType_new");
ALTER TYPE "public"."CommissionRuleType" RENAME TO "CommissionRuleType_old";
ALTER TYPE "public"."CommissionRuleType_new" RENAME TO "CommissionRuleType";
DROP TYPE "public"."CommissionRuleType_old";
COMMIT;
