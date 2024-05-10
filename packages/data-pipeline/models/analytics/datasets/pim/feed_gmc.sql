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
    p.size,
    null AS barcode,
    v.price AS product_price,
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
    v.requires_shipping,
    'kg' AS weight_unit,
    p.brand,
    p.scoring,
    dp.discount_title,
    CASE WHEN v.title = 'Default Title' THEN null ELSE v.title END AS variant_title,
    concat(bc.universe, ' > ', bc.product_category, ' > ', bc.product_type, ' > ', p.brand) AS google_type,
    CASE
      WHEN c.isrefurbisher IS true AND p.etat IN ('Très bon état', 'Bon état') THEN 'refurbished'
      WHEN p.etat = 'Neuf' THEN 'new'
      ELSE 'used'
    END AS etat,
    CASE
      WHEN p.modele IS NOT null AND etat != 'Neuf' THEN array_to_string([initcap(p.brand), p.modele, upper(p.size), p.etat], ' | ')
      WHEN p.modele IS NOT null AND etat = 'Neuf' THEN array_to_string([initcap(p.brand), p.modele, upper(p.size)], ' | ')
      ELSE p.title
    END AS title_proper,
    CASE WHEN p.modele IS null THEN 0 ELSE 1 END AS has_modele,
    date_diff(current_date(), p.creation_date, DAY) AS age,
    CASE WHEN p.status = 'active' THEN v.inventory_quantity ELSE 0 END AS inventory_quantity,
    concat('https://barooders.com/products/', p.handle) AS product_url,
    concat('https://barooders.com/products/', p.handle, '?variant=', v.id) AS variant_url,
    v.grams / 1000 AS weight,
    CASE WHEN p.status = 'active' THEN v.inventory_quantity ELSE 0 END AS inventory_value,
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
    c.forcedshippingpriceincents / 100 AS forced_shipping_price,
    coalesce(c.buyercommissionrate < 100, false) AS new_commission,
    CASE
      --SKI
      --when variable.Skisdynamic and safe_divide(perfsByBrand.ca,perfsByBrand.cost) > 2 then "Top Brand ski"
      --when variable.Skisdynamic and safe_divide(perfsByBrand.ca,perfsByBrand.cost) < 1 then "Low Brand ski"
      --when variable.Skisdynamic then "Medium Brand ski"
      WHEN bc.universe = 'Ski | Snow' AND bc.product_category IN ('Matériel', 'Chaussures', 'Accessoires') THEN 'Top Brand ski' -- en attendant d'avoir configuré perfs dynamiques avec channable x Gads

      --Vélo
      WHEN date_diff(current_date(), p.creation_date, DAY) <= 7 AND p.scoring IN ('A', 'B') AND bc.product_category = 'Vélos' THEN 'New product'
      WHEN p.scoring = 'A' AND p.product_type IN ('VTT', 'VTT électriques', 'Cyclocross', 'BMX', 'Vélos de trekking', 'Vélos de voyage et trekking électriques') THEN 'A VTT VTC'
      WHEN p.scoring = 'A' AND p.product_type IN ('Vélos de course', 'Vélos de triathlon', 'Gravel', 'Vélos de route', 'Vélos de route électriques', 'Vélos de contre la montre', 'Cyclocross', 'Gravel électriques') THEN 'A route gravel'

      WHEN p.scoring = 'B' AND p.product_type IN ('VTT', 'VTT électriques', 'Cyclocross', 'BMX', 'Vélos de trekking', 'Vélos de voyage et trekking électriques') THEN 'B VTT VTC'
      WHEN p.scoring = 'B' AND p.product_type IN ('Vélos de course', 'Vélos de triathlon', 'Gravel', 'Vélos de route', 'Vélos de route électriques', 'Vélos de contre la montre', 'Cyclocross', 'Gravel électriques') THEN 'B route gravel'

      WHEN p.scoring IN ('A', 'B') AND p.product_type IN ('VTC', 'VTC électriques', 'Vélos de ville électriques', 'Vélos électriques', 'Vélos vintage', 'Vélos enfant', 'Vélos urbains et hollandais', 'Vélos pliants', 'Vélos longtail', 'Vélos cargo', 'Fixie et Single Speed') THEN 'A B vélos ville'

      WHEN p.scoring = 'C' AND p.product_type IN ('VTT', 'VTT électriques', 'Cyclocross', 'BMX', 'Vélos de trekking', 'Vélos de voyage et trekking électriques') THEN 'C VTT VTC'
      WHEN p.scoring = 'C' AND p.product_type IN ('Vélos de course', 'Vélos de triathlon', 'Gravel', 'Vélos de route', 'Vélos de route électriques', 'Vélos de contre la montre', 'Cyclocross', 'Gravel électriques') THEN 'C route gravel'
      WHEN p.scoring = 'C' AND p.product_type IN ('VTC', 'VTC électriques', 'Vélos de ville électriques', 'Vélos électriques', 'Vélos vintage', 'Vélos enfant', 'Vélos urbains et hollandais', 'Vélos pliants', 'Vélos longtail', 'Vélos cargo', 'Fixie et Single Speed') THEN 'C vélos ville'

      --Autres
      WHEN p.scoring = 'A' THEN 'top vendeurs'
      WHEN b.brand_rating = 'TOP' THEN 'top brand'
      WHEN b.brand_rating = 'MID' THEN 'medium brand'

      ELSE 'low brand'

    END AS custom_label_0


  FROM {{ ref('dim_product') }} AS p
  LEFT JOIN {{ ref('dim_product_variant') }} AS v ON p.id = v.product_id
  LEFT JOIN images_feed AS i ON p.id = i.product_id
  LEFT JOIN barooders_backend_dbt.store_product_for_analytics AS b ON p.id = b.shopify_id
  LEFT JOIN barooders_backend_dbt.store_discount_product AS dp ON p.internal_id = dp.product_id
  LEFT JOIN {{ ref('breadcrumbs') }} AS bc ON p.product_type = bc.product_type
  LEFT JOIN snapshots.catalog_snapshot_variants AS snap ON snap.variant_id = cast(v.id AS string) AND snap.date = date_sub(current_date, INTERVAL 1 DAY)
  LEFT JOIN barooders_backend_public.customer AS c ON cast(c.shopifyid AS string) = cast(p.vendor_id AS string)
  LEFT JOIN barooders_backend_public.productsaleschannel ON p.internal_id = productsaleschannel.productid
  WHERE
    (
      (p.status = 'active' AND v.inventory_quantity > 0)
      OR (snap.quantity > 0)
    )
    AND productsaleschannel.saleschannelname = 'PUBLIC'
    AND p.vendor != 'Commission'
    AND NOT (bc.universe = 'Vélo | VTT' AND bc.product_category = 'Vélos' AND p.etat = 'Bon état' AND p.owner = 'c2c')
    AND NOT (bc.product_category != 'Vélos' AND p.scoring = 'C')
    AND NOT (p.owner = 'c2c' AND date_diff(current_date(), p.creation_date, DAY) > 28)
    AND NOT (p.vendor NOT IN ('Tubike', 'MVélos', 'TBike', 'TNC', 'EBSolutions', 'Darosa', 'LinkBike', 'Cyclable G', 'Cyclable M', 'Bonnieux Bikes', 'BICIRIO', 'Free', 'Cyclesaveyron') AND bc.universe = 'Vélo | VTT' AND bc.product_category = 'Vélos' AND date_diff(current_date(), p.creation_date, DAY) > 56)
)

SELECT * FROM feed_gmc
