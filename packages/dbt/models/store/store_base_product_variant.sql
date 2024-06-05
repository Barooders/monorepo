{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    pre_hook = 'delete from {{this}}'
) }}

SELECT
  ppv.id,
  pv.id AS "medusa_id",
  ppv."merchantItemId" AS "merchant_item_id",
  pv.created_at AS "created_at",
  ppv."productId"
FROM
  public."ProductVariant" AS ppv
LEFT JOIN medusa.product_variant AS pv ON ppv."medusaId" = pv.id
WHERE pv.id IS NOT NULL
