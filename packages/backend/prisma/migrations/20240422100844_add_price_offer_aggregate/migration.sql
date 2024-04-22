BEGIN;
ALTER TYPE "public"."AggregateName" ADD VALUE 'PRICE_OFFER';
COMMIT;

UPDATE "public"."Event"
    SET "aggregateName" = 'PRICE_OFFER', "aggregateId"=payload->>'priceOfferId'
    WHERE name::text LIKE 'PRICE_OFFER%';
