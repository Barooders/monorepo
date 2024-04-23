{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bpv."shopify_id" AS "shopify_id",
    bpv.inventory_quantity AS "inventoryQuantity",
    bpv.sync_date AS "syncDate",
    ppv."priceInCents"::float / 100 AS price,
    bpv.compare_at_price AS "compareAtPrice",
    bpv.option_1_name AS "option1Name",
    bpv.option_1 AS "option1",
    bpv.option_2_name AS "option2Name",
    bpv.option_2 AS "option2",
    bpv.option_3_name AS "option3Name",
    bpv.option_3 AS "option3",
    bpv.requires_shipping AS "requiresShipping",
    bpv.title,
    bpv.condition,
    bpv.is_refurbished AS "isRefurbished",
    bpv.updated_at AS "updatedAt"

FROM {{ref('store_base_product_variant')}} bpv
LEFT JOIN public."ProductVariant" ppv ON ppv.id = bpv.id
LEFT JOIN public."ProductSalesChannel" psc ON bpv."productId" = psc."productId"

WHERE
  bpv.inventory_quantity IS NOT NULL
  AND bpv.price IS NOT NULL
  AND bpv.updated_at IS NOT NULL
  AND psc."salesChannelName"::TEXT='PUBLIC'
