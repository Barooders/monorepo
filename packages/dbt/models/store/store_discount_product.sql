{{ config(
    materialized='incremental',
    unique_key="discount_title||'-'||product_id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  d.title AS discount_title,
  pc.product_id,
  CURRENT_DATE AS "syncDate"
FROM {{ ref('store_discount_collection') }} AS dc
INNER JOIN {{ ref('store_discount') }} AS d ON dc.discount_id = d.id
INNER JOIN
  {{ ref('store_product_collection') }} AS pc
  ON dc.collection_internal_id = pc.collection_id
WHERE d.title IN (
  -- BDAYS ends on 01/04/24
  'BDAYS5',
  'BDAYS10',
  'BDAYS15',
  'BDAYS_SHIPPING'
-- BDAYS
) AND d.ends_at > CURRENT_DATE AND d.starts_at < CURRENT_DATE
