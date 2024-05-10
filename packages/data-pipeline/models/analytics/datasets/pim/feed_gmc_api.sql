{{ config(materialized='table') }}

WITH unique_variant_feed AS (
  SELECT
    row.*,
    row.variant_id AS id
  FROM (
    SELECT ARRAY_AGG(f LIMIT 1)[OFFSET(0)] AS row
    FROM {{ ref('feed_gmc') }} AS f
    WHERE
      NOT CONTAINS_SUBSTR(tags, 'exclude')
      AND NOT image_url_1 IS null
    GROUP BY variant_id
  )
),

stocks AS (
  SELECT
    id,
    CASE
      WHEN product_status != 'active' OR inventory_quantity = 0 THEN 'out_of_stock'
      ELSE 'in_stock'
    END AS availability
  FROM unique_variant_feed
),

shipping_price AS (
  SELECT
    id,
    CASE
      WHEN forced_shipping_price IS NOT null THEN forced_shipping_price + commission_price + 0.1
      ELSE sh.shipping_price + commission_price + 0.1
    END AS shipping_price
  FROM unique_variant_feed AS f
  INNER JOIN config.shipping_weights AS sh ON f.weight = sh.weight
),

slugs AS (
  SELECT
    id,
    slug.collection_slug,
    CONCAT('https://barooders.com/collections/', COALESCE(slug.collection_slug, 'all'), '?handle=', f.handle, '&cache=false&utm_source=google&utm_medium=cpc&variant=', variant_id) AS link
  FROM unique_variant_feed AS f
  LEFT JOIN config.product_type_slug AS slug ON f.product_type = slug.product_type
),

image_1 AS (
  SELECT
    id,
    COALESCE(img.image_url, f.image_url_1) AS image_url
  FROM unique_variant_feed AS f
  LEFT JOIN smartfeeds.product_images_no_background AS img ON img.product_id = CAST(f.product_id AS STRING)
)

SELECT
  f.id,
  f.product_id AS item_group_id,
  st.availability,
  f.etat AS condition,
  f.size,
  f.weight,
  image_1.image_url AS image_link,
  'France' AS shipping_country,
  sl.link,
  f.title_proper AS title,
  f.barcode AS gtin,
  f.google_type AS product_type,
  f.custom_label_0,
  CASE
    WHEN f.product_description IS null THEN '<p>Les prix les moins chers du marché sont sur barooders.com</p><p>Qualité et service garantis</p>'
    WHEN CHAR_LENGTH(f.product_description) >= 5000 THEN SUBSTR(f.product_description, 1, 5000)
    ELSE f.product_description
  END AS description,
  COALESCE(f.brand, 'Barooders') AS brand,
  CONCAT(CASE
    WHEN f.compare_at_price IS NOT null AND f.compare_at_price > f.price THEN f.compare_at_price
    ELSE f.price
  END, ' EUR') AS price,
  CONCAT(CASE
    WHEN f.compare_at_price IS NOT null AND f.compare_at_price > f.price THEN f.price
    ELSE f.price
  END, ' EUR') AS sale_price,
  CONCAT('FR:::', sh.shipping_price, ' EUR') AS shipping,
  ARRAY_TO_STRING([f.image_url_2, f.image_url_3, f.image_url_4, f.image_url_5, f.image_url_6], ',') AS additional_image_link

FROM unique_variant_feed AS f
INNER JOIN stocks AS st ON f.id = st.id
INNER JOIN shipping_price AS sh ON f.id = sh.id
INNER JOIN slugs AS sl ON f.id = sl.id
INNER JOIN config.feed_google_categories AS gcat ON f.product_category = gcat.product_category
INNER JOIN image_1 ON f.id = image_1.id
