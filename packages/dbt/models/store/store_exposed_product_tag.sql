{{ config(
   materialized='incremental',
  unique_key="product_id||'-'||full_tag",
  pre_hook='delete from {{this}}'
) }}

WITH tags AS (
  SELECT
    id AS shopify_product_id,
    string_to_table(tags, ', ') AS value -- noqa: RF04, (ignore reserved keyword)
  FROM airbyte_shopify.products
)

SELECT -- noqa: ST06, (Select wildcards then simple targets before calculations and aggregates)
  bp.id AS "product_id",
  split_part(t.value, ':', 1) AS tag,
  t.value AS full_tag,
  min(substring(t.value FROM position(':' IN t.value) + 1)) AS value -- noqa: RF04, (ignore reserved keyword)
FROM tags AS t
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON t.shopify_product_id = bp."shopifyId"
WHERE value LIKE '%:%'
GROUP BY 1, 2, 3
