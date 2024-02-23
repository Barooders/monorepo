-- AlterEnum
ALTER TYPE "public"."PaymentStatusType" ADD VALUE 'NOT_ELIGIBLE';

-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "externalCustomerId" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "token" TEXT;
