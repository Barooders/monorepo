{{ config(
    materialized='incremental',
    unique_key='shopify_id',
	pre_hook='delete from {{this}}'
) }}

SELECT
  pi.id AS "shopify_id",
  bp.id AS "productId",
  pi.src,
  pi.width,
  pi.height,
  pi.alt,
  pi.position,
  CURRENT_DATE AS "syncDate"
FROM airbyte_shopify.product_images AS pi
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON pi.product_id = bp."shopifyId"
