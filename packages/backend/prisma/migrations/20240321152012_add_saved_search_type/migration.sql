-- CreateEnum
CREATE TYPE "public"."SavedSearchType" AS ENUM ('B2B_MAIN_PAGE', 'PUBLIC_COLLECTION_PAGE');

-- AlterTable
ALTER TABLE "public"."SavedSearch" ADD COLUMN     "type" "public"."SavedSearchType";
