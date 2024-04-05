{{ config(materialized='table') }}

SELECT
date,
p.vendor,
cast(product_item_id as string) as id,
product_type_l_2 as product_type,
product_type_l_1 as category,
sum(cost_micros) / 1000000 as cost1J,
sum(conversions_value) as conv_value1J,
sum(clicks) as clicks1J,
sum(impressions) as impressions1J,
sum(conversions) as conversions1J,

FROM google_ads.shopping_performance_view as shp
LEFT JOIN {{ ref('dim_product_variant') }}  pv on cast(pv.id as string) = shp.product_item_id
LEFT JOIN {{ ref('dim_product') }} as p on p.id = pv.product_id

group by vendor, id, product_type, category, date