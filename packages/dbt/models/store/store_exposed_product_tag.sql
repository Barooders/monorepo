{{ config(
   materialized='incremental',
  unique_key="product_id||'-'||full_tag",
  pre_hook='delete from {{this}}'
) }}

SELECT
  bp.id AS "product_id",
  split_part(t.value, ':', 1) AS tag,
  t.value AS full_tag,
  min(substring(t.value FROM position(':' IN t.value) + 1)) AS value
FROM fivetran_shopify.product_tag AS t
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON t.product_id = bp."shopifyId"
WHERE value LIKE '%:%'
GROUP BY 1, 2, 3
