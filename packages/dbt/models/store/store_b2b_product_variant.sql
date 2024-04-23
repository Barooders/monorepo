{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bpv."shopify_id" AS "shopify_id",
    bpv.inventory_quantity,
    bpv.sync_date,
    (1 + GET_GLOBAL_B2B_BUYER_COMMISSION() / 100) * ppv."priceInCents" / 100 AS "price",
    bpv.compare_at_price AS "compare_at_price",
    bpv.condition,
    bpv.title,
    bpv.updated_at

FROM {{ref('store_base_product_variant')}} bpv
LEFT JOIN public."ProductSalesChannel" psc ON ppv."productId" = psc."productId"

WHERE
  bpv.inventory_quantity IS NOT NULL
  AND bpv.price IS NOT NULL
  AND bpv.updated_at IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'
