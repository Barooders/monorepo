{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

with dynamic_tags AS (
    SELECT
        da.name AS name,
        pa.tag_prefix AS tag_prefix,
        al.pim_product_attribute_order AS priority
    FROM fivetran_strapi_public.pim_dynamic_attributes AS da
    JOIN fivetran_strapi_public.pim_dynamic_attributes_pim_product_attributes_links al ON al.pim_dynamic_attribute_id = da.id
    JOIN fivetran_strapi_public.pim_product_attributes pa ON pa.id = al.pim_product_attribute_id
),
images_ranked AS (
  SELECT
    images."productId",
    images.src AS "firstImage",
    ROW_NUMBER() OVER (PARTITION BY images."productId" ORDER BY images."syncDate" DESC) AS row_number
  FROM {{ref('store_exposed_product_image')}} images
  WHERE images.position = 1
)

SELECT
    bp.id AS id,
    sp.published_at AS "publishedAt",
    COALESCE(p."productType", sp.product_type) AS "productType",
    sp.title,
    sp.vendor,
    sp.body_html AS "description",
    sp.handle,
    CAST(p.status::TEXT AS dbt."ProductStatus") AS status,
    t_brand.value AS brand,
    COALESCE(pr.traffictot,0) AS "numberOfViews",
    t_size.value AS size,
    t_gender.value AS gender,
    t_model.value AS model,
    t_year.value AS "modelYear",
    CURRENT_DATE AS "syncDate",
    ir."firstImage" AS "firstImage"

FROM {{ref('store_base_product')}} bp
LEFT JOIN public."Product" p ON p.id = bp.id
LEFT JOIN fivetran_shopify.product sp ON sp.id = bp."shopifyId"

LEFT JOIN (SELECT product_id, min(value) value from {{ref('store_exposed_product_tag')}} t_brand WHERE tag = 'marque' group by 1) t_brand ON t_brand.product_id = bp.id
LEFT JOIN (SELECT product_id, min(t_size.value) value from {{ref('store_exposed_product_tag')}} t_size JOIN dynamic_tags dt ON dt.tag_prefix = t_size.tag AND dt.name = 'size' group by 1) t_size ON t_size.product_id = bp.id
LEFT JOIN (SELECT product_id, min(value) value from {{ref('store_exposed_product_tag')}} t_gender WHERE tag = 'genre' group by 1) t_gender ON t_gender.product_id = bp.id
LEFT JOIN (SELECT product_id, min(value) value from {{ref('store_exposed_product_tag')}} t_model WHERE tag = 'modele' group by 1) t_model ON t_model.product_id = bp.id
LEFT JOIN (SELECT product_id, min(value) value from {{ref('store_exposed_product_tag')}} t_year WHERE tag = 'année' group by 1) t_year ON t_year.product_id = bp.id
LEFT JOIN images_ranked ir ON ir."productId" = bp.id AND ir.row_number = 1
LEFT JOIN biquery_analytics_dbt.products_ranking pr ON pr.id = bp.id AND pr._fivetran_deleted=FALSE

WHERE
  sp.id IS NOT NULL
  AND COALESCE(p."productType",sp.product_type) IS NOT NULL
  AND sp.title IS NOT NULL