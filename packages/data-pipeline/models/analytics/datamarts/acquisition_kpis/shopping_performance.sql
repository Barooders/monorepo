{{ config(materialized='table') }}

SELECT
  date,
  p.vendor,
  cast(product_item_id AS string) AS id,
  product_type_l_2 AS product_type,
  product_type_l_1 AS category,
  sum(cost_micros) / 1000000 AS cost1j,
  sum(conversions_value) AS conv_value1j,
  sum(clicks) AS clicks1j,
  sum(impressions) AS impressions1j,
  sum(conversions) AS conversions1j

FROM google_ads.shopping_performance_view AS shp
LEFT JOIN {{ ref('dim_product_variant') }} AS pv ON cast(pv.id AS string) = shp.product_item_id
LEFT JOIN {{ ref('dim_product') }} AS p ON pv.product_id = p.id

GROUP BY vendor, id, product_type, category, date
