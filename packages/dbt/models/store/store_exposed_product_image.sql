{{ config(
    materialized='incremental',
    unique_key='medusa_id',
	pre_hook='delete from {{this}}'
) }}

SELECT -- noqa: ST06, (Select wildcards then simple targets before calculations and aggregates)
  bp.id AS "productId",
  i.id AS "medusa_id",
  -1 AS width,
  -1 AS height,
  -1 AS position, -- noqa: RF04
  i.url AS src,
  NULL AS alt,
  current_date AS "syncDate"
FROM medusa.product_images AS pi
LEFT JOIN medusa.image AS i ON pi.image_id = i.id
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON pi.product_id = bp."medusaId"
