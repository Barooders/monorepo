{{ config(
    materialized='incremental',
    unique_key='medusa_id',
	pre_hook='delete from {{this}}'
) }}

WITH ranked_images AS (
  SELECT
    pi.product_id,
    pi.image_id,
    i.url,
    ROW_NUMBER() OVER (PARTITION BY pi.product_id ORDER BY pi.image_id ORDER BY pi.image_id) AS position -- Replace `pi.image_id` with appropriate column for ordering if needed
  FROM medusa.product_images AS pi
  LEFT JOIN medusa.image AS i ON pi.image_id = i.id
)

SELECT -- noqa: ST06, (Select wildcards then simple targets before calculations and aggregates)
  bp.id AS "productId",
  ri.image_id AS "medusa_id",
  -1 AS width,
  -1 AS height,
  ri.position,
  ri.url AS src,
  NULL AS alt,
  current_date AS "syncDate"
FROM ranked_images AS ri
INNER JOIN
  {{ ref('store_base_product') }} AS bp
  ON ri.product_id = bp."medusaId"
