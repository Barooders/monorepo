{{ config(materialized='table') }}

SELECT
  pt.name AS product_type,
  min(pc.label) AS product_category,
  min(u.label) AS universe
FROM strapi_public.pim_product_types AS pt
INNER JOIN strapi_public.pim_product_types_categories_links AS cl ON pt.id = cl.pim_product_type_id
INNER JOIN strapi_public.pim_categories AS pc ON cl.pim_category_id = pc.id
INNER JOIN strapi_public.pim_categories_universe_links AS ul ON pc.id = ul.pim_category_id
INNER JOIN strapi_public.pim_universes AS u ON ul.pim_universe_id = u.id
GROUP BY pt.name
