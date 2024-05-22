{{ config(
    materialized='incremental',
    unique_key='shopify_id',
	pre_hook='delete from {{this}}'
) }}

WITH product_images AS (
  SELECT
    id AS product_id,
    jsonb_array_elements(images) AS image
  FROM airbyte_shopify.products
)

SELECT -- noqa: ST06, (Select wildcards then simple targets before calculations and aggregates)
  bp.id AS "productId",
  (pi.image ->> 'id')::bigint AS "shopify_id",
  (pi.image ->> 'width')::bigint AS width,
  (pi.image ->> 'height')::bigint AS height,
  (pi.image ->> 'position')::bigint AS position,
  pi.image ->> 'src' AS src,
  pi.image ->> 'alt' AS alt, -- noqa: RF04
  current_date AS "syncDate"
FROM product_images AS pi
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON pi.product_id = bp."shopifyId"
