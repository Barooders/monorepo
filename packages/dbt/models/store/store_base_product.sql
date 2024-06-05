{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
  bp.id,
  p.id AS "medusaId",
  bp."merchantItemId" AS "merchant_item_id",
  bp."createdAt",
  bp."vendorId"::uuid AS "vendorId"
FROM public."Product" AS bp
LEFT JOIN medusa.product AS p ON bp."medusaId" = p.id
WHERE p.id IS NOT NULL
