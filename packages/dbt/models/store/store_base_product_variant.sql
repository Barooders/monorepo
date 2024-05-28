{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    pre_hook = 'delete from {{this}}'
) }}

SELECT
  ppv.id,
  pv.id AS "shopify_id",
  ppv."merchantItemId" AS "merchant_item_id",
  pv.created_at AS "createdAt",
  ppv."productId"
FROM
  public."ProductVariant" AS ppv
LEFT JOIN airbyte_shopify.product_variants AS pv ON ppv."shopifyId" = pv.id
WHERE pv.id IS NOT NULL
