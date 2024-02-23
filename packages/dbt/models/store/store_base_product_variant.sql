{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    ppv.id AS id,
    pv.id AS "shopify_id",
    pv.created_at AS "createdAt",
    bp.id AS "productId"
FROM fivetran_shopify.product_variant pv
JOIN {{ref('store_base_product')}} bp ON bp."shopifyId" = pv.product_id
LEFT JOIN public."ProductVariant" ppv ON ppv."shopifyId" = pv.id
