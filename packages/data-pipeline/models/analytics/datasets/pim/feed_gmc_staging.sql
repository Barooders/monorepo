{{ config(materialized='table') }}

with images_feed as (
SELECT
    i1.product_id,
    i1.src as image_url_1,
    i2.src as image_url_2,
    i3.src as image_url_3,
    i4.src as image_url_4,
    i5.src as image_url_5,
    i6.src as image_url_6,
    from (select src, product_id from shopify.product_image where position = 1) as i1
    left join (select src, product_id from shopify.product_image where position = 2) as i2 on i2.product_id = i1.product_id
    left join (select src, product_id from shopify.product_image where position = 3) as i3 on i3.product_id = i1.product_id
    left join (select src, product_id from shopify.product_image where position = 4) as i4 on i4.product_id = i1.product_id
    left join (select src, product_id from shopify.product_image where position = 5) as i5 on i5.product_id = i1.product_id
    left join (select src, product_id from shopify.product_image where position = 6) as i6 on i6.product_id = i1.product_id
),
feed_gmc as (
    SELECT
        p.merchant_item_id as product_id,
        v.merchant_item_id as variant_id,
        v.internal_id as variant_internal_id,
        p.title as product_title,
        case when v.title = 'Default Title' then null else v.title end as variant_title,
        p.product_type as product_type,
        bc.universe,
        bc.product_category,
        concat(bc.universe, " > ", bc.product_category, " > ", bc.product_type, " > ", p.brand) as google_type,
        p.handle as handle,
        v.option_1 as option_1,
        v.option_2 as option_2,
        v.option_3 as option_3,
        p.vendor as vendor,
        p.tags as tags,
        case
            when c.isrefurbisher is true then 'Refurbished'
            when p.etat in ('Très bon état', 'Bon état') then 'Used'
            when p.etat = 'Neuf' then 'New'
            else 'Used'
            end as etat,
        case when p.modele is null then ARRAY_TO_STRING([initcap(p.brand), p.modele, upper(p.size), p.etat], " | ") else p.title end as title_proper,
        case when p.modele is null then 0 else 1 end as has_modele,
        DATE_DIFF(current_date(), p.creation_date, day) as age,
        b.ean_code as barcode,
        v.price as product_price,
        v.inventory_quantity as inventory_quantity,
        p.creation_date as published_at,
        v.creation_date as created_at,
        p.body_html as product_description,
        p.status as product_status,
        i.image_url_1 as image_url_1,
        i.image_url_2 as image_url_2,
        i.image_url_3 as image_url_3,
        i.image_url_4 as image_url_4,
        i.image_url_5 as image_url_5,
        i.image_url_6 as image_url_6,
        concat("https://barooders.com/products/", p.handle) as product_url,
        concat("https://barooders.com/products/", p.handle, "?variant=", v.internal_id) as variant_url,
        v.compare_at_price as compare_at_price,
        v.price as price,
        v.grams / 1000 as weight,
        v.inventory_quantity as inventory_value,
        v.requires_shipping as requires_shipping,
        "kg" as weight_unit,
        p.brand as brand,
        p.scoring,
        CEIL((
          CASE
            WHEN v.price < 200 THEN 0.09 * v.price + 1
            WHEN v.price < 500 THEN 0.08 * v.price + 1
            WHEN v.price < 1000 THEN 0.06 * v.price + 11
            WHEN v.price < 2000 THEN 0.03 * v.price + 41
            WHEN v.price < 3000 THEN 0.02 * v.price + 61
            ELSE 0.01 * v.price + 91
          END
        ) * c.buyercommissionrate) / 100 AS commission_price,
        dp.discount_title,
        case when c.buyercommissionrate < 100 then true else false end as new_commission

    FROM {{ref('dim_product')}} as p
    left JOIN {{ref('dim_product_variant')}} as v on v.product_internal_id = p.internal_id
    left JOIN images_feed as i on i.product_id = p.shopify_id
    left JOIN backend__dbt.store_product_for_analytics as b on b.id = p.internal_id
    left JOIN backend__dbt.store_discount_product as dp on dp.product_id = p.internal_id
    left JOIN {{ref('breadcrumbs')}} as bc on bc.product_type = p.product_type
    JOIN snapshots.catalog_snapshot_variants as snap on snap.variant_id = cast(v.shopify_id as string) and snap.date = date_sub(current_date, interval 1 day)
    left join backend__public.Customer as c on c.authUserId = p.vendor_id

    where
        ((p.status = 'active' and v.inventory_quantity > 0) or (snap.quantity > 0))
        AND p.vendor != 'Commission'
        AND not (bc.universe = "Vélo | VTT" AND bc.product_category = "Vélos" AND p.etat = "Bon état")
        AND not (bc.product_category != "Vélos" AND p.scoring = "C")
        AND not (p.owner = 'c2c' and DATE_DIFF(current_date(), p.creation_date, day) > 14)
        AND not (p.vendor not in ('Tubike', 'MVélos', 'TBike', 'TNC', 'EBSolutions', 'Darosa') and DATE_DIFF(current_date(), p.creation_date, day) > 56)
)

SELECT * from feed_gmc
