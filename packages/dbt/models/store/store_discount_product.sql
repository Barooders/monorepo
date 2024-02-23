{{ config(
    materialized='incremental',
    unique_key="discount_title||'-'||product_id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  d.title AS discount_title,
  pc.product_id as product_id,
  CURRENT_DATE AS "syncDate"
FROM {{ref('store_discount_collection')}} dc
JOIN {{ref('store_discount')}} d ON dc.discount_id = d.id
JOIN {{ref('store_product_collection')}} pc on pc.collection_id = dc.collection_internal_id
WHERE d.title IN ('WEEK_VENDOR') AND d.ends_at > CURRENT_DATE AND d.starts_at < CURRENT_DATE
