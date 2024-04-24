BEGIN;

UPDATE "public"."SavedSearch" SET "resultsUrl" = 'https://barooders.com/pro' WHERE "resultsUrl" IS NULL AND type::text='B2B_MAIN_PAGE';
ALTER TABLE "public"."SavedSearch" ALTER COLUMN "resultsUrl" SET NOT NULL;

COMMIT;
