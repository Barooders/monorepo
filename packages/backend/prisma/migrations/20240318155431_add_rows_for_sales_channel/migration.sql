INSERT INTO "public"."SalesChannel" VALUES ('B2B'), ('PUBLIC');

INSERT INTO "public"."ProductSalesChannel" ("salesChannelName", "productId")
SELECT 'PUBLIC', id
FROM "public"."Product";