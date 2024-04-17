
-- Update all values
UPDATE "public"."Customer" SET "chatId" = "shopifyId";

-- AlterTable
ALTER TABLE "public"."Customer" ALTER COLUMN "chatId" SET NOT NULL;