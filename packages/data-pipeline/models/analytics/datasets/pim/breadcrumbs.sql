{{ config(materialized='table') }}

SELECT
	pt.name as product_type,
	min(pc.label) as product_category,
	min(u.label) as universe,
FROM backend__strapi.pim_product_types pt
JOIN backend__strapi.pim_product_types_categories_links cl ON cl.pim_product_type_id = pt.id
JOIN backend__strapi.pim_categories pc ON pc.id = cl.pim_category_id
JOIN backend__strapi.pim_categories_universe_links ul ON ul.pim_category_id = pc.id
JOIN backend__strapi.pim_universes u ON u.id = ul.pim_universe_id
GROUP BY pt.name
