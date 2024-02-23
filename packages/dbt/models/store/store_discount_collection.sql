{{ config(
    materialized='incremental',
    unique_key="collection_internal_id||'-'||discount_id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  sc.id AS collection_internal_id,
  prec.price_rule_id AS discount_id
FROM fivetran_shopify.price_rule_ent_collection prec
LEFT JOIN {{ref('store_collection')}} sc ON prec.collection_id = sc.shopify_id
WHERE sc.id IS NOT NULL
