{{ config(materialized='table') }}

SELECT
    f.id,
    f.product_type as type,
    f.brand,
    p.year as year,
    f.gtin as ean,
    f.description,
    f.title as name,
    COALESCE(f.sale_price, f.price) as price,
    f.link,
    f.image_link
FROM {{ref('feed_gmc_api')}} AS f
JOIN {{ref('dim_product')}} AS p on p.id = f.item_group_id
