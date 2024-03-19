{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

WITH images_ranked AS (
  SELECT
    images."productId",
    images.src AS "firstImage",
    ROW_NUMBER() OVER (PARTITION BY images."productId" ORDER BY images."syncDate" DESC) AS row_number
  FROM {{ref('store_exposed_product_image')}} images
  WHERE images.position = 1
)

SELECT
    bp.id AS id,
    sp.published_at AS "published_at",
    COALESCE(p."productType", sp.product_type) AS "product_type",
    CAST(p.status::TEXT AS dbt."ProductStatus") AS status,
    sp.title,
    sp.handle,
    CURRENT_DATE AS "sync_date",
    ir."firstImage" AS "first_image"

FROM {{ref('store_base_product')}} bp
LEFT JOIN public."Product" p ON p.id = bp.id
LEFT JOIN fivetran_shopify.product sp ON sp.id = bp."shopifyId"
LEFT JOIN images_ranked ir ON ir."productId" = bp.id AND ir.row_number = 1
LEFT JOIN public."ProductSalesChannel" psc ON bp.id = psc."productId"

WHERE
  sp.id IS NOT NULL
  AND COALESCE(p."productType",sp.product_type) IS NOT NULL
  AND sp.title IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'
