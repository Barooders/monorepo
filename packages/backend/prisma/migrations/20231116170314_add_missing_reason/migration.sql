-- AlterTable
ALTER TABLE "public"."Dispute" ADD COLUMN     "reason" "public"."DisputeReason" NOT NULL DEFAULT 'OTHER';
