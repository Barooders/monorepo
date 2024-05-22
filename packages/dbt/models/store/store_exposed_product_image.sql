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

SELECT
  pi.image->>'id' AS "shopify_id",
  bp.id AS "productId",
  pi.image->>'src' AS src,
  pi.image->>'width' AS width,
  pi.image->>'height' AS height,
  pi.image->>'alt' AS alt,
  pi.image->>'position' AS position,
  CURRENT_DATE AS "syncDate"
FROM product_images AS pi
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON pi.product_id = bp."shopifyId"
