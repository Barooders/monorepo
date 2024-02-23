{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
  bp.id AS id,
  p.id AS "shopifyId",
  bp."createdAt" AS "createdAt",
  bp."vendorId"::uuid as "vendorId"
FROM public."Product" bp
LEFT JOIN fivetran_shopify.product p ON p.id = bp."shopifyId"
WHERE p.id IS NOT NULL
