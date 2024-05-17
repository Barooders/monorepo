{{ config(materialized='table') }}

SELECT
	shp.segments_date AS date,
	p.vendor,
	cast(segments_product_item_id as string) as id,
	shp.segments_product_type_l3 as product_type,
	shp.segments_product_type_l2 as category,
	sum(shp.metrics_cost_micros) / 1000000 as cost1J,
	sum(shp.metrics_all_conversions_value) as conv_value1J,
	sum(shp.metrics_clicks) as clicks1J,
	sum(shp.metrics_impressions) as impressions1J,
	sum(shp.metrics_all_conversions) as conversions1J
FROM ads_direct_export.p_ads_ShoppingProductStats_5663401656 as shp
LEFT JOIN {{ ref('dim_product_variant') }} pv on cast(pv.id as string) = shp.segments_product_item_id
LEFT JOIN {{ ref('dim_product') }} as p on p.id = pv.product_id

group by vendor, id, product_type, category, date