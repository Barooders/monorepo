-- DropIndex
DROP INDEX "public"."Customer_shopifyId_key";

-- AlterTable
ALTER TABLE "public"."Customer" ALTER COLUMN "shopifyId" DROP NOT NULL;
