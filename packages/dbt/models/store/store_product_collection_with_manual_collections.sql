{{ config(
    materialized='incremental',
    unique_key="collection_id||'-'||product_id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  spc.collection_id AS collection_id,
  spc.product_id,
  spc."syncDate"
FROM {{ref('store_product_collection')}} spc
LEFT JOIN {{ref('store_collection')}} c on c.id=spc.collection_id
WHERE
  c.handle NOT IN ('all', 'hot-deals')

UNION

SELECT
  c.id AS collection_id,
  bp.id AS product_id,
  CURRENT_DATE AS "syncDate"
FROM {{ref('store_base_product')}} bp
JOIN {{ref('store_collection')}} c on c.handle='all'

UNION

SELECT
  c.id AS collection_id,
  bp.id AS product_id,
  CURRENT_DATE AS "syncDate"
FROM {{ref('store_product_for_analytics')}} bp
JOIN {{ref('store_collection')}} c on c.handle='hot-deals'
WHERE
  bp.highest_discount > 30
  AND bp.is_bike=TRUE
  AND bp.image_count > 0
  AND bp.notation::TEXT='A'
