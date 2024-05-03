{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

WITH largest_bundle_prices AS (
  SELECT
    "productId",
    "unitPriceInCents"
  FROM (
    SELECT
      "productId",
      "unitPriceInCents",
      ROW_NUMBER()
        OVER (PARTITION BY "productId" ORDER BY "minQuantity" DESC)
      AS row_num
    FROM public."BundlePrice"
  ) AS ranked
  WHERE row_num = 1
)

SELECT
  ep.id,
  (1 + GET_GLOBAL_B2B_BUYER_COMMISSION() / 100)
  * lbp."unitPriceInCents" AS "largest_bundle_price_in_cents"
FROM {{ ref('store_exposed_product') }} AS ep
LEFT JOIN public."ProductSalesChannel" AS psc ON ep.id = psc."productId"
LEFT JOIN largest_bundle_prices AS lbp ON ep.id = lbp."productId"

WHERE psc."salesChannelName"::TEXT = 'B2B'
