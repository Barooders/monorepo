{{ config(
    materialized='incremental',
    unique_key='shopify_id',
	pre_hook='delete from {{this}}'
) }}

SELECT
    pi.id AS "shopify_id",
    bp.id AS "productId",
    CURRENT_DATE AS "syncDate",
    pi.src,
    pi.width,
    pi.height,
    pi.alt,
    pi.position
FROM fivetran_shopify.product_image pi
JOIN {{ref('store_base_product')}} bp on bp."shopifyId" = pi.product_id