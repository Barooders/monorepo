{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
  bp.id,
  p.id AS "shopifyId",
  bp."createdAt",
  bp."vendorId"::uuid AS "vendorId"
FROM public."Product" AS bp
LEFT JOIN fivetran_shopify.product AS p ON bp."shopifyId" = p.id
WHERE p.id IS NOT NULL
