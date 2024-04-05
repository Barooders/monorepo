{{ config(materialized='table') }}

SELECT
    f.additional_image_link,
    f.availability,
    f.brand,
    f.condition,
    f.custom_label_0,
    f.description,
    "unisex" as gender,
    f.gtin,
    f.id,
    f.image_link,
    f.item_group_id,
    f.link,
    f.price,
    f.product_type,
    f.sale_price,
    LEFT(RIGHT(shipping, CHAR_LENGTH(shipping)-5), CHAR_LENGTH(shipping)-9) as shipping,
    f.size,
    f.title,

FROM {{ref('feed_gmc_api')}} AS f