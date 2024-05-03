{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    pre_hook = 'delete from {{this}}'
) }}

SELECT
  ppv.id,
  pv.id AS "shopify_id",
  pv.created_at AS "createdAt",
  ppv."productId"
FROM
  public."ProductVariant" AS ppv
LEFT JOIN fivetran_shopify.product_variant AS pv ON ppv."shopifyId" = pv.id
WHERE pv.id IS NOT NULL
