{{
    config(
        materialized="incremental", unique_key="id", pre_hook="delete from {{this}}"
    )
}}

with
    largest_bundle_tax_included_prices as (
        select "productId", "unitPriceInCents"
        from
            (
                select
                    "productId",
                    "unitPriceInCents" * 1.2 as "unitPriceInCents",
                    row_number() over (
                        partition by "productId" order by "minQuantity" desc
                    ) as row_num
                from public."BundlePrice"
            ) as ranked
        where row_num = 1
    ),
    variant_data as (
        select
            ppv."productId",
            sum(ppv.quantity) as stock,
            min(ppv.condition) as condition,
            max(
                case
                    when
                        ppv."compareAtPriceInCents" is null
                        or ppv."compareAtPriceInCents" = 0
                    then 0
                    when ppv."priceInCents" is null or ppv."priceInCents" = 0
                    then 0
                    else
                        (
                            (
                                ppv."compareAtPriceInCents"::float - coalesce(
                                    lbp."unitPriceInCents", ppv."priceInCents"
                                )::float
                            )
                            / ppv."compareAtPriceInCents"::float
                        )
                        * 100
                end
            ) as highest_discount
        from public."ProductVariant" ppv
        left join
            largest_bundle_tax_included_prices lbp on lbp."productId" = ppv."productId"
        group by ppv."productId"
    ),
    image_data as (
        select "productId", count(*) as "image_count"
        from {{ ref("store_exposed_product_image") }}
        group by "productId"
    ),
    bikes as (
        select pc.product_id
        from {{ ref("store_product_collection") }} pc
        left join {{ ref("store_collection") }} c on pc.collection_id = c.id
        where c.handle = 'velos'
    ),
    favorites as (
        select count(distinct fp.id) as favorites_count, bp.id
        from public."FavoriteProducts" fp
        left join {{ ref("store_base_product") }} bp on bp."shopifyId" = fp."productId"
        group by bp.id
    ),
    orders as (
        select count(distinct ol.id) as orders_count, pv."productId"
        from public."OrderLines" ol
        join public."ProductVariant" pv on ol."productVariantId" = pv.id
        group by pv."productId"
        order by orders_count desc
    ),
    top_brands_list as (
        select name from fivetran_strapi_public.pim_brands where rating = 'TOP'
    ),
    mid_brands_list as (
        select name from fivetran_strapi_public.pim_brands where rating = 'MID'
    ),
    exposed_product as (
        select
            *,
            case
                when
                    trim(lower(brand))
                    in (select trim(lower(name)) from top_brands_list)
                then 'TOP'
                when
                    trim(lower(brand))
                    in (select trim(lower(name)) from mid_brands_list)
                then 'MID'
                else 'LOW'
            end as brand_rating,
            case
                when ("modelYear" is null or "modelYear" = '')
                then 0
                else substring("modelYear" from '([0-9]{4})')::int
            end as model_year
        from {{ ref("store_exposed_product") }} ep
    ),
    product_with_algo_inputs as (
        select
            bp.id as id,
            bp."createdAt" as "created_at",
            bp."vendorId" as "vendor_id",
            bp."shopifyId" as "shopify_id",
            cast(
                bpp."manualNotation"::text as dbt."ProductNotation"
            ) as "manual_notation",
            bpp.source as source,
            bc."overridesProductNotation" as "vendor_overrides_product_scoring",
            cast(
                bc.scoring::text as dbt."ProductNotation"
            ) as "default_vendor_notation",
            case
                when bp.id in (select product_id from bikes) then true else false
            end as "is_bike",
            coalesce(image_data.image_count, 0) as "image_count",
            coalesce(variant_data.highest_discount, 0) as "highest_discount",
            cast(
                variant_data.condition::text as dbt."Condition"
            ) as "condition_from_variants",
            coalesce(variant_data.stock, 0) as "stock",
            case
                when
                    variant_data.condition::text = 'AS_NEW'
                    or variant_data.condition::text is null
                then true
                else false
            end as is_new,
            ep.brand as brand,
            ep.size as size,
            coalesce(ep.model_year, 0) as model_year,
            case
                when
                    coalesce(ep.model_year, 0) = 0
                    and variant_data.condition::text = 'AS_NEW'
                then 2023
                else coalesce(ep.model_year, 0)
            end as model_year_with_override,
            cast(ep.brand_rating as dbt."BrandRating") as "brand_rating",
            coalesce(pr.traffic30, 0) as "views_last_30_days",
            bpp."EANCode" as "ean_code",
            coalesce(favorites.favorites_count, 0) as favorites_count,
            coalesce(orders.orders_count, 0) as orders_count

        from {{ ref("store_base_product") }} bp
        left join exposed_product ep on ep.id = bp.id
        left join public."Product" bpp on bpp.id = bp.id
        left join public."Customer" bc on bc."authUserId" = bp."vendorId"
        left join variant_data on variant_data."productId" = bp.id
        left join image_data on image_data."productId" = bp.id
        left join
            biquery_analytics_dbt.products_ranking pr
            on pr.id = bp.id
            and pr._fivetran_deleted = false
        left join favorites on favorites.id = bp.id
        left join orders on orders."productId" = bp.id
    ),
    product_with_sub_notations as (
        select
            p.*,
            case
                when p.vendor_overrides_product_scoring = true
                then p.default_vendor_notation
                else cast(null as dbt."ProductNotation")
            end as "vendor_notation",
            (
                case
                    when p.is_bike = false
                    then p.default_vendor_notation
                    when p.is_new = true and p.highest_discount = 0
                    then 'C'
                    when p.is_new = false and p.image_count = 1
                    then 'C'
                    when p.size is null
                    then 'C'

                    when
                        p.highest_discount = 0
                        and p.is_new = false
                        and p.brand_rating::text = 'TOP'
                    then 'B'
                    when
                        p.highest_discount = 0
                        and p.is_new = false
                        and p.brand_rating::text = 'MID'
                    then 'C'

                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'TOP'
                        and p.highest_discount >= 30
                    then 'B'
                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'TOP'
                    then 'C'

                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'MID'
                        and p.highest_discount >= 35
                    then 'B'
                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'MID'
                    then 'C'

                    when p.model_year_with_override < 2017 and p.highest_discount >= 35
                    then 'B'
                    when p.model_year_with_override < 2017
                    then 'C'

                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'TOP'
                        and p.highest_discount >= 30
                    then 'A'
                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'TOP'
                        and p.highest_discount >= 15
                    then 'B'
                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'TOP'
                    then 'C'

                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'MID'
                        and p.highest_discount >= 40
                    then 'A'
                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'MID'
                        and p.highest_discount >= 20
                    then 'B'
                    when p.model_year_with_override >= 2017 and p.highest_discount >= 50
                    then 'B'

                    when p.model_year_with_override >= 2017
                    then 'C'

                    else p.default_vendor_notation
                end
            ) as "calculated_notation",
            (
                case
                    when p.is_bike = false
                    then p.default_vendor_notation
                    when p.is_new = true and p.highest_discount = 0
                    then 'C'
                    when p.is_new = false and p.image_count = 1
                    then 'C'
                    when p.size is null
                    then 'C'

                    when
                        p.highest_discount = 0
                        and p.is_new = false
                        and p.brand_rating::text = 'TOP'
                    then 'B'
                    when
                        p.highest_discount = 0
                        and p.is_new = false
                        and p.brand_rating::text = 'MID'
                    then 'C'

                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'TOP'
                        and p.highest_discount >= 30
                    then 'B'
                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'TOP'
                    then 'C'

                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'MID'
                        and p.highest_discount >= 35
                    then 'B'
                    when
                        p.model_year_with_override < 2017
                        and p.brand_rating::text = 'MID'
                    then 'C'

                    when p.model_year_with_override < 2017 and p.highest_discount >= 35
                    then 'B'
                    when p.model_year_with_override < 2017
                    then 'C'

                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'TOP'
                        and p.highest_discount >= 30
                    then 'A'
                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'TOP'
                        and p.highest_discount >= 15
                    then 'B'
                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'TOP'
                    then 'C'

                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'MID'
                        and p.highest_discount >= 40
                    then 'A'
                    when
                        p.model_year_with_override >= 2017
                        and p.brand_rating::text = 'MID'
                        and p.highest_discount >= 20
                    then 'B'
                    when p.model_year_with_override >= 2017 and p.highest_discount >= 50
                    then 'B'

                    when p.model_year_with_override >= 2017
                    then 'C'

                    else p.default_vendor_notation
                end
            ) as "calculated_notation_beta"
        from product_with_algo_inputs as p
    ),
    product_with_notation as (
        select
            *,
            coalesce(
                product_with_sub_notations."manual_notation",
                product_with_sub_notations."vendor_notation",
                product_with_sub_notations."calculated_notation"
            ) as "notation"
        from product_with_sub_notations
    )

select
    *,
    0.3 * (
        case
            when notation = 'A'
            then 1000
            when notation = 'B'
            then 800
            when notation = 'C'
            then 400
            else 0
        end
    )
    + 0.3
    * (
        case
            when orders_count * 10 + favorites_count > 50
            then 1000
            when orders_count * 10 + favorites_count > 10
            then 800
            when orders_count * 10 + favorites_count > 5
            then 700
            when orders_count * 10 + favorites_count > 1
            then 400
            else 0
        end
    )
    + 0.25
    * (
        case
            when cast(current_date as date) - cast(created_at as date) <= 7
            then 1000
            when cast(current_date as date) - cast(created_at as date) <= 30
            then 600
            when cast(current_date as date) - cast(created_at as date) <= 60
            then 300
            else 100
        end
    )
    + 0.15
    * (
        case
            when views_last_30_days > 200
            then 1000
            when views_last_30_days > 100
            then 800
            when views_last_30_days > 50
            then 600
            when views_last_30_days > 10
            then 500
            when views_last_30_days > 5
            then 400
            when views_last_30_days > 1
            then 200
            else 0
        end
    ) as "calculated_scoring",
    round(
        0.15 * (
            case
                when brand_rating::text = 'TOP'
                then 1000
                when brand_rating::text = 'MID'
                then 500
                else 0
            end
        )
        + 0.15
        * (
            case
                when date_part('year', current_date) - model_year_with_override > 5
                then 0
                else
                    (
                        1000
                        - (date_part('year', current_date) - model_year_with_override)
                        * 200
                    )
            end
        )
        + 0.15
        * (
            case
                when highest_discount >= 60
                then 1000
                when highest_discount <= 20
                then 0
                else highest_discount * 20 - 200
            end
        )
        + 0.5 * (case when stock > 20 then 1000 else 50 * stock end)
        + 0.25
        * (
            case
                when cast(current_date as date) - cast(created_at as date) <= 7
                then 1000
                when cast(current_date as date) - cast(created_at as date) <= 30
                then 600
                when cast(current_date as date) - cast(created_at as date) <= 60
                then 300
                else 100
            end
        )
    ) as "calculated_b2b_scoring"
from product_with_notation
