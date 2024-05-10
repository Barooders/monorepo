{{ config(materialized='table') }}

SELECT
  f.additional_image_link,
  f.availability,
  f.brand,
  f.condition,
  f.custom_label_0,
  f.description,
  "unisex" AS gender,
  f.gtin,
  f.id,
  f.image_link,
  f.item_group_id,
  f.link,
  f.price,
  f.product_type,
  f.sale_price,
  f.size,
  f.title,
  LEFT(RIGHT(shipping, CHAR_LENGTH(shipping) - 5), CHAR_LENGTH(shipping) - 9) AS shipping

FROM {{ ref('feed_gmc_api') }} AS f
