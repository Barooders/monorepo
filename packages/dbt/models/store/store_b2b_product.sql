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
    ep.id AS id,
    ep."publishedAt" AS published_at,
    ep."productType" AS product_type,
    ep.status,
    ep.total_quantity AS total_quantity,
    (1 + GET_GLOBAL_B2B_BUYER_COMMISSION() / 100) * lbp."unitPriceInCents" AS "largest_bundle_price_in_cents",
    ep.title,
    ep.brand,
    ep.handle,
    ep."syncDate" AS sync_date,
    ep."firstImage" AS first_image

FROM {{ref('store_exposed_product')}} ep
LEFT JOIN public."ProductSalesChannel" psc ON ep.id = psc."productId"
LEFT JOIN largest_bundle_prices lbp ON lbp."productId" = ep.id

WHERE psc."salesChannelName"::TEXT='B2B'
