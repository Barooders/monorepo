{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

WITH largest_bundle_prices AS (
    SELECT "productVariantId", "unitPriceInCents"
    FROM (
    SELECT 
        "productVariantId",
        "unitPriceInCents"
        ROW_NUMBER() OVER (PARTITION BY "productVariantId" ORDER BY "minQuantity" DESC) AS row_num
    FROM public."BundlePrice"
    ) AS ranked
    WHERE row_num = 1;
)

SELECT
    bpv."shopify_id" AS "shopify_id",
    pv.inventory_quantity AS "inventory_quantity",
    CURRENT_DATE AS "sync_date",
    pv.price,
    pv.compare_at_price AS "compare_at_price",
    lbp."unitPriceInCents" AS "largest_bundle_price_in_cents",
    CAST(ppv.condition::TEXT AS dbt."Condition") as "condition",
    pv.updated_at AS "updated_at"

FROM {{ref('store_base_product_variant')}} bpv
LEFT JOIN public."ProductVariant" ppv ON ppv.id = bpv.id
LEFT JOIN largest_bundle_prices lbp ON lbp."productVariantId" = bpv.id
LEFT JOIN fivetran_shopify.product_variant pv ON pv.id = bpv."shopify_id"
LEFT JOIN public."ProductSalesChannel" psc ON ppv."productId" = psc."productId"

WHERE
  pv.inventory_quantity IS NOT NULL
  AND pv.price IS NOT NULL
  AND pv.updated_at IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'