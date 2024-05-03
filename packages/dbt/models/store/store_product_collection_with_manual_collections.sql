{{ config(
    materialized='incremental',
    unique_key="collection_id||'-'||product_id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  spc.collection_id,
  spc.product_id,
  spc."syncDate"
FROM {{ ref('store_product_collection') }} AS spc
LEFT JOIN {{ ref('store_collection') }} AS c ON spc.collection_id = c.id
WHERE
  c.handle NOT IN ('all', 'hot-deals')

UNION

SELECT
  c.id AS collection_id,
  bp.id AS product_id,
  CURRENT_DATE AS "syncDate"
FROM {{ ref('store_base_product') }} AS bp
INNER JOIN {{ ref('store_collection') }} AS c ON c.handle = 'all'

UNION

SELECT
  c.id AS collection_id,
  bp.id AS product_id,
  CURRENT_DATE AS "syncDate"
FROM {{ ref('store_product_for_analytics') }} AS bp
INNER JOIN {{ ref('store_collection') }} AS c ON c.handle = 'hot-deals'
WHERE
  bp.highest_discount > 30
  AND bp.is_bike = TRUE
  AND bp.image_count > 0
  AND bp.notation::TEXT = 'A'
