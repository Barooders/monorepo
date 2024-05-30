{{ config(materialized="table") }}

with
    dynamic_tags as (
        select
            da.name name,
            pa.tag_prefix tag_prefix,
            al.pim_product_attribute_order priority
        from backend__strapi.pim_dynamic_attributes da
        join
            backend__strapi.pim_dynamic_attributes_pim_product_attributes_links al
            on al.pim_dynamic_attribute_id = da.id
        join
            backend__strapi.pim_product_attributes pa
            on pa.id = al.pim_product_attribute_id
    ),
    dim_product as (
        select
            b_p.id as internal_id,
            b_p.shopifyId as shopify_id,
            b_p.merchant_item_id,
            datetime(b_p.createdAt, 'Europe/Paris') as creation_datetime,
            date_trunc(datetime(b_p.createdAt, 'Europe/Paris'), day) as creation_date,
            datetime(b_ep.publishedAt, 'Europe/Paris') as publication_datetime,
            date_trunc(
                datetime(b_ep.publishedAt, 'Europe/Paris'), day
            ) as publication_date,
            b_ep.productType as product_type,
            LOWER(b_ep.status) as status,
            b_ep.title,
            b_ep.vendor,
            b_ep.handle,
            c_vendor.authuserid as vendor_id,
            b_p_a.source as source,
            b_p_a.notation as scoring,
            case
                when b_ep.vendor = 'Commission'
                then 'commission'
                when c_vendor.sellername = 'Barooders'
                then 'barooders'
                when c_vendor.ispro is true
                then 'b2c'
                else 'c2c'
            end as owner,
            pv.product_price,
            pv.compare_at_price,
            pv.inventory_quantity,
            t_brand.value as brand,
            t_size.value as size,
            t_gender.value as gender,
            case
                when b_p_a.condition_from_variants = 'AS_NEW'
                then 'Neuf'
                when b_p_a.condition_from_variants = 'REFURBISHED_AS_NEW'
                then 'Neuf'
                when b_p_a.condition_from_variants = 'VERY_GOOD'
                then 'Très bon état'
                else 'Bon état'
            end as etat,
            t_modele.value as modele,
            t_year.value as year,
            tags.tags,
            b_ep.description as body_html,
            current_date() as sync_date,
            case
                when date_diff(former_p.sync_date, current_date(), day) > 0
                then LOWER(b_ep.status)
                else former_p.status
            end as former_status,
            case
                when date_diff(former_p.sync_date, current_date(), day) > 0
                then pv.inventory_quantity
                else former_p.inventory_quantity
            end as former_quantity,
            date_diff(o.created_at, b_p.createdAt, day) as product_lifetime,
						cat.name AS parent_category

        from  backend__dbt.store_base_product b_p
        left join backend__dbt.store_exposed_product b_ep ON b_ep.id=b_p.id
        left join backend__dbt.store_product_for_analytics b_p_a ON b_p_a.id=b_p.id
        left join dbt.dim_product former_p on former_p.internal_id = b_p.id
        left join
            backend__public.Customer c_vendor
            on c_vendor.authuserid = b_p.vendorId
        left join
            (
                select product_id, min(value) value
                from backend__dbt.store_exposed_product_tag t_brand
                where tag = 'marque'
                group by 1
            ) t_brand
            on t_brand.product_id = b_p.id
        left join
            (
                select product_id, t_size.value
                from backend__dbt.store_exposed_product_tag t_size
                join dynamic_tags dt on dt.tag_prefix = t_size.tag and dt.name = 'size'
            ) t_size
            on t_size.product_id = b_p.id
        left join
            (
                select product_id, min(value) value
                from backend__dbt.store_exposed_product_tag t_gender
                where tag = 'genre'
                group by 1
            ) t_gender
            on t_gender.product_id = b_p.id
        left join
            (
                select product_id, min(value) value
                from backend__dbt.store_exposed_product_tag t_modele
                where tag = 'modele'
                group by 1
            ) t_modele
            on t_modele.product_id = b_p.id
        left join
            (
                select product_id, min(value) value
                from backend__dbt.store_exposed_product_tag t_year
                where tag = 'année'
                group by 1
            ) t_year
            on t_year.product_id = b_p.id
        left join
            (
                select t.product_id, string_agg(t.full_tag, ';') tags
                from backend__dbt.store_exposed_product_tag t
                group by 1
            ) tags
            on tags.product_id = b_p.id
        left join
            (
                select
                    pv.product_id,
                    sum(pv.inventory_quantity) inventory_quantity,
                    min(pv.price) product_price,
                    min(pv.compare_at_price) compare_at_price
                from shopify.product_variant pv
                group by pv.product_id
            ) pv
            on pv.product_id = b_p.shopifyId

        left join
            shopify.order_line ol
            on ol.product_id = b_p.shopifyId
            and ol.fulfillment_status = 'fulfilled'
        left join shopify.order o on o.id = ol.order_id and o.financial_status = 'paid'
        left join backend__strapi.pim_product_types ppt on ppt.name = b_ep.productType
        left join backend__strapi.pim_product_types_categories_links ppt_cat on ppt_cat.pim_product_type_id = ppt.id
				left join backend__strapi.pim_categories cat on ppt_cat.pim_category_id = cat.id
    ),
    added_row_number as (
        select
            *,
            row_number() over (
                partition by internal_id order by creation_datetime desc
            ) as row_number
        from dim_product
    )

select *
from added_row_number
where row_number = 1
