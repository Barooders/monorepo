{{ config(
   materialized='incremental',
  unique_key="product_id||'-'||full_tag",
  pre_hook='delete from {{this}}'
) }}

SELECT
  bp.id AS "product_id",
  split_part(t.value, ':',1) AS tag,
  t.value AS full_tag,
  min(substring(t.value from position(':' in t.value) + 1)) AS value
FROM fivetran_shopify.product_tag t
JOIN {{ref('store_base_product')}} bp on bp."shopifyId" = t.product_id
WHERE value LIKE '%:%'
GROUP BY 1,2,3