{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

WITH variant_data AS (
    SELECT
        bpv."productId",
        min(epv.condition) condition,
        max(
            CASE
                WHEN epv."compareAtPrice" IS NULL OR epv."compareAtPrice" = 0 THEN 0
                WHEN epv.price IS NULL OR epv.price = 0 THEN 0
                ELSE ((epv."compareAtPrice" - epv.price) / epv."compareAtPrice") * 100
            END
        ) AS highest_discount
    FROM {{ref('store_exposed_product_variant')}} epv
    LEFT JOIN {{ref('store_base_product_variant')}} bpv ON bpv."shopify_id"=epv."shopify_id"
    GROUP BY bpv."productId"
), image_data AS (
    SELECT
        "productId",
        COUNT(*) AS "image_count"
    FROM {{ref('store_exposed_product_image')}}
    GROUP BY "productId"
), bikes AS (
    SELECT pc.product_id
    FROM {{ref('store_product_collection')}} pc
    LEFT JOIN {{ref('store_collection')}} c ON pc.collection_id=c.id
    WHERE c.handle='velos'
), favorites AS (
    SELECT
        count(distinct fp.id) AS favorites_count,
        bp.id
    FROM public."FavoriteProducts" fp
    LEFT JOIN {{ref('store_base_product')}} bp ON bp."shopifyId" = fp."productId"
    GROUP BY bp.id
), orders AS (
    SELECT
        count(distinct ol.id) AS orders_count,
        pv."productId"
    FROM public."OrderLines" ol
    JOIN public."ProductVariant" pv on ol."productVariantId" = pv.id
    group by pv."productId"
    order by orders_count desc
), top_brands_list AS (
    SELECT name FROM fivetran_strapi_public.pim_brands WHERE rating = 'TOP'
), mid_brands_list AS (
    SELECT name FROM fivetran_strapi_public.pim_brands WHERE rating = 'MID'
), exposed_product AS (
    SELECT
        *,
        CASE
            WHEN TRIM(LOWER(brand)) IN (SELECT TRIM(LOWER(name)) FROM top_brands_list) THEN 'TOP'
            WHEN TRIM(LOWER(brand)) IN (SELECT TRIM(LOWER(name)) FROM mid_brands_list) THEN 'MID'
            ELSE 'LOW'
        END AS brand_rating,
        CASE
            WHEN ("modelYear" IS NULL OR "modelYear" = '') THEN 0
            ELSE SUBSTRING("modelYear" FROM '([0-9]{4})')::int
        END AS model_year
    FROM {{ref('store_exposed_product')}} ep
), product_with_algo_inputs AS (
    SELECT
        bp.id AS id,
        bp."createdAt" AS "created_at",
        bp."vendorId" AS "vendor_id",
        bp."shopifyId" AS "shopify_id",
        CAST(bpp."manualNotation"::TEXT AS dbt."ProductNotation") AS "manual_notation",
        bpp.source AS source,
        bc."overridesProductNotation" AS "vendor_overrides_product_scoring",
        CAST(bc.scoring::TEXT AS dbt."ProductNotation") AS "default_vendor_notation",
        CASE
            WHEN bp.id IN (SELECT product_id FROM bikes) THEN TRUE
            ELSE FALSE
        END AS "is_bike",
        COALESCE(image_data.image_count,0) AS "image_count",
        COALESCE(variant_data.highest_discount,0) AS "highest_discount",
        CAST(variant_data.condition::TEXT AS dbt."Condition") AS "condition_from_variants",
        CASE
            WHEN variant_data.condition::TEXT='AS_NEW' OR variant_data.condition::TEXT IS NULL THEN TRUE
            ELSE FALSE
        END AS is_new,
        ep.brand AS brand,
        ep.size AS size,
        COALESCE(ep.model_year, 0) AS model_year,
        CASE
            WHEN COALESCE(ep.model_year, 0) = 0 AND variant_data.condition::TEXT='AS_NEW' THEN 2023
            ELSE COALESCE(ep.model_year, 0)
        END AS model_year_with_override,
        CAST(ep.brand_rating AS dbt."BrandRating") AS "brand_rating",
        COALESCE(pr.traffic30,0) AS "views_last_30_days",
        bpp."EANCode" AS "ean_code",
        COALESCE(favorites.favorites_count, 0) AS favorites_count,
        COALESCE(orders.orders_count, 0) AS orders_count
    
    FROM {{ref('store_base_product')}} bp
    LEFT JOIN exposed_product ep ON ep.id = bp.id
    LEFT JOIN public."Product" bpp ON bpp.id = bp.id
    LEFT JOIN public."Customer" bc ON bc."authUserId"=bp."vendorId"
    LEFT JOIN variant_data ON variant_data."productId" = bp.id
    LEFT JOIN image_data ON image_data."productId" = bp.id
    LEFT JOIN biquery_analytics_dbt.products_ranking pr ON pr.id = bp.id AND pr._fivetran_deleted=FALSE
    LEFT JOIN favorites on favorites.id = bp.id
    LEFT JOIN orders on orders."productId" = bp.id
), product_with_sub_notations AS (
    SELECT
        p.*,
        CASE
            WHEN p.vendor_overrides_product_scoring=TRUE THEN p.default_vendor_notation
            ELSE CAST(NULL AS dbt."ProductNotation")
        END AS "vendor_notation",
        (
            CASE
                WHEN p.is_bike=FALSE THEN p.default_vendor_notation
                WHEN p.is_new=TRUE AND p.highest_discount=0 THEN 'C'
                WHEN p.is_new=FALSE AND p.image_count=1 THEN 'C'
                WHEN p.size IS NULL THEN 'C'

                WHEN p.highest_discount = 0 AND p.is_new=FALSE AND p.brand_rating::TEXT = 'TOP' THEN 'B'
                WHEN p.highest_discount = 0 AND p.is_new=FALSE AND p.brand_rating::TEXT = 'MID' THEN 'C'

                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='TOP' AND p.highest_discount >= 30 THEN 'B'
                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='TOP' THEN 'C'

                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='MID' AND p.highest_discount >= 35 THEN 'B'
                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='MID' THEN 'C'

                WHEN p.model_year_with_override < 2017 AND p.highest_discount >= 35 THEN 'B'
                WHEN p.model_year_with_override < 2017 THEN 'C'

                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='TOP' AND p.highest_discount >= 30 THEN 'A'
                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='TOP' AND p.highest_discount >= 15 THEN 'B'
                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='TOP' THEN 'C'

                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='MID' AND p.highest_discount >= 40 THEN 'A'
                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='MID' AND p.highest_discount >= 20 THEN 'B'
                WHEN p.model_year_with_override >= 2017 AND p.highest_discount >= 50 THEN 'B'

                WHEN p.model_year_with_override >= 2017 THEN 'C'

                ELSE p.default_vendor_notation
            END
        ) AS "calculated_notation",
        (
            CASE
                WHEN p.is_bike=FALSE THEN p.default_vendor_notation
                WHEN p.is_new=TRUE AND p.highest_discount=0 THEN 'C'
                WHEN p.is_new=FALSE AND p.image_count=1 THEN 'C'
                WHEN p.size IS NULL THEN 'C'

                WHEN p.highest_discount = 0 AND p.is_new=FALSE AND p.brand_rating::TEXT = 'TOP' THEN 'B'
                WHEN p.highest_discount = 0 AND p.is_new=FALSE AND p.brand_rating::TEXT = 'MID' THEN 'C'

                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='TOP' AND p.highest_discount >= 30 THEN 'B'
                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='TOP' THEN 'C'

                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='MID' AND p.highest_discount >= 35 THEN 'B'
                WHEN p.model_year_with_override < 2017 AND p.brand_rating::TEXT='MID' THEN 'C'

                WHEN p.model_year_with_override < 2017 AND p.highest_discount >= 35 THEN 'B'
                WHEN p.model_year_with_override < 2017 THEN 'C'

                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='TOP' AND p.highest_discount >= 30 THEN 'A'
                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='TOP' AND p.highest_discount >= 15 THEN 'B'
                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='TOP' THEN 'C'

                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='MID' AND p.highest_discount >= 40 THEN 'A'
                WHEN p.model_year_with_override >= 2017 AND p.brand_rating::TEXT='MID' AND p.highest_discount >= 20 THEN 'B'
                WHEN p.model_year_with_override >= 2017 AND p.highest_discount >= 50 THEN 'B'

                WHEN p.model_year_with_override >= 2017 THEN 'C'

                ELSE p.default_vendor_notation
            END
        ) AS "calculated_notation_beta"
    FROM product_with_algo_inputs AS p
), product_with_notation AS (
    SELECT
        *,
        COALESCE(
            product_with_sub_notations."manual_notation",
            product_with_sub_notations."vendor_notation",
            product_with_sub_notations."calculated_notation"
        ) AS "notation"
    FROM product_with_sub_notations
)

SELECT
    *,
    0.3 * (
    CASE
        WHEN notation='A' THEN 1000
        WHEN notation='B' THEN 800
        WHEN notation='C' THEN 400
        ELSE 0
    END
    )
    + 0.3 * (
        CASE
            WHEN orders_count*10 + favorites_count > 50 THEN 1000
            WHEN orders_count*10 + favorites_count > 10 THEN 800
            WHEN orders_count*10 + favorites_count > 5 THEN 700
            WHEN orders_count*10 + favorites_count > 1 THEN 400
            ELSE 0
        END
    )
    + 0.25 * (
        CASE
            WHEN CAST(CURRENT_DATE AS DATE) - CAST(created_at AS DATE) <= 7 THEN 1000
            WHEN CAST(CURRENT_DATE AS DATE) - CAST(created_at AS DATE) <= 30 THEN 600
            WHEN CAST(CURRENT_DATE AS DATE) - CAST(created_at AS DATE) <= 60 THEN 300
            ELSE 100
        END
    )
    + 0.15 * (
        CASE
            WHEN views_last_30_days > 200 then 1000
            WHEN views_last_30_days > 100 then 800
            WHEN views_last_30_days > 50 then 600
            WHEN views_last_30_days > 10 then 500
            WHEN views_last_30_days > 5 then 400
            WHEN views_last_30_days > 1 then 200
            ELSE 0
        END
    ) AS "calculated_scoring"
FROM product_with_notation
