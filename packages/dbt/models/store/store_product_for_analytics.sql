{{
    config(
        materialized="incremental", unique_key="id", pre_hook="delete from {{this}}"
    )
}}

WITH
largest_bundle_tax_included_prices AS (
  SELECT
    "productId",
    "unitPriceInCents"
  FROM
    (
      SELECT
        "productId",
        "unitPriceInCents" * 1.2 AS "unitPriceInCents",
        row_number() OVER (
          PARTITION BY "productId" ORDER BY "minQuantity" DESC
        ) AS row_num
      FROM public."BundlePrice"
    ) AS ranked
  WHERE row_num = 1
),

variant_data AS (
  SELECT
    ppv."productId",
    sum(ppv.quantity) AS stock,
    min(ppv.condition) AS condition,
    max(
      CASE
        WHEN
          ppv."compareAtPriceInCents" IS null
          OR ppv."compareAtPriceInCents" = 0
          THEN 0
        WHEN ppv."priceInCents" IS null OR ppv."priceInCents" = 0
          THEN 0
        ELSE
          (
            (
              ppv."compareAtPriceInCents"::float - coalesce(
                lbp."unitPriceInCents", ppv."priceInCents"
              )::float
            )
            / ppv."compareAtPriceInCents"::float
          )
          * 100
      END
    ) AS highest_discount
  FROM public."ProductVariant" AS ppv
  LEFT JOIN
    largest_bundle_tax_included_prices AS lbp ON ppv."productId" = lbp."productId"
  GROUP BY ppv."productId"
),

image_data AS (
  SELECT
    "productId",
    count(*) AS "image_count"
  FROM {{ ref("store_exposed_product_image") }}
  GROUP BY "productId"
),

bikes AS (
  SELECT pc.product_id
  FROM {{ ref("store_product_collection") }} AS pc
  LEFT JOIN {{ ref("store_collection") }} AS c ON pc.collection_id = c.id
  WHERE c.handle = 'velos'
),

favorites AS (
  SELECT
    bp.id,
    count(DISTINCT fp.id) AS favorites_count
  FROM public."FavoriteProducts" AS fp
  LEFT JOIN {{ ref("store_base_product") }} AS bp ON fp."internalProductId" = bp."id"
  GROUP BY bp.id
),

orders AS (
  SELECT
    pv."productId",
    count(DISTINCT ol.id) AS orders_count
  FROM public."OrderLines" AS ol
  INNER JOIN public."ProductVariant" AS pv ON ol."productVariantId" = pv.id
  GROUP BY pv."productId"
  ORDER BY orders_count DESC
),

top_brands_list AS (
  SELECT name FROM strapi.pim_brands WHERE rating = 'TOP'
),

mid_brands_list AS (
  SELECT name FROM strapi.pim_brands WHERE rating = 'MID'
),

exposed_product AS (
  SELECT
    *,
    CASE
      WHEN
        trim(lower(brand))
        IN (SELECT trim(lower(name)) FROM top_brands_list)
        THEN 'TOP'
      WHEN
        trim(lower(brand))
        IN (SELECT trim(lower(name)) FROM mid_brands_list)
        THEN 'MID'
      ELSE 'LOW'
    END AS brand_rating,
    CASE
      WHEN ("modelYear" IS null OR "modelYear" = '')
        THEN 0
      ELSE substring("modelYear" FROM '([0-9]{4})')::int
    END AS model_year
  FROM {{ ref("store_exposed_product") }}
),

product_with_algo_inputs AS (
  SELECT
    bp.id,
    bp."createdAt" AS "created_at",
    bp."vendorId" AS "vendor_id",
    bp."shopifyId" AS "shopify_id",
    (bpp."manualNotation"::text)::dbt."ProductNotation" AS "manual_notation",
    bpp.source,
    bc."overridesProductNotation" AS "vendor_overrides_product_scoring",
    (bc.scoring::text)::dbt."ProductNotation" AS "default_vendor_notation",
    (variant_data.condition::text)::dbt."Condition" AS "condition_from_variants",
    ep.brand,
    ep.size,
    bpp."EANCode" AS "ean_code",
    (ep.brand_rating)::dbt."BrandRating" AS "brand_rating",
    coalesce(bp.id IN (SELECT product_id FROM bikes), false) AS "is_bike",
    coalesce(image_data.image_count, 0) AS "image_count",
    coalesce(variant_data.highest_discount, 0) AS "highest_discount",
    coalesce(variant_data.stock, 0) AS "stock",
    coalesce(
      variant_data.condition::text = 'AS_NEW'
      OR variant_data.condition::text IS null, false
    ) AS is_new,
    coalesce(ep.model_year, 0) AS model_year,
    CASE
      WHEN
        coalesce(ep.model_year, 0) = 0
        AND variant_data.condition::text = 'AS_NEW'
        THEN 2023
      ELSE coalesce(ep.model_year, 0)
    END AS model_year_with_override,
    coalesce(pr.traffic30, 0) AS "views_last_30_days",
    coalesce(favorites.favorites_count, 0) AS favorites_count,
    coalesce(orders.orders_count, 0) AS orders_count

  FROM {{ ref("store_base_product") }} AS bp
  LEFT JOIN exposed_product AS ep ON bp.id = ep.id
  LEFT JOIN public."Product" AS bpp ON bp.id = bpp.id
  LEFT JOIN public."Customer" AS bc ON bp."vendorId" = bc."authUserId"
  LEFT JOIN variant_data ON bp.id = variant_data."productId"
  LEFT JOIN image_data ON bp.id = image_data."productId"
  LEFT JOIN
    biquery_analytics_dbt.sync_products_ranking AS pr
    ON
      bp.id = pr.id
  LEFT JOIN favorites ON bp.id = favorites.id
  LEFT JOIN orders ON bp.id = orders."productId"
),

product_with_sub_notations AS (
  SELECT
    p.*,
    CASE
      WHEN p.vendor_overrides_product_scoring = true
        THEN p.default_vendor_notation
      ELSE null::dbt."ProductNotation"
    END AS "vendor_notation",
    (
      CASE
        WHEN p.is_bike = false
          THEN p.default_vendor_notation
        WHEN p.is_new = true AND p.highest_discount = 0
          THEN 'C'
        WHEN p.is_new = false AND p.image_count = 1
          THEN 'C'
        WHEN p.size IS null
          THEN 'C'

        WHEN
          p.highest_discount = 0
          AND p.is_new = false
          AND p.brand_rating::text = 'TOP'
          THEN 'B'
        WHEN
          p.highest_discount = 0
          AND p.is_new = false
          AND p.brand_rating::text = 'MID'
          THEN 'C'

        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'TOP'
          AND p.highest_discount >= 30
          THEN 'B'
        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'TOP'
          THEN 'C'

        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'MID'
          AND p.highest_discount >= 35
          THEN 'B'
        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'MID'
          THEN 'C'

        WHEN p.model_year_with_override < 2017 AND p.highest_discount >= 35
          THEN 'B'
        WHEN p.model_year_with_override < 2017
          THEN 'C'

        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'TOP'
          AND p.highest_discount >= 30
          THEN 'A'
        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'TOP'
          AND p.highest_discount >= 15
          THEN 'B'
        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'TOP'
          THEN 'C'

        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'MID'
          AND p.highest_discount >= 40
          THEN 'A'
        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'MID'
          AND p.highest_discount >= 20
          THEN 'B'
        WHEN p.model_year_with_override >= 2017 AND p.highest_discount >= 50
          THEN 'B'

        WHEN p.model_year_with_override >= 2017
          THEN 'C'

        ELSE p.default_vendor_notation
      END
    ) AS "calculated_notation",
    (
      CASE
        WHEN p.is_bike = false
          THEN p.default_vendor_notation
        WHEN p.is_new = true AND p.highest_discount = 0
          THEN 'C'
        WHEN p.is_new = false AND p.image_count = 1
          THEN 'C'
        WHEN p.size IS null
          THEN 'C'

        WHEN
          p.highest_discount = 0
          AND p.is_new = false
          AND p.brand_rating::text = 'TOP'
          THEN 'B'
        WHEN
          p.highest_discount = 0
          AND p.is_new = false
          AND p.brand_rating::text = 'MID'
          THEN 'C'

        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'TOP'
          AND p.highest_discount >= 30
          THEN 'B'
        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'TOP'
          THEN 'C'

        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'MID'
          AND p.highest_discount >= 35
          THEN 'B'
        WHEN
          p.model_year_with_override < 2017
          AND p.brand_rating::text = 'MID'
          THEN 'C'

        WHEN p.model_year_with_override < 2017 AND p.highest_discount >= 35
          THEN 'B'
        WHEN p.model_year_with_override < 2017
          THEN 'C'

        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'TOP'
          AND p.highest_discount >= 30
          THEN 'A'
        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'TOP'
          AND p.highest_discount >= 15
          THEN 'B'
        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'TOP'
          THEN 'C'

        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'MID'
          AND p.highest_discount >= 40
          THEN 'A'
        WHEN
          p.model_year_with_override >= 2017
          AND p.brand_rating::text = 'MID'
          AND p.highest_discount >= 20
          THEN 'B'
        WHEN p.model_year_with_override >= 2017 AND p.highest_discount >= 50
          THEN 'B'

        WHEN p.model_year_with_override >= 2017
          THEN 'C'

        ELSE p.default_vendor_notation
      END
    ) AS "calculated_notation_beta"
  FROM product_with_algo_inputs AS p
),

product_with_notation AS (
  SELECT
    *,
    coalesce(
      product_with_sub_notations."manual_notation", -- noqa: RF03, (Qualified reference 'product_with_sub_notations."manual_notation"' found in single table select which is inconsistent with previous references)
      product_with_sub_notations."vendor_notation",
      product_with_sub_notations."calculated_notation"
    ) AS "notation"
  FROM product_with_sub_notations
)

SELECT
  *,
  0.3 * (
    CASE
      WHEN notation = 'A'
        THEN 1000
      WHEN notation = 'B'
        THEN 800
      WHEN notation = 'C'
        THEN 400
      ELSE 0
    END
  )
  + 0.3
  * (
    CASE
      WHEN orders_count * 10 + favorites_count > 50
        THEN 1000
      WHEN orders_count * 10 + favorites_count > 10
        THEN 800
      WHEN orders_count * 10 + favorites_count > 5
        THEN 700
      WHEN orders_count * 10 + favorites_count > 1
        THEN 400
      ELSE 0
    END
  )
  + 0.25
  * (
    CASE
      WHEN current_date::date - created_at::date <= 7
        THEN 1000
      WHEN current_date::date - created_at::date <= 30
        THEN 600
      WHEN current_date::date - created_at::date <= 60
        THEN 300
      ELSE 100
    END
  )
  + 0.15
  * (
    CASE
      WHEN views_last_30_days > 200
        THEN 1000
      WHEN views_last_30_days > 100
        THEN 800
      WHEN views_last_30_days > 50
        THEN 600
      WHEN views_last_30_days > 10
        THEN 500
      WHEN views_last_30_days > 5
        THEN 400
      WHEN views_last_30_days > 1
        THEN 200
      ELSE 0
    END
  ) AS "calculated_scoring",
  round(
    0.3 * (
      CASE
        WHEN brand_rating::text = 'TOP'
          THEN 1000
        WHEN brand_rating::text = 'MID'
          THEN 500
        ELSE 0
      END
    )
    + 0.15
    * (
      CASE
        WHEN date_part('year', current_date) - model_year_with_override > 5
          THEN 0
        ELSE
          (
            1000
            - (date_part('year', current_date) - model_year_with_override)
            * 200
          )
      END
    )
    + 0.3
    * (
      CASE
        WHEN highest_discount >= 60
          THEN 1000
        WHEN highest_discount <= 20
          THEN 0
        ELSE highest_discount * 20 - 200
      END
    )
    + 0.3 * (CASE WHEN stock > 20 THEN 1000 ELSE 50 * stock END)
    + 0.15
    * (
      CASE
        WHEN current_date::date - created_at::date <= 7
          THEN 1000
        WHEN current_date::date - created_at::date <= 30
          THEN 600
        WHEN current_date::date - created_at::date <= 60
          THEN 300
        ELSE 100
      END
    )
  ) AS "calculated_b2b_scoring"
FROM product_with_notation
