{{ config(materialized='table') }}

WITH images_feed AS (
  SELECT
    i1.product_id,
    i1.src AS image_url_1,
    i2.src AS image_url_2,
    i3.src AS image_url_3,
    i4.src AS image_url_4,
    i5.src AS image_url_5,
    i6.src AS image_url_6
  FROM (SELECT
    src,
    product_id
  FROM shopify.product_image WHERE position = 1) AS i1
  LEFT JOIN (SELECT
    src,
    product_id
  FROM shopify.product_image WHERE position = 2) AS i2 ON i1.product_id = i2.product_id
  LEFT JOIN (SELECT
    src,
    product_id
  FROM shopify.product_image WHERE position = 3) AS i3 ON i1.product_id = i3.product_id
  LEFT JOIN (SELECT
    src,
    product_id
  FROM shopify.product_image WHERE position = 4) AS i4 ON i1.product_id = i4.product_id
  LEFT JOIN (SELECT
    src,
    product_id
  FROM shopify.product_image WHERE position = 5) AS i5 ON i1.product_id = i5.product_id
  LEFT JOIN (SELECT
    src,
    product_id
  FROM shopify.product_image WHERE position = 6) AS i6 ON i1.product_id = i6.product_id
),

feed_gmc AS (
  SELECT
    p.id AS product_id,
    v.id AS variant_id,
    p.title AS product_title,
    p.product_type,
    bc.universe,
    bc.product_category,
    p.handle,
    v.option_1,
    v.option_2,
    v.option_3,
    p.vendor,
    p.tags,
    b.ean_code AS barcode,
    v.price AS product_price,
    v.inventory_quantity,
    p.creation_date AS published_at,
    v.creation_date AS created_at,
    p.body_html AS product_description,
    p.status AS product_status,
    i.image_url_1,
    i.image_url_2,
    i.image_url_3,
    i.image_url_4,
    i.image_url_5,
    i.image_url_6,
    v.compare_at_price,
    v.price,
    v.inventory_quantity AS inventory_value,
    v.requires_shipping,
    'kg' AS weight_unit,
    p.brand,
    p.scoring,
    dp.discount_title,
    CASE WHEN v.title = 'Default Title' THEN null ELSE v.title END AS variant_title,
    concat(bc.universe, ' > ', bc.product_category, ' > ', bc.product_type, ' > ', p.brand) AS google_type,
    CASE
      WHEN c.isrefurbisher IS true THEN 'Refurbished'
      WHEN p.etat IN ('Très bon état', 'Bon état') THEN 'Used'
      WHEN p.etat = 'Neuf' THEN 'New'
      ELSE 'Used'
    END AS etat,
    CASE WHEN p.modele IS null THEN array_to_string([initcap(p.brand), p.modele, upper(p.size), p.etat], ' | ') ELSE p.title END AS title_proper,
    CASE WHEN p.modele IS null THEN 0 ELSE 1 END AS has_modele,
    date_diff(current_date(), p.creation_date, DAY) AS age,
    concat('https://barooders.com/products/', p.handle) AS product_url,
    concat('https://barooders.com/products/', p.handle, '?variant=', v.id) AS variant_url,
    v.grams / 1000 AS weight,
    ceil((
      CASE
        WHEN v.price < 200 THEN 0.09 * v.price + 1
        WHEN v.price < 500 THEN 0.08 * v.price + 1
        WHEN v.price < 1000 THEN 0.06 * v.price + 11
        WHEN v.price < 2000 THEN 0.03 * v.price + 41
        WHEN v.price < 3000 THEN 0.02 * v.price + 61
        ELSE 0.01 * v.price + 91
      END
    ) * c.buyercommissionrate) / 100 AS commission_price,
    coalesce(c.buyercommissionrate < 100, false) AS new_commission

  FROM {{ ref('dim_product') }} AS p
  LEFT JOIN {{ ref('dim_product_variant') }} AS v ON p.id = v.product_id
  LEFT JOIN images_feed AS i ON p.id = i.product_id
  LEFT JOIN barooders_backend_dbt.store_product_for_analytics AS b ON p.id = b.shopify_id
  LEFT JOIN barooders_backend_dbt.store_discount_product AS dp ON p.internal_id = dp.product_id
  LEFT JOIN {{ ref('breadcrumbs') }} AS bc ON p.product_type = bc.product_type
  INNER JOIN snapshots.catalog_snapshot_variants AS snap ON snap.variant_id = cast(v.id AS string) AND snap.date = date_sub(current_date, INTERVAL 1 DAY)
  LEFT JOIN barooders_backend_public.customer AS c ON cast(c.shopifyid AS string) = cast(p.vendor_id AS string)

  WHERE
    ((p.status = 'active' AND v.inventory_quantity > 0) OR (snap.quantity > 0))
    AND p.vendor != 'Commission'
    AND NOT (bc.universe = 'Vélo | VTT' AND bc.product_category = 'Vélos' AND p.etat = 'Bon état')
    AND NOT (bc.product_category != 'Vélos' AND p.scoring = 'C')
    AND NOT (p.owner = 'c2c' AND date_diff(current_date(), p.creation_date, DAY) > 14)
    AND NOT (p.vendor NOT IN ('Tubike', 'MVélos', 'TBike', 'TNC', 'EBSolutions', 'Darosa') AND date_diff(current_date(), p.creation_date, DAY) > 56)
)

SELECT * FROM feed_gmc
