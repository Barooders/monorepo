-- AlterEnum
ALTER TYPE "public"."NotificationName" ADD VALUE 'ORDER_REFUNDED';

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "phoneNumber" TEXT;
