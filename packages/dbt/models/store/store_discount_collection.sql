{{ config(
    materialized='incremental',
    unique_key="collection_internal_id||'-'||discount_id",
    pre_hook='delete from {{this}}'
) }}

WITH price_rule_collections AS (
  SELECT
    (jsonb_array_elements(entitled_collection_ids) -> 0)::bigint AS collection_shopify_id,
    id AS shopify_discount_id
  FROM airbyte_shopify.price_rules
)

SELECT
  sc.id AS collection_internal_id,
  shopify_discount_id AS discount_id -- noqa: RF02
FROM price_rule_collections AS prec
LEFT JOIN
  {{ ref('store_collection') }} AS sc
  ON prec.collection_shopify_id = sc.shopify_id
WHERE sc.id IS NOT NULL
