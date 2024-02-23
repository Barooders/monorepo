-- DropForeignKey
ALTER TABLE "public"."PaymentAccounts" DROP CONSTRAINT "PaymentAccounts_customerId_fkey";

-- AlterTable
ALTER TABLE "public"."PaymentAccounts" ADD COLUMN     "email" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."PaymentAccounts" ADD CONSTRAINT "PaymentAccounts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;
