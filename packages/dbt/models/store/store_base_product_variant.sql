{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

WITH bikes AS (
    SELECT pc.product_id
    FROM {{ref('store_product_collection')}} pc
    LEFT JOIN {{ref('store_collection')}} c ON pc.collection_id=c.id
    WHERE c.handle='velos'
)

SELECT
		ppv.id,
    ppv."shopifyId" AS shopify_id,
    ppv."createdAt" AS "created_at",
    ppv."productId" AS "product_id",
    ppv.quantity AS inventory_quantity,
    CURRENT_DATE AS sync_date,
    ppv."priceInCents"::float / 100 AS price,
    pv.compare_at_price AS compare_at_price,
    po1.name AS option_1_name,
    pv.option_1 AS option_1,
    po2.name AS option_2_name,
    pv.option_2 AS option_2,
    po3.name AS option_3_name,
    pv.option_3 AS option_3,
    pv.requires_shipping AS requires_shipping,
    pv.title,
    CAST(ppv.condition::TEXT AS dbt."Condition") as condition,
    CASE
        WHEN ppv.condition::TEXT<>'AS_NEW' AND c."isRefurbisher"=TRUE AND pp.id IN (SELECT product_id FROM bikes) THEN TRUE
        ELSE FALSE
    END AS is_refurbished,
    pv.updated_at AS updated_at

FROM public."ProductVariant" ppv
JOIN {{ref('store_base_product')}} bp ON bp."shopifyId" = pv.product_id
LEFT JOIN fivetran_shopify.product_variant pv ON ppv."shopifyId" = pv.id
LEFT JOIN public."ProductVariant" ppv ON ppv.id = bpv.id
LEFT JOIN public."ProductSalesChannel" psc ON ppv."productId" = psc."productId"
LEFT JOIN public."Product" pp ON ppv."productId"=pp.id
LEFT JOIN public."Customer" c ON pp."vendorId"=c."authUserId"
LEFT JOIN fivetran_shopify.product_variant pv ON pv.id = bpv."shopify_id"

LEFT JOIN fivetran_shopify.product_option po1 ON (po1.product_id=pv.product_id AND po1.position=1)
LEFT JOIN fivetran_shopify.product_option po2 ON (po2.product_id=pv.product_id AND po2.position=2)
LEFT JOIN fivetran_shopify.product_option po3 ON (po3.product_id=pv.product_id AND po3.position=3)

WHERE
  pv.inventory_quantity IS NOT NULL
  AND pv.price IS NOT NULL
  AND pv.updated_at IS NOT NULL
  AND psc."salesChannelName"::TEXT='PUBLIC'
