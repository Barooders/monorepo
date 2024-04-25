{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    pre_hook = 'delete from {{this}}'
) }}

SELECT
    ppv.id AS id,
    pv.id AS "shopify_id",
    pv.created_at AS "createdAt",
    ppv."productId" AS "productId"
FROM
    public."ProductVariant" ppv
LEFT JOIN fivetran_shopify.product_variant pv ON ppv."shopifyId" = pv.id
WHERE pv.id IS NOT NULL
