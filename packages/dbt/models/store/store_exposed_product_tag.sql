{{ config(
   materialized='incremental',
  unique_key="product_id||'-'||full_tag",
  pre_hook='delete from {{this}}'
) }}

SELECT -- noqa: ST06, (Select wildcards then simple targets before calculations and aggregates)
  bp.id AS "product_id",
  split_part(tag.value, ':', 1) AS tag,
  tag.value AS full_tag,
  min(substring(tag.value FROM position(':' IN tag.value) + 1)) AS value -- noqa: RF04, (ignore reserved keyword)
FROM medusa.product_tag AS tag
INNER JOIN medusa.product_tags AS tags ON tag.id = tags.product_tag_id
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON tags.product_id = bp."medusaId"
WHERE value LIKE '%:%'
GROUP BY 1, 2, 3
