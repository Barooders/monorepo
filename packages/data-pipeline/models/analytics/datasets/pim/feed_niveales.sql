{{ config(materialized='table') }}

SELECT
    f.variant_id id,
    m.slug as type,
    COALESCE(f.brand, "Barooders") as brand,
    p.year as year,
    f.barcode as ean,
    case 
        when CHAR_LENGTH(f_api.description) >= 300 then SUBSTR(f_api.description, 1, 300) 
        else f_api.description 
        end as description,
    p.modele as name,
    f.title_proper as title,
    f.price,
    f_api.link,
    f.image_url_1 as image_link
FROM {{ref('feed_gmc')}} AS f
JOIN {{ref('feed_gmc_api')}} AS f_api on f_api.id = f.variant_id
JOIN {{ref('dim_product')}} AS p on p.id = f.product_id
JOIN config.niveales_mapping as m on m.product_type = p.product_type
