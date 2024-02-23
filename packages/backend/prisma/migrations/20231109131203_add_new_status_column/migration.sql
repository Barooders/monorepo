-- CreateEnum
CREATE TYPE "public"."SyncStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "public"."VendorProProduct" ADD COLUMN     "syncStatus" "public"."SyncStatus";
