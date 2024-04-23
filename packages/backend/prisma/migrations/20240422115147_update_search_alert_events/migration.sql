BEGIN;

UPDATE "Event" AS e
SET 
    "aggregateId" = e.metadata->>'customerId',
    metadata = jsonb_build_object('searchAlertId', sa."id")
FROM "SearchAlert" AS sa
WHERE 
    e.name = 'SEARCH_ALERT_SENT'
    AND sa."searchId" = e.metadata->>'customerId';

COMMIT;