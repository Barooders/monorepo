{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bpv."shopify_id" AS "shopify_id",
    ppv.quantity AS "inventory_quantity",
    CURRENT_DATE AS "sync_date",
    GET_GLOBAL_B2B_BUYER_COMMISSION_MULTIPLIER() * ppv."priceInCents" / 100 AS "price",
    pv.compare_at_price AS "compare_at_price",
    CAST(ppv.condition::TEXT AS dbt."Condition") as "condition",
    pv.updated_at AS "updated_at"

FROM {{ref('store_base_product_variant')}} bpv
LEFT JOIN public."ProductVariant" ppv ON ppv.id = bpv.id
LEFT JOIN fivetran_shopify.product_variant pv ON pv.id = bpv."shopify_id"
LEFT JOIN public."ProductSalesChannel" psc ON ppv."productId" = psc."productId"

WHERE
  pv.inventory_quantity IS NOT NULL
  AND pv.price IS NOT NULL
  AND pv.updated_at IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'