{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

WITH largest_bundle_prices AS (
    SELECT "productId", "unitPriceInCents"
    FROM (
    SELECT
        "productId",
        "unitPriceInCents",
        ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "minQuantity" DESC) AS row_num
    FROM public."BundlePrice"
    ) AS ranked
    WHERE row_num = 1
)

SELECT
    bp.id AS id,
    bp.published_at,
    bp.product_type,
    bp.status,
    bp.total_quantity,
    (1 + GET_GLOBAL_B2B_BUYER_COMMISSION() / 100) * lbp."unitPriceInCents" AS "largest_bundle_price_in_cents",
    bp.title,
    bp.brand,
    bp.handle,
    bp.sync_date,
    bp.first_image

FROM {{ref('store_base_product')}} bp
LEFT JOIN public."ProductSalesChannel" psc ON bp.id = psc."productId"
LEFT JOIN largest_bundle_prices lbp ON lbp."productId" = bp.id

WHERE
  bp.product_type IS NOT NULL
  AND bp.title IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'
