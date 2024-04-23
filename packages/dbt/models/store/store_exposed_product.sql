{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bp.id AS id,
    bp.published_at AS "publishedAt",
    bp.product_type AS "productType",
    bp.title,
    bp.vendor,
    bp.description,
    bp.handle,
    bp.status,
    bp.brand,
    bp.number_of_views AS "numberOfViews",
    bp.size,
    bp.gender,
    bp.model,
    bp.model_year AS "modelYear",
    bp.sync_date AS "syncDate",
    bp.first_image AS "firstImage"
FROM {{ref('store_base_product')}} bp
LEFT JOIN public."ProductSalesChannel" psc ON bp.id = psc."productId"
WHERE
  bp.product_type IS NOT NULL
  AND bp.title IS NOT NULL
  AND psc."salesChannelName"::TEXT='PUBLIC'
