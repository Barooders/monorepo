{{ config(materialized='table') }}


WITH dim_product_variant AS (
  SELECT
    v.id,
    v.product_id,
    v.option_1,
    v.option_2,
    v.option_3,
    v.title,
    v.sku,
    v.grams,
    v.price,
    v.compare_at_price,
    v.inventory_quantity,
    v.requires_shipping,
    DATETIME(v.created_at, 'Europe/Paris') AS creation_datetime,
    DATE_TRUNC(DATETIME(v.created_at, 'Europe/Paris'), DAY) AS creation_date
  FROM shopify.product_variant AS v
)

SELECT *
FROM dim_product_variant
ORDER BY 2 DESC
