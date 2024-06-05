{{ config(
    materialized='incremental',
    unique_key="collection_internal_id||'-'||discount_id",
    pre_hook='delete from {{this}}'
) }}

WITH price_rule_collections AS (
  SELECT
    dcc.product_collection_id AS collection_medusa_id,
    d.id AS medusa_discount_id
  FROM medusa.discount AS d
  LEFT JOIN medusa.discount_rule AS dr ON d.rule_id = dr.id
  LEFT JOIN medusa.discount_condition AS dc ON dr.id = dc.discount_rule_id
  LEFT JOIN medusa.discount_condition_product_collection AS dcc ON dc.id = dcc.condition_id
)

SELECT
  sc.id AS collection_internal_id,
  medusa_discount_id AS discount_id -- noqa: RF02
FROM price_rule_collections AS prec
LEFT JOIN
  {{ ref('store_collection') }} AS sc
  ON prec.collection_medusa_id = sc.medusa_id
WHERE sc.id IS NOT NULL
