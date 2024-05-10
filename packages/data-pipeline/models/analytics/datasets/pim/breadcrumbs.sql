{{ config(materialized='table') }}

SELECT
	pt.name as product_type,
	min(pc.label) as product_category,
	min(u.label) as universe,
FROM strapi_public.pim_product_types pt
JOIN strapi_public.pim_product_types_categories_links cl ON cl.pim_product_type_id = pt.id
JOIN strapi_public.pim_categories pc ON pc.id = cl.pim_category_id
JOIN strapi_public.pim_categories_universe_links ul ON ul.pim_category_id = pc.id
JOIN strapi_public.pim_universes u ON u.id = ul.pim_universe_id
GROUP BY pt.name
