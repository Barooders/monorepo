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
),
largest_bundle_prices AS (
    SELECT "productId", "unitPriceInCents"
    FROM (
    SELECT
        "productId",
        "unitPriceInCents",
        ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "minQuantity" DESC) AS row_num
    FROM public."BundlePrice"
    ) AS ranked
    WHERE row_num = 1
),
total_quantities AS (
    SELECT
        "productId",
        SUM("quantity") AS "totalQuantity"
    FROM public."ProductVariant"
    GROUP BY "productId"

)

SELECT
    bp.id AS id,
    sp.published_at AS "published_at",
    COALESCE(p."productType", sp.product_type) AS "product_type",
    CAST(p.status::TEXT AS dbt."ProductStatus") AS status,
    tq."totalQuantity" AS "total_quantity",
    lbp."unitPriceInCents" AS "largest_bundle_price_in_cents",
    sp.title,
    sp.handle,
    CURRENT_DATE AS "sync_date",
    ir."firstImage" AS "first_image"

FROM {{ref('store_base_product')}} bp
LEFT JOIN public."Product" p ON p.id = bp.id
LEFT JOIN fivetran_shopify.product sp ON sp.id = bp."shopifyId"
LEFT JOIN images_ranked ir ON ir."productId" = bp.id AND ir.row_number = 1
LEFT JOIN public."ProductSalesChannel" psc ON bp.id = psc."productId"
LEFT JOIN largest_bundle_prices lbp ON lbp."productId" = bp.id
LEFT JOIN total_quantities tq ON tq."productId" = bp.id

WHERE
  sp.id IS NOT NULL
  AND COALESCE(p."productType",sp.product_type) IS NOT NULL
  AND sp.title IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'
