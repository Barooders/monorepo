-- AlterEnum
ALTER TYPE "public"."CommissionRuleType" ADD VALUE 'GLOBAL_B2B_BUYER_COMMISSION';

-- DropForeignKey
ALTER TABLE "public"."CommissionRule" DROP CONSTRAINT "CommissionRule_customerId_fkey";

-- AlterTable
ALTER TABLE "public"."CommissionRule" ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CommissionRule" ADD CONSTRAINT "CommissionRule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;
